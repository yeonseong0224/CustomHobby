// 📁 src/pages/PersonalHobbyPage.jsx
import React, { useEffect, useState } from "react";
import "../styles/PersonalHobbyPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PersonalHobbyPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [recommendedHobbies, setRecommendedHobbies] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 취미명 → 이미지 매핑
  const imageMap = {
    "그림 그리기": "art",
    "기타 연주": "guitar",
    "요가": "yoga",
    "하이킹": "hiking",
    "베이킹": "baking",
    "캠핑": "camping",
    "커피 브루잉": "coffee",
    "언어 공부": "language",
    "독서": "book",
    "여행": "travel",
  };

  // ✅ 추천 취미 불러오기 (React → Spring Boot → Flask)
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!isAuthenticated || !user) {
        alert("로그인이 필요합니다.");
        navigate("/");
        return;
      }

      try {
        console.log("📡 추천 요청 중...");
        const res = await fetch("http://localhost:8080/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gender: user.gender,
            age_group: user.ageGroup,
            preferred_place: user.preferredPlace,
            propensity: user.propensity,
            budget: user.budget,
            hobby_time: user.hobbyTime,
            time_per_day: user.timePerDay,
            frequency: user.frequency,
            goal: user.goal,
            sociality: user.sociality,
          }),
        });

        if (!res.ok) throw new Error("추천 요청 실패");
        const data = await res.json();

        console.log("🎯 Flask 추천 결과:", data);
        setRecommendedHobbies(data.recommendations || []);
      } catch (err) {
        console.error("❌ 추천 취미 불러오기 실패:", err);
        alert("추천 취미를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, isAuthenticated, navigate]);

  if (loading) return <p style={{ textAlign: "center" }}>로딩 중입니다...</p>;

  return (
    <div className="ph-container">
      <h2 className="ph-title">🎯 AI 추천 취미 TOP 5</h2>

      <div className="ph-grid">
        {recommendedHobbies.length > 0 ? (
          recommendedHobbies.map((hobby, i) => (
            <div
              key={i}
              className="ph-card"
              onClick={() => navigate(`/hobby/${encodeURIComponent(hobby)}`)}
            >
              <img
                src={`/images/${imageMap[hobby] || "default"}.png`}
                alt={hobby}
                className="ph-img"
                onError={(e) =>
                  (e.target.src = process.env.PUBLIC_URL + "/images/default.png")
                }
              />
              <div className="ph-info">
                <h3>{hobby}</h3>
                <p className="ph-desc">AI가 추천한 당신에게 어울리는 취미입니다 💡</p>
              </div>
            </div>
          ))
        ) : (
          <p className="ph-empty">추천된 취미가 없습니다 😢</p>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button className="ph-btn" onClick={() => navigate("/main")}>
          ← 메인으로 돌아가기
        </button>
      </div>
    </div>
  );
}
