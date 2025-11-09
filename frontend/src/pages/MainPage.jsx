// 📁 src/pages/MainPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainPage.css";
import { useAuth } from "../context/AuthContext";

export default function MainPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [recommendedHobbies, setRecommendedHobbies] = useState([]);
  const [newHobbies, setNewHobbies] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ 이미지 매핑
  const imageMap = {
    "그림 그리기": "art",
    "캘리그래피": "calligraphy",
    "사진 촬영": "photo",
    "기타 연주": "guitar",
    "피아노 연주": "piano",
    "요가": "yoga",
    "베이킹": "baking",
    "커피 브루잉": "coffee",
    "하이킹": "hiking",
    "자전거 타기": "bike",
    "캠핑": "camping",
    "독서": "book",
    "언어 공부": "language",
    "게임": "game",
    "여행": "travel",
  };

  // ✅ 1. Spring Boot에서 사용자 정보 가져오기
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        if (!isAuthenticated || !user?.userId) {
          console.warn("⚠️ 로그인 정보 없음 — 기본 취미 표시");
          setLoading(false);
          return;
        }

        console.log("📡 사용자 ID:", user.userId);

        // Spring Boot에서 사용자 정보 가져오기
        const userRes = await fetch(`http://localhost:8080/api/users/${user.userId}`);
        if (!userRes.ok) throw new Error("Spring Boot 사용자 요청 실패");
        const userData = await userRes.json();

        console.log("✅ Spring Boot 유저 정보:", userData);

        // Flask AI 요청
        const aiRes = await fetch("http://localhost:8080/api/recommend", {
          // ✅ Flask가 아니라 Spring Boot로 요청해야 함 (Spring이 Flask로 중계)
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            gender: userData.gender,
            age_group: userData.ageGroup,
            preferred_place: userData.preferredPlace,
            propensity: userData.propensity,
            budget: userData.budget,
            hobby_time: userData.hobbyTime,
            time_per_day: userData.timePerDay,
            frequency: userData.frequency,
            goal: userData.goal,
            sociality: userData.sociality,
          }),
        });

        if (!aiRes.ok) throw new Error("Flask AI 요청 실패");
        const aiData = await aiRes.json();
        console.log("🎯 AI 추천 결과:", aiData);

        setRecommendedHobbies(aiData.recommendations || []);
      } catch (err) {
        console.error("❌ 추천 로직 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user, isAuthenticated]);

  // ✅ 2. Spring Boot에서 새로운 취미 목록 가져오기
  useEffect(() => {
    const fetchNewHobbies = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/hobbies");
        if (!res.ok) throw new Error("취미 목록 요청 실패");

        const data = await res.json();
        console.log("🆕 새로운 취미:", data);
        setNewHobbies(data.slice(0, 3));
      } catch (err) {
        console.error("❌ 취미 데이터 불러오기 실패:", err);
      }
    };

    fetchNewHobbies();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>로딩 중...</p>;

  return (
    <div className="main-container">
      {/* 🎯 개인 맞춤 취미 */}
      <div className="main-wrapper">
        <h2
          className="main-title"
          onClick={() => navigate("/personal-hobby")}
          style={{ cursor: "pointer" }}
        >
          개인 맞춤 취미
        </h2>

        <div className="main-card">
          <div className="main-list">
            {recommendedHobbies.length > 0 ? (
              recommendedHobbies.map((hobby, i) => (
                <div
                  key={i}
                  className="main-item"
                  onClick={() =>
                    navigate(`/hobby/${encodeURIComponent(hobby)}`)
                  }
                >
                  <img
                    src={
                      process.env.PUBLIC_URL +
                      `/images/${imageMap[hobby] || "default"}.png`
                    }
                    alt={hobby}
                    onError={(e) =>
                      (e.target.src =
                        process.env.PUBLIC_URL + "/images/default.png")
                    }
                  />
                  <p>{hobby}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center" }}>추천 취미가 없습니다 😢</p>
            )}
          </div>
        </div>
      </div>

      {/* 🆕 새로운 취미 */}
      <div className="main-wrapper">
        <h2
          className="main-title"
          onClick={() => navigate("/new-hobbies")}
          style={{ cursor: "pointer" }}
        >
          새로운 취미 보기
        </h2>

        <div className="main-card">
          <div className="main-list">
            {newHobbies.length > 0 ? (
              newHobbies.map((hobby) => (
                <div
                  key={hobby.id}
                  className="main-item"
                  onClick={() => navigate(`/hobby-detail/${hobby.id}`)}
                >
                  <img
                    src={hobby.photo || "/images/default.png"}
                    alt={hobby.hobbyName}
                    onError={(e) => (e.target.src = "/images/default.png")}
                  />
                  <p>{hobby.hobbyName}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center" }}>새로운 취미가 없습니다 😢</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
