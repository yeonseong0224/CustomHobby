import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHobby, getAllHobbies } from "../api/hobbyApi";
import axios from "axios";
import "../styles/HobbyDescriptionPage.css";

export default function HobbyDescriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mainHobby, setMainHobby] = useState(null);
  const [groupHobbies, setGroupHobbies] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let data;

        // ✅ 숫자면 ID 기반 조회
        if (/^\d+$/.test(id)) {
          data = await getHobby(id);
        } else {
          // ✅ 이름 기반 조회 (한글 지원)
          const res = await axios.get(
            `http://localhost:8080/api/hobbies/name?hobbyName=${encodeURIComponent(id)}`
          );
          data = Array.isArray(res.data) ? res.data[0] : res.data;
        }

        console.log("✅ 최종 선택된 취미:", data);
        setMainHobby(data);

        // ✅ 같은 이름의 취미 모임 불러오기 + 중복 제거
        const all = await getAllHobbies();
        const sameHobbyGroup = all
          .filter((h) => h.hobbyName === data.hobbyName)
          .filter(
            (h, idx, arr) =>
              arr.findIndex((x) => x.oneLineDescription === h.oneLineDescription) === idx
          );

        setGroupHobbies(sameHobbyGroup);
      } catch (err) {
        console.error("❌ 데이터 불러오기 실패:", err);
        setError("데이터를 불러오는 중 오류가 발생했습니다.");
      }
    };

    fetchData();
  }, [id]);

  if (!mainHobby) return <p className="hdp-loading">로딩 중...</p>;

  return (
    <div className="hdp-container">
      {/* 왼쪽: 대표 취미 설명 */}
      <div className="hdp-left">
        <h1 className="hdp-title">{mainHobby.hobbyName}</h1>

        <div className="hdp-image-box">
          <img
            src={
              mainHobby.photo && mainHobby.photo.trim() !== ""
                ? `${window.location.origin}${
                    mainHobby.photo.startsWith("/")
                      ? mainHobby.photo
                      : "/" + mainHobby.photo
                  }`
                : `${window.location.origin}/images/default.png`
            }
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

      {/* 오른쪽: 같은 취미의 모임 목록 */}
      <div className="hdp-right">
        <h2 className="hdp-subtitle">이 취미의 모임 목록</h2>

        <div className="hdp-meeting-grid">
  {groupHobbies.length > 0 ? (
    groupHobbies.map((meet) => (
      <div
        key={meet.id}
        className="hdp-meeting-card"
        onClick={() => navigate(`/hobby-detail/${meet.id}`)}
      >
        <img
          src={
            mainHobby.photo && mainHobby.photo.trim() !== ""
              ? `${window.location.origin}${
                  mainHobby.photo.startsWith("/")
                    ? mainHobby.photo
                    : "/" + mainHobby.photo
                }`
              : `${window.location.origin}/images/default.png`
          }
          alt={meet.hobbyName}
          className="hdp-meeting-img"
        />

        <div className="hdp-meeting-info">
          <h3>{meet.oneLineDescription}</h3>
          <p>{meet.locationLink}</p>
          <p className="hdp-meeting-sub">
            💸 {meet.participationFee?.toLocaleString() ?? 0}원 · 📅{" "}
            {meet.meetingDate || "미정"}
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
