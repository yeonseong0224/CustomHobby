import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyPage.css";

export default function MyPage({ userId }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요합니다!");
      navigate("/"); // 로그인 안 되어 있으면 시작 페이지로 이동
    }
  }, [userId, navigate]);

  return (
    <div className="mypage-container">
      <h1>마이페이지</h1>
      <p>안녕하세요, <strong>{userId}</strong> 님 👋</p>
      <p>이곳에서 내 정보와 활동 내역을 확인할 수 있습니다.</p>
    </div>
  );
}
