import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StartPage.css";

export default function StartPage({ setUserId }) {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 🚀 1️⃣ 로그인 로직 (예시: 백엔드 API 호출)
    try {
      // 실제 백엔드 요청 예시 (백엔드에 따라 변경 가능)
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loginId, password }),
      });

      if (!response.ok) throw new Error("로그인 실패");

      const user = await response.json();

      // 🚀 2️⃣ 로그인 성공 시
      localStorage.setItem("userId", user.userId);
      setUserId(user.userId); // ✅ App.jsx의 상태도 즉시 갱신
      alert(`${user.userId}님 환영합니다!`);
      navigate("/main"); // 로그인 성공 시 메인으로 이동
    } catch (error) {
      console.error(error);
      alert("아이디 또는 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="start-page-container">
      <div className="login-card">
        <h1>로그인</h1>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="아이디를 입력하세요"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="login-btns">
            <button type="submit">로그인</button>
            <button type="button" onClick={() => navigate("/register")}>
              회원가입
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
