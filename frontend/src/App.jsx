import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

//페이지 불러오기
import HomePage from "./pages/HomePage";
// import LoginPage from "./pages/LoginPage";
// import SignUpPage from "./pages/SignUpPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          {/* <Route path="/login" element={<LoginPage />} />
          <Route path="/sign-up" element={<SignUpPage />} /> */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;