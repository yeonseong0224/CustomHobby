import { useEffect, useState } from "react";
import { getUser } from "../api/userApi";

export default function UserProfile({ userId }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!userId) return;
    getUser(userId)
      .then(setUser)
      .catch(err => alert(err.response?.data || "사용자 조회 실패"));
  }, [userId]);

  if (!userId) return <p>로그인 후 프로필을 확인할 수 있습니다.</p>;
  if (!user) return <p>로딩 중...</p>;

  return (
    <div>
      <h2>프로필</h2>
      <p>아이디: {user.userId}</p>
      <p>닉네임: {user.nickname}</p>
      <p>이메일: {user.email}</p>
      <p>지역: {user.region}</p>
      <p>나이: {user.age}</p>
    </div>
  );
}
