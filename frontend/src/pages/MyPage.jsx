import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();

  // 자기소개 관리 (localStorage 저장)
  const [intro, setIntro] = useState("");

  useEffect(() => {
    const savedIntro = localStorage.getItem("intro");
    if (savedIntro) setIntro(savedIntro);
  }, []);

  const handleIntroSave = () => {
    localStorage.setItem("intro", intro);
    alert("자기소개가 저장되었습니다!");
  };

  return (
    <div className="mypage-container">
      {/* 상단 영역 */}
      <div className="mypage-top">
        <div className="profile-section">
          <img src="/images/profile.png" alt="프로필" className="profile-img" />

          <div className="intro-box">
            <h3>자기 소개</h3>
            <textarea
              placeholder="자기소개를 입력하세요..."
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
            <button className="save-intro-btn" onClick={handleIntroSave}>
              저장
            </button>
          </div>
        </div>

        <div className="right-section">
          <button
            className="create-group-btn"
            onClick={() => navigate("/create-group")}
          >
            모임 개설
          </button>
          <div className="mypage-buttons">
            <button onClick={() => navigate("/survey")}>설문 조사 다시하기</button>
            <button onClick={() => navigate("/edit-profile")}>
              개인 정보 수정
            </button>
          </div>
        </div>
      </div>

      {/* 취미 카드 영역 */}
      <div className="hobby-section">
        <div className="hobby-box">
          <h2>참여한 취미</h2>
          <div className="hobby-card">
            <img src="/images/guitar.png" alt="기타 연주" className="hobby-img" />
            <p className="hobby-title">🎵 기타 연주</p>
          </div>
        </div>

        <div className="hobby-box">
          <h2>개설한 취미 모임</h2>
          <div className="hobby-card empty-card">
            <p>아직 개설한 취미가 없습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
