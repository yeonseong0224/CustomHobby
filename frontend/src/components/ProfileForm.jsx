import React, { useState, useEffect } from "react";

export default function ProfileForm({ user, onSave }) {
  const [form, setForm] = useState({
    nickname: user?.nickname || "",
    region: user?.region || "",
    age: user?.age || ""
  });

  useEffect(() => {
    setForm({ nickname: user?.nickname || "", region: user?.region || "", age: user?.age || "" });
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSave) onSave(form);
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <label>닉네임: <input name="nickname" value={form.nickname} onChange={handleChange} /></label>
      <label>지역: <input name="region" value={form.region} onChange={handleChange} /></label>
      <label>나이: <input name="age" value={form.age} onChange={handleChange} /></label>
      <button type="submit">저장</button>
    </form>
  );
}
