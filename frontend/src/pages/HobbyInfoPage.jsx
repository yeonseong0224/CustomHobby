import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/HobbyInfoPage.css";

export default function HobbyInfoPage() {
  const { id } = useParams(); // URL에서 카테고리 id 받기 (예: art, music 등)
  const navigate = useNavigate();

  const [hobbies, setHobbies] = useState([]);
  const [loading, setLoading] = useState(true);

  // 카테고리 이름 매핑
  const categoryNames = {
  art: "예술/공예",
  health: "운동/건강",
  sports: "스포츠",
  music: "음악/공연",
  food: "요리/음식",
  outdoor: "야외활동",
  entertainment: "엔터테인먼트",
  theater: "공연예술",
  education: "교육/자기계발",
  lifestyle: "라이프스타일",
  self: "자기계발",
};


  // 취미 이름별 이미지 매핑
  const hobbyImages = {
    "그림 그리기": "art",
    "캘리그래피": "calligraphy",
    "서예": "calligraphy2",
    "드로잉": "drawing",
    "디자인": "design",
    "뜨개질": "knitting",
    "보석십자수": "diamond",
    "기타 연주": "guitar",
    "피아노 연주": "piano",
    "음악 감상": "music",
    "악기 연주": "instrument",
    "연주회 감상": "classic",
    "콘서트 관람": "concert",
    "요가": "yoga",
    "필라테스": "pilates",
    "헬스": "health",
    "러닝": "running",
    "클라이밍": "climbing",
    "골프": "golf",
    "복싱": "boxing",
    "홈트레이닝": "homefit",
    "수영": "swimming",
    "하이킹": "hiking",
    "등산": "mountain",
    "캠핑": "camping",
    "차박": "carcamp",
    "자전거 타기": "bike",
    "요리": "cooking",
    "요리 클래스": "class",
    "베이킹": "baking",
    "커피 브루잉": "coffee",
    "언어 공부": "language",
    "자기계발": "self",
    "독서": "book",
    "게임": "game",
    "퍼즐 맞추기": "puzzle",
    "OTT 감상": "ott",
    "영화 보기": "movie",
    "연극 관람": "theater",
    "야구 관람": "baseball",
    "축구 관람": "soccer",
    "풋살": "futsal",
    "배드민턴": "badminton",
    "여행": "travel",
    "볼링": "bowling",
  };

  // DB에서 모든 취미 불러오기
  useEffect(() => {
    fetch("http://localhost:8080/api/hobbies")
      .then((res) => res.json())
      .then((data) => {

        const categoryName = categoryNames[id] || "";

        // 카테고리별 필터링
        const filtered = data.filter(
          (hobby) => hobby.hobbyCategory === categoryName
        );
        // 중복된 취미 이름 제거
        const unique = filtered.filter(
          (h, i, arr) =>
            arr.findIndex((o) => o.hobbyName === h.hobbyName) === i
        );
  

        setHobbies(unique);
        setLoading(false);
      })
      .catch((err) => {
        console.error("취미 데이터 불러오기 실패:", err);
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
              onClick={() => navigate(`/hobby/${hobby.id}`)} // DB id로 이동
            >
              <img
  src={
    hobby.photo && hobby.photo.trim() !== ""
      ? `${window.location.origin}${
          hobby.photo.startsWith("/") ? hobby.photo : "/" + hobby.photo
        }`
      : `${window.location.origin}/images/${
          hobby.photo || "default"
        }.png`
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