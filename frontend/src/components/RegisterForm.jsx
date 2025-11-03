import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { registerUser, checkUserIdAvailable } from "../api/userApi";

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
    phoneNum: ""  // ✅ phonenum → phoneNum (camelCase 통일)
  });
  const [idCheckStatus, setIdCheckStatus] = useState(null); // null: 미확인, true: 사용가능, false: 중복

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
    // 아이디 입력이 변경되면 중복 체크 상태 초기화
    if (e.target.name === "userId") {
      setIdCheckStatus(null);
    }
  };

  // 아이디 중복 체크 함수
  const handleCheckUserId = async () => {
    if (!form.userId.trim()) {
      alert("아이디를 입력해주세요!");
      return;
    }

    try {
      const isAvailable = await checkUserIdAvailable(form.userId);
      if (isAvailable) {
        setIdCheckStatus(true);
        alert("✅ 사용 가능한 아이디입니다!");
      } else {
        setIdCheckStatus(false);
        alert("❌ 이미 사용 중인 아이디입니다.");
      }
    } catch (error) {
      console.error("아이디 중복 체크 실패:", error);
      alert("아이디 중복 체크에 실패했습니다.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 아이디 중복 체크 확인
    if (idCheckStatus !== true) {
      alert("아이디 중복 체크를 먼저 해주세요!");
      return;
    }

    // ✅ 필수 필드 검증
    if (!form.phoneNum || form.phoneNum.trim() === "") {
      alert("전화번호를 입력해주세요!");
      return;
    }

    console.log("📤 전송할 회원가입 데이터:", form);

    try {
      
      const result = await registerUser(form);
      
      console.log("✅ 회원가입 성공:", result);
      
      // ✅ 회원가입 후 자동으로 로그인 처리 (Context 사용)
      login(result);
      
      alert(`회원가입 성공! 환영합니다, ${result.nickname}님`);
      
      // ✅ 회원가입 후 바로 메인 페이지로 이동
      navigate("/main");
    } catch (err) {
      console.error("❌ 회원가입 실패:", err);
      alert(err.response?.data || "회원가입 실패");
    }
  };

  return (
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
          backgroundColor: idCheckStatus === true ? "#4CAF50" : "#2196F3",
          color: "white",
          border: "none",
          borderRadius: "3px",
          cursor: "pointer",
          marginTop: "3px",
          marginBottom: "5px",
          width: "fit-content"
        }}
      >
        {idCheckStatus === true ? "✅ 완료" : "중복체크"}
      </button>
      {idCheckStatus === false && (
        <p style={{ color: "red", fontSize: "12px", margin: "5px 0" }}>
          ❌ 이미 사용 중인 아이디입니다.
        </p>
      )}
      {idCheckStatus === true && (
        <p style={{ color: "green", fontSize: "12px", margin: "5px 0" }}>
          ✅ 사용 가능한 아이디입니다.
        </p>
      )}
      <input type="password" name="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
      <input name="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
      <input name="nickname" placeholder="닉네임" value={form.nickname} onChange={handleChange} required />
      <input 
        name="age" 
        placeholder="나이" 
        type="number" 
        value={form.age} 
        onChange={handleChange} 
        required 
      />
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
      <button type="submit">회원가입</button>
    </form>
  );
}
