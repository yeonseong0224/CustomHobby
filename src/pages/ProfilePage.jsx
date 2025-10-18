import React, { useState, useEffect } from "react";
import UserProfile from "../components/UserProfile";

export default function ProfilePage() {
  const [userId, setUserId] = useState(localStorage.getItem("userId"));

  return (
    <div>
      <h1>내 프로필</h1>
      <UserProfile userId={userId} />
    </div>
  );
}
