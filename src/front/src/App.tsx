import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Chat from './pages/chat/Chat';
import Leaderboard from './pages/Leaderboard';
import SignIn from './pages/SignIn';
import Error404 from './pages/404';
import ProtectedRoute from './components/ProtectedRoutes';
import Profile from './pages/Profile';
import TwoFaAuth from './pages/TwoFaAuth';
import Game from './pages/Game';
import { createContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const WS_SERVER = `http://${process.env.REACT_APP_BASE_IP}:5000/chat`;

export interface context {
  socket: Socket | undefined;
  userId: number;
  online: number[];
}

export const Context = createContext<context>({
  socket: undefined,
  userId: -1,
  online: [],
});

export default function App() {
  const [contextData, setcontextData] = useState<context>({
    socket: undefined,
    userId: -1,
    online: [],
  });

  function getUser() {
    fetch(`/api/user`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((result) => {
        setcontextData({
          socket: io(WS_SERVER),
          userId: result.id,
          online: [],
        });
      })
      .catch((error) => console.log(error));
  }
  function quit(event: any) {
    event.preventDefault();
    if (contextData.socket === undefined) return;
    contextData.socket.emit('offline', contextData.userId);
  }

  useEffect(() => {
    console.log(contextData.online);

    window.onbeforeunload = quit;
    if (contextData.socket === undefined) return getUser();
    if (contextData.online.length < 1)
      contextData.socket.emit('WhoOnline', contextData.userId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextData]);

  useEffect(() => {
    if (contextData.socket === undefined) return;
    contextData.socket.on('areOnline', (ons: number[]) => {
      if (contextData.online.length === 0)
        setcontextData((pred) => {
          pred.online = ons;
          return { ...pred };
        });
    });

    contextData.socket.on('areNowOnline', (id: number) => {
      setcontextData((pred) => {
        if (pred.online.findIndex((el) => el === id || el === -id) === -1)
          pred.online = [...pred.online, id];
        return { ...pred };
      });
    });

    contextData.socket.on('areNowOffline', (id: number) => {
      if (contextData.online.length === 0) return;
      else
        setcontextData((pred) => {
          const index = pred.online.findIndex((el) => el === id || el === -id);

          if (index !== -1) pred.online.splice(index, 1);
          return { ...pred };
        });
    });

    contextData.socket.on('areNowInGame', (id: number) => {
      if (contextData.online.length === 0) return;
      else
        setcontextData((pred) => {
          const index = pred.online.findIndex((el) => el === id);
          pred.online[index] = -pred.online[index];
          return { ...pred };
        });
    });

    contextData.socket.on('areNotInGame', (id: number) => {
      if (contextData.online.length === 0) return;
      else
        setcontextData((pred) => {
          const index = pred.online.findIndex((el) => el === -id);
          pred.online[index] = -pred.online[index];
          return { ...pred };
        });
    });
    return () => {
      contextData.socket?.removeListener('areOnline');
      contextData.socket?.removeListener('areNowOnline');
      contextData.socket?.removeListener('areNowInGame');
      contextData.socket?.removeListener('areNotInGame');
      contextData.socket?.removeListener('areNowOffline');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contextData.socket]);

  return (
    <BrowserRouter>
      <Context.Provider value={contextData}>
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
                <Chat />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users/:username"
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
          <Route
            path="/game/inverted"
            element={
              <ProtectedRoute>
                <Game inverted={true} />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/two_fa_auth" element={<TwoFaAuth />} />
          <Route path="*" element={<Error404 />} />
        </Routes>
      </Context.Provider>
    </BrowserRouter>
  );
}
