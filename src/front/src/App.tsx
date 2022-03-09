// import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Chat from './pages/chat/Chat';
import Leaderboard from './pages/Leaderboard';
import SignIn from './pages/SignIn';
import Error404 from './pages/404';
import ProtectedRoute from './components/ProtectedRoutes';
import Profile from './pages/Profile';
import TwoFaAuth from './pages/TwoFaAuth';
import Game from './pages/Game';
import  { createContext, useEffect, useState } from 'react';
import { io , Socket} from 'socket.io-client';
import { wait } from '@testing-library/user-event/dist/utils';
import e from 'express';

const WS_SERVER = `http://${process.env.REACT_APP_BASE_IP}:3001/chat`;

export interface context
{
  socket: Socket | undefined; 
  userId: number;
}

export const Context = createContext<context>({
  socket: undefined,
  userId: -1,
});

export default function App() {
  
  const [contextData, setcontextData] = useState<context>({
  socket: undefined,
  userId: -1,
});

  
  function getUser(): void
  {
    console.log("getUser")
    fetch(`http://${process.env.REACT_APP_BASE_IP}:3001/api/user`, {
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((result) => {
          setcontextData({
            socket: io(WS_SERVER), 
            userId: result.id,
          })
          console.log("getted: ", contextData)
        })
        .catch((error) => console.log(error))
        
  }
  function quit(event: any){
    event.preventDefault();
    //console.log("APP DEST: " ,contextData)
    if (contextData.socket === undefined)
      return;
    contextData.socket?.emit("offline", contextData.userId)
  }

  useEffect(() => {
    console.log("RENDER: ", contextData)
    if (contextData.socket === undefined)
      getUser()
    else
      contextData.socket?.emit("online", contextData.userId)

    window.onbeforeunload = quit
    window.onclose = quit
  },[contextData])


  
  return (
    <div className="App">
      
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
        </Context.Provider>
      </BrowserRouter>
    </div>
  );
}
