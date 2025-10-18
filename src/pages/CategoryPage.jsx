import React from "react";
import CategoryList from "../components/CategoryList";
import { useNavigate } from "react-router-dom";

const categories = [
  { id: "art", name: "예술/공예" },
  { id: "outdoor", name: "야외활동" },
  { id: "music", name: "음악/공연" },
  { id: "food", name: "요리/음식" }
];

export default function CategoryPage() {
  const navigate = useNavigate();

  return (
    <div className="page category-page">
      <h1>카테고리 페이지</h1>
      <CategoryList categories={categories} onSelect={(c) => navigate(`/hobby-info/${c.id}`)} />
    </div>
  );
}
