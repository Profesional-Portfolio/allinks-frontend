import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./modules/auth/presentation/store/auth-provider";
import { ProtectedRoute } from "./modules/auth/presentation/components/protected-route";
import { ProfileProvider } from "./modules/profile/presentation/store/profile-provider";
import { LinksProvider } from "./modules/links/presentation/store/links-provider";
import { LoginPage } from "./modules/auth/presentation/pages/login.page";
import { RegisterPage } from "./modules/auth/presentation/pages/register.page";
import { ForgotPasswordPage } from "./modules/auth/presentation/pages/forgot-password.page";
import { ResetPasswordPage } from "./modules/auth/presentation/pages/reset-password.page";
import { VerifyEmailPage } from "./modules/auth/presentation/pages/verify-email.page";
import { HomePage } from "./modules/home/presentation/pages/home.page";
import { LinksPage } from "./modules/links/presentation/pages/links.page";
import { ProfilePage } from "./modules/profile/presentation/pages/profile.page";
import { PublicProfilePage } from "./modules/public/presentation/pages/public-profile.page";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProfileProvider>
          <LinksProvider>
            <Routes>
              {/* Public Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />

              {/* Public Profile route */}
              <Route path="/:username" element={<PublicProfilePage />} />

              {/* Protected Dashboard routes */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              >
                <Route index element={<LinksPage />} />
                <Route path="profile" element={<ProfilePage />} />
              </Route>

              {/* Catch all - redirect to home or login */}
              <Route
                path="*"
                element={<Navigate to="/" replace />}
              />
            </Routes>
          </LinksProvider>
        </ProfileProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
