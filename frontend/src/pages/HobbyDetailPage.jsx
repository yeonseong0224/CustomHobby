import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHobby, participateHobby } from "../api/hobbyApi";
import "../styles/HobbyDetailPage.css";

export default function HobbyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();  // ✅ Context에서 사용자 정보 가져오기
  const [hobby, setHobby] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHobby = async () => {
      try {
        const data = await getHobby(id);
        setHobby(data);
      } catch (error) {
        console.error("취미 상세 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHobby();
  }, [id]);

  const handleParticipate = async () => {
    try {
      // ✅ Context에서 사용자 정보 확인
      if (!user || !user.userId) {
        alert("로그인이 필요합니다!");
        navigate("/");
        return;
      }
      
      console.log("📤 취미 참여 요청:", { hobbyId: id, userId: user.userId });
      await participateHobby(id, user.userId);  // ✅ Context에서 가져온 userId
      alert("취미에 참여했습니다!");
    } catch (error) {
      console.error("❌ 취미 참여 실패:", error);
      alert("취미 참여에 실패했습니다.");
    }
  };

  if (loading) return <p className="hdp-loading">로딩 중...</p>;
  if (!hobby) 
    return (
      <div className="hdp-container">
        <h2>❌ 해당 취미 정보를 찾을 수 없습니다.</h2>
      </div>
    );

  return (
    <div className="hdp-container">
      {/* 상단 헤더 */}
      <div className="hdp-header">
        <h1 className="hdp-title">🎨 취미 - {hobby.hobbyName}</h1>
      </div>

      <div className="hdp-content">
        {/* 왼쪽 */}
        <div className="hdp-left">
          <div className="hdp-card">
            <h2>모임 이름</h2>
            <p>{hobby.oneLineDescription || "-"}</p>
          </div>

          <div className="hdp-card">
            <h3>취미 종류 / 설명</h3>
            <p>{hobby.hobbyCategory}</p>
            <p className="hdp-desc">{hobby.description}</p>
          </div>

          <div className="hdp-row">
            <span>참가비:</span>{" "}
            <strong>
              {hobby.participationFee
                ? `${hobby.participationFee.toLocaleString()}원`
                : "무료"}
            </strong>
          </div>

          <div className="hdp-row">
            <span>진행 방식:</span> <strong>{hobby.meetingType}</strong>
          </div>

          <div className="hdp-row">
            <span>장소 / 링크:</span> <strong>{hobby.locationLink}</strong>
          </div>

          <div className="hdp-card">
            <h3>준비물</h3>
            <p>{hobby.materials}</p>
            <p className="hdp-sub">
              <strong>대체 가능:</strong> {hobby.haveMaterial}
            </p>
          </div>

          {/* 참여하기 버튼 */}
          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button 
              onClick={handleParticipate}
              style={{
                flex: 1,
                padding: "12px 20px",
                backgroundColor: "#4a90e2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              참여하기
            </button>
            <button 
              onClick={() => navigate("/create-group")}
              style={{
                flex: 1,
                padding: "12px 20px",
                backgroundColor: "#ddd",
                color: "#333",
                border: "none",
                borderRadius: "8px",
                fontWeight: "600",
                cursor: "pointer"
              }}
            >
              모임 개설
            </button>
          </div>
        </div>

        {/* 오른쪽 */}
        <div className="hdp-right">
          <div className="hdp-calendar">
            <h3>📅 일정</h3>
            <p>모임 날짜: {hobby.meetingDate}</p>
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
            <p>개설자 ID: {hobby.creatorId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
