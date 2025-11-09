import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllHobbies } from "../api/hobbyApi";
import "../styles/RecommendedHobbyPage.css";

export default function RecommendedHobbyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hobbies, setHobbies] = useState([]);


  useEffect(() => {
    const fetchRecommendedHobbies = async () => {
      try {
        // 실제로는 추천 알고리즘 적용 필요
        // 현재는 전체 취미 목록을 가져와서 일부만 표시
        const allHobbies = await getAllHobbies();
        setHobbies(allHobbies.slice(0, 6)); // 상위 6개만 표시
      } catch (error) {
        console.error("❌ 추천 취미 조회 실패:", error);
      }
    };

    fetchRecommendedHobbies();
  }, [id]);

  return (
    <div className="rec-container">
      <h1 className="rec-title">추천 취미</h1>
      <p className="rec-subtitle">당신의 관심과 취향에 맞춘 취미입니다.</p>


      <div className="rec-grid">
        {hobbies.length > 0 ? (
          hobbies.map((hobby) => (
            <div
              key={hobby.id}
              className="rec-card"
              onClick={() => navigate(`/hobby-description/${hobby.id}`)}
            >
              <img 

                src={hobby.photo || "/images/art.png"} 
                alt={hobby.hobbyName} 
                className="rec-img"
                onError={(e) => { e.target.src = "/images/art.png"; }}

              />
              <div className="rec-info">
                <h3>{hobby.hobbyName}</h3>
                <p className="rec-category">{hobby.hobbyCategory}</p>
                <p className="rec-type">{hobby.meetingType}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="rec-empty">추천 데이터가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

