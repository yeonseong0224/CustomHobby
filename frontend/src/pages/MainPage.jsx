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

  // 🔠 취미 → 이미지 매핑
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

  // (1) 유저 정보 가져오기
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/${user.userId}`);
        if (!res.ok) throw new Error("유저 정보 요청 실패");

        const data = await res.json();

        // hasSurvey 확인 - 설문 완료 여부 체크
        if (!data.hasSurvey){
          console.log("설문조사 미완료 - 추천 API 호출 안함");
          setUserData(null); // userData를 null 로 설정하여 추천 API 호출 방지
          setLoading(flase);
          return;
        }

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
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, isAuthenticated]);

  // (2) Flask 추천 결과 불러오기
  useEffect(() => {
    if (!userData) return;

    const fetchRecs = async () => {
      try {
        const recs = await getHobbyRecommendations(userData);

        const clean = recs.filter(
          (hobby) =>
            hobby &&
            hobby !== "." &&
            hobby.trim() !== ""
        );

        setRecommendedHobbies(clean.slice(0, 3));
      } catch (err) {
        console.error("추천 취미 로드 실패:", err);
      }
    };

    fetchRecs();
  }, [userData]);

  // (3) 새로운 취미 — 중복 제거 + 추천 제외
  useEffect(() => {
    const fetchNewHobbies = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/hobbies");
        if (!res.ok) throw new Error("취미 목록 요청 실패");

        const data = await res.json();

        // 1️⃣ hobbyName 기준 중복 제거
        const uniqueList = data.filter(
          (h, idx, self) =>
            idx === self.findIndex((x) => x.hobbyName === h.hobbyName)
        );

        // 2️⃣ 추천 취미 제외
        const filtered = uniqueList.filter(
          (hobby) =>
            !recommendedHobbies.some(
              (rec) =>
                (typeof rec === "string" ? rec : rec.hobbyName) === hobby.hobbyName
            )
        );

        // 3️⃣ 랜덤 3개 출력
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        setNewHobbies(shuffled.slice(0, 3));
      } catch (err) {
        console.error("새로운 취미 불러오기 실패:", err);
      }
    };

    fetchNewHobbies();
  }, [recommendedHobbies]);

  if (loading) return <p style={{ textAlign: "center" }}>로딩 중...</p>;

  return (
    <div className="main-container">

      {/* 개인 맞춤 취미 */}
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
                  onClick={() =>
                    navigate(
                      typeof hobby === "string"
                        ? `/hobby/${encodeURIComponent(hobby)}`
                        : `/hobby/${hobby.id}`
                    )
                  }
                >
                  <img
                    src={
                      typeof hobby === "string"
                        ? `/images/${imageMap[hobby] || "default"}.png`
                        : `/images/${imageMap[hobby.hobbyName] || "default"}.png`
                    }
                    onError={(e) => (e.target.src = "/images/default.png")}
                    alt={typeof hobby === "string" ? hobby : hobby.hobbyName}
                  />
                  <p>{typeof hobby === "string" ? hobby : hobby.hobbyName}</p>
                </div>
              ))
            ) : (
              <p className="main-empty" onClick={() => navigate("/survey")}>
                <span>설문을 진행해주세요!</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 새로운 취미 보기 */}
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
                  onClick={() => navigate(`/hobby/${hobby.id}`)}
                >
                  <img
                    src={hobby.photo || "/images/default.png"}
                    onError={(e) => (e.target.src = "/images/default.png")}
                    alt={hobby.hobbyName}
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
