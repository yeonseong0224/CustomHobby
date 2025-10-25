import React from "react";
import "../styles/CategoryList.css"; // 🎨 CSS 따로 import

export default function CategoryList({ categories = [], onSelect }) {
  return (
    <div className="category-list">
      {categories.map((c) => (
        <div
          key={c.id}
          className="category-card"
          onClick={() => onSelect && onSelect(c)}
        >
          <img src={c.icon} alt={c.name} className="category-icon" />
          <h3 className="category-name">{c.name}</h3>
        </div>
      ))}
    </div>
  );
}
