import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser } from "../api/userApi";

export default function RegisterForm() {
  const navigate = useNavigate();
  const { login } = useAuth();  // ✅ Context의 login 함수 사용
  const [form, setForm] = useState({
    userId: "",
    password: "",
    email: "",
    nickname: "",
    age: "",
    region: "",
    phonenum: ""
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await registerUser(form);
      
      console.log("✅ 회원가입 성공:", result);
      
      // ✅ 회원가입 후 자동으로 로그인 처리 (Context 사용)
      login(result);
      
      alert(`회원가입 성공! 환영합니다, ${result.nickname}님`);
      
      // ✅ State 업데이트를 기다린 후 페이지 이동
      setTimeout(() => {
        navigate("/survey");
      }, 100);
    } catch (err) {
      console.error("❌ 회원가입 실패:", err);
      alert(err.response?.data || "회원가입 실패");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="userId" placeholder="아이디" value={form.userId} onChange={handleChange} required />
      <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
      <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
      <input name="nickname" placeholder="닉네임" value={form.nickname} onChange={handleChange} />
      <input name="age" placeholder="나이" value={form.age} onChange={handleChange} />
      <input name="region" placeholder="지역" value={form.region} onChange={handleChange} />
      <input name="phonenum" placeholder="전화번호" value={form.phonenum} onChange={handleChange} />
      <button type="submit">회원가입</button>
    </form>
  );
}
