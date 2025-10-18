import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function HobbyInfoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 실제 데이터가 없으니 임시 텍스트
  return (
    <div className="page hobby-info-page">
      <h1>취미 설명 페이지: {id}</h1>
      <p>카테고리/취미 기본 정보가 표시됩니다.</p>
      <button onClick={() => navigate(`/hobby-detail/${id}`)}>자세히 보기</button>
    </div>
  );
}
