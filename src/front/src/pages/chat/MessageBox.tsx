import { useState, useEffect, useContext } from 'react';
import { channelResponsePkj, MessagePkg } from '../../models/Chat.interface';
import { Context } from '../../App';

interface Prop {
  room: string;
}

export default function MessageBox({ room }: Prop) {
  const userId = useContext(Context).userId;
  const socket = useContext(Context).socket;
  const [chats, setChats] = useState<MessagePkg[]>([]);

  const messageListener = (message: MessagePkg) => {
    if (message.room === room)
      setChats((prevChat) => {
        return [...prevChat, message];
      });
  };

  useEffect(() => {}, [socket, room]);

  useEffect(() => {
    if (chats.length === 0 || chats[0].room !== room) {
      fetch(`/api/chat/CHmessage/${+room}`, { credentials: 'include' })
        .then((response) => response.json())
        .then((result) => {
          setChats(result);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  useEffect(() => {
    socket?.on('messageUpdate', (res: channelResponsePkj) => {
      const serverMex: MessagePkg = {
        data: `${res.reciverName} was ${res.type}ed`,
        id: -1,
        userId: { id: -1, username: 'server' },
        room: '',
        sendDate: new Date(),
      };
      setChats((prevChat) => {
        return [...prevChat, serverMex];
      });
    });

    socket?.on('message', messageListener);

    return () => {
      socket?.removeListener('messageUpdate');
      socket?.removeListener('message');
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [room]);

  const handleTime = (dataD: Date) => {
    let data = new Date(dataD);
    let day: number = data.getDate();
    let month: number = data.getMonth();
    let year: number = data.getFullYear();
    let hrs: number = data.getHours();
    let mins = data.getMinutes();
    let hr: string = hrs <= 9 ? '0' + String(hrs) : String(hrs);
    let mn: string = mins < 10 ? '0' + mins.toString() : mins.toString();
    const postTime = day + '/' + month + '/' + year + ' ' + hr + ':' + mn;
    return postTime;
  };

  return (
    <div
      className="scrollable-msg"
      ref={(el) => {
        el?.scrollBy({
          top: el.scrollHeight,
        });
      }}
    >
      {chats.map((msg: MessagePkg, i) => {
        return (
          <div
            key={i}
            className={
              msg.userId.id !== userId
                ? 'test d-flex justify-content-start mb-5'
                : 'test d-flex justify-content-end mb-5'
            }
          >
            <span className={msg.userId.id !== userId ? 'msg-name-usr' : 'msg-name-otherusr'} /* style={{color:'white', fontSize: '10px'}} */>
            {msg.userId.username}
            </span>
            <div className="img_cont_msg" ></div>
            <div
              className={
                msg.userId.id !== userId
                  ? 'msg_cotainer box1 box2'
                  : 'msg_cotainer_send box1 box2'
              }
            >
              {msg.data}
            </div>
            <span
              className={
                msg.userId.id !== userId ? 'msg_time' : 'msg_time_send'
              }
            >
              {handleTime(msg.sendDate)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
