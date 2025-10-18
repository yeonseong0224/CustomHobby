import { useState } from "react";
import { loginUser } from "../api/userApi";

export default function LoginForm({ onLogin }) {
  const [form, setForm] = useState({ userId: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(form);
      alert(`${user.nickname}님, 로그인 성공!`);
      if (onLogin) onLogin(user.userId);
    } catch (err) {
      alert(err.response?.data || "로그인 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="userId" placeholder="아이디" value={form.userId} onChange={handleChange} required />
      <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
      <button type="submit">로그인</button>
    </form>
  );
}
