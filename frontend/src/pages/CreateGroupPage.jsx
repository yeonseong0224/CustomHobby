import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createHobbyGroup } from "../api/hobbyGroupApi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../styles/CreateGroupPage.css";

export default function CreateGroupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { hobbyName: paramHobbyName } = useParams();

  const [selectedHobby, setSelectedHobby] = useState(paramHobbyName || "");

  const [form, setForm] = useState({
    title: "",
    desc: "",
    fee: "",
    location: "",
    items: "",
    notice: "",
    review: "",
    category: "",
  });

  const [isOnline, setIsOnline] = useState(true);
  const [date, setDate] = useState(new Date());

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user || !user.userId) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    if (!selectedHobby) {
      alert("어떤 취미의 모임인지 선택해주세요!");
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
      creatorId: user.userId,
      category: form.category,
      meetingDate: date.toLocaleDateString("ko-KR"),
      hobbyName: selectedHobby, // ⭐ 핵심: 취미 이름 저장
    };

    try {
      await createHobbyGroup(payload);
      alert("모임이 성공적으로 개설되었습니다!");
      navigate(`/hobby/${encodeURIComponent(selectedHobby)}`);
    } catch (error) {
      console.error("❌ 등록 실패:", error);
      alert("서버 전송 실패. 다시 시도해주세요.");
    }
  };

  return (
    <div className="create-group-page">
      <div className="create-group-header">
        <h2>모임 개설하기</h2>
      </div>

      <div className="create-group-layout">
        <form className="create-group-left" onSubmit={handleSubmit}>
          {/* ⭐ 취미 선택 */}
          <select
            value={selectedHobby}
            onChange={(e) => setSelectedHobby(e.target.value)}
            disabled={!!paramHobbyName}
            className="create-group-category"
          >
            <option value="">-- 취미 선택 --</option>
            <option value="헬스">헬스</option>
            <option value="여행">여행</option>
            <option value="수영">수영</option>
            <option value="캠핑">캠핑</option>
            <option value="베이킹">베이킹</option>
            <option value="러닝">러닝</option>
            <option value="볼링">볼링</option>
            <option value="요리">요리</option>
            <option value="독서">독서</option>
            <option value="자전거">자전거</option>
          </select>

          <input name="title" placeholder="모임 이름" value={form.title} onChange={handleChange} required />
          <textarea name="desc" placeholder="모임 설명" value={form.desc} onChange={handleChange} />

          <input name="fee" placeholder="참가비" value={form.fee} onChange={handleChange} />

          <div className="create-group-location-row">
            <button
              type="button"
              className={`create-group-toggle ${isOnline ? "online" : "offline"}`}
              onClick={() => setIsOnline(!isOnline)}
            >
              {isOnline ? "온라인" : "오프라인"}
            </button>
            <input name="location" placeholder="장소" value={form.location} onChange={handleChange} />
          </div>

          <input name="items" placeholder="준비물" value={form.items} onChange={handleChange} />

          <div className="create-group-btn-row">
            <button type="submit" className="create-group-submit-btn">
              등록
            </button>
          </div>
        </form>

        <div className="create-group-right">
          <div className="create-group-calendar">
            <h4>📅 캘린더</h4>
            <Calendar onChange={setDate} value={date} locale="ko-KR" />
            <p>선택한 날짜: {date.toLocaleDateString("ko-KR")}</p>
          </div>

          <div className="create-group-notice">
            <h4>공지사항</h4>
            <input name="notice" placeholder="공지사항 입력" value={form.notice} onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  );
}
