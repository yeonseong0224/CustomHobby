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
  });
  const [loading, setLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false); // ✅ 성공 배너 상태

  // ✅ 기존 데이터 불러오기
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

  // ✅ 입력 변경
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ 저장
  const handleSave = async () => {
    try {
      await updateHobbyGroup(id, formData);
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
      {/* ✅ 상단 성공 배너 */}
      {showSuccess && <div className="success-banner">✅ 수정이 완료되었습니다!</div>}

      <h1 className="edit-title">🛠️ 모임 정보 수정</h1>

      <div className="edit-form">
        <label>모임 이름</label>
        <input
          type="text"
          name="groupName"
          value={formData.groupName}
          onChange={handleChange}
          placeholder="모임 이름을 입력하세요"
        />

        <label>모임 설명</label>
        <textarea
          name="groupDescription"
          value={formData.groupDescription}
          onChange={handleChange}
          placeholder="모임에 대한 설명을 입력하세요"
        />

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
          placeholder="예: 부산 OO문화센터 / Zoom 링크 등"
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
          placeholder="예: 붓펜, 노트, 기타 등"
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
