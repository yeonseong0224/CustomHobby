import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserParticipatedHobbies } from "../api/hobbyApi";
import { getUserCreatedGroups } from "../api/hobbyGroupApi";
import "../styles/MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();  // ✅ Context에서 사용자 정보 가져오기
  const [intro, setIntro] = useState("");
  const [participatedHobbies, setParticipatedHobbies] = useState([]);
  const [createdGroups, setCreatedGroups] = useState([]);

  useEffect(() => {
    const savedIntro = localStorage.getItem("intro");
    if (savedIntro) setIntro(savedIntro);

    // ✅ Context에서 사용자 정보 확인
    if (!user || !user.userId) {
      console.warn("⚠️ 로그인이 필요합니다.");
      navigate("/");
      return;
    }
    
    // 참여한 취미 조회
    const fetchParticipatedHobbies = async () => {
      try {
        const data = await getUserParticipatedHobbies(user.userId);
        setParticipatedHobbies(data);
      } catch (error) {
        console.error("참여한 취미 조회 실패:", error);
      }
    };

    // 개설한 모임 조회
    const fetchCreatedGroups = async () => {
      try {
        const data = await getUserCreatedGroups(user.userId);
        setCreatedGroups(data);
      } catch (error) {
        console.error("개설한 모임 조회 실패:", error);
      }
    };

    fetchParticipatedHobbies();
    fetchCreatedGroups();
  }, [user, navigate]);

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
          {participatedHobbies.length > 0 ? (
            participatedHobbies.map((hobby) => (
              <div 
                key={hobby.id} 
                className="hobby-card"
                onClick={() => navigate(`/hobby-detail/${hobby.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img 
                  src={hobby.photo || "/images/art.png"} 
                  alt={hobby.hobbyName} 
                  className="hobby-img"
                  onError={(e) => { 
                    console.warn(`이미지 로드 실패: ${e.target.src}`);
                    e.target.src = "/images/art.png"; 
                  }}
                />
                <p className="hobby-title">{hobby.hobbyName}</p>
              </div>
            ))
          ) : (
            <div className="hobby-card empty-card">
              <p>참여한 취미가 없습니다.</p>
            </div>
          )}
        </div>

        <div className="hobby-box">
          <h2>개설한 취미 모임</h2>
          {createdGroups.length > 0 ? (
            createdGroups.map((group) => (
              <div 
                key={group.id} 
                className="hobby-card"
                onClick={() => navigate(`/my-group-detail/${group.id}`)}
                style={{ cursor: "pointer" }}
              >
                <p className="hobby-title">{group.groupName}</p>
                <p style={{ fontSize: "14px", color: "#666" }}>{group.groupDescription}</p>
              </div>
            ))
          ) : (
            <div className="hobby-card empty-card">
              <p>아직 개설한 취미가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
