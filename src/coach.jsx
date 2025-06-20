import { useEffect, useState } from "react";
import { NavBar } from "./dashBoard";
import { Footer } from "./homePage";
import "./App.css";
import { getUserId } from "./dashBoard";

const symptoms = [
  "Thèm thuốc nhiều",
  "Bức rứt khi không hút",
  "Khó tập trung",
  "Mất ngủ",
  "Khác",
];

function formatDateWithWeekday(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function Coach() {
  const [coaches, setCoaches] = useState([]);
  const [selected, setSelected] = useState({ coach: null, symptom: "", slot: null });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedSlot, setConfirmedSlot] = useState(null);
  const userId = getUserId();


  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/schedule/get-schedule");
        if (!response.ok) throw new Error("Lỗi khi lấy danh sách coach");
        const data = await response.json();
        setCoaches(data);
      } catch (error) {
        console.error("Fetch coaches error:", error);
      }
    };
    fetchCoaches();
  }, []);

  const openModal = (coach) => setSelected({ coach, symptom: "", slot: null });
  const closeModal = () => setSelected({ coach: null, symptom: "", slot: null });

  const confirm = async () => {
    if (!selected.symptom || selected.slot === null) {
      setShowConfirmation(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/bookings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: userId, scheduleId: selected.slot, note: selected.symptom }),
      });
      console.error("userId:", userId, "slot:", selected.slot, "note", selected.symptom)
      if (!res.ok) throw new Error("Lỗi khi booking");

      setConfirmedSlot({ coachId: selected.coach.id, slot: selected.slot });

      const refreshed = await fetch("http://localhost:8080/api/schedule/get-schedule");
      const refreshedData = await refreshed.json();
      setCoaches(refreshedData);
      await fetchBookings();
      setShowConfirmation(true);
    } catch (err) {
      console.error("Booking error:", err);
      console.error("userId:", userId, "slot:", selected.slot, "note", selected.symptom)
    }


  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    if (selected.symptom && selected.slot !== null) closeModal();
  };

  const [userBookings, setUserBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/bookings/get-booking/${userId}`);
      const data = await res.json();
      setUserBookings(data);
    } catch (err) {
      console.error("Lỗi khi lấy lịch người dùng:", err);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const cancelBooking = async (bookingId) => {
  if (!window.confirm("Bạn có chắc muốn hủy lịch hẹn này?")) return;

  try {
    const res = await fetch(`http://localhost:8080/api/bookings/cancel/${bookingId}`, {
      method: "DELETE", // hoặc "POST" tùy backend
    });

    if (!res.ok) throw new Error("Hủy lịch thất bại");

    // Tải lại danh sách lịch hẹn sau khi hủy
    await fetchBookings();
  } catch (error) {
    console.error("Lỗi khi hủy lịch:", error);
    alert("Hủy lịch không thành công. Vui lòng thử lại.");
  }
};


  return (
    <div>
      <NavBar />
    <div className="coach-page">
      
      <h2 className="section-title">Lịch của bạn</h2>
      <div className="user-schedule">
        {userBookings.length === 0 ? (
          <p>Chưa có lịch hẹn nào.</p>
        ) : (
          userBookings.map((b, index) => (
            <div key={index} className="user-booking-card">
              <div className="booking-info">
                <p><strong>Thời gian:</strong> {formatDateWithWeekday(b.bookingDate)} {b.startTime} - {b.endTime}</p>
                <p><strong>Tên chuyên gia:</strong> {b.coachName}</p>
                <p><strong>Trạng thái:</strong> {b.status}</p>
                <p><strong>Ghi chú:</strong> {b.note}</p>
              </div>
              <div className="booking-actions">
                <a href={b.meetingLink} target="_blank" rel="noreferrer" className="btn-meet">
                  Vào buổi gặp
                </a>
                <button onClick={() => cancelBooking?.(b.bookingId)} className="btn-cancel">
                  Hủy lịch
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="coach-container">
        <h1 className="coach-title">Chuyên gia</h1>
        {coaches.map((c) => (
          <div key={c.id} className="coach-card">
            <div className="coach-details">
              <img src={c.avatar} alt={c.name} className="coach-avatar" />
              <div className="coach-text">
                <h2 className="coach-name">{c.name}</h2>
                <p className="coach-email">{c.email}</p>
              </div>
            </div>
            <div className="coach-slot-grid">
              {c.schedules.map((s) => (
                <div
                  key={s.scheduleId}
                  className={`coach-slot ${!s.available ? "slot-booked" : confirmedSlot && confirmedSlot.coachId === c.id && confirmedSlot.slot === s.scheduleId ? "slot-confirmed" : ""}`}
                >
                  {`${formatDateWithWeekday(s.date)} ${s.slotLabel === "1" ? "Sáng" : "Chiều"}`}
                </div>
              ))}
            </div>
            <button className="btn-booking" onClick={() => openModal(c)}>Booking</button>
          </div>
        ))}
      </div>

      {selected.coach && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 className="modal-title">Đặt lịch với {selected.coach.name}</h3>
            <div className="modal-section">
              <p className="modal-label">Triệu chứng:</p>
              <select
                className="symptom-dropdown"
                value={selected.symptom}
                onChange={(e) => setSelected({ ...selected, symptom: e.target.value })}
              >
                <option value="">--Chọn triệu chứng--</option>
                {symptoms.map((s, i) => (
                  <option key={i} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="modal-section">
              <p className="modal-label">Chọn slot (7 ngày × 2 slot):</p>
              <div className="slot-grid">
                {selected.coach.schedules.map((s) => (
                  <button
                    key={s.scheduleId}
                    disabled={!s.available}
                    onClick={() => setSelected({ ...selected, slot: s.scheduleId })}
                    className={`slot-button ${!s.available ? "slot-disabled" : ""} ${selected.slot === s.scheduleId ? "slot-active" : ""}`}

                  >
                    {`${formatDateWithWeekday(s.date)} ${s.slotLabel === "1" ? "Sáng" : "Chiều"}`}
                  </button>
                ))}
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeModal}>Hủy</button>
              <button className="btn-confirm" onClick={confirm}>Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-content">
            <h3 className="confirmation-title">
              {selected.symptom && selected.slot !== null ? "Xác nhận đặt lịch" : "Lỗi"}
            </h3>
            <p className="confirmation-message">
              {selected.symptom && selected.slot !== null
                ? `Đã đặt với ${selected.coach.name}\nTriệu chứng: ${selected.symptom}`
                : "Vui lòng chọn triệu chứng và slot!"}
            </p>
            <button className="btn-ok" onClick={closeConfirmation}>OK</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
    </div>
  );
}

export default Coach;