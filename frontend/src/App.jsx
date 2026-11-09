import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import Layout from './components/Layout';
import ThemeExplorePage from './pages/ThemeExplorePage';
import ThemeDetailPage from './pages/ThemeDetailPage';
import ThemeFormPage from './pages/ThemeFormPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import PostDetailPage from './pages/PostDetailPage';
import PostListPage from './pages/PostListPage'; // 커뮤니티 목록 (P-01)
import PostFormPage from './pages/PostFormPage'; // 글쓰기·글 수정 (P-03, P-04)
import AdminUsersPage from './pages/AdminUsersPage'; // 관리자 회원 목록 (M-04)
import RequireAuth from './components/RequireAuth';
import MyPagePage from './pages/MyPagePage';
import MyPageEditPage from './pages/MyPageEditPage';
import MyPostsPage from './pages/MyPostsPage';
import MyCommentsPage from './pages/MyCommentsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/themes" element={<ThemeExplorePage />} />
            <Route path="/themes/new" element={<ThemeFormPage key="new" />} />
            <Route path="/themes/:id" element={<ThemeDetailPage />} />
            <Route path="/themes/:id/edit" element={<ThemeFormPage key="edit" />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            {/* 커뮤니티: 같은 PostFormPage를 주소에 :id가 있는지로 작성/수정 구분 */}
            <Route path="/posts" element={<PostListPage />} />
            <Route path="/posts/new" element={<PostFormPage key="new" />} />
            <Route path="/posts/:id/edit" element={<PostFormPage key="edit" />} />
            {/* 관리자: 화면에서 role을 확인하고, 서버도 adminMiddleware로 한 번 더 막아요 */}
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route element={<RequireAuth />}>
              <Route path="/mypage" element={<MyPagePage />} />
              <Route path="/mypage/edit" element={<MyPageEditPage />} />
              <Route path="/mypage/posts" element={<MyPostsPage />} />
              <Route path="/mypage/comments" element={<MyCommentsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
