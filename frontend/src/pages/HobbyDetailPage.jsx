import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHobby, participateHobby } from "../api/hobbyApi";
import { getHobbyGroup } from "../api/hobbyGroupApi";
import "../styles/HobbyDetailPage.css";

export default function HobbyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();

  const [data, setData] = useState(null);
  const [isUserGroup, setIsUserGroup] = useState(false);
  const [loading, setLoading] = useState(true);

  const groupId = new URLSearchParams(location.search).get("groupId");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 사용자 모임
        if (groupId && !groupId.startsWith("official")) {
          const g = await getHobbyGroup(groupId);
          setData({
            hobbyName: g.hobbyName,
            oneLineDescription: g.groupName,
            hobbyCategory: g.category,
            description: g.groupDescription,
            participationFee: g.participationFee || 0,
            meetingType: g.meetingType,
            locationLink: g.locationLink,
            meetingDate: g.meetingDate,
            materials: g.materials || "준비물 없음",
            haveMaterial: g.haveMaterial || "정보 없음",
            creatorId: g.userId,
          });
          setIsUserGroup(true);
        }
        // 공식 모임
        else {
          const h = await getHobby(id);
          setData({
            hobbyName: h.hobbyName,
            oneLineDescription: h.oneLineDescription,
            hobbyCategory: h.hobbyCategory,
            description: h.description,
            participationFee: h.participationFee || 0,
            meetingType: h.meetingType,
            locationLink: h.locationLink,
            meetingDate: h.meetingDate,
            materials: h.materials || "준비물 없음",
            haveMaterial: h.haveMaterial || "정보 없음",
            creatorId: h.creatorId,
          });
          setIsUserGroup(false);
        }
      } catch (error) {
        console.error("❌ 상세조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, groupId]);

  if (loading) return <p className="hdp-loading">로딩 중...</p>;
  if (!data) return <p>데이터가 없습니다.</p>;

  return (
    <div className="hdp-container">
      <div className="hdp-header">
        <h1 className="hdp-title">{data.hobbyName}</h1>
      </div>

      <div className="hdp-content">
        <div className="hdp-left">
          <div className="hdp-card">
            <h2>모임 이름</h2>
            <p>{data.oneLineDescription}</p>
          </div>

          <div className="hdp-card">
            <h3>취미 종류 / 설명</h3>
            <p>{data.hobbyCategory}</p>
            <p className="hdp-desc">{data.description}</p>
          </div>

          <div className="hdp-row">
            <span>참가비:</span>
            <strong>{data.participationFee.toLocaleString()}원</strong>
          </div>

          <div className="hdp-row">
            <span>진행 방식:</span>
            <strong>{data.meetingType}</strong>
          </div>

          <div className="hdp-row">
            <span>장소 / 링크:</span>
            <strong>{data.locationLink}</strong>
          </div>

          <div className="hdp-card">
            <h3>준비물</h3>
            <p>{data.materials}</p>
            <p className="hdp-sub">
              <strong>대체 가능:</strong> {data.haveMaterial}
            </p>
          </div>
        </div>

        <div className="hdp-right">
          <div className="hdp-calendar">
            <h3>📅 일정</h3>
            <p>모임 날짜: {data.meetingDate}</p>
          </div>

          <div className="hdp-notice">
            <h3>📢 공지사항</h3>
            <p>공지사항은 준비 중입니다.</p>
          </div>

          <div className="hdp-review">
            <h3>💬 후기 게시판</h3>
            <p>아직 후기가 없습니다.</p>
          </div>

          <div className="hdp-creator">
            <h3>👤 개설자 정보</h3>
            <p>{data.creatorId}</p>
          </div>

          {!isUserGroup && (
            <button className="hdp-btn" onClick={() => navigate(`/mypage`)}>
              참여하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
