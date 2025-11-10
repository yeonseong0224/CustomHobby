import React, { useEffect, useState } from "react";
import "../styles/PersonalHobbyPage.css";
import { useNavigate } from "react-router-dom";
import { getHobbyRecommendations } from "../api/recommendApi";
import { useAuth } from "../context/AuthContext";

export default function PersonalHobbyPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [recommendedHobbies, setRecommendedHobbies] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 한글 취미명 → 이미지 파일명 매핑
  const imageMap = {
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

  // ✅ (1) Spring Boot에서 최신 유저 정보 가져오기
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) {
        alert("로그인이 필요합니다 😅");
        navigate("/");
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080/api/users/${user.userId}`);
        if (!res.ok) throw new Error("유저 정보 요청 실패");

        const data = await res.json();
        console.log("✅ [개인취미] 유저 정보:", data);

        setUserData({
          gender: data.gender || "",
          age_group: data.ageGroup || "",
          preferred_place: data.preferredPlace || "",
          propensity: data.propensity || "",
          budget: data.budget || "",
          hobby_time: data.hobbyTime || "",
          time_per_day: data.timePerDay || "",
          frequency: data.frequency || "",
          goal: data.goal || "",
          sociality: data.sociality || "",
        });
      } catch (error) {
        console.error("❌ 유저 데이터 불러오기 실패:", error);
      }
    };

    fetchUserData();
  }, [user, isAuthenticated, navigate]);

  // ✅ (2) Flask 추천 API 호출
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userData) return;
      try {
        const recs = await getHobbyRecommendations(userData);
        console.log("🎯 Flask 추천 결과:", recs);
        setRecommendedHobbies(recs.slice(0, 5));
      } catch (error) {
        console.error("❌ 추천 취미 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecommendations();
  }, [userData]);

  if (loading) return <p style={{ textAlign: "center" }}>로딩 중입니다...</p>;

  return (
    <div className="ph-container">
      <h2 className="ph-title">🎯 당신을 위한 추천 취미 5가지</h2>

      <div className="ph-grid">
        {recommendedHobbies.length > 0 ? (
          recommendedHobbies.map((hobby, index) => (
            <div
              key={index}
              className="ph-card"
              onClick={() => {
                if (typeof hobby === "string") {
                  navigate(`/hobby/${encodeURIComponent(hobby)}`);
                } else if (hobby.id) {
                  navigate(`/hobby/${hobby.id}`);
                }
              }}
            >
              <img
                src={
                  typeof hobby === "string"
                    ? `/images/${imageMap[hobby] || "default"}.png`
                    : `/images/${
                        imageMap[hobby.hobbyName] || hobby.hobbyName || "default"
                      }.png`
                }
                alt={typeof hobby === "string" ? hobby : hobby.hobbyName}
                className="ph-img"
                onError={(e) => (e.target.src = "/images/default.png")}
              />
              <div className="ph-info">
                <h3>{typeof hobby === "string" ? hobby : hobby.hobbyName}</h3>
                <p className="ph-desc">
                  {typeof hobby === "string"
                    ? "추천된 인기 취미입니다."
                    : hobby.description || "설명 없음"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="ph-empty">추천된 취미가 없습니다 😢</p>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button className="ph-btn" onClick={() => navigate("/main")}>
          ← 메인 페이지로 돌아가기
        </button>
      </div>
    </div>
  );
}
