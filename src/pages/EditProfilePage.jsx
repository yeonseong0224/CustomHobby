import React, { useEffect, useState } from "react";
import ProfileForm from "../components/ProfileForm";
import { getUser } from "../api/userApi";
import { useNavigate } from "react-router-dom";

export default function EditProfilePage({ userId }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) return;
    getUser(userId).then(setUser).catch(()=>alert("사용자 조회 실패"));
  }, [userId]);

  const handleSave = (form) => {
    // 실제로는 API로 저장. 여기서는 로컬에서만 동작.
    alert("저장 완료 (샘플): " + JSON.stringify(form));
    navigate("/mypage");
  };

  if (!userId) return <div className="page">로그인 후 이용하세요.</div>;
  if (!user) return <div className="page">로딩...</div>;

  return (
    <div className="page edit-profile-page">
      <h1>개인 정보 수정</h1>
      <ProfileForm user={user} onSave={handleSave} />
    </div>
  );
}
