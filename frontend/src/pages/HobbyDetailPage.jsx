import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHobby, participateHobby } from "../api/hobbyApi";
import {
  getHobbyGroup,
  participateHobbyGroup,
} from "../api/hobbyGroupApi";
import "../styles/HobbyDetailPage.css";

export default function HobbyDetailPage() {
  const { id } = useParams(); // hobbyId
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ?groupId=xxx 읽기
  const groupId = new URLSearchParams(location.search).get("groupId");

  const isOfficialGroup =
    !groupId || (typeof groupId === "string" && groupId.startsWith("official"));

  const isUserGroup =
    groupId && typeof groupId === "string" && !groupId.startsWith("official");

  // ------------------------------------------------------
  // 1) 상세 데이터 로딩
  // ------------------------------------------------------
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // ⭐ 공식 모임 (hobbies 테이블)
        if (isOfficialGroup) {
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
            isOfficial: true,
          });
        }

        // ⭐ 사용자 모임 (hobby_groups 테이블)
        else if (isUserGroup) {
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
            creatorId: g.creatorId || g.userId || g.ownerId,
            isOfficial: false,
          });
        }
      } catch (err) {
        console.error("❌ 상세 조회 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, groupId]);

  // ------------------------------------------------------
  // 2) 참여하기 기능
  // ------------------------------------------------------
  const handleParticipate = async () => {
    try {
      if (!user || !user.userId) {
        alert("로그인이 필요합니다!");
        navigate("/");
        return;
      }

      // 🔵 공식 모임 참여
      if (isOfficialGroup) {
        console.log("📤 공식 모임 참여 요청:", { hobbyId: id, userId: user.userId });
        await participateHobby(id, user.userId);
      }

      // 🟡 사용자 모임 참여
      else if (isUserGroup) {
        console.log("📤 사용자 모임 참여 요청:", { groupId, userId: user.userId });
        await participateHobbyGroup(groupId, user.userId);
      }

      alert("참여가 완료되었습니다!");
      navigate("/mypage");
    } catch (err) {
      console.error("❌ 참여 실패:", err);
      alert("참여 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p className="hdp-loading">로딩 중...</p>;
  if (!data) return <p>데이터가 없습니다.</p>;

  // 🟢 참여 버튼 표시 조건
  const showParticipateButton =
    // 공식 모임은 항상 가능
    data.isOfficial ||
    // 사용자 모임은 개설자 본인은 참여 X
    (!data.isOfficial && user?.userId !== data.creatorId);

  return (
    <div className="hdp-container">
      {/* 헤더 */}
      <div className="hdp-header">
        <h1 className="hdp-title">{data.hobbyName}</h1>
      </div>

      <div className="hdp-content">
        {/* --------------------------- LEFT --------------------------- */}
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
            참가비: <strong>{data.participationFee.toLocaleString()}원</strong>
          </div>

          <div className="hdp-row">
            진행 방식: <strong>{data.meetingType}</strong>
          </div>

          <div className="hdp-row">
            장소 / 링크: <strong>{data.locationLink}</strong>
          </div>

          <div className="hdp-card">
            <h3>준비물</h3>
            <p>{data.materials}</p>
            <p className="hdp-sub">
              <strong>대체 가능:</strong> {data.haveMaterial}
            </p>
          </div>
        </div>

        {/* --------------------------- RIGHT --------------------------- */}
        <div className="hdp-right">
          <div className="hdp-calendar">
            <h3>📅 일정</h3>
            <p>{data.meetingDate}</p>
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
            <p>{data.creatorId || "정보 없음"}</p>
          </div>

          {/* 참여하기 버튼 */}
          {showParticipateButton && (
            <button className="hdp-btn" onClick={handleParticipate}>
              참여하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
