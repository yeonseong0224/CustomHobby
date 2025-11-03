import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserParticipatedHobbies } from "../api/hobbyApi";
import { getUserCreatedGroups } from "../api/hobbyGroupApi";
import { getUser, updateUserProfile } from "../api/userApi";
import "../styles/MyPage.css";

export default function MyPage() {
  const navigate = useNavigate();
  const { user } = useAuth();  // ✅ Context에서 사용자 정보 가져오기
  const [intro, setIntro] = useState("");
  const [profileImage, setProfileImage] = useState("/images/profile.png");
  const [participatedHobbies, setParticipatedHobbies] = useState([]);
  const [createdGroups, setCreatedGroups] = useState([]);

  useEffect(() => {
    // ✅ Context에서 사용자 정보 확인
    if (!user || !user.userId) {
      console.warn("⚠️ 로그인이 필요합니다.");
      navigate("/");
      return;
    }

    // 사용자 정보 불러오기 (자기소개 포함)
    const fetchUserData = async () => {
      try {
        const userData = await getUser(user.userId);
        if (userData.introduce) {
          setIntro(userData.introduce);
        }
        if (userData.profile) {
          setProfileImage(userData.profile);
        }
      } catch (error) {
        console.error("사용자 정보 불러오기 실패:", error);
      }
    };
    
    // 참여한 취미 조회
    const fetchParticipatedHobbies = async () => {
      try {
        const data = await getUserParticipatedHobbies(user.userId);
        setParticipatedHobbies(data);
      } catch (error) {
        console.error("참여한 취미 조회 실패:", error);
      }
    };

    // 개설한 모임 조회
    const fetchCreatedGroups = async () => {
      try {
        const data = await getUserCreatedGroups(user.userId);
        setCreatedGroups(data);
      } catch (error) {
        console.error("개설한 모임 조회 실패:", error);
      }
    };

    fetchUserData();
    fetchParticipatedHobbies();
    fetchCreatedGroups();
  }, [user, navigate]);

  // 자기소개 저장 (DB에 저장)
  const handleIntroSave = async () => {
    try {
      await updateUserProfile(user.userId, {
        introduce: intro
      });
      alert("자기소개가 저장되었습니다! ✅");
    } catch (error) {
      console.error("자기소개 저장 실패:", error);
      alert("자기소개 저장에 실패했습니다. 다시 시도해주세요.");
    }
  };

  // 프로필 사진 업로드 (Base64로 변환하여 저장)
  const handleProfileImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 파일 크기 체크 (5MB 이하)
    if (file.size > 5 * 1024 * 1024) {
      alert("파일 크기는 5MB 이하여야 합니다.");
      return;
    }

    // 이미지 파일인지 확인
    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드 가능합니다.");
      return;
    }

    // 파일을 Base64로 변환
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setProfileImage(base64String);

      // DB에 저장
      try {
        await updateUserProfile(user.userId, {
          profile: base64String
        });
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
      {/* 상단 영역 */}
      <div className="mypage-top">
        <div className="profile-section">
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
              onClick={() => document.getElementById("profileImageInput").click()}
              style={{
                position: "absolute",
                bottom: "10px",
                right: "10px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "50%",
                width: "35px",
                height: "35px",
                cursor: "pointer",
                fontSize: "18px"
              }}
              title="프로필 사진 변경"
            >
              📷
            </button>
          </div>

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

        <div className="right-section">
          <button
            className="create-group-btn"
            onClick={() => navigate("/create-group")}
          >
            모임 개설
          </button>
          <div className="mypage-buttons">
            <button onClick={() => navigate("/survey")}>설문 조사 다시하기</button>
            <button onClick={() => navigate("/edit-profile")}>
              개인 정보 수정
            </button>
          </div>
        </div>
      </div>

      {/* 취미 카드 영역 */}
      <div className="hobby-section">
        <div className="hobby-box">
          <h2>참여한 취미</h2>
          {participatedHobbies.length > 0 ? (
            participatedHobbies.map((hobby) => (
              <div 
                key={hobby.id} 
                className="hobby-card"
                onClick={() => navigate(`/hobby-detail/${hobby.id}`)}
                style={{ cursor: "pointer" }}
              >
                <img 
                  src={hobby.photo || "/images/art.png"} 
                  alt={hobby.hobbyName} 
                  className="hobby-img"
                  onError={(e) => { 
                    console.warn(`이미지 로드 실패: ${e.target.src}`);
                    e.target.src = "/images/art.png"; 
                  }}
                />
                <p className="hobby-title">{hobby.hobbyName}</p>
              </div>
            ))
          ) : (
            <div className="hobby-card empty-card">
              <p>참여한 취미가 없습니다.</p>
            </div>
          )}
        </div>

        <div className="hobby-box">
          <h2>개설한 취미 모임</h2>
          {createdGroups.length > 0 ? (
            createdGroups.map((group) => (
              <div 
                key={group.id} 
                className="hobby-card"
                onClick={() => navigate(`/my-group-detail/${group.id}`)}
                style={{ cursor: "pointer" }}
              >
                <p className="hobby-title">{group.groupName}</p>
                <p style={{ fontSize: "14px", color: "#666" }}>{group.groupDescription}</p>
              </div>
            ))
          ) : (
            <div className="hobby-card empty-card">
              <p>아직 개설한 취미가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
