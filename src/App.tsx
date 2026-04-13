import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { DataProvider } from '@/context/DataContext';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CatalogPage } from '@/pages/CatalogPage';
import { KnowledgePage } from '@/pages/KnowledgePage';
import { VideosPage } from '@/pages/VideosPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';
import { AdminPage } from '@/pages/AdminPage';
import { AdminUsersPage } from '@/pages/AdminUsersPage';
import { Toaster } from '@/components/ui/sonner';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <CatalogPage />
                </Layout>
              }
            />
            <Route
              path="/knowledge"
              element={
                <Layout>
                  <KnowledgePage />
                </Layout>
              }
            />
            <Route
              path="/videos"
              element={
                <Layout>
                  <VideosPage />
                </Layout>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
