import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();  // ✅ Context 사용

  const handleLogout = () => {
    logout();  // ✅ Context의 logout 함수 사용
    alert("로그아웃되었습니다.");
    navigate("/");  // 로그아웃 후 시작 페이지로 이동
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
          <>
            {/* ✅ 로그인 안 된 경우 */}
            <Link to="/" className="mypage-link">
              로그인
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
