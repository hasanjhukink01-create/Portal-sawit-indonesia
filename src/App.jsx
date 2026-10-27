import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { I18nProvider } from './context/I18nContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Kalkulator from './pages/Kalkulator';
import Pemeliharaan from './pages/Pemeliharaan';
import Pestisida from './pages/Pestisida';
import Alat from './pages/Alat';
import Jadwal from './pages/Jadwal';
import Monitoring from './pages/Monitoring';
import UmurTanaman from './pages/UmurTanaman';
import Stok from './pages/Stok';
import Riwayat from './pages/Riwayat';
import Login from './pages/Login';

function App() {
  return (
    <I18nProvider>
      <AppProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public route */}
              <Route path="/login" element={<Login />} />

              {/* Protected routes wrapped in Layout */}
              <Route path="/" element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="kalkulator" element={<Kalkulator />} />
                  <Route path="pemeliharaan" element={<Pemeliharaan />} />
                  <Route path="pestisida" element={<Pestisida />} />
                  <Route path="alat" element={<Alat />} />
                  <Route path="jadwal" element={<Jadwal />} />
                  <Route path="monitoring" element={<Monitoring />} />
                  <Route path="umur-tanaman" element={<UmurTanaman />} />
                  <Route path="stok" element={<Stok />} />
                  <Route path="riwayat" element={<Riwayat />} />
                </Route>
              </Route>
              
              {/* Fallback 404 */}
              <Route path="*" element={<div className="p-6">Halaman tidak ditemukan (404)</div>} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </AppProvider>
    </I18nProvider>
  );
}

export default App;
