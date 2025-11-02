import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHobbiesByCategory } from "../api/hobbyApi";
import "../styles/HobbyInfoPage.css";

export default function HobbyInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hobbies, setHobbies] = useState([]);

  const categoryNames = {
    art: "예술/공예",
    outdoor: "야외활동",
    music: "음악/공연",
    food: "요리/음식",
  };

  // 기본 이미지 매핑
  const defaultImages = {
    art: "/images/art.png",
    outdoor: "/images/outdoor.png",
    music: "/images/music.png",
    food: "/images/food.png",
  };

  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const categoryName = categoryNames[id];
        if (categoryName) {
          const data = await getHobbiesByCategory(categoryName);
          console.log(`📦 카테고리 [${categoryName}] 취미 데이터:`, data);
          setHobbies(data);
        }
      } catch (error) {
        console.error("❌ 카테고리별 취미 조회 실패:", error);
        // 오류 발생 시 기본 데이터 사용
        const hobbyData = {
          art: [
            { id: 1, hobbyName: "수채화 그리기", photo: "/images/watercolor.png" },
            { id: 2, hobbyName: "도자기 공예", photo: "/images/pottery.png" },
            { id: 3, hobbyName: "캘리그래피", photo: "/images/calligraphy.png" },
          ],
          outdoor: [
            { id: 4, hobbyName: "하이킹", photo: "/images/hiking.png" },
            { id: 5, hobbyName: "캠핑", photo: "/images/camping.png" },
            { id: 6, hobbyName: "러닝", photo: "/images/running.png" },
          ],
          music: [
            { id: 7, hobbyName: "기타 연주", photo: "/images/guitar.png" },
            { id: 8, hobbyName: "피아노", photo: "/images/piano.png" },
            { id: 9, hobbyName: "드럼", photo: "/images/drum.png" },
          ],
          food: [
            { id: 10, hobbyName: "베이킹", photo: "/images/baking.png" },
            { id: 11, hobbyName: "이탈리안 요리", photo: "/images/pasta.png" },
            { id: 12, hobbyName: "커피 브루잉", photo: "/images/coffee.png" },
          ],
        };
        setHobbies(hobbyData[id] || []);
      }
    };

    fetchHobbies();
  }, [id]);

  return (
    <div className="hobbyinfo-page">
      <h1 className="hobbyinfo-title">카테고리: {categoryNames[id] || id}</h1>
      <p className="hobbyinfo-subtext">관련 취미 활동을 선택해보세요.</p>

      <div className="hobbyinfo-grid">
        {hobbies.map((hobby) => (
          <div
            key={hobby.id}
            className="hobbyinfo-card"
            onClick={() => navigate(`/hobby-detail/${hobby.id}`)}
          >
            <img 
              src={hobby.photo || defaultImages[id] || "/images/art.png"} 
              alt={hobby.hobbyName} 
              className="hobbyinfo-image"
              onError={(e) => { 
                console.warn(`이미지 로드 실패: ${e.target.src}`);
                e.target.src = defaultImages[id] || "/images/art.png"; 
              }}
            />
            <h3 className="hobbyinfo-name">{hobby.hobbyName}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
