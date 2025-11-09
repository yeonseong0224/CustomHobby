// 📁 src/pages/HobbyDescriptionPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHobby, getAllHobbies } from "../api/hobbyApi";
import axios from "axios";
import "../styles/HobbyDescriptionPage.css";

export default function HobbyDescriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mainHobby, setMainHobby] = useState(null);
  const [relatedGroups, setRelatedGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let hobbyData;

        // ✅ 숫자 ID or 문자열(한글 이름) 판별
        if (/^\d+$/.test(id)) {
          hobbyData = await getHobby(id);
        } else {
          const res = await axios.get(
            `http://localhost:8080/api/hobbies/name?hobbyName=${encodeURIComponent(id)}`
          );
          hobbyData = Array.isArray(res.data) ? res.data[0] : res.data;
        }

        if (!hobbyData) throw new Error("해당 취미를 찾을 수 없습니다.");
        setMainHobby(hobbyData);

        // ✅ 같은 이름의 모임 불러오기
        const all = await getAllHobbies();
        const sameHobbyGroups = all
          .filter((h) => h.hobbyName === hobbyData.hobbyName)
          .filter(
            (h, i, arr) =>
              arr.findIndex((x) => x.oneLineDescription === h.oneLineDescription) === i
          );

        setRelatedGroups(sameHobbyGroups);
      } catch (err) {
        console.error("❌ 데이터 불러오기 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, [id]);

  if (error) return <p className="hdp-loading">❌ {error}</p>;
  if (!mainHobby) return <p className="hdp-loading">로딩 중...</p>;

  // ✅ 이미지 경로 안전 처리 함수
  const getImageSrc = (path) => {
    if (!path || path.trim() === "") return "/images/default.png";
    return path.startsWith("http")
      ? path
      : `${window.location.origin}${path.startsWith("/") ? path : "/" + path}`;
  };

  return (
    <div className="hdp-container">
      {/* 왼쪽: 대표 취미 설명 */}
      <div className="hdp-left">
        <h1 className="hdp-title">{mainHobby.hobbyName}</h1>

        <div className="hdp-image-box">
          <img
            src={getImageSrc(mainHobby.photo)}
            alt={mainHobby.hobbyName}
            className="hdp-image"
          />
        </div>

        <div className="hdp-info">
          <h2>취미 설명</h2>
          <p>{mainHobby.description || "설명이 없습니다."}</p>

          <h3>💼 준비물</h3>
          <p>{mainHobby.materials || "정보 없음"}</p>

          <h3>🎯 대체 활동</h3>
          <p>{mainHobby.haveMaterial || "정보 없음"}</p>
        </div>
      </div>

      {/* 오른쪽: 관련 모임 목록 */}
      <div className="hdp-right">
        <h2 className="hdp-subtitle">이 취미의 모임 목록</h2>

        <div className="hdp-meeting-grid">
          {relatedGroups.length > 0 ? (
            relatedGroups.map((group) => (
              <div
                key={group.id}
                className="hdp-meeting-card"
                onClick={() => navigate(`/hobby-detail/${group.id}`)}
              >
                <img
                  src={getImageSrc(group.photo)}
                  alt={group.hobbyName}
                  className="hdp-meeting-img"
                />
                <div className="hdp-meeting-info">
                  <h3>{group.oneLineDescription}</h3>
                  <p>{group.locationLink}</p>
                  <p className="hdp-meeting-sub">
                    💸 {group.participationFee?.toLocaleString() ?? 0}원 · 📅{" "}
                    {group.meetingDate || "미정"}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="hdp-empty">현재 등록된 모임이 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
