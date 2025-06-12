import { useState } from "react";
import { NavBar } from "./dashBoard";
import './App.css';
import { Footer } from "./homePage";
import CoachA from './assets/img/a.png';
import CoachB from './assets/img/b.jpg';

const initialCoaches = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@example.com",
    avatar: CoachA,
    bookedSlots: [2, 5],
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@example.com",
    avatar: CoachB,
    bookedSlots: [3, 8],
  },
];

const symptoms = [
  "Thèm thuốc nhiều",
  "Bức rứt khi không hút",
  "Khó tập trung",
  "Mất ngủ",
  "Khác",
];

function Coach() {
  const [coaches, setCoaches] = useState(initialCoaches); // State cho coaches
  const [selected, setSelected] = useState({
    coach: null,
    symptom: "",
    slot: null,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedSlot, setConfirmedSlot] = useState(null); // Lưu slot vừa xác nhận

  const openModal = (coach) =>
    setSelected({ coach, symptom: "", slot: null });

  const closeModal = () =>
    setSelected({ coach: null, symptom: "", slot: null });

  const confirm = () => {
    if (!selected.symptom || selected.slot === null) {
      setShowConfirmation(true);
      return;
    }
    // Cập nhật bookedSlots cho coach
    setCoaches((prevCoaches) =>
      prevCoaches.map((coach) =>
        coach.id === selected.coach.id
          ? { ...coach, bookedSlots: [...coach.bookedSlots, selected.slot] }
          : coach
      )
    );
    setConfirmedSlot({ coachId: selected.coach.id, slot: selected.slot }); // Lưu slot vừa xác nhận
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
    if (selected.symptom && selected.slot !== null) {
      closeModal();
    }
  };

  return (
    <>
      <div className="coach-page">
        <NavBar />
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
                {Array.from({ length: 14 }).map((_, i) => (
                  <div
                    key={i}
                    className={`coach-slot ${
                      confirmedSlot &&
                      confirmedSlot.coachId === c.id &&
                      confirmedSlot.slot === i
                        ? "slot-confirmed"
                        : c.bookedSlots.includes(i)
                        ? "slot-booked"
                        : ""
                    }`}
                  >
                    {`${["T2", "T3", "T4", "T5", "T6", "T7", "CN"][Math.floor(i / 2)]} ${
                      i % 2 === 0 ? "S" : "C"
                    }`}
                  </div>
                ))}
              </div>
              <button className="btn-booking" onClick={() => openModal(c)}>
                Booking
              </button>
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
                    <option key={i} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-section">
                <p className="modal-label">Chọn slot (7 ngày × 2 slot):</p>
                <div className="slot-grid">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const booked = selected.coach.bookedSlots.includes(i);
                    const active = selected.slot === i;
                    return (
                      <button
                        key={i}
                        disabled={booked}
                        onClick={() => setSelected({ ...selected, slot: i })}
                        className={`slot-button ${
                          booked ? "slot-disabled" : active ? "slot-active" : ""
                        }`}
                      >
                        {booked
                          ? "❌"
                          : `${["T2", "T3", "T4", "T5", "T6", "T7", "CN"][Math.floor(i / 2)]} ${
                              i % 2 === 0 ? "S" : "C"
                            }`}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeModal}>
                  Hủy
                </button>
                <button className="btn-confirm" onClick={confirm}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        )}

        {showConfirmation && (
          <div className="confirmation-overlay">
            <div className="confirmation-content">
              <h3 className="confirmation-title">
                {selected.symptom && selected.slot !== null
                  ? "Xác nhận đặt lịch"
                  : "Lỗi"}
              </h3>
              <p className="confirmation-message">
                {selected.symptom && selected.slot !== null
                  ? `Đã đặt với ${selected.coach.name}\nTriệu chứng: ${selected.symptom}\nSlot: ${
                      ["T2", "T3", "T4", "T5", "T6", "T7", "CN"][Math.floor(selected.slot / 2)]
                    } ${selected.slot % 2 === 0 ? "Sáng" : "Chiều"}`
                  : "Vui lòng chọn triệu chứng và slot!"}
              </p>
              <button className="btn-ok" onClick={closeConfirmation}>
                OK
              </button>
            </div>
          </div>
        )}

        <Footer />
      </div>
    </>
  );
}

export default Coach;