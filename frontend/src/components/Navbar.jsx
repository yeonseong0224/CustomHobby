import React from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar({ userId, setUserId }) {
  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem("userId");
    window.location.href = "/"; // 로그아웃 후 메인으로 이동
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        {/* 로고 */}
        <Link to="/main" className="logo">
          CustomHobby
        </Link>

        {/* 메뉴 링크 */}
        <div className="nav-links">
          <Link to="/category">카테고리</Link>
        </div>
      </div>

      <div className="navbar-right">
        {/* ✅ 로그인된 경우 */}
        {userId ? (
          <>
            <Link to="/mypage" className="mypage-link">
              마이페이지
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          </>
        ) : (
          <>
            {/* ✅ 로그인 안 된 경우에도 마이페이지 링크는 유지 */}
            <Link to="/mypage" className="mypage-link">
              마이페이지
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
