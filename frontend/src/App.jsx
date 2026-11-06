import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import AuthProvider from "./context/AuthProvider";

//페이지 불러오기
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
// import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    // AuthProvider로 감싸면 모든 페이지에서 useAuth()로 로그인 상태 사용
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="/sign-up" element={<SignUpPage />} /> */}
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
