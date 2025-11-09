import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createHobbyGroup } from "../api/hobbyGroupApi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CreateGroupPage.css";

export default function CreateGroupPage() {
  const navigate = useNavigate();

  const { user } = useAuth();  // ✅ Context에서 사용자 정보 가져오기
  const [form, setForm] = useState({
    title: "",
    desc: "",
    fee: "",
    location: "",
    link: "",
    items: "",
    notice: "",
    review: "",
    category: "",
  });
  const [isOnline, setIsOnline] = useState(true);
  const [date, setDate] = useState(new Date());


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate);
    // YYYY-MM-DD 형식으로 변환
    const formattedDate = selectedDate.toISOString().split('T')[0];
    setForm({ ...form, meetingDate: formattedDate });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!user || !user.userId) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }


    const payload = {
      groupName: form.title,
      groupDescription: form.desc,
      meetingType: isOnline ? "online" : "offline",
      locationLink: form.location,
      participationFee: parseInt(form.fee, 10) || 0,
      materials: form.items,
      reviewBoard: form.review,
      customTab: form.notice,
      creatorId: user.userId,  // ✅ Context에서 가져온 userId
      category: form.category,
      meetingDate: date.toLocaleDateString("ko-KR")
    };

    try {
      const result = await createHobbyGroup(payload);
      console.log("✅ 등록 성공:", result);

      alert("모임이 성공적으로 개설되었습니다!");
      navigate("/main");
    } catch (error) {
      console.error("❌ 등록 실패:", error);
      alert("서버 전송 실패. 다시 시도해주세요.");
    }
  };

  return (
    <div className="create-group-page">
      <div className="create-group-header">
        <h2>모임 개설 페이지</h2>
      </div>

      <div className="create-group-layout">
        {/* 왼쪽 입력 */}
        <form className="create-group-left" onSubmit={handleSubmit}>

          <input 
            name="groupName" 
            placeholder="모임 이름" 
            value={form.groupName} 
            onChange={handleChange} 
            required 
          />
          <textarea 
            name="groupDescription" 
            placeholder="모임 설명" 
            value={form.groupDescription} 
            onChange={handleChange} 
          />
          <input 
            name="participationFee" 
            type="number"
            placeholder="참가비" 
            value={form.participationFee} 
            onChange={handleChange} 
          />


          <div className="create-group-location-row">
            <button
              type="button"
              className={`create-group-toggle ${isOnline ? "online" : "offline"}`}
              onClick={() => setIsOnline(!isOnline)}
            >
              {isOnline ? "온라인" : "오프라인"}
            </button>

            <input 
              name="locationLink" 
              placeholder="장소" 
              value={form.locationLink} 
              onChange={handleChange} 
            />
          </div>

          <input 
            name="materials" 
            placeholder="준비물" 
            value={form.materials} 
            onChange={handleChange} 
          />

          {/* ✅ 카테고리 */}
          <select 
            name="category" 
            value={form.category} 
            onChange={handleChange} 
            className="create-group-category"
            required
          >

            <option value="">-- 카테고리 선택 --</option>
            <option value="음악">🎵 음악</option>
            <option value="운동">🏃 운동</option>
            <option value="예술">🎨 예술</option>
            <option value="요리">🍳 요리</option>
            <option value="독서">📚 독서</option>
            <option value="기타">✨ 기타</option>
          </select>

          <div className="create-group-btn-row">
            <button type="submit" className="create-group-submit-btn">
              등록
            </button>
          </div>
        </form>

        {/* 오른쪽: 캘린더 & 공지 */}
        <div className="create-group-right">
          <div className="create-group-calendar">
            <h4>📅 캘린더</h4>

            <Calendar 
              onChange={handleDateChange} 
              value={date} 
              locale="ko-KR" 
            />
            <p className="selected-date">
              선택한 날짜: {date.toLocaleDateString("ko-KR")}
            </p>

          </div>

          <div className="create-group-notice">
            <h4>공지사항</h4>

            <input 
              name="notice" 
              placeholder="공지사항 입력" 
              value={form.notice} 
              onChange={handleChange} 
            />

          </div>
        </div>
      </div>
    </div>
  );
}
