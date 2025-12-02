import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { getAllHobbyGroups } from "../api/hobbyGroupApi";
import "../styles/HobbyDescriptionPage.css";

export default function HobbyDescriptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [mainHobby, setMainHobby] = useState(null);
  const [mergedGroups, setMergedGroups] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let hobbyData;

        if (/^\d+$/.test(id)) {
          const res = await axios.get(`http://localhost:8080/api/hobbies/${id}`);
          hobbyData = res.data;
        } else {
          const res = await axios.get(
            `http://localhost:8080/api/hobbies/name?hobbyName=${encodeURIComponent(id)}`
          );
          hobbyData = Array.isArray(res.data) ? res.data[0] : res.data;
        }

        setMainHobby(hobbyData);

        // Official group 형태 변환
        const officialGroup = {
          id: "official-" + hobbyData.id,
          groupName: hobbyData.oneLineDescription,
          locationLink: hobbyData.locationLink,
          participationFee: hobbyData.participationFee,
          meetingDate: hobbyData.meetingDate,
          photo: hobbyData.photo,
          source: "official",
        };

        // User groups
        const allUserGroups = await getAllHobbyGroups();
        const userGroups = allUserGroups
          .filter((g) => g.hobbyName === hobbyData.hobbyName)
          .map((g) => ({
            id: g.id,
            groupName: g.groupName,
            locationLink: g.locationLink,
            participationFee: g.participationFee,
            meetingDate: g.meetingDate,
            photo: g.groupImage,
            source: "user",
          }));

        setMergedGroups([officialGroup, ...userGroups]);
      } catch (err) {
        //console.error("데이터 로드 실패:", err);
        setError("데이터 불러오기 오류");
      }
    };

    fetchData();
  }, [id]);

  if (!mainHobby) return <p>로딩 중...</p>;

  return (
    <div className="hdp-container">
      <div className="hdp-left">
        <h1 className="hdp-title">{mainHobby.hobbyName}</h1>

        <div className="hdp-image-box">
          <img
            src={
              mainHobby.photo
                ? `${window.location.origin}/${mainHobby.photo}`
                : `${window.location.origin}/images/default.png`
            }
            alt={mainHobby.hobbyName}
            className="hdp-image"
          />
        </div>

        <div className="hdp-info big-card">
          <h2 className="section-title">📘 취미 정보</h2>

          <div className="info-block">
            <h3>📝 취미 설명</h3>
            <p>{mainHobby.description || "설명이 없습니다."}</p>
          </div>

          <div className="info-block">
            <h3>👜 준비물</h3>
            <p>{mainHobby.materials || "기본 준비물 제공"}</p>
          </div>

          <div className="info-block">
            <h3>🔄 대체 활동</h3>
            <p>{mainHobby.alternative || "대체 활동 정보 없음"}</p>
          </div>

          <div className="info-block">
            <h3>ℹ️ 추가 정보</h3>
            <p>난이도: {mainHobby.difficulty || "보통"}</p>
            <p>필요 도구: {mainHobby.requiredTools || "별도 준비물 없음"}</p>
          </div>
        </div>
      </div>

      {/* 오른쪽 모임 리스트 */}
      <div className="hdp-right">
        <h2 className="hdp-subtitle">이 취미의 모임 목록</h2>

        <div className="hdp-meeting-grid">
          {mergedGroups.map((g) => (
            <div
              key={g.id}
              className="hdp-meeting-card"
              onClick={() => {
                console.log("➡ 모임 클릭 → groupId 전달:", g.id);
                navigate(`/hobby-detail/${mainHobby.id}?groupId=${g.id}`);
              }}
            >
              <img
                src={
                  g.photo
                    ? g.photo.startsWith("data:image")
                      ? g.photo
                      : `${window.location.origin}/${g.photo}`
                    : `${window.location.origin}/images/default.png`
                }
                alt={g.groupName}
                className="hdp-meeting-img"
              />


              <div>
                <h3>{g.groupName}</h3>
                <p>{g.locationLink}</p>
                <p>
                  💸 {g.participationFee?.toLocaleString()}원 • 📅 {g.meetingDate}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
