import * as icon from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { SiOxygen } from "react-icons/si";

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
      description: "Huy hiệu 'Tuần Lễ Vàng' - Hoàn thành 7 ngày không hút thuốc",
      time: "2 phút trước",
      read: false,
      link: '/achievement', // <-- THÊM LINK ĐIỀU HƯỚNG
    },
    {
      id: 2,
      type: "appointment",
      title: "Lịch hẹn với chuyên gia",
      description: "Bạn có cuộc hẹn với Dr. Trần Minh Tuấn vào 15:00 ngày mai",
      time: "1 giờ trước",
      read: false,
      link: '/coach', // <-- THÊM LINK ĐIỀU HƯỚNG
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
      link: '/missions' // <-- THÊM LINK ĐIỀU HƯỚNG
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

  // --- HÀM XỬ LÝ CLICK ĐÃ ĐƯỢC CẢI TIẾN ---
  const handleItemClick = (notification) => {
    // 1. Đánh dấu đã đọc
    setNotifications(prev =>
      prev.map(n => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // 2. Nếu có link, điều hướng đến đó
    if (notification.link) {
      navigate(notification.link);
      setIsNotificationOpen(false); // Đóng popup sau khi điều hướng
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path || (path === '/achievement' && location.pathname.startsWith('/achievement'));

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
      <h4 style={navItemStyle('/Achievement')} onClick={() => navigate('/Achievement')}>Thành tựu</h4>
      <h4 style={navItemStyle('/service-package')} onClick={() => navigate('/service-package')}>Gói dịch vụ</h4>
      <h4 style={navItemStyle('/coach')} onClick={() => navigate('/coach')}>Chuyên gia</h4>
      <h4 style={navItemStyle('/blog')} onClick={() => navigate('/blog')}>bài viết</h4> 
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
            justifyContent: 'center',
            border: '2px solid white' // Thêm viền trắng để nổi bật hơn
          }}>
            {unreadCount}
          </div>
        )}
        {isNotificationOpen && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 15px)', // Vị trí đẹp hơn
            right: 0,
            width: 380, // Tăng chiều rộng để thoáng hơn
            background: '#ffffff',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            borderRadius: '8px',
            zIndex: 1000,
            fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
            border: '1px solid #f0f0f0' // Thêm viền nhẹ
          }}>
            {/* Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 20px',
              backgroundColor: '#f9fafb', // Nền xám nhạt như trong ảnh
            }}>
              <h4 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#111827' }}>Thông báo</h4>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#16a34a', // Màu xanh lá cây
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  padding: '4px 0'
                }}
              >
                Đánh dấu đã đọc
              </button>
            </div>

            {/* Danh sách thông báo */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {notifications.length > 0 ? (
                notifications.map((n, index) => {
                  // Helper nhỏ để lấy icon và style
                  const getIcon = (type) => {
                    const iconStyle = { width: '38px', height: '38px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginRight: '16px' };
                    if (type === 'achievement') return <div style={{...iconStyle, backgroundColor: '#fffbe6'}}><icon.Trophy size={20} color="#fbbd23" /></div>;
                    if (type === 'appointment') return <div style={{...iconStyle, backgroundColor: '#eef9ff'}}><icon.Calendar size={20} color="#3b82f6" /></div>;
                    if (type === 'reminder') return <div style={{...iconStyle, backgroundColor: '#fef2f2'}}><icon.AlarmClock size={20} color="#ef4444" /></div>;
                    return <div style={{...iconStyle, backgroundColor: '#f3f4f6'}}><icon.Bell size={20} color="#4b5563" /></div>;
                  };

                  return (
                    <div key={n.id}
                      onClick={() => handleItemClick(n)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start', // Canh lề trên
                        padding: '16px 20px',
                        cursor: 'pointer',
                        position: 'relative',
                        borderTop: '1px solid #f0f0f0',
                        backgroundColor: n.read ? '#ffffff' : '#f8fffa' // Nền hơi xanh nhạt khi chưa đọc
                      }}>
                      
                      {/* Thanh dọc màu xanh DYNAMIC: Chỉ hiển thị trên item đầu tiên */}
                      {index === 0 && (
                        <div style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: '4px',
                          backgroundColor: '#3b82f6', // Màu xanh dương
                        }}></div>
                      )}

                      {getIcon(n.type)}
                      
                      {/* Nội dung text */}
                      <div style={{ flex: 1, marginRight: '10px' }}>
                        <h5 style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '15px', lineHeight: '1.4' }}>
                          {/* Sửa title cho khớp ảnh */}
                          {n.title.length > 30 ? n.title.substring(0, 30) + '...' : n.title}
                        </h5>
                        <p style={{ margin: '4px 0 8px 0', color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>
                          {n.description}
                        </p>
                        <small style={{ color: '#9ca3af', fontSize: '13px' }}>
                          {n.time}
                        </small>
                      </div>

                      {/* Chấm xanh cho thông báo chưa đọc */}
                      {!n.read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0,
                          marginTop: '6px' // Canh cho nó thẳng hàng với title
                        }}></div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p style={{textAlign: 'center', padding: '20px', color: '#6b7280'}}>Không có thông báo nào</p>
              )}
            </div>
          </div>
        )}
      </div>


      <icon.MessageCircle style={{ marginLeft: 15 }} />
    </div>
  );
}

// ... Phần còn lại của Dashboard.jsx giữ nguyên ...
function ImprovedCard(props) {
  const isPositive = props.percentageChange >= 0;
  const percentageText = `${isPositive ? '+' : ''}${props.percentageChange}%`;

  return (
    <div className="pulse-card">
      <div className="pulse-header">
        <div className="pulse-title">
          <span className="pulse-icon"><props.Icon></props.Icon></span>
          <span><strong>{props.title}</strong></span>
        </div>
        <div className={`pulse-change ${isPositive ? 'positive' : 'negative'}`}>{percentageText}</div>
      </div>
      <div className="pulse-value">{props.value} {props.unit}</div>
      <div className="pulse-bar">
        <div className="pulse-bar-fill" style={{ width: `${props.progress}%` }}></div>
      </div>
    </div>
  );
}

function DashBoard() {
    return (
        <>
        <NavBar></NavBar>
        <div id='dashBoard'>
          <h2 style={{textAlign:'left'}}><strong>Tổng Quan</strong></h2>
          <h3 style={{textAlign:'left'}}>Cải thiện sức khỏe của bạn</h3>
          <div className='ImprovedCardContainer'>
            <ImprovedCard percentageChange = "10" title="Mạch" Icon={icon.Heart} value={10} unit="bpm" progress={80}></ImprovedCard>
            <ImprovedCard percentageChange = "10" title="Nồng độ Oxy trong máu" Icon={SiOxygen} value={10} unit="bpm" progress={80}/>
            <ImprovedCard percentageChange = "10" title="Nồng độ Nicotine trong cơ thể" Icon={icon.Cigarette} value={10} unit="bpm" progress={80}/>
            <ImprovedCard percentageChange = "10" title="Vị giác & thính giác" Icon={icon.Coffee} value={10} unit="bpm" progress={80}/>
            <ImprovedCard percentageChange = "10" title="Hô hấp" Icon={icon.Wind} value={10} unit="bpm" progress={80}/>
          </div>
        </div>
        </>
    )
}

export default DashBoard;
export { NavBar };