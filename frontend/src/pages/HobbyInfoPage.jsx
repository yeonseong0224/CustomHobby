import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/HobbyInfoPage.css";

export default function HobbyInfoPage() {
  const { id } = useParams(); // URL에서 카테고리 id 받기 (예: art, music 등)
  const navigate = useNavigate();

  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 카테고리 이름 매핑
  const categoryNames = {
    art: "예술/공예",
    outdoor: "야외활동",
    music: "음악/공연",
    food: "요리/음식",
    sport: "운동",
    indoor: "실내활동",
    culture: "문화/여가",
  };

  // ✅ 취미 이름별 이미지 매핑
  const hobbyImages = {
    "그림 그리기": "/images/painting.png",
    "캘리그래피": "/images/calligraphy.png",
    "사진 촬영": "/images/photo.png",
    "기타 연주": "/images/guitar.png",
    "피아노 연주": "/images/piano.png",
    "자전거 타기": "/images/bike.png",
    "요가": "/images/yoga.png",
    "하이킹": "/images/hiking.png",
    "베이킹": "/images/baking.png",
    "커피 브루잉": "/images/coffee.png",
    "캠핑": "/images/camping.png",
    "도예": "/images/pottery.png",
    "드럼 연주": "/images/drum.png",
    "파스타 만들기": "/images/pasta.png",
  };

  // ✅ DB에서 모든 취미 불러오기
  useEffect(() => {
    fetch("http://localhost:8080/api/hobbies")
      .then((res) => res.json())
      .then((data) => {
        const categoryName = categoryNames[id] || "";

        // ✅ 카테고리별 필터링
        const filtered = data.filter(
          (hobby) => hobby.hobbyCategory === categoryName
        );

        // ✅ 중복된 취미 이름 제거
        const unique = filtered.filter(
          (h, i, arr) =>
            arr.findIndex((o) => o.hobbyName === h.hobbyName) === i
        );

        setHobbies(unique);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ 취미 데이터 불러오기 실패:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ textAlign: "center" }}>로딩 중입니다...</p>;

  return (
    <div className="hobbyinfo-page">
      <h1 className="hobbyinfo-title">카테고리: {categoryNames[id] || id}</h1>
      <p className="hobbyinfo-subtext">관련 취미 활동을 선택해보세요.</p>

      {hobbies.length > 0 ? (
        <div className="hobbyinfo-grid">
          {hobbies.map((hobby) => (
            <div
              key={hobby.id}
              className="hobbyinfo-card"
              onClick={() => navigate(`/hobby/${hobby.id}`)} // ✅ DB id로 이동
            >
              <img
                src={
                  hobby.photo && hobby.photo.trim() !== ""
                    ? hobby.photo
                    : hobbyImages[hobby.hobbyName] || "/images/default.png"
                }
                alt={hobby.hobbyName}
                className="hobbyinfo-image"
              />
              <h3 className="hobbyinfo-name">{hobby.hobbyName}</h3>
              <p className="hobbyinfo-desc">{hobby.oneLineDescription}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="hobbyinfo-empty">해당 카테고리에 등록된 취미가 없습니다.</p>
      )}
    </div>
  );
}