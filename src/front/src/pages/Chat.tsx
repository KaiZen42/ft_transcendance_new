import { useState, useEffect, useContext } from 'react';
import { Socket } from 'socket.io-client';
import { Sender } from '../components/chat/Sender';
import Wrapper from '../components/Wrapper';
import MessageBox from '../components/chat/MessageBox';
import { MessagePkg } from '../models/Chat.interface';
import { UserList } from '../components/chat/UserList';
import '../styles/Chat.css';
import { ChannelList } from '../components/chat/ChannelList';
import MessageHeader from '../components/chat/MessageHeader';
import { ChatInfo } from '../models/Chat.interface';
import { context, Context } from '../App';

export function Chat() {
  const cont: context = useContext(Context);
  const [pkg, setPkg] = useState<MessagePkg>();
  const [socket, setSocket] = useState<Socket>();
  const [room, setRoom] = useState('');
  const [chatInfo, setChatInfo] = useState<ChatInfo>();

  function getUser() {
    fetch(`/api/user`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((result) => {
        setPkg({
          id: 0,
          data: '',
          userId: {
            id: result.id,
            username: result.username,
          },
          room: '',
          sendDate: new Date(),
        });
      });
  }

  //-----------PKG OR SOCKET UPDATE
  useEffect(() => {
    if (pkg === undefined) getUser();
    if (socket === undefined && cont.socket !== undefined)
      setSocket(cont.socket);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg, socket, room]);

  //-----------VIEW LISTENER
  useEffect(() => {
    socket?.on('viewedRoom', (roomView: string) => {
      if (room !== roomView) setRoom(roomView);
      if (roomView === '' && chatInfo !== undefined) {
        const preInfo = chatInfo;
        preInfo.roomId = '';
        setChatInfo(undefined);
      }
    });

    return () => {
      socket?.removeListener('viewedRoom');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pkg, socket, chatInfo]);

  useEffect(() => {
    if (socket !== undefined) {
      socket.on('createRoom', (newRoom: string) => {
        if (room !== newRoom) setRoom(newRoom);
      });
    }
    return () => {
      socket?.removeListener('createRoom');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket]);

  return cont.socket === undefined ? null : (
    <Wrapper>
      <div id="parent" className="container-fluid">
        <div
          className="row h-50"
          style={{ marginLeft: '17%', marginRight: 'auto', width: '80%' }}
        >
          {pkg === undefined ? null : <UserList />}
          {pkg === undefined ? null : (
            <ChannelList room={room} setChatInfo={setChatInfo} />
          )}
          {chatInfo === undefined ||
          chatInfo.roomId === '' ||
          room === '' ? null : (
            <div className="col-md-4 col-xl-5 chat">
              <div>
                <div className="card">
                  {chatInfo === undefined ? null : (
                    <MessageHeader chatInfo={chatInfo} />
                  )}
                  {pkg === undefined || room === undefined ? null : (
                    <MessageBox room={room} />
                  )}
                </div>
              </div>
              {pkg === undefined ? null : <Sender room={room} packet={pkg} />}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
}

export default Chat;
