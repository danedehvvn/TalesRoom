import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

//페이지 불러오기
import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import SignUpPage from "./pages/SignUpPage";
import PostListPage from "./pages/PostListPage"; // 커뮤니티 목록 (P-01)
import PostFormPage from "./pages/PostFormPage"; // 글쓰기·글 수정 (P-03, P-04)

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} /> */}
          {/* 커뮤니티: 같은 PostFormPage를 주소에 :id가 있는지로 작성/수정 구분 */}
          <Route path="/posts" element={<PostListPage />} />
          <Route path="/posts/new" element={<PostFormPage />} />
          <Route path="/posts/:id/edit" element={<PostFormPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;