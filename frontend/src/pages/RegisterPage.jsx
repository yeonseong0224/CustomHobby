import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RegisterPage.css";

export default function RegisterPage() {
  const [form, setForm] = useState({
    userId: "",
    password: "",
    email: "",
    nickname: "",
    age: "",
    region: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Spring Boot 백엔드로 회원가입 요청 전송
      const response = await axios.post("http://localhost:8080/api/users/register", form);

      console.log("✅ 회원가입 성공:", response.data);
      alert(`${form.nickname}님, 회원가입이 완료되었습니다!`);
      navigate("/survey"); // 설문조사 페이지로 이동
    } catch (error) {
      console.error("❌ 회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>회원가입</h1>
        <form onSubmit={handleSubmit}>
          <input name="userId" placeholder="아이디" value={form.userId} onChange={handleChange} required />
          <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
          <input type="email" name="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
          <input name="nickname" placeholder="닉네임" value={form.nickname} onChange={handleChange} required />
          <input name="age" placeholder="나이" value={form.age} onChange={handleChange} />
          <input name="region" placeholder="지역" value={form.region} onChange={handleChange} />
          <input name="phone" placeholder="전화번호" value={form.phone} onChange={handleChange} />

          <div className="register-btns">
            <button type="button" className="prev-btn" onClick={() => navigate("/")}>
              이전
            </button>
            <button type="submit" className="submit-btn">
              가입하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
