import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/HobbyInfoPage.css";

export default function HobbyInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 예시 취미 데이터
  const hobbyData = {
    art: [
      { name: "수채화 그리기", image: "/images/watercolor.png" },
      { name: "도자기 공예", image: "/images/pottery.png" },
      { name: "캘리그래피", image: "/images/calligraphy.png" },
    ],
    outdoor: [
      { name: "하이킹", image: "/images/hiking.png" },
      { name: "캠핑", image: "/images/camping.png" },
      { name: "러닝", image: "/images/running.png" },
    ],
    music: [
      { name: "기타 연주", image: "/images/guitar.png" },
      { name: "피아노", image: "/images/piano.png" },
      { name: "드럼", image: "/images/drum.png" },
    ],
    food: [
      { name: "베이킹", image: "/images/baking.png" },
      { name: "이탈리안 요리", image: "/images/pasta.png" },
      { name: "커피 브루잉", image: "/images/coffee.png" },
    ],
  };

  const hobbies = hobbyData[id] || [];

  const categoryNames = {
    art: "예술/공예",
    outdoor: "야외활동",
    music: "음악/공연",
    food: "요리/음식",
  };

  return (
    <div className="hobbyinfo-page">
      <h1 className="hobbyinfo-title">카테고리: {categoryNames[id] || id}</h1>
      <p className="hobbyinfo-subtext">관련 취미 활동을 선택해보세요.</p>

      <div className="hobbyinfo-grid">
        {hobbies.map((hobby, index) => (
          <div
            key={index}
            className="hobbyinfo-card"
            onClick={() => navigate(`/hobby-detail/${hobby.name}`)}
          >
            <img src={hobby.image} alt={hobby.name} className="hobbyinfo-image" />
            <h3 className="hobbyinfo-name">{hobby.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
