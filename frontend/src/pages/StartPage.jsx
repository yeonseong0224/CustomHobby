import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/userApi";
import "../styles/StartPage.css";

export default function StartPage() {
  const navigate = useNavigate();
  const { login } = useAuth();  // ✅ Context의 login 함수 사용
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ✅ userApi.js의 loginUser 함수 사용
      const user = await loginUser({ userId: loginId, password });

      console.log("✅ 로그인 성공:", user);

      // ✅ Context의 login 함수로 사용자 정보 저장
      login(user);
      
      alert(`${user.nickname}님 환영합니다!`);
      
      // ✅ 로그인 후 무조건 메인 페이지로 이동
      navigate("/main");
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
