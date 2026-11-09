import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import FindIdPage from './pages/FindIdPage'; //아이디 찾기 화면
import ResetPasswordPage from './pages/ResetPasswordPage'; //비밀번호 재설정 화면

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          { /* 기본 '/' 경로로 들어왔을 때 메인 홈페이지가 보이도록 설정*/}
          <Route path="/" element={<HomePage />} />

          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          {/* 아이디 찾기 (로그인 화면의 '아이디 찾기' 링크가 이 주소로 이동) */}
          <Route path="/find-id" element={<FindIdPage />} />
          {/* 비밀번호 재설정 (로그인 화면, 아이디 찾기 결과 화면의 '비밀번호 재설정' 링크가 이 주소로 이동) */}
          <Route path="/reset-password" element={<ResetPasswordPage />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;