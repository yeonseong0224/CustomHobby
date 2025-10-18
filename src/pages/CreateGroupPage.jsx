import React, { useState } from "react";

export default function CreateGroupPage({ userId }) {
  const [form, setForm] = useState({ title: "", desc: "", location: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userId) return alert("로그인 필요");
    alert("모임 개설 (샘플): " + JSON.stringify(form));
  };

  return (
    <div className="page create-group-page">
      <h1>모임 개설 페이지</h1>
      <form onSubmit={handleSubmit} className="create-group-form">
        <input name="title" placeholder="모임 이름" value={form.title} onChange={handleChange} required />
        <textarea name="desc" placeholder="모임 설명" value={form.desc} onChange={handleChange} />
        <input name="location" placeholder="지역" value={form.location} onChange={handleChange} />
        <button type="submit">등록</button>
      </form>
    </div>
  );
}
