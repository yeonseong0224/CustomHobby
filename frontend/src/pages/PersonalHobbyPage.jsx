import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllHobbies } from "../api/hobbyApi";
import "../styles/PersonalHobbyPage.css";

export default function PersonalHobbyPage() {
  const navigate = useNavigate();
  const [hobbies, setHobbies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ DB에서 취미 목록 불러오기
  useEffect(() => {
    const fetchHobbies = async () => {
      try {
        const data = await getAllHobbies();
        setHobbies(data);
        setLoading(false);
      } catch (err) {
        console.error("❌ 취미 목록 로드 실패:", err);
        setLoading(false);
      }
    };

    fetchHobbies();
  }, []);

  // ✅ 중복된 취미 이름 제거
  const uniqueHobbies = hobbies.filter(
    (h, i, arr) => arr.findIndex(o => o.hobbyName === h.hobbyName) === i
  );

  // ✅ 검색 필터 적용
  const filteredHobbies = uniqueHobbies.filter((h) =>
    h.hobbyName.toLowerCase().includes(search.toLowerCase())
  );

  const goToHobby = (id) => {
    navigate(`/hobby-description/${id}`);
  };

  if (loading) return <p style={{ textAlign: "center" }}>로딩 중입니다...</p>;

  return (
    <div className="ph-container">
      {/* 상단 검색바 */}
      <div className="ph-header">
        <input
          className="ph-search"
          type="text"
          placeholder="취미 검색..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <h2 className="ph-title">개인 맞춤 취미</h2>

      {/* 취미 목록 */}
      <div className="ph-grid">
        {filteredHobbies.length > 0 ? (
          filteredHobbies.map((hobby) => (
            <div
              key={hobby.id}
              className="ph-card"
              onClick={() => goToHobby(hobby.id)}
            >
              <img
                src={hobby.photo || "/images/default.png"}
                alt={hobby.hobbyName}
                className="ph-img"
                onError={(e) => { e.target.src = "/images/art.png"; }}
              />
              <div className="ph-info">
                <h3>{hobby.hobbyName}</h3>
                <p className="ph-desc">{hobby.description || "설명 없음"}</p>
                <p className="ph-items">
                  🧰 {hobby.materials || "준비물 정보 없음"}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="ph-empty">검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
}

