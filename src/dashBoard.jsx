import * as icon from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { SiOxygen } from "react-icons/si";
import axios from 'axios';
import { mockTodayMissionList } from './mock-missions'; // <-- IMPORT NHIỆM VỤ HÔM NAY

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const popupRef = useRef();

  const [notifications, setNotifications] = useState([
    // Dữ liệu ban đầu có thể để trống hoặc chỉ chứa các loại khác
    {
      id: 1, type: "achievement", title: "Chúc mừng! Bạn đã đạt được thành tựu mới",
      description: "Huy hiệu 'Tuần Lễ Vàng' - Hoàn thành 7 ngày không hút thuốc",
      time: "2 phút trước", read: false, link: '/achievement',
    },
    {
      id: 2, type: "appointment", title: "Lịch hẹn với chuyên gia",
      description: "Bạn có cuộc hẹn với Dr. Trần Minh Tuấn vào 15:00 ngày mai",
      time: "1 giờ trước", read: false, link: '/coach',
    },
  ]);

  // --- LOGIC MỚI: TỰ ĐỘNG THÊM THÔNG BÁO NHIỆM VỤ ---
  useEffect(() => {
    // Tạo thông báo từ danh sách nhiệm vụ hôm nay
    const missionNotifications = mockTodayMissionList.map((mission, index) => ({
      id: 100 + mission.templateId, // Tạo ID duy nhất để không trùng lặp
      type: 'mission',
      title: `Nhiệm vụ mới: ${mission.title}`,
      description: 'Hãy hoàn thành mục tiêu hôm nay để tiến gần hơn đến thành công!',
      time: 'Sáng nay',
      read: false, // Mặc định là chưa đọc
      link: '/missions',
    }));

    // Thêm thông báo nhiệm vụ vào đầu danh sách
    setNotifications(prev => [...missionNotifications, ...prev]);
  }, []); // Chỉ chạy một lần khi component được mount


  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = () => setIsNotificationOpen(!isNotificationOpen);

  const handleItemClick = (notification) => {
    setNotifications(prev => prev.map(n => (n.id === notification.id ? { ...n, read: true } : n)));
    if (notification.link) {
      navigate(notification.link);
      setIsNotificationOpen(false);
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

  // ... Các phần code khác của NavBar giữ nguyên ...
  // (Phần style, fetch user, menu logout, và JSX return)
  // ... (Bạn có thể copy paste phần code còn lại của NavBar vào đây) ...

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

  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUserEntries = async () => {
      try {
        const user = await fetch("http://localhost:8080/api/auth/get-session-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          credentials: "include" // gửi cookie (session) nếu dùng Spring Boot hoặc Express session
        });
        if (!user) {
          console.error("Không tìm thấy user");
          return;
        } else {
          const userData = await user.json();
          setUserName(userData.name)
        }
      } catch (error) {
        console.error("Fetch diary entries error:", error);
      }
    };
    fetchUserEntries();
  }, []);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8080/api/auth/logout', {}, { withCredentials: true }); // Quan trọng: Gửi cookie

      navigate('/');
    } catch (error) {
      console.error('Logout thất bại:', error);
      alert('Đăng xuất không thành công, vui lòng thử lại.');
    }
  };


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
      <div style={{ position: 'relative', marginLeft: 'auto' }} ref={userMenuRef}>
        <div
          style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setUserMenuOpen(prev => !prev)}
        >
          <icon.User />
          <h4 style={{ marginLeft: 5 }}>{userName}</h4>
        </div>

        {userMenuOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 10px)',
              right: 0,
              background: '#fff',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              borderRadius: '8px',
              zIndex: 1000,
              minWidth: '160px',
              padding: '8px 0',
            }}
          >
            <div
              onClick={() => navigate('/profile')}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#1f2937',
                whiteSpace: 'nowrap',
              }}
            >
              Thông tin cá nhân
            </div>
            <div
              onClick={handleLogout}
              style={{
                padding: '10px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#ef4444',
                whiteSpace: 'nowrap',
              }}
            >
              Đăng xuất
            </div>
          </div>
        )}
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
                    if (type === 'achievement') return <div style={{ ...iconStyle, backgroundColor: '#fffbe6' }}><icon.Trophy size={20} color="#fbbd23" /></div>;
                    if (type === 'appointment') return <div style={{ ...iconStyle, backgroundColor: '#eef9ff' }}><icon.Calendar size={20} color="#3b82f6" /></div>;
                    if (type === 'reminder') return <div style={{ ...iconStyle, backgroundColor: '#fef2f2' }}><icon.AlarmClock size={20} color="#ef4444" /></div>;
                    // --- THÊM ICON CHO MISSION ---
                    if (type === 'mission') return <div style={{ ...iconStyle, backgroundColor: '#eef2ff' }}><icon.Target size={20} color="#4f46e5" /></div>;
                    return <div style={{ ...iconStyle, backgroundColor: '#f3f4f6' }}><icon.Bell size={20} color="#4b5563" /></div>;
                  };

                  return (
                    <div key={n.id}
                      onClick={() => handleItemClick(n)}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        padding: '16px 20px',
                        cursor: 'pointer',
                        position: 'relative',
                        borderTop: '1px solid #f0f0f0',
                        backgroundColor: n.read ? '#ffffff' : '#f8fffa'
                      }}>
                      {getIcon(n.type)}
                      <div style={{ flex: 1, marginRight: '10px' }}>
                        <h5 style={{ margin: 0, fontWeight: '600', color: '#1f2937', fontSize: '15px', lineHeight: '1.4' }}>
                          {n.title}
                        </h5>
                        <p style={{ margin: '4px 0 8px 0', color: '#4b5563', fontSize: '14px', lineHeight: '1.5' }}>
                          {n.description}
                        </p>
                        <small style={{ color: '#9ca3af', fontSize: '13px' }}>
                          {n.time}
                        </small>
                      </div>
                      {!n.read && (
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: '#3b82f6',
                          borderRadius: '50%',
                          flexShrink: 0,
                          marginTop: '6px'
                        }}></div>
                      )}
                    </div>
                  );
                })
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>Không có thông báo nào</p>
              )}
            </div>
          </div>
        )}
      </div>
      <icon.MessageCircle style={{ marginLeft: 15 }} />
    </div>
  );
}

export function getUserId() {
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/get-session-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });

        if (!res.ok) throw new Error("Không tìm thấy user");

        const userData = await res.json();
        setUserId(userData.userId);
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
      }
    };

    fetchUser();
  }, []);

  return userId;
}

// ... Các phần code khác của Dashboard.jsx giữ nguyên ...
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
      <div className="pulse-value">{props.timeRemaining}</div>
    </div>
  );
}

function improvedList() {
  const [userId, setUserId] = useState("");
  const [healthList, setHealthList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy userId
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/auth/get-session-user", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include"
        });

        if (!res.ok) throw new Error("Không tìm thấy user");

        const userData = await res.json();
        setUserId(userData.userId);
      } catch (error) {
        console.error("Lỗi khi lấy user:", error);
      }
    };

    fetchUser();
  }, []);

  // Lấy health milestone
  useEffect(() => {
    if (!userId) return;

    const fetchProgress = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/health-milestones/progress/${userId}`);
        if (!res.ok) throw new Error("Lỗi khi fetch progress");
        const data = await res.json();
        setHealthList(data);
      } catch (error) {
        console.error("Lỗi khi gọi API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [userId]);


  return { healthList, loading };
}


function SavingsCardWithDetail() {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  const userId = getUserId();

  const [savedMoney, setSavedMoney] = useState(0);
  
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/quit-plan/${userId}/savings`);
      const savedMoney = await response.json();
      setSavedMoney(savedMoney);
    } catch (error) {
      console.error("Lỗi khi fetch:", error);
    }
  };

  fetchData();
}, [userId]);

  return (
    <>
      {/* Card chính */}
      <div className="savings-container">
        <h3>Số tiền tiết kiệm</h3>
        <div className="savings-content">
          <div className="savings-left">
            <p className="label">Số tiền đã tiết kiệm</p>
            <p className="value green">{savedMoney} đ</p>
            <button className="detail-button" onClick={handleOpen}>Xem chi tiết</button>
          </div>
          <div className="savings-right">
            <p className="label">Tiết kiệm trong 1 năm</p>
            <p className="value blue">{savedMoney*365} đ</p>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h4>Chi tiết số tiền</h4>
              <icon.X className="close-btn" onClick={handleClose}></icon.X>
            </div>
            <div className="modal-body">
              <div className="modal-left">
                <p><strong>Số tiền tiết kiệm được</strong></p>
                <p className="green">{savedMoney} đ</p>

                <p>Đã tiêu cho thuốc lá</p>
                <p className="red">0 đ</p>

                <p>Đã tiêu cho liệu pháp thay thế Nicotine</p>
                {/* <p className="orange">{moneyForNRT} đ</p> */}
              </div>
              <div className="modal-right">
                <p><strong>Mỗi ngày</strong></p>
                <p>{savedMoney} đ</p>

                <p><strong>Mỗi tuần</strong></p>
                <p>{savedMoney*7} đ</p>

                <p><strong>Mỗi tháng</strong></p>
                <p>{savedMoney*30} đ</p>

                <p><strong>Mỗi năm</strong></p>
                <p>{savedMoney*365} đ</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function DashBoard() {
  const { healthList, loading } = improvedList();

  if (loading) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
      <NavBar></NavBar>
      <div id='dashBoard'>
        <h2 style={{ textAlign: 'left' }}><strong>Tổng Quan</strong></h2>
        <h3 style={{ textAlign: 'left' }}>Cải thiện sức khỏe của bạn</h3>
        <div className='ImprovedCardContainer'>
          <ImprovedCard percentageChange={healthList[0].progressPercent} timeRemaining={healthList[0].timeRemaining} title={healthList[0].name} Icon={icon.Heart} value={healthList[0].progressPercent} unit="%" progress={healthList[0].progressPercent}></ImprovedCard>
          <ImprovedCard percentageChange={healthList[1].progressPercent} timeRemaining={healthList[1].timeRemaining} title={healthList[1].name} Icon={SiOxygen} value={healthList[1].progressPercent} unit="%" progress={healthList[1].progressPercent} />
          <ImprovedCard percentageChange={healthList[2].progressPercent} timeRemaining={healthList[2].timeRemaining} title={healthList[2].name} Icon={SiOxygen} value={healthList[2].progressPercent} unit="%" progress={healthList[2].progressPercent} />
          <ImprovedCard percentageChange={healthList[3].progressPercent} timeRemaining={healthList[3].timeRemaining} title={healthList[3].name} Icon={SiOxygen} value={healthList[3].progressPercent} unit="%" progress={healthList[3].progressPercent} />
          <ImprovedCard percentageChange={healthList[4].progressPercent} timeRemaining={healthList[4].timeRemaining} title={healthList[4].name} Icon={SiOxygen} value={healthList[4].progressPercent} unit="%" progress={healthList[4].progressPercent} />
        </div>

        <div className='ImprovedCardContainer'>
          
          <ImprovedCard percentageChange={healthList[5].progressPercent} timeRemaining={healthList[5].timeRemaining} title={healthList[5].name} Icon={SiOxygen} value={healthList[5].progressPercent} unit="%" progress={healthList[5].progressPercent} />
          <ImprovedCard percentageChange={healthList[6].progressPercent} timeRemaining={healthList[6].timeRemaining} title={healthList[6].name} Icon={SiOxygen} value={healthList[6].progressPercent} unit="%" progress={healthList[6].progressPercent} />
          <ImprovedCard percentageChange={healthList[7].progressPercent} timeRemaining={healthList[7].timeRemaining} title={healthList[7].name} Icon={SiOxygen} value={healthList[7].progressPercent} unit="%" progress={healthList[7].progressPercent} />
          <ImprovedCard percentageChange={healthList[8].progressPercent} timeRemaining={healthList[8].timeRemaining} title={healthList[8].name} Icon={SiOxygen} value={healthList[8].progressPercent} unit="%" progress={healthList[8].progressPercent} />
          <ImprovedCard percentageChange={healthList[9].progressPercent} timeRemaining={healthList[9].timeRemaining} title={healthList[9].name} Icon={SiOxygen} value={healthList[9].progressPercent} unit="%" progress={healthList[9].progressPercent} />
          
        </div>

        <div className='ImprovedCardContainer'>
          <ImprovedCard percentageChange={healthList[10].progressPercent} timeRemaining={healthList[10].timeRemaining} title={healthList[10].name} Icon={SiOxygen} value={healthList[10].progressPercent} unit="%" progress={healthList[10].progressPercent} />
          <ImprovedCard percentageChange={healthList[11].progressPercent} timeRemaining={healthList[11].timeRemaining} title={healthList[11].name} Icon={SiOxygen} value={healthList[11].progressPercent} unit="%" progress={healthList[11].progressPercent} />
          <ImprovedCard percentageChange={healthList[12].progressPercent} timeRemaining={healthList[12].timeRemaining} title={healthList[12].name} Icon={SiOxygen} value={healthList[12].progressPercent} unit="%" progress={healthList[12].progressPercent} />
          <ImprovedCard percentageChange={healthList[13].progressPercent} timeRemaining={healthList[13].timeRemaining} title={healthList[13].name} Icon={SiOxygen} value={healthList[13].progressPercent} unit="%" progress={healthList[13].progressPercent} />
        </div>
      </div>
      <div id='savedMoney'>
        <SavingsCardWithDetail></SavingsCardWithDetail>
      </div>
    </>
  )
}


export default DashBoard;
export { NavBar };