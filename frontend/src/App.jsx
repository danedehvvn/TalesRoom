import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';
import Layout from './components/Layout';
import ThemeExplorePage from './pages/ThemeExplorePage';
import ThemeDetailPage from './pages/ThemeDetailPage';
import ThemeFormPage from './pages/ThemeFormPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';

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
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
