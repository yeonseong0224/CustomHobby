import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function HobbyDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="page hobby-detail-page">
      <h1>취미 상세: {id}</h1>
      <p>취미 상세 설명, 모임 목록, 참여 버튼 등을 여기에 배치</p>

      <div className="actions">
        <button onClick={() => navigate("/main")}>메인으로</button>
        <button onClick={() => navigate("/create-group")}>모임 개설</button>
      </div>
    </div>
  );
}
