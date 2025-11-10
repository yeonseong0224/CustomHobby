import React from "react";
import CategoryList from "../components/CategoryList";
import { useNavigate } from "react-router-dom";


const categories = [
  { id: "art", name: "예술/공예", icon: "/images/art.png" },
  { id: "health", name: "운동/건강", icon: "/images/health.png" },
  { id: "sports", name: "스포츠", icon: "/images/sports.png" },
  { id: "music", name: "음악/공연", icon: "/images/music.png" },
  { id: "food", name: "요리/음식", icon: "/images/food.png" },
  { id: "outdoor", name: "야외활동", icon: "/images/outdoor.png" },
  { id: "entertainment", name: "엔터테인먼트", icon: "/images/entertainment.png" },
  { id: "theater", name: "공연예술", icon: "/images/theater.png" },
  { id: "education", name: "교육/자기계발", icon: "/images/self-development.png" },
  { id: "lifestyle", name: "라이프스타일", icon: "/images/lifestyle.png" },
];


export default function CategoryPage() {
  const navigate = useNavigate();

  return (
    <div className="page category-page" style={{ textAlign: "center", padding: "40px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "700", marginBottom: "30px" }}>
        카테고리 페이지
      </h1>
      <CategoryList categories={categories} onSelect={(c) => navigate(`/hobby-info/${c.id}`)} />
    </div>
  );
}
