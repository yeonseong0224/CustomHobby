import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUser, updateUserProfile } from "../api/userApi";
import { getUserCreatedGroups } from "../api/hobbyGroupApi";
import { getUserParticipatedHobbies } from "../api/hobbyApi";
import "../styles/MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [intro, setIntro] = useState("");
  const [profileImage, setProfileImage] = useState("/images/profile.png");
  const [participatedHobbies, setParticipatedHobbies] = useState([]);
  const [createdGroups, setCreatedGroups] = useState([]);

  // ✅ 데이터 로드
  useEffect(() => {
    if (!user || !user.userId) {
      navigate("/");
      return;
    }

    const fetchData = async () => {
      try {
        const userData = await getUser(user.userId);
        setIntro(userData.introduce || "");
        setProfileImage(userData.profile || "/images/profile.png");

        const hobbies = await getUserParticipatedHobbies(user.userId);
        setParticipatedHobbies(hobbies);

        const groups = await getUserCreatedGroups(user.userId);
        setCreatedGroups(groups);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      }
    };
    fetchData();
  }, [user, navigate]);

  // ✅ 자기소개 저장
  const handleIntroSave = async () => {
    try {
      await updateUserProfile(user.userId, { introduce: intro });
      alert("자기소개가 저장되었습니다!");
    } catch (error) {
      alert("자기소개 저장 실패");
    }
  };

  // ✅ 프로필 사진 업로드 (Base64 변환 후 저장)
  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기 제한 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 이미지 파일만 허용
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setProfileImage(base64String);

      try {
        await updateUserProfile(user.userId, { profile: base64String });
        alert("프로필 사진이 저장되었습니다! ✅");
      } catch (error) {
        console.error("프로필 사진 저장 실패:", error);
        alert("프로필 사진 저장에 실패했습니다.");
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mypage-container">
      {/* ✅ 상단 프로필 영역 */}
      <div className="mypage-top">
        <div className="profile-section">
          {/* 프로필 이미지 + 카메라 버튼 */}
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src={profileImage}
              alt="프로필"
              className="profile-img"
              onError={(e) => {
                console.warn("프로필 이미지 로드 실패");
                e.target.src = "/images/profile.png";
              }}
            />
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              onChange={handleProfileImageChange}
              style={{ display: "none" }}
            />
            <button
              onClick={() =>
                document.getElementById("profileImageInput").click()
              }
              style={{
                position: "absolute",
                bottom: "5px",
                right: "5px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                cursor: "pointer",
                fontSize: "18px",
              }}
              title="프로필 사진 변경"
            >
              📷
            </button>
          </div>

          {/* 자기소개 */}
          <div className="intro-box">
            <h3>자기 소개</h3>
            <textarea
              placeholder="자기소개를 입력하세요..."
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
            <button className="save-intro-btn" onClick={handleIntroSave}>
              저장
            </button>
          </div>
        </div>

        {/* ✅ 오른쪽 버튼 영역 */}
        <div className="right-section">
          <button
            className="create-group-btn"
            onClick={() => navigate("/create-group")}
          >
            모임 개설
          </button>
          <div className="mypage-buttons">
            <button
              onClick={() => navigate("/survey", { state: { from: "mypage" } })}
            >
              설문 조사 다시하기
            </button>
            <button onClick={() => navigate("/edit-profile")}>
              개인 정보 수정
            </button>
          </div>
        </div>
      </div>

      {/* ✅ 취미 카드 영역 */}
      <div className="hobby-section">
        {/* 참여한 취미 */}
        <div className="hobby-box">
          <h2>참여한 취미</h2>
          <div className="hobby-grid">
            {participatedHobbies.length > 0 ? (
              participatedHobbies.map((hobby) => (
                <div
                  key={hobby.id}
                  className="small-hobby-card"
                  onClick={() => navigate(`/hobby-detail/${hobby.id}`)}
                >
                  <img
                    src={hobby.photo || "/images/art.png"}
                    alt={hobby.hobbyName}
                    className="small-hobby-img"
                  />
                  <p className="small-hobby-title">🎵 {hobby.hobbyName}</p>
                  <p className="small-hobby-desc">{hobby.oneLineDescription}</p>
                </div>
              ))
            ) : (
              <p className="empty-text">참여한 취미가 없습니다.</p>
            )}
          </div>
        </div>

        {/* 개설한 취미 모임 */}
        <div className="hobby-box">
          <h2>개설한 취미 모임</h2>
          <div className="hobby-grid">
            {createdGroups.length > 0 ? (
              createdGroups.map((group) => (
                <div
                  key={group.id}
                  className="small-hobby-card"
                  onClick={() => navigate(`/my-group-detail/${group.id}`)}
                >
                  <p className="small-hobby-title">{group.groupName}</p>
                  <p className="small-hobby-desc">{group.groupDescription}</p>
                </div>
              ))
            ) : (
              <p className="empty-text">아직 개설한 취미가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}