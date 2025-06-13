import { NavBar } from "./dashBoard";
import { useState, useEffect } from "react";

function Diary() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    smoked: "no",
    cravingLevel: 1,
    cravingTimes: 0,
    nrtCost: 0,
  });

  useEffect(() => {
    const savedEntries = localStorage.getItem("diaryEntries");
    if (savedEntries) {
      setDiaryEntries(JSON.parse(savedEntries));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("diaryEntries", JSON.stringify(diaryEntries));
  }, [diaryEntries]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setDiaryEntries((prev) => [{ ...formData, id: Date.now(), date: formData.date }, ...prev]);
    setIsModalOpen(false);
    setFormData({
      date: new Date().toISOString().split("T")[0],
      smoked: "no",
      cravingLevel: 1,
      cravingTimes: 0,
      nrtCost: 0,
    });
  };

  return (
    <div className="dry-diary-container">
      <NavBar />
      <div className="dry-content">
        <div className="dry-header">
          <h1 className="dry-title">Nhật ký cai thuốc</h1>
          <div className="dry-button-container">
            <button onClick={() => setIsModalOpen(true)} className="dry-add-button">
              Thêm nhật ký
            </button>
          </div>
        </div>
        <div className="dry-history-card">
          <h2 className="dry-subtitle">Lịch sử nhật ký</h2>
          {diaryEntries.length === 0 ? (
            <p className="dry-no-entries">Chưa có nhật ký nào.</p>
          ) : (
            <div className="dry-history-list">
              {diaryEntries.map((entry) => (
                <div key={entry.id} className="dry-history-item">
                  <div className="dry-history-details">
                    <p className="dry-history-text">
                      <span className="dry-history-date">{new Date(entry.date).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}</span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Hút thuốc:</span>
                      <span className="dry-history-value" style={{ color: entry.smoked === "yes" ? "#dc2626" : "inherit" }}>
                        {entry.smoked === "yes" ? "Có" : "Không"}
                      </span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Mức độ thèm:</span>
                      <span className="dry-history-value">{entry.cravingLevel}/10</span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Số lần thèm:</span>
                      <span className="dry-history-value">{entry.cravingTimes} lần</span>
                    </p>
                    <p className="dry-history-text">
                      <span className="dry-history-label">Chi phí NRT:</span>
                      <span className="dry-history-value">{entry.nrtCost.toLocaleString()} VNĐ</span>
                    </p>
                  </div>
                  <p className="dry-history-time">
                    {new Date(entry.id).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="dry-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="dry-modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="dry-modal-title">Thêm nhật ký mới</h2>
            <form onSubmit={handleSubmit}>
              <div className="dry-modal-field">
                <label className="dry-modal-label">Ngày</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="dry-modal-input"
                  required
                />
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label">Bạn có hút thuốc kể từ lần ghi trước không?</label>
                <div className="dry-modal-radio-group">
                  <label className="dry-modal-radio">
                    <input
                      type="radio"
                      name="smoked"
                      value="no"
                      checked={formData.smoked === "no"}
                      onChange={handleInputChange}
                    />
                    <span className="dry-modal-radio-label">Không</span>
                  </label>
                  <label className="dry-modal-radio">
                    <input
                      type="radio"
                      name="smoked"
                      value="yes"
                      checked={formData.smoked === "yes"}
                      onChange={handleInputChange}
                    />
                    <span className="dry-modal-radio-label">Có</span>
                  </label>
                </div>
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label">Mức độ thèm thuốc (1-10)</label>
                <input
                  type="range"
                  name="cravingLevel"
                  min="1"
                  max="10"
                  value={formData.cravingLevel}
                  onChange={handleInputChange}
                  className="dry-modal-range"
                />
                <span className="dry-modal-range-value">{formData.cravingLevel}</span>
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label">Số lần thèm thuốc trong ngày</label>
                <input
                  type="number"
                  name="cravingTimes"
                  min="0"
                  value={formData.cravingTimes}
                  onChange={handleInputChange}
                  className="dry-modal-input"
                  required
                />
              </div>

              <div className="dry-modal-field">
                <label className="dry-modal-label">Tổng chi phí cho NRT (VNĐ)</label>
                <input
                  type="number"
                  name="nrtCost"
                  min="0"
                  value={formData.nrtCost}
                  onChange={handleInputChange}
                  className="dry-modal-input"
                  required
                />
              </div>

              <div className="dry-modal-buttons">
                <button type="button" onClick={() => setIsModalOpen(false)} className="dry-modal-cancel">
                  Hủy
                </button>
                <button type="submit" className="dry-modal-save">
                  Lưu nhật ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>
        {`
          .dry-diary-container {
            min-height: 100vh;
            background-color: #ffffff;
          }
          .dry-content {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }
          .dry-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
          }
          .dry-title {
            font-size: 2rem;
            font-weight: bold;
            color: #1f2937;
            margin: 0;
          }
          .dry-button-container {
            margin: 0;
          }
          .dry-add-button {
            background-color: #10b981;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          .dry-add-button:hover {
            background-color: #059669;
          }
          .dry-history-card {
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 4px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          .dry-subtitle {
            font-size: 1.2rem;
            font-weight: bold;
            color: #374151;
            margin-bottom: 15px;
          }
          .dry-no-entries {
            text-align: center;
            color: #6b7280;
            font-size: 14px;
          }
          .dry-history-list {
            margin-top: 10px;
          }
          .dry-history-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px 0;
            border-bottom: 1px solid #e5e7eb;
          }
          .dry-history-details {
            flex-grow: 1;
            display: flex;
            flex-wrap: wrap;
            gap: 20px;
            align-items: center;
          }
          .dry-history-text {
            margin: 0;
            font-size: 14px;
            color: #374151;
            display: flex;
            align-items: center;
          }
          .dry-history-date {
            font-weight: bold;
            color: #1f2937;
            margin-right: 20px;
          }
          .dry-history-label {
            font-weight: bold;
            margin-right: 5px;
            color: #6b7280;
          }
          .dry-history-value {
            color: #374151;
          }
          .dry-history-time {
            font-size: 12px;
            color: #6b7280;
            min-width: 50px;
            text-align: right;
          }
          .dry-modal-overlay {
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.75);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 50;
          }
          .dry-modal-content {
            background-color: #ffffff;
            padding: 20px;
            border-radius: 4px;
            width: 90%;
            max-width: 400px;
            position: relative;
          }
          .dry-modal-title {
            font-size: 1.2rem;
            font-weight: bold;
            color: #1f2937;
            text-align: left;
            margin-bottom: 15px;
          }
          .dry-modal-field {
            margin-bottom: 15px;
          }
          .dry-modal-label {
            display: block;
            font-size: 14px;
            font-weight: bold;
            color: #374151;
            margin-bottom: 5px;
          }
          .dry-modal-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #000000;
            border-radius: 4px;
            font-size: 14px;
            background-color: #ffffff;
            color: #000000;
          }
          .dry-modal-radio-group {
            margin-top: 5px;
          }
          .dry-modal-radio {
            display: flex;
            align-items: center;
            margin-right: 15px;
          }
          .dry-modal-radio input {
            margin-right: 5px;
          }
          .dry-modal-radio-label {
            color: #374151;
            font-size: 14px;
          }
          .dry-modal-range {
            width: 100%;
            margin-top: 5px;
          }
          .dry-modal-range-value {
            display: block;
            margin-top: 5px;
            color: #6b7280;
            font-size: 14px;
          }
          .dry-modal-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 15px;
          }
          .dry-modal-cancel {
            background-color: #d1d5db;
            color: #1f2937;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          .dry-modal-cancel:hover {
            background-color: #9ca3af;
          }
          .dry-modal-save {
            background-color: #10b981;
            color: white;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          .dry-modal-save:hover {
            background-color: #059669;
          }
        `}
      </style>
    </div>
  );
}

export default Diary;