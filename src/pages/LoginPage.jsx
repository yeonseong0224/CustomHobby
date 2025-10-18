import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  const handleLogin = (id) => {
    setUserId(id);
    navigate("/profile");
  };

  return (
    <div>
      <h1>로그인</h1>
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}
