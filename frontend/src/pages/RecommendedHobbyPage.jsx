import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAllHobbies } from "../api/hobbyApi"; // ✅ 올바른 import
import "../styles/RecommendedHobbyPage.css";

export default function RecommendedHobbyPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 카테고리별 취미 불러오기
  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const allHobbies = await getAllHobbies();
        // id와 hobbyCategory를 비교하여 필터링
        const filtered = allHobbies.filter(
          (h) => h.hobbyCategory && h.hobbyCategory.includes(id)
        );
        setHobbies(filtered);
      } catch (error) {
        console.error("❌ 추천 취미 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHobbies();
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>로딩 중...</p>;

  return (
    <div className="rec-container">
      <h1 className="rec-title">추천 취미 - {id}</h1>
      <p className="rec-subtitle">당신의 관심과 취향에 맞춘 취미 클래스입니다.</p>

      <div className="rec-grid">
        {hobbies.length > 0 ? (
          hobbies.map((hobby) => (
            <div
              key={hobby.id}
              className="rec-card"
              onClick={() => navigate(`/hobby-description/${hobby.id}`)}
            >
              <img
                src={hobby.photo || "/images/default.png"}
                alt={hobby.hobbyName}
                className="rec-img"
                onError={(e) => (e.target.src = "/images/default.png")}
              />
              <div className="rec-info">
                <h3>{hobby.hobbyName}</h3>
                <p className="rec-category">{hobby.hobbyCategory}</p>
                <p className="rec-type">{hobby.meetingType || "정보 없음"}</p>
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
