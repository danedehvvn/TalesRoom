// 컴포넌트에서 로그인 상태를 꺼내 쓰는 훅
// 사용 예) const { user, isLoggedIn, logout } = useAuth();
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function useAuth() {
  return useContext(AuthContext);
}
