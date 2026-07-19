import { Routes, Route, Navigate } from 'react-router-dom';
import { AppStateProvider } from './app/AppState';
import { Layout } from './app/Layout';
import { HomePage } from './pages/HomePage';
import { ProfilePage } from './pages/ProfilePage';

export function App() {
  return (
    <AppStateProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </AppStateProvider>
  );
}
