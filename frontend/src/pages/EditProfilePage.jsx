import React, { useEffect, useState } from "react";
import ProfileForm from "../components/ProfileForm";
import { getUser, updateUserInfo } from "../api/userApi"; // ✅ 수정 API 사용
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/EditProfilePage.css";

export default function EditProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser: updateContextUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  // ✅ 사용자 정보 로드
  useEffect(() => {
    if (isLoading || !isAuthenticated) return;
    getUser(user.userId)
      .then((data) => {
        console.log("📦 사용자 정보 불러오기 성공:", data);
        setUserData(data);
      })
      .catch((err) => {
        console.error("❌ 사용자 정보를 불러오지 못했습니다:", err);
        alert("사용자 정보를 불러오지 못했습니다.");
      });
  }, [user, isAuthenticated, isLoading]);

  // ✅ 저장 버튼 클릭 시 실행
  const handleSave = async (form) => {
    try {
      console.log("📝 수정 요청 데이터:", form);
      const updated = await updateUserInfo(user.userId, form); // 백엔드로 PUT 요청
      console.log("✅ 수정 완료:", updated);

      // AuthContext 상태 업데이트
      updateContextUser(updated);

      alert("✅ 정보가 성공적으로 수정되었습니다!");
      navigate("/mypage");
    } catch (err) {
      console.error("❌ 수정 실패:", err);
      alert("정보 수정에 실패했습니다.");
    }
  };

  // ✅ 로딩 상태 처리
  if (isLoading) return <div className="page">로딩 중...</div>;
  if (!isAuthenticated) return <div className="page">로그인 후 이용하세요.</div>;
  if (!userData) return <div className="page">정보를 불러오는 중...</div>;

  // ✅ 렌더링
  return (
    <div className="page edit-profile-page" style={{ maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>개인 정보 수정</h1>
      <ProfileForm user={userData} onSave={handleSave} />
    </div>
  );
}
