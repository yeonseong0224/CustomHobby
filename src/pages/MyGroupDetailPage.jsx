import React from "react";
import { useParams } from "react-router-dom";

export default function MyGroupDetailPage() {
  const { id } = useParams();

  return (
    <div className="page mygroup-detail-page">
      <h1>내가 연 모임 상세 (id: {id})</h1>
      <p>모임 정보, 참가자 목록 등이 보입니다.</p>
    </div>
  );
}
