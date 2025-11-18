import React, { useEffect, useState } from "react";
import { getAllHobbies } from "../api/hobbyApi";
import { getHobbyRecommendations } from "../api/recommendApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/NewHobbiesPage.css";

export default function NewHobbiesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [allHobbies, setAllHobbies] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [filteredHobbies, setFilteredHobbies] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // 🔍 검색어 상태 추가

  // ✅ 전체 취미 불러오기
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await getAllHobbies();
        setAllHobbies(res);
      } catch (err) {
        console.error("❌ 전체 취미 로드 실패:", err);
      }
    };
    fetchAll();
  }, []);

  // ✅ Flask 추천 결과 불러오기
  useEffect(() => {
    const fetchRecs = async () => {
      if (!user) return;
      try {
        const recs = await getHobbyRecommendations(user);
        setRecommended(recs);
      } catch (err) {
        console.error("❌ 추천 취미 로드 실패:", err);
      }
    };
    fetchRecs();
  }, [user]);

// ✅ 추천에 없는 취미 필터링 + 중복 제거
useEffect(() => {
  if (allHobbies.length === 0) return;

  // 추천 목록에 없는 취미만 필터링
  const filtered = allHobbies.filter(
    (h) => !recommended.some((r) => r.name === h.hobbyName)
  );

  // ✅ hobbyName 기준으로 중복 제거
  const uniqueFiltered = filtered.filter(
    (hobby, index, self) =>
      index === self.findIndex((t) => t.hobbyName === hobby.hobbyName)
  );

  setFilteredHobbies(uniqueFiltered);
}, [allHobbies, recommended]);


  // ✅ 검색어 필터 적용
  const searchedHobbies = filteredHobbies.filter((h) =>
    h.hobbyName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  console.log('============');
  console.log(JSON.stringify(searchedHobbies));
  
  console.log('============');
  return (
    <div className="newhobbies-container">
      <h1 className="newhobbies-title">새로운 취미 목록</h1>
      <p className="newhobbies-desc">
        개인 맞춤 추천에 포함되지 않은 다양한 취미를 만나보세요 ✨
      </p>

      {/* 🔍 검색창 */}
      <div className="search-box">
        <input
          type="text"
          placeholder="검색어를 입력하세요 (예: 요가, 그림, 여행...)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* 📋 결과 목록 */}
      <div className="newhobbies-grid">
  {searchedHobbies.length > 0 ? (
    searchedHobbies.map((hobby) => (
      <div
        key={hobby.id}
        className="newhobby-card"
        onClick={() => navigate(`/hobby/${hobby.id}`)}
      >
        <img
          src={
            hobby.photo && hobby.photo.trim() !== ""
              ? `${window.location.origin}${
                  hobby.photo.startsWith("/")
                    ? hobby.photo
                    : "/" + hobby.photo
                }`
              : `${window.location.origin}/images/default.png`
          }
          alt={hobby.hobbyName}
          className="newhobby-img"
        />

        {/* 🔥 여기만 취미 이름만 나타나도록 수정 */}
        <div className="newhobby-info">
          <h3>{hobby.hobbyName}</h3>
        </div>
      </div>
    ))
  ) : (
    <p className="newhobbies-empty">검색 결과가 없습니다 😢</p>
  )}
</div>

    </div>
  );
}
