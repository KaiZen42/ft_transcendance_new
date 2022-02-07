import * as React from "react"
// import logo from './logo.svg';
import "./App.css";
import { BrowserRouter, Route, Routes , Navigate} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/chat/Chat";
import Leaderboard from "./pages/Leaderboard";
import SignIn from "./pages/SignIn";
import Error404 from "./pages/404";
import ProtectedRoute from "./components/ProtectedRoutes";
import PongGame from "./pages/PongGame";
import Profile from "./pages/Profile";
import TwoFaAuth from "./pages/TwoFaAuth";

export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
        <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute>
                <Leaderboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <PongGame />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chat/>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          
          <Route path="/signin" element={<SignIn />} />
          <Route path="/two_fa_auth" element={<TwoFaAuth />} />
          <Route path="*" element={<Error404 />} /> 
        </Routes>
      </BrowserRouter>
    </div>
  );
}
