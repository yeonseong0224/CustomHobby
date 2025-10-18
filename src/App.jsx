import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import NavbarSimple from "./components/NavbarSimple";

import StartPage from "./pages/StartPage"; // 로그인 역할
import RegisterPage from "./pages/RegisterPage";
import SurveyPage from "./pages/SurveyPage";
import MainPage from "./pages/MainPage";
import CategoryPage from "./pages/CategoryPage";
import HobbyInfoPage from "./pages/HobbyInfoPage";
import HobbyDetailPage from "./pages/HobbyDetailPage";
import RecommendPage from "./pages/RecommendPage";
import MyPage from "./pages/MyPage";
import EditProfilePage from "./pages/EditProfilePage";
import CreateGroupPage from "./pages/CreateGroupPage";
import MyGroupDetailPage from "./pages/MyGroupDetailPage";

function AppContent() {
  const [userId, setUserId] = useState(localStorage.getItem("userId") || null);
  const location = useLocation();

  useEffect(() => {
    if (userId) localStorage.setItem("userId", userId);
    else localStorage.removeItem("userId");
  }, [userId]);

  // ✅ 로그인(시작) / 회원가입 / 설문조사 페이지 → 로고만 있는 Navbar 표시
  const simpleNavbarPaths = ["/", "/register", "/survey"];
  const isSimpleNavbar = simpleNavbarPaths.includes(location.pathname);

  return (
    <>
      {isSimpleNavbar ? (
        <NavbarSimple />
      ) : (
        <Navbar userId={userId} setUserId={setUserId} />
      )}

      <main className="container">
        <Routes>
          <Route path="/" element={<StartPage setUserId={setUserId} />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/hobby-info/:id" element={<HobbyInfoPage />} />
          <Route path="/hobby-detail/:id" element={<HobbyDetailPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/mypage" element={<MyPage userId={userId} />} />
          <Route path="/edit-profile" element={<EditProfilePage userId={userId} />} />
          <Route path="/create-group" element={<CreateGroupPage userId={userId} />} />
          <Route path="/mygroup/:id" element={<MyGroupDetailPage userId={userId} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
