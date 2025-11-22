import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getHobbyGroup, updateHobbyGroup } from "../api/hobbyGroupApi";
import "../styles/EditGroupPage.css";

export default function EditGroupPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    groupName: "",
    groupDescription: "",
    meetingType: "offline",
    locationLink: "",
    participationFee: 0,
    materials: "",
    category: "",
    meetingDate: "",
    hobbyName: "", 
  });

  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getHobbyGroup(id);

        setFormData({
          groupName: data.groupName || "",
          groupDescription: data.groupDescription || "",
          meetingType: data.meetingType || "offline",
          locationLink: data.locationLink || "",
          participationFee: data.participationFee || 0,
          materials: data.materials || "",
          category: data.category || "",
          meetingDate: data.meetingDate
            ? data.meetingDate.split("T")[0]
            : "",
          hobbyName: data.hobbyName || "", // 취미 이름 세팅
        });
      } catch (error) {
        alert("모임 정보를 불러오는 중 오류가 발생했습니다.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // 입력 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 저장
  const handleSave = async () => {
    try {
      await updateHobbyGroup(id, formData); // hobbyName 포함한 모든 정보 전송됨
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        navigate(`/my-group-detail/${id}`);
      }, 1500);
    } catch (error) {
      console.error("모임 수정 실패:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  if (loading)
    return <div className="loading">⏳ 모임 정보를 불러오는 중...</div>;

  return (
    <div className="edit-group-page">
      {showSuccess && (
        <div className="success-banner">수정이 완료되었습니다!</div>
      )}

      <h1 className="edit-title">모임 정보 수정</h1>

      <div className="edit-form">

        {/* 취미 이름 표시 */}
        <label>취미 이름</label>
        <input
          type="text"
          name="hobbyName"
          value={formData.hobbyName}
          onChange={handleChange}
          placeholder="예: 헬스, 여행, 수영 등"
        />
        {/* 만약 수정 불가로 하고 싶으면 disabled */}
        {/* disabled */}

        <label>모임 이름</label>
        <input
          type="text"
          name="groupName"
          value={formData.groupName}
          onChange={handleChange}
        />

        <label>모임 설명</label>
        <textarea
          name="groupDescription"
          value={formData.groupDescription}
          onChange={handleChange}
        />

        <label>카테고리</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="">카테고리를 선택하세요</option>
          <option value="운동/건강">운동/건강</option>
          <option value="음악/공연">음악/공연</option>
          <option value="예술/공예">예술/공예</option>
          <option value="요리/음식">요리/음식</option>
          <option value="야외활동">야외활동</option>
          <option value="교육/자기계발">교육/자기계발</option>
          <option value="엔터테인먼트">엔터테인먼트</option>
          <option value="라이프스타일">라이프스타일</option>
        </select>

        <label>모임 형태</label>
        <select
          name="meetingType"
          value={formData.meetingType}
          onChange={handleChange}
        >
          <option value="offline">오프라인</option>
          <option value="online">온라인</option>
          <option value="hybrid">혼합</option>
        </select>

        <label>장소 / 링크</label>
        <input
          type="text"
          name="locationLink"
          value={formData.locationLink}
          onChange={handleChange}
        />

        <label>참가비 (원)</label>
        <input
          type="number"
          name="participationFee"
          value={formData.participationFee}
          onChange={handleChange}
          min="0"
        />

        <label>준비물</label>
        <input
          type="text"
          name="materials"
          value={formData.materials}
          onChange={handleChange}
        />

        <label>모임 날짜</label>
        <input
          type="date"
          name="meetingDate"
          value={formData.meetingDate}
          onChange={handleChange}
        />

        <div className="button-wrapper">
          <button
            className="cancel-btn"
            onClick={() => navigate(`/my-group-detail/${id}`)}
          >
            취소
          </button>

          <button className="save-btn" onClick={handleSave}>
            저장하기 💾
          </button>
        </div>
      </div>
    </div>
  );
}
