import React, { createContext, useContext, useState, useEffect } from "react";

// AuthContext 생성
const AuthContext = createContext(null);

// AuthContext를 사용하기 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내부에서 사용해야 합니다.");
  }
  return context;
};

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 localStorage에서 사용자 정보 불러오기
  useEffect(() => {
    console.log("🔍 AuthContext 초기화 시작...");
    const storedUserId = localStorage.getItem("userId");
    const storedUserNickname = localStorage.getItem("userNickname");
    
    console.log("📦 localStorage 내용:", {
      userId: storedUserId,
      nickname: storedUserNickname
    });

    if (storedUserId && storedUserNickname) {
      console.log("✅ localStorage에서 사용자 정보 복원 완료!");
      setUser({
        userId: storedUserId,
        nickname: storedUserNickname
      });
    } else {
      console.log("⚠️ localStorage에 사용자 정보 없음");
    }
    setIsLoading(false);
  }, []);

  // 로그인 함수
  const login = (userData) => {
    const userInfo = {
      userId: userData.userId,
      nickname: userData.nickname
    };
    
    setUser(userInfo);
    
    // localStorage에도 백업 저장 (새로고침 시 유지)
    localStorage.setItem("userId", userInfo.userId);
    localStorage.setItem("userNickname", userInfo.nickname);
    
    console.log("✅ 로그인 성공:", userInfo);
  };

  // 로그아웃 함수
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userId");
    localStorage.removeItem("userNickname");
    localStorage.removeItem("intro");
    console.log("✅ 로그아웃 완료");
  };

  // 사용자 정보 업데이트 함수
  const updateUser = (newData) => {
    setUser((prev) => ({ ...prev, ...newData }));
    
    // localStorage 동기화
    if (newData.userId) localStorage.setItem("userId", newData.userId);
    if (newData.nickname) localStorage.setItem("userNickname", newData.nickname);
  };

  const value = {
    user,              // 현재 사용자 정보
    isLoading,         // 로딩 상태
    login,             // 로그인 함수
    logout,            // 로그아웃 함수
    updateUser,        // 사용자 정보 업데이트 함수
    isAuthenticated: !!user  // 로그인 여부
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};



