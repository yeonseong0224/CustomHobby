import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
    alert("로그아웃되었습니다.");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">

        {/* ✅ 로고 이미지를 사용 */}
        <Link to="/main" className="logo">
  <img 
    src="/images/logo.png" 
    alt="CustomHobby Logo" 
    className="navbar-logo"
  />
</Link>


        {/* 메뉴 */}
        <div className="nav-links">
          <Link to="/category">카테고리</Link>
        </div>
      </div>

      <div className="navbar-right">
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: "15px", color: "#666" }}>
              {user.nickname}님
            </span>
            <Link to="/mypage" className="mypage-link">
              마이페이지
            </Link>
            <button onClick={handleLogout} className="logout-btn">
              로그아웃
            </button>
          </>
        ) : (
          <Link to="/" className="mypage-link">
            로그인
          </Link>
        )}
      </div>
    </nav>
  );
}
