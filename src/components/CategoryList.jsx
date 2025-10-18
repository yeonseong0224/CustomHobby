import React from "react";

export default function CategoryList({ categories = [], onSelect }) {
  return (
    <div className="category-list">
      {categories.map((c) => (
        <button key={c.id || c.name} className="category-item" onClick={() => onSelect && onSelect(c)}>
          {c.name}
        </button>
      ))}
    </div>
  );
}
