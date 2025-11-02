import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHobby, participateHobby } from "../api/hobbyApi";

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

  if (loading) return <div className="page">로딩 중...</div>;
  if (!hobby) return <div className="page">취미를 찾을 수 없습니다.</div>;

  return (
    <div className="page hobby-detail-page" style={{ padding: "40px" }}>
      <h1>{hobby.hobbyName}</h1>
      <p style={{ fontSize: "18px", color: "#666", marginBottom: "20px" }}>
        {hobby.oneLineDescription}
      </p>
      
      <div style={{ marginBottom: "30px" }}>
        <h2>상세 설명</h2>
        <p>{hobby.description || "상세 설명이 없습니다."}</p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p><strong>카테고리:</strong> {hobby.hobbyCategory}</p>
        <p><strong>모임 형태:</strong> {hobby.meetingType}</p>
        <p><strong>참가비:</strong> {hobby.participationFee}원</p>
        <p><strong>모임 날짜:</strong> {hobby.meetingDate}</p>
        {hobby.materials && <p><strong>준비물:</strong> {hobby.materials}</p>}
        {hobby.locationLink && <p><strong>장소:</strong> {hobby.locationLink}</p>}
      </div>

      <div className="actions" style={{ display: "flex", gap: "10px" }}>
        <button onClick={handleParticipate} style={{ padding: "10px 20px" }}>
          참여하기
        </button>
        <button onClick={() => navigate("/main")} style={{ padding: "10px 20px" }}>
          메인으로
        </button>
        <button onClick={() => navigate("/create-group")} style={{ padding: "10px 20px" }}>
          모임 개설
        </button>
      </div>
    </div>
  );
}
