
// import logo from './logo.svg';
import "./App.css";
import { BrowserRouter, Route, Routes , Navigate} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/chat/Chat";
import Leaderboard from "./pages/Leaderboard";
import SignIn from "./pages/SignIn";
import Error404 from "./pages/404";
import ProtectedRoute from "./components/ProtectedRoutes";
import Profile from "./pages/Profile";
import TwoFaAuth from "./pages/TwoFaAuth";
import Game from "./pages/Game";

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
          <Route
            path="/game"
            element={
              <ProtectedRoute>
                <Game />
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
