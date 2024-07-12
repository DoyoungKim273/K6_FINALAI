import React, { createContext, useEffect, useState } from "react";

// React 의 context API 이용하여 AuthContext 생성
// 컴포넌트 트리에서 전역적으로 상태를 공유하는데 사용됨
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(() => {
    // 페이지 로드 시 localStorage에서 username 가져오기
    return localStorage.getItem("username") || null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  useEffect(() => {
    // username이 변경될 때마다 localStorage에 저장
    if (username) {
      localStorage.setItem("username", username);
    } else {
      localStorage.removeItem("username");
    }
  }, [username]);

  useEffect(() => {
    if (role) {
      localStorage.setItem("role", role);
    } else {
      localStorage.removeItem("role");
    }
  }, [role]);

  return (
    // Provider는 context를 구독하는 모든 컴포넌트에게 상태를 제공
    <AuthContext.Provider value={{ username, setUsername, role, setRole}}>
      {children}
    </AuthContext.Provider>
  );
};
