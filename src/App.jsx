import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import MatchRoom from "./pages/MatchRoom";
import Leaderboard from "./pages/Leaderboard";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Login from "./pages/Login";

function App() {
  const { user, loading, profileComplete } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
        <Route path="/setup" element={user && !profileComplete ? <Profile isInitialSetup={true} /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Home /> : <Navigate to="/login" />} />
        <Route path="/match" element={user ? <MatchRoom /> : <Navigate to="/login" />} />
        <Route path="/leaderboard" element={user ? <Leaderboard /> : <Navigate to="/login" />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
      </Routes>
    </>
  );
}

export default App;