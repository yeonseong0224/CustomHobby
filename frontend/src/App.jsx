import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import NavbarSimple from "./components/NavbarSimple";

import StartPage from "./pages/StartPage"; // 로그인 역할
import RegisterPage from "./pages/RegisterPage";
import SurveyPage from "./pages/SurveyPage";
import MainPage from "./pages/MainPage";
import CategoryPage from "./pages/CategoryPage";
import HobbyInfoPage from "./pages/HobbyInfoPage";
import HobbyDetailPage from "./pages/HobbyDetailPage";
import HobbyDescriptionPage from "./pages/HobbyDescriptionPage";
import PersonalHobbyPage from "./pages/PersonalHobbyPage";
import RecommendedHobbyPage from "./pages/RecommendedHobbyPage";
import RecommendPage from "./pages/RecommendPage";
import MyPage from "./pages/MyPage";
import EditProfilePage from "./pages/EditProfilePage";
import CreateGroupPage from "./pages/CreateGroupPage";
import MyGroupDetailPage from "./pages/MyGroupDetailPage";

function AppContent() {
  const { user, isAuthenticated } = useAuth();  // ✅ Context에서 사용자 정보 가져오기
  const location = useLocation();

  // ✅ 로그인(시작) / 회원가입 / 설문조사 페이지 → 로고만 있는 Navbar 표시
  const simpleNavbarPaths = ["/", "/register", "/survey"];
  const isSimpleNavbar = simpleNavbarPaths.includes(location.pathname);

  return (
    <>
      {isSimpleNavbar ? (
        <NavbarSimple />
      ) : (
        <Navbar />
      )}

      <main className="container">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/survey" element={<SurveyPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/hobby-info/:id" element={<HobbyInfoPage />} />
          <Route path="/hobby-detail/:id" element={<HobbyDetailPage />} />
          <Route path="/hobby-description/:id" element={<HobbyDescriptionPage />} />
          <Route path="/hobby/:id" element={<HobbyDescriptionPage />} />
          <Route path="/personal-hobby" element={<PersonalHobbyPage />} />
          <Route path="/recommended-hobby/:id" element={<RecommendedHobbyPage />} />
          <Route path="/recommend" element={<RecommendPage />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />
          <Route path="/create-group" element={<CreateGroupPage />} />
          <Route path="/my-group-detail/:id" element={<MyGroupDetailPage />} />
          <Route path="/mygroup/:id" element={<MyGroupDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}
