import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Home } from '@/pages/Home';
import { Categories } from '@/pages/Categories';
import { Quiz } from '@/pages/Quiz';
import { QuizResult } from '@/pages/QuizResult';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Profile } from '@/pages/Profile';
import { History } from '@/pages/History';
import { Leaderboard } from '@/pages/Leaderboard';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { HelpCenter } from '@/pages/HelpCenter';
import { PrivacyPolicy } from '@/pages/PrivacyPolicy';
import { TermsOfService } from '@/pages/TermsOfService';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { AdminRoute } from '@/components/auth/AdminRoute';
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { ManageCategories } from '@/pages/admin/ManageCategories';
import { ManageCareerInfo } from '@/pages/admin/ManageCareerInfo';
import { ManageQuestions } from '@/pages/admin/ManageQuestions';
import { ManageUsers } from '@/pages/admin/ManageUsers';
import { AttemptDetails } from '@/pages/AttemptDetails';
import { NotFound } from '@/pages/NotFound';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen transition-colors bg-white dark:bg-secondary-900">
            <Navbar />
            <main className="min-h-screen">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/leaderboard" element={<Leaderboard />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                 <Route path="/admin" element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                } />
                <Route path="/admin/categories" element={
                  <AdminRoute>
                    <ManageCategories />
                  </AdminRoute>
                } />
               <Route path="/admin/questions" element={
                  <AdminRoute>
                    <ManageQuestions />
                  </AdminRoute>
                } />
                <Route path="/admin/users" element={
                  <AdminRoute>
                    <ManageUsers />
                  </AdminRoute>
                } />
                <Route path="/admin/settings" element={
                  <AdminRoute>
                    <div>System Settings Page</div>
                  </AdminRoute>
                } />
                <Route path="/admin/career-info" element={
                  <AdminRoute>
                    <ManageCareerInfo />
                  </AdminRoute>
                } />
                {/* Protected Routes */}
                <Route path="/quiz/:categoryId" element={
                  <ProtectedRoute>
                    <Quiz />
                  </ProtectedRoute>
                } />
                <Route path="/quiz-result" element={
                  <ProtectedRoute>
                    <QuizResult />
                  </ProtectedRoute>
                } />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                } />
                <Route path="/history" element={
                  <ProtectedRoute>
                    <History />
                  </ProtectedRoute>
                } />
                <Route path="/attempts/:attemptId" element={
                  <ProtectedRoute>
                    <AttemptDetails />
                  </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin/*" element={
                  <AdminRoute>
                    <div>Admin Dashboard</div>
                  </AdminRoute>
                } />

                {/* Fallback */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;