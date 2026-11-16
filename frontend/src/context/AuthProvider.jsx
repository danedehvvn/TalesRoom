// 로그인 상태(토큰, 회원 정보)를 관리하고 하위 컴포넌트에 나눠주는 컴포넌트
import { useState } from "react";
import { AuthContext } from "./AuthContext";

// 새로고침해도 로그인이 유지되도록 localStorage에서 회원 정보를 꺼내요
function getSavedUser() {
  const saved = localStorage.getItem("user");
  if (!saved || !localStorage.getItem("token")) return null;
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

function AuthProvider({ children }) {
  const [user, setUser] = useState(getSavedUser);

  // 로그인 성공 시: 토큰과 회원 정보를 저장
  const saveLogin = (token, userInfo) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userInfo));
    setUser(userInfo);
  };

  // 로그아웃 (REQ-USR-005): 저장된 토큰을 지우고 로그인 상태 해제
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const updateUser = (changes) => {
    setUser((current) => {
      if (!current) return current;
      const nextUser = { ...current, ...changes };
      localStorage.setItem("user", JSON.stringify(nextUser));
      return nextUser;
    });
  };

  return (
    <AuthContext.Provider value={{ user, isLoggedIn: !!user, saveLogin, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
