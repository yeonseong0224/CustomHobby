import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createHobbyGroup } from "../api/hobbyGroupApi";

export default function CreateGroupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();  // ✅ Context에서 사용자 정보 가져오기
  const [form, setForm] = useState({ 
    groupName: "", 
    groupDescription: "", 
    meetingType: "offline",
    locationLink: "",
    participationFee: 0,
    materials: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Context에서 사용자 정보 확인
    if (!user || !user.userId) {
      alert("로그인이 필요합니다.");
      navigate("/");
      return;
    }

    try {
      const groupData = {
        ...form,
        creatorId: user.userId,  // ✅ Context에서 가져온 userId
        participationFee: Number(form.participationFee)
      };
      
      console.log("📤 모임 개설 데이터:", groupData);
      const result = await createHobbyGroup(groupData);
      console.log("✅ 모임 개설 성공:", result);
      alert("모임이 개설되었습니다!");
      navigate("/main");  // ✅ 메인 페이지로 이동
    } catch (error) {
      console.error("❌ 모임 개설 실패:", error);
      alert("모임 개설에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="page create-group-page" style={{ padding: "40px", maxWidth: "600px", margin: "0 auto" }}>
      <h1>모임 개설 페이지</h1>
      <form onSubmit={handleSubmit} className="create-group-form" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        <input 
          name="groupName" 
          placeholder="모임 이름" 
          value={form.groupName} 
          onChange={handleChange} 
          required 
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <textarea 
          name="groupDescription" 
          placeholder="모임 설명" 
          value={form.groupDescription} 
          onChange={handleChange} 
          rows="4"
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <select 
          name="meetingType" 
          value={form.meetingType} 
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        >
          <option value="offline">오프라인</option>
          <option value="online">온라인</option>
          <option value="hybrid">혼합</option>
        </select>
        <input 
          name="locationLink" 
          placeholder="장소 또는 링크" 
          value={form.locationLink} 
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input 
          name="participationFee" 
          type="number" 
          placeholder="참가비 (원)" 
          value={form.participationFee} 
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input 
          name="materials" 
          placeholder="준비물" 
          value={form.materials} 
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <input 
          name="category" 
          placeholder="카테고리" 
          value={form.category} 
          onChange={handleChange}
          style={{ padding: "10px", fontSize: "16px" }}
        />
        <button type="submit" style={{ padding: "12px", fontSize: "18px", cursor: "pointer" }}>
          등록
        </button>
      </form>
    </div>
  );
}
