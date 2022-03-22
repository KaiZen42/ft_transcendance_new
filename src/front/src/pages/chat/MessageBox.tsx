import React, { useState, useEffect, useRef, useContext } from 'react';
import io, { Socket } from 'socket.io-client';
import { Sender } from './Sender';
import Wrapper from '../../components/Wrapper';
import { channelResponsePkj, MessagePkg } from '../../models/Chat.interface';
import MessageHeader from './MessageHeader';
import { maxHeaderSize } from 'http';
import { emitKeypressEvents } from 'readline';
import { Context } from '../../App';
import { time } from 'console';

interface Prop {
  room: string;
}

let key: number = 0;
export default function MessageBox({ room }: Prop) {
  const userId = useContext(Context).userId;
  const socket = useContext(Context).socket;
  const [chats, setChats] = useState<MessagePkg[]>([]);
  console.log('Render mex box of ' + room);

  const messageListener = (message: MessagePkg) => {
    //let newChat = chats;
    //newChat.push(message);
    console.log('ARRIVED: ', message);
    if (message.room == room)
      setChats((prevChat) => {
        return [...prevChat, message];
      });
    console.log(chats);
  };

  useEffect(() => {
    console.log('ACTUAL ROOM ', room);
  }, [socket, room]);

  useEffect(() => {
    if (chats.length === 0 || chats[0].room !== room) {
      fetch(`/api/chat/CHmessage/${+room}`, { credentials: 'include' })
        .then((response) => response.json())
        .then((result) => {
          setChats(result);
        });
    }
    //TODO: capire perche stampa 3 volte
  }, [room]);

  useEffect(() => {
    socket?.on('messageUpdate', (res: channelResponsePkj) => {
      const serverMex: MessagePkg = {
        data: `${res.reciverName} has ${res.type}ed`,
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
                ? 'test d-flex justify-content-start mb-4'
                : 'test d-flex justify-content-end mb-4'
            }
          >
            <div className="img_cont_msg"></div>
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

{
  /* <div>
			<p>MESSAGES:</p>
			
			{ chats.map(msg => (<p key={key++}> {msg.userId.username}: {msg.data} </p>))}
		</div> */
}

/* 	<div className="d-flex justify-content-start mb-4">
			<div className="img_cont_msg"></div>
			<div className="msg_cotainer">
				Hi, how are you samim?
				<span className="msg_time">8:40 AM, Today</span>
			</div>
		</div>
		
		<div className="d-flex justify-content-end mb-4">
			<div className="msg_cotainer_send">
				Hi Khalid i am good tnx how about you?
				<span className="msg_time_send">8:55 AM, Today</span>
			</div>
			<div className="img_cont_msg"></div>
		</div> */
