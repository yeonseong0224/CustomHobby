import { useState } from "react";
import { registerUser } from "../api/userApi";

export default function RegisterForm() {
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
      alert(`회원가입 성공! 환영합니다, ${result.nickname}`);
      setForm({
        userId: "", password: "", email: "", nickname: "", age: "", region: "", phonenum: ""
      });
    } catch (err) {
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
