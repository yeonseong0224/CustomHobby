// 📁 src/pages/EditProfilePage.jsx
import React, { useEffect, useState } from "react";
import ProfileForm from "../components/ProfileForm";
import { getUser, updateUserInfo } from "../api/userApi";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/EditProfilePage.css";

export default function EditProfilePage() {
  const { user, isAuthenticated, isLoading, updateUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  // ✅ 사용자 정보 불러오기
  useEffect(() => {
    if (!isAuthenticated || !user?.userId) return;

    getUser(user.userId)
      .then((data) => {
        console.log("📦 사용자 정보 불러오기 성공:", data);
        setUserData(data);
      })
      .catch((err) => {
        console.error("❌ 사용자 정보 불러오기 실패:", err);
        alert("사용자 정보를 불러오지 못했습니다.");
      });
  }, [user, isAuthenticated]);

  // ✅ 프로필 수정 저장
  const handleSave = async (form) => {
    if (!user || !user.userId) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);
      console.log("📝 수정 요청 데이터:", form);

      const updated = await updateUserInfo(user.userId, form);
      console.log("✅ 수정 완료:", updated);

      // ✅ Context + localStorage 동기화
      updateUser(updated);

      alert("✅ 정보가 성공적으로 수정되었습니다!");
      navigate("/mypage");
    } catch (error) {
      console.error("❌ 수정 실패:", error);
      alert("정보 수정에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) return <div className="page">로딩 중...</div>;
  if (!isAuthenticated) return <div className="page">로그인 후 이용하세요.</div>;
  if (!userData) return <div className="page">정보를 불러오는 중...</div>;

  return (
    <div
      className="page edit-profile-page"
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "40px 20px",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "40px" }}>👤 개인 정보 수정</h1>
      <ProfileForm user={userData} onSave={handleSave} />

      {saving && (
        <div className="saving-overlay">
          <div className="saving-message">💾 저장 중입니다...</div>
        </div>
      )}
    </div>
  );
}
