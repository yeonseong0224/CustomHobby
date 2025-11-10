import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/MainPage.css";
import { getHobbyRecommendations } from "../api/recommendApi";
import { useAuth } from "../context/AuthContext";

export default function MainPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [recommendedHobbies, setRecommendedHobbies] = useState([]);
  const [newHobbies, setNewHobbies] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ 한글 취미명 → 이미지 파일명 매핑
  const imageMap = {
    // 🎨 예술/공예
    "그림 그리기": "art",
    "캘리그래피": "calligraphy",
    "서예": "calligraphy2",
    "드로잉": "drawing",
    "디자인": "design",
    "뜨개질": "knitting",
    "보석십자수": "diamond",
    // 🎵 음악/공연
    "기타 연주": "guitar",
    "피아노 연주": "piano",
    "음악 감상": "music",
    "악기 연주": "instrument",
    "연주회 감상": "classic",
    "콘서트 관람": "concert",
    // 💪 운동/건강
    "요가": "yoga",
    "필라테스": "pilates",
    "헬스": "health",
    "러닝": "running",
    "클라이밍": "climbing",
    "골프": "golf",
    "복싱": "boxing",
    "홈트레이닝": "homefit",
    "수영": "swimming",
    // 🌳 야외활동
    "하이킹": "hiking",
    "등산": "mountain",
    "캠핑": "camping",
    "차박": "carcamp",
    "자전거 타기": "bike",
    // 🍳 요리/음식
    "요리": "cooking",
    "요리 클래스": "class",
    "베이킹": "baking",
    "커피 브루잉": "coffee",
    // 📖 교육/자기계발
    "언어 공부": "language",
    "자기계발": "self",
    "독서": "book",
    // 🎮 엔터테인먼트
    "게임": "game",
    "퍼즐 맞추기": "puzzle",
    "OTT 감상": "ott",
    "영화 보기": "movie",
    // 🎭 공연예술
    "연극 관람": "theater",
    // ⚾ 스포츠
    "야구 관람": "baseball",
    "축구 관람": "soccer",
    "풋살": "futsal",
    "배드민턴": "badminton",
    // 🧳 라이프스타일
    "여행": "travel",
    "볼링": "bowling",
  };

  // ✅ (1) 유저 정보 불러오기
  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.warn("⚠️ 로그인 정보 없음 — 기본 취미 목록 표시");
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/${user.userId}`);
        if (!res.ok) throw new Error("유저 정보 요청 실패");

        const data = await res.json();
        console.log("✅ 유저 정보:", data);

        const formattedData = {
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
        };

        setUserData(formattedData);
      } catch (error) {
        console.error("❌ 유저 데이터 불러오기 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isAuthenticated]);

  // ✅ (2) Flask 추천 API 호출
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userData || Object.keys(userData).length === 0) return;
      try {
        const recs = await getHobbyRecommendations(userData);
        console.log("🎯 Flask 추천 결과:", recs);

        // ✅ 불필요한 값 제거 (. / 공백 / 빈 문자열)
        const cleanRecs = recs.filter(
          (hobby) =>
            hobby && hobby !== "." && hobby !== " " && hobby.trim() !== ""
        );

        setRecommendedHobbies(cleanRecs.slice(0, 3));
      } catch (error) {
        console.error("❌ Flask 추천 취미 불러오기 실패:", error);
      }
    };
    fetchRecommendations();
  }, [userData]);

  // ✅ (3) Spring Boot에서 새로운 취미 랜덤 불러오기
  useEffect(() => {
    const fetchNewHobbies = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/hobbies");
        if (!res.ok) throw new Error("취미 목록 요청 실패");

        const data = await res.json();
        console.log("🆕 전체 취미 목록:", data);

        // ✅ 배열을 랜덤으로 섞고 상위 3개만 표시
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setNewHobbies(shuffled.slice(0, 3));
      } catch (error) {
        console.error("❌ 새로운 취미 불러오기 실패:", error);
      }
    };
    fetchNewHobbies();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>로딩 중입니다...</p>;

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
              recommendedHobbies.map((hobby, index) => (
                <div
                  key={index}
                  className="main-item"
                  onClick={() => {
                    if (!isAuthenticated) {
                      alert("로그인이 필요합니다 😅");
                      navigate("/");
                    } else {
                      if (typeof hobby === "string") {
                        navigate(`/hobby/${encodeURIComponent(hobby)}`);
                      } else if (hobby.id) {
                        navigate(`/hobby/${hobby.id}`);
                      }
                    }
                  }}
                >
                  <img
                    src={
                      typeof hobby === "string"
                        ? process.env.PUBLIC_URL +
                          `/images/${imageMap[hobby] || hobby || "default"}.png`
                        : process.env.PUBLIC_URL +
                          `/images/${imageMap[hobby.hobbyName] || hobby.hobbyName || "default"}.png`
                    }
                    alt={typeof hobby === "string" ? hobby : hobby.hobbyName}
                    onError={(e) =>
                      (e.target.src = process.env.PUBLIC_URL + "/images/default.png")
                    }
                  />
                  <p>{typeof hobby === "string" ? hobby : hobby.hobbyName}</p>
                </div>
              ))
            ) : (
              <p
                className="main-empty"
                onClick={() => navigate("/survey")}
              >
                아직 추천할 취미가 없습니다.{" "}
                <span>설문을 먼저 진행해주세요!</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 🆕 새로운 취미 */}
      <div className="main-wrapper">
        <h2
    className="main-title"
    onClick={() => navigate("/new-hobbies")}
    style={{ cursor: "pointer", transition: "color 0.2s" }}
    onMouseEnter={(e) => (e.target.style.color = "#1e3a8a")}
    onMouseLeave={(e) => (e.target.style.color = "black")}
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
                  onClick={() => navigate(`/hobby/${hobby.id}`)}
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
              <p className="main-empty">새로운 취미가 없습니다 😢</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
