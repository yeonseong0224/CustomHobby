import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getHobbyGroup, deleteHobbyGroup } from "../api/hobbyGroupApi";
import "../styles/MyGroupDetailPage.css"; // 별도 CSS 파일 분리

export default function MyGroupDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 모임 상세 조회
  useEffect(() => {
    if (!user || !user.userId) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    const fetchGroupDetail = async () => {
      try {
        const data = await getHobbyGroup(id);
        setGroup(data);
      } catch (error) {
        //console.error("모임 조회 실패:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetail();
  }, [id, navigate, user]);

  // 삭제 기능
  const handleDelete = async () => {
    if (window.confirm("정말 이 모임을 삭제하시겠습니까?")) {
      try {
        await deleteHobbyGroup(id);
        alert("모임이 삭제되었습니다.");
        navigate("/mypage");
      } catch (error) {
        //console.error("삭제 실패:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  if (loading) {
    return <div className="loading">모임 정보를 불러오는 중입니다...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>모임 정보를 불러올 수 없습니다</h2>
        <p>{error}</p>
        <button className="back-btn" onClick={() => navigate("/mypage")}>
          마이페이지로 돌아가기
        </button>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="error-container">
        <h2>모임 정보를 찾을 수 없습니다</h2>
        <button className="back-btn" onClick={() => navigate("/mypage")}>
          마이페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="mygroup-detail-container">
      <h1 className="group-title">{group.groupName}</h1>

      <div className="group-card">
        <h3>📝 모임 설명</h3>
        <p className="group-desc">
          {group.groupDescription || "설명이 없습니다."}
        </p>
      </div>

      <div className="group-info">
        <p>
          <strong>모임 형태:</strong>{" "}
          {group.meetingType === "online"
            ? "온라인"
            : group.meetingType === "offline"
            ? "오프라인"
            : "혼합"}
        </p>
        <p>
          <strong>장소 / 링크:</strong> {group.locationLink || "정보 없음"}
        </p>
        <p>
          <strong>참가비:</strong>{" "}
          {group.participationFee
            ? `${group.participationFee.toLocaleString()}원`
            : "무료"}
        </p>
        {group.materials && (
          <p>
            <strong>준비물:</strong> {group.materials}
          </p>
        )}
        <p>
          <strong>카테고리:</strong> {group.category || "미지정"}
        </p>
        <p>
          <strong>개설자:</strong> {group.creatorId}
        </p>
        <p>
          <strong>모임일:</strong>{" "}
          {group.meetingDate
            ? new Date(group.meetingDate).toLocaleDateString()
            : "미정"}
        </p>
        <p>
          <strong>개설일:</strong>{" "}
          {group.createdAt
            ? new Date(group.createdAt).toLocaleDateString()
            : "정보 없음"}
        </p>
      </div>

      <div className="button-group">
        <button className="back-btn" onClick={() => navigate("/mypage")}>
          ← 뒤로가기
        </button>
        <button
          className="edit-btn"
          onClick={() => navigate(`/edit-group/${group.id}`)}
        >
          ✏️ 수정하기
        </button>
        <button className="delete-btn" onClick={handleDelete}>
          🗑️ 삭제하기
        </button>
      </div>
    </div>
  );
}
