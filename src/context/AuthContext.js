import React, { createContext, useState } from 'react'

// React 의 context API 이용하여 AuthContext 생성
// 컴포넌트 트리에서 전역적으로 상태를 공유하는데 사용됨
export const AuthContext = createContext();

export const AuthProvider = ({ children }) =>  {
    const [username, setUsername] = useState(null);
  
  return (
    // Provider는 context를 구독하는 모든 컴포넌트에게 상태를 제공
    <AuthContext.Provider value={{ username, setUsername }}>
        {children}
    </AuthContext.Provider>
)
}
