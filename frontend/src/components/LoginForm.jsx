import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api/userApi";

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();  // ✅ Context의 login 함수 사용
  const [form, setForm] = useState({ userId: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await loginUser(form);
      
      // ✅ Context의 login 함수로 사용자 정보 저장 (자동으로 localStorage도 저장됨)
      login(user);
      
      alert(`${user.nickname}님, 로그인 성공!`);
      navigate("/main");  // ✅ 로그인 후 메인 페이지로 자동 이동
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
