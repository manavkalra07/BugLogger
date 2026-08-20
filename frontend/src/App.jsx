import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyOTP from "./pages/VerifyOTP";

import Bugs from "./pages/Bugs";
import BugDetails from "./pages/BugDetails";
import Team from "./pages/Team";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import Invite from "./pages/Invite";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/bugs" element={<Bugs />} />
        <Route path="/bugs/:id" element={<BugDetails />} />
        <Route path="/team" element={<Team />} />
        <Route path="/invite/:token" element={<Invite />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;