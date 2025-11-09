import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import NavbarSimple from "./components/NavbarSimple";

// ✅ 페이지 임포트
import StartPage from "./pages/StartPage";
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
import NewHobbiesPage from "./pages/NewHobbiesPage";
import EditGroupPage from "./pages/EditGroupPage";

function AppContent() {
  const { isLoading } = useAuth();
  const location = useLocation();

  // ✅ AuthContext가 localStorage에서 복원 중일 때 로딩 표시
  if (isLoading) {
    return (
      <p style={{ textAlign: "center", marginTop: "100px" }}>
        로그인 상태 확인 중...
      </p>
    );
  }

  // ✅ Navbar 구분 로직
  const simpleNavbarPaths = ["/", "/register", "/survey"];
  const isSimpleNavbar = simpleNavbarPaths.includes(location.pathname);

  return (
    <>
      {isSimpleNavbar ? <NavbarSimple /> : <Navbar />}

      <main className="container">
        <Routes>
          {/* ✅ 기본 경로 */}
          <Route path="/" element={<StartPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/survey" element={<SurveyPage />} />

          {/* ✅ 메인 및 취미 관련 페이지 */}
          <Route path="/main" element={<MainPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/category/:hobby" element={<CategoryPage />} />
          <Route path="/hobby-info/:id" element={<HobbyInfoPage />} />
          <Route path="/hobby-detail/:id" element={<HobbyDetailPage />} />
          <Route path="/hobby-description/:id" element={<HobbyDescriptionPage />} />
          <Route path="/hobby/:id" element={<HobbyDescriptionPage />} />

          {/* ✅ AI 추천 관련 */}
          <Route path="/personal-hobby" element={<PersonalHobbyPage />} />
          <Route path="/recommended-hobby/:id" element={<RecommendedHobbyPage />} />
          <Route path="/recommend" element={<RecommendPage />} />

          {/* ✅ 사용자 관련 */}
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/edit-profile" element={<EditProfilePage />} />

          {/* ✅ 모임 관련 */}
          <Route path="/create-group" element={<CreateGroupPage />} />
          <Route path="/my-group-detail/:id" element={<MyGroupDetailPage />} />
          <Route path="/mygroup/:id" element={<MyGroupDetailPage />} />
          <Route path="/edit-group/:id" element={<EditGroupPage />} />

          {/* ✅ 신규 페이지 */}
          <Route path="/new-hobbies" element={<NewHobbiesPage />} />

          {/* ✅ 존재하지 않는 경로 처리 */}
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
