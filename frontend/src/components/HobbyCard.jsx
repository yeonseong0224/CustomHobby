import React from "react";
import { useNavigate } from "react-router-dom";

export default function HobbyCard({ hobby }) {
  const navigate = useNavigate();

  return (
    <div className="hobby-card" onClick={() => navigate(`/hobby-detail/${hobby.id || hobby.name}`)}>
      <div className="hobby-thumb">{/* 이미지 자리 */}</div>
      <div className="hobby-info">
        <h4>{hobby.name}</h4>
        <p>{hobby.short || "간단한 설명"}</p>
      </div>
    </div>
  );
}
