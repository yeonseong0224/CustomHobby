import React from "react";
import HobbyCard from "../components/HobbyCard";

const recs = [
  { id: "yoga", name: "요가", short: "스트레칭 및 명상" },
  { id: "photography", name: "사진", short: "카메라와 산책" }
];

export default function RecommendPage() {
  return (
    <div className="page recommend-page">
      <h1>추천 취미 페이지</h1>
      <div className="grid">
        {recs.map(r => <HobbyCard key={r.id} hobby={r} />)}
      </div>
    </div>
  );
}
