import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser, checkUserIdAvailable } from "../api/userApi";
import "../styles/RegisterPage.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    userId: "",
    password: "",
    email: "",
    nickname: "",
    age: "",
    region: "",
    phoneNum: "",  
  });
  const [idCheckStatus, setIdCheckStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "userId") {
      setIdCheckStatus(null);
    }
  };

  const handleCheckUserId = async () => {
    if (!form.userId.trim()) {
      alert("아이디를 입력해주세요!");
      return;
    }

    try {
      const isAvailable = await checkUserIdAvailable(form.userId);
      if (isAvailable) {
        setIdCheckStatus(true);
        alert("사용 가능한 아이디입니다!");
      } else {
        setIdCheckStatus(false);
        alert("이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 중복 체크 실패:", error);
      alert("아이디 중복 체크에 실패했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (idCheckStatus !== true) {
      alert("아이디 중복 체크를 먼저 해주세요!");
      return;
    }

    if (!form.phoneNum || form.phoneNum.trim() === "") {
      alert("전화번호를 입력해주세요!");
      return;
    }

    console.log("📤 전송할 회원가입 데이터:", form);

    try {
      const result = await registerUser(form);
      
      console.log("회원가입 성공:", result);
      
      login(result);
      
      alert(`${form.nickname}님, 회원가입이 완료되었습니다!`);
      navigate("/main");
    } catch (error) {
      console.error("회원가입 실패:", error);
      alert("회원가입 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1>회원가입</h1>
        <form onSubmit={handleSubmit}>
          <input 
            name="userId" 
            placeholder="아이디" 
            value={form.userId} 
            onChange={handleChange} 
            required 
          />
          <button 
            type="button" 
            onClick={handleCheckUserId}
            style={{
              padding: "2px 8px",
              fontSize: "11px",
              backgroundColor: idCheckStatus === true ? "#61c263ff" : "#4c95d1ff",
              color: "white",
              border: "none",
              borderRadius: "3px",
              cursor: "pointer",
              marginTop: "-5px",
              marginBottom: "8px",
              width: "fit-content"
            }}
          >
            {idCheckStatus === true ? "사용 가능" : "중복 체크"}
          </button>
          {idCheckStatus === false && (
            <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
              이미 사용 중인 아이디입니다.
            </p>
          )}
          
          <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
          <input type="email" name="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
          <input name="nickname" placeholder="닉네임" value={form.nickname} onChange={handleChange} required />
          <input name="age" placeholder="나이" type="number" value={form.age} onChange={handleChange} required />
          <input name="region" placeholder="지역" value={form.region} onChange={handleChange} required />
          <input 
            name="phoneNum" 
            placeholder="전화번호 (숫자만 입력: 01012345678)" 
            value={form.phoneNum} 
            onChange={handleChange} 
            pattern="[0-9]{10,11}"
            title="전화번호는 10~11자리 숫자만 입력해주세요"
            required 
          />

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
