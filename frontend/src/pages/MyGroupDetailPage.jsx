import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHobbyGroup } from "../api/hobbyGroupApi";

export default function MyGroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 로그인 체크
    if (!user || !user.userId) {
      console.warn("⚠️ 로그인이 필요합니다.");
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    const fetchGroupDetail = async () => {
      try {
        console.log("🔍 모임 조회 시작 - ID:", id);
        const data = await getHobbyGroup(id);
        console.log("✅ 모임 상세 정보:", data);
        setGroup(data);
      } catch (error) {
        console.error("❌ 모임 조회 실패:", error);
        console.error("❌ 에러 상세:", error.response?.data || error.message);
        setError(error.message);
        // 에러 발생 시 MyPage로 이동하지 않고 에러 메시지만 표시
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetail();
  }, [id, navigate, user]);

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>로딩 중...</div>;
  }

  if (error) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>모임 정보를 불러올 수 없습니다</h2>
        <p style={{ color: "red", marginTop: "20px" }}>{error}</p>
        <button 
          onClick={() => navigate("/mypage")}
          style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          마이페이지로 돌아가기
        </button>
      </div>
    );
  }

  if (!group) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>모임 정보를 찾을 수 없습니다</h2>
        <button 
          onClick={() => navigate("/mypage")}
          style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          마이페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="page mygroup-detail-page" style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "30px" }}>{group.groupName}</h1>
      
      <div style={{ backgroundColor: "#f5f5f5", padding: "20px", borderRadius: "8px", marginBottom: "20px" }}>
        <h3 style={{ marginBottom: "10px" }}>모임 설명</h3>
        <p style={{ lineHeight: "1.6", whiteSpace: "pre-wrap" }}>
          {group.groupDescription || "설명이 없습니다."}
        </p>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <p><strong>모임 형태:</strong> {group.meetingType === "online" ? "온라인" : group.meetingType === "offline" ? "오프라인" : "혼합"}</p>
        <p><strong>장소/링크:</strong> {group.locationLink || "정보 없음"}</p>
        <p><strong>참가비:</strong> {group.participationFee?.toLocaleString()}원</p>
        {group.materials && <p><strong>준비물:</strong> {group.materials}</p>}
        <p><strong>개설자 ID:</strong> {group.creatorId}</p>
        <p><strong>개설일:</strong> {new Date(group.createdAt).toLocaleDateString()}</p>
      </div>

      <div style={{ display: "flex", gap: "10px", marginTop: "30px" }}>
        <button 
          onClick={() => navigate("/mypage")}
          style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        >
          뒤로 가기
        </button>
      </div>
    </div>
  );
}
