import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllHobbies } from "../api/hobbyApi";
import "../styles/MainPage.css";

export default function MainPage() {
  const navigate = useNavigate();
  const [personalizedHobbies, setPersonalizedHobbies] = useState([]);
  const [newHobbies, setNewHobbies] = useState([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const hobbies = await getAllHobbies();
        console.log("📦 받은 취미 데이터:", hobbies);
        
        // 개인 맞춤 취미 (처음 3개)
        setPersonalizedHobbies(hobbies.slice(0, 3));
        
        // 새로운 취미 (다음 3개)
        setNewHobbies(hobbies.slice(3, 6));
      } catch (error) {
        console.error("❌ 취미 목록 조회 실패:", error);
        // 오류 발생 시 기본 데이터 사용
        setPersonalizedHobbies([
          { id: 1, hobbyName: "자전거 타기", photo: "/images/bike.png" },
          { id: 2, hobbyName: "기타 연주", photo: "/images/guitar.png" },
          { id: 3, hobbyName: "그림 그리기", photo: "/images/painting.png" }
        ]);
        setNewHobbies([
          { id: 4, hobbyName: "요가", photo: "/images/yoga.png" },
          { id: 5, hobbyName: "베이킹", photo: "/images/baking.png" },
          { id: 6, hobbyName: "하이킹", photo: "/images/hiking.png" }
        ]);
      }
    };

    fetchHobbies();
  }, []);

  const handleHobbyClick = (hobbyId) => {
    navigate(`/hobby-detail/${hobbyId}`);
  };

  return (
    <div className="main-container">
      {/* 개인 맞춤 취미 */}
      <div className="main-wrapper">
        <h2 className="main-title">개인 맞춤 취미</h2>
        <div className="main-card">
          <div className="main-list">
            {personalizedHobbies.map((hobby) => (
              <div 
                key={hobby.id} 
                className="main-item"
                onClick={() => handleHobbyClick(hobby.id)}
                style={{ cursor: "pointer" }}
              >
                <img 
                  src={hobby.photo || "/images/art.png"} 
                  alt={hobby.hobbyName} 
                  onError={(e) => { 
                    console.warn(`이미지 로드 실패: ${e.target.src}`);
                    e.target.src = "/images/art.png"; 
                  }}
                />
                <p>{hobby.hobbyName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 새로운 취미 */}
      <div className="main-wrapper">
        <h2 className="main-title">새로운 취미</h2>
        <div className="main-card">
          <div className="main-list">
            {newHobbies.map((hobby) => (
              <div 
                key={hobby.id} 
                className="main-item"
                onClick={() => handleHobbyClick(hobby.id)}
                style={{ cursor: "pointer" }}
              >
                <img 
                  src={hobby.photo || "/images/art.png"} 
                  alt={hobby.hobbyName}
                  onError={(e) => { 
                    console.warn(`이미지 로드 실패: ${e.target.src}`);
                    e.target.src = "/images/art.png"; 
                  }}
                />
                <p>{hobby.hobbyName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
