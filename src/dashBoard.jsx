import * as icon from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const popupRef = useRef();

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "achievement",
      title: "Chúc mừng! Bạn đã đạt được thành tựu mới",
      description: "Huy hiệu 'Tuần đầu tiên' - Hoàn thành 7 ngày không hút thuốc",
      time: "2 phút trước",
      read: false,
    },
    {
      id: 2,
      type: "appointment",
      title: "Lịch hẹn với chuyên gia",
      description: "Bạn có cuộc hẹn với Dr. Trần Minh Tuấn vào 15:00 ngày mai",
      time: "1 giờ trước",
      read: false,
    },
    {
      id: 3,
      type: "reminder",
      title: "Nhắc nhở hàng ngày",
      description: "Đã đến lúc uống nước! Hãy uống 1 ly nước để giải độc cơ thể",
      time: "3 giờ trước",
      read: false,
    },
    {
      id: 4,
      type: "mission",
      title: "Hoàn thành nhiệm vụ",
      description: "Bạn đã hoàn thành nhiệm vụ 'Tập thể dục 30 phút' hôm nay",
      time: "5 giờ trước",
      read: true,
    },
    {
      id: 5,
      type: "reminder",
      title: "Thời gian thiền",
      description: "Đã 6 tiếng kể từ lần cuối bạn thiền. Hãy dành 15 phút để thư giãn",
      time: "6 giờ trước",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  // Đóng popup khi click ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const navItemStyle = (path) => ({
    margin: '0 10px',
    padding: '6px 12px',
    cursor: 'pointer',
    color: isActive(path) ? 'white' : 'black',
    fontWeight: isActive(path) ? 'bold' : 'normal',
    background: isActive(path) ? 'rgba(22, 163, 74, 0.6)' : 'transparent',
    borderRadius: '8px',
    backdropFilter: isActive(path) ? 'blur(6px)' : 'none',
    WebkitBackdropFilter: isActive(path) ? 'blur(6px)' : 'none',
    transition: 'all 0.2s ease-in-out',
  });

  return (
    <div
      className="nav-bar"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        position: 'relative'
      }}
    >
      <h3><strong>QuitSmoking</strong></h3>
      <h4 style={navItemStyle('/dashboard')} onClick={() => navigate('/dashboard')}>Tổng quan</h4>
      <h4 style={navItemStyle('/diary')} onClick={() => navigate('/diary')}>Nhật ký</h4>
      <h4 style={navItemStyle('/missions')} onClick={() => navigate('/missions')}>Nhiệm vụ</h4>
      <h4 style={navItemStyle('/ranking')} onClick={() => navigate('/ranking')}>Bảng xếp hạng</h4>
      <h4 style={navItemStyle('/achievement')} onClick={() => navigate('/achievement')}>Thành tựu</h4>
      <h4 style={navItemStyle('/service-package')} onClick={() => navigate('/service-package')}>Gói dịch vụ</h4>
      <h4 style={navItemStyle('/coach')} onClick={() => navigate('/coach')}>Chuyên gia</h4>

      <div style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto' }}>
        <icon.User />
        <h4 style={{ marginLeft: 5 }}>Người dùng</h4>
      </div>

      <div style={{ position: 'relative', marginLeft: 15 }} ref={popupRef}>
        <icon.Bell onClick={handleNotificationClick} style={{ cursor: 'pointer' }} />
        {unreadCount > 0 && (
          <div style={{
            position: 'absolute',
            top: -5,
            right: -5,
            background: 'red',
            color: 'white',
            borderRadius: '50%',
            width: 16,
            height: 16,
            fontSize: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {unreadCount}
          </div>
        )}
        {isNotificationOpen && (
  <div style={{
    position: 'absolute',
    top: 30,
    right: 0,
    width: 320,
    maxHeight: 400,
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    borderRadius: 10,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden', // giữ border-radius khi scroll
  }}>
    {/* Header cố định */}
    <div style={{
      position: 'sticky',
      top: 0,
      background: 'white',
      zIndex: 1,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px',
      borderBottom: '1px solid #eee',
    }}>
      <h4 style={{ margin: 0 }}>Thông báo</h4>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#007bff',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        Đánh dấu đã đọc
      </button>
    </div>

    {/* Danh sách thông báo */}
    <div style={{
      overflowY: 'auto',
      padding: '10px',
      maxHeight: '340px',
    }}>
      {notifications.length === 0 ? (
        <p>Không có thông báo nào</p>
      ) : (
        notifications.map(n => (
          <div key={n.id}
            onClick={() => markAsRead(n.id)}
            style={{
              marginBottom: 10,
              background: n.read ? '#f0f0f0' : '#e6ffed',
              padding: 10,
              borderRadius: 8,
              cursor: 'pointer',
            }}>
            <strong>{n.title}</strong>
            <p style={{ margin: 0 }}>{n.description}</p>
            <small style={{ color: '#888' }}>{n.time}</small>
          </div>
        ))
      )}
    </div>
  </div>
)}

        
      </div>

      <icon.MessageCircle style={{ marginLeft: 15 }} />
    </div>
  );
}

function DashBoard() {
    return (
        <>
        <NavBar></NavBar>
        </>
    )
}

export default DashBoard;
export { NavBar };
