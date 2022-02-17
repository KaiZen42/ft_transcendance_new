import React, { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { Sender } from './Sender';
import Wrapper from '../../components/Wrapper';
import MessageBox from './MessageBox';
import { User } from '../../models/User.interface';
import axios from 'axios';
import { Message } from '../../models/Message.interface';
// import '../../styles/Chat.css';
import { response } from 'express';
import SearchBox from './Search';
import testChat from './testChat';
import './testChat.css';
import { Search } from '@mui/icons-material';
const WS_SERVER = `http://${process.env.REACT_APP_BASE_IP}:3000/chat`;

let idx: number = 0;

export function Chat(/* {user} : Prop */) {
  const [pkg, setPkg] = useState<Message>();
  const [socket, setSocket] = useState<Socket>();
  const [searchRes, setSearchRes] = useState('');

  function getUser() {
    fetch(`http://${process.env.REACT_APP_BASE_IP}:3001/api/user`, {
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((result) => {
        setPkg({
          id: idx++,
          idUser: result.id,
          user: result.username,
          data: '',
        });
      });
  }

  useEffect(() => {
    if (pkg === undefined) getUser();
    const sock = io(WS_SERVER);
    setSocket(sock);
    sock.on('connect', () => {
      console.log('connected');
    });
    return () => {
      sock.close();
    };
  }, []);

  console.log('CACCA  ' + searchRes); //cacca di debug

  return socket === undefined ? (
    <Wrapper>
      {' '}
      <div>Not Connected</div>{' '}
    </Wrapper>
  ) : (
    <Wrapper>
      <MessageBox socket={socket} />
      {console.log(pkg)}
      {pkg === undefined ? 4 : <Sender socket={socket} packet={pkg} />}

      {/* <div className="chat__container">
        <video autoPlay muted loop className="video">
          <source src="movie2.webm" type="video/webm" />
        </video>

        <h1>CHAT</h1>
        <div className="chat">
          <div className="chat__user-list">
            <SearchBox setSearch={setSearchRes} />
            <h1>Friends Online</h1>
            <div className="chat__user--active">
              <p>Ale</p>
            </div>
            <div className="chat__user--busy">
              <p>Ale</p>
            </div>
            <div className="chat__user--away">
              <p>Ale</p>
            </div>
          </div>

          <div className="chat__messages">
            <div className="chat__messages__user-message">
              <div className="chat__messages__user-message--ind-message">
                <p className="name">Nome</p>
                <br />
                <p className="message">Mess</p>
              </div>
            </div>
          </div>
          <form>
            <input type="text" placeholder="Type Message" />
          </form>
        </div>
      </div> */}
      <>
        <div className="container--fluid">
          <div className="row h-100">
              {<SearchBox setSearch={setSearchRes}/>}
            <div className="col-md-4 col-xl-3 chat">
              <div className="card mb-sm-3 mb-md-0 contacts_card">
                <div className="card-header">
                  <div className="user_info">
                    <span>Open Chats</span>
                  </div>
                </div>
                <div className="card-body contacts_body">
                  <ul className="contacts">
                    <li className="active">
                      <div className="d-flex bd-highlight">
                        <div className="img_cont">
                          <span className="online_icon"></span>
                        </div>
                        <div className="user_info">
                          <span>Khalid</span>
                          <p>Kalid is online</p>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="d-flex bd-highlight">
                        <div className="img_cont">
                          <span className="online_icon offline"></span>
                        </div>
                        <div className="user_info">
                          <span>Taherah Big</span>
                          <p>Taherah left 7 mins ago</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="card-footer"></div>
              </div>
            </div>
            <div className="col-md-8 col-xl-6 chat">
              <div className="card">
                <div className="card-header msg_head">
                  <div className="d-flex bd-highlight">
                    <div className="img_cont">
                      <span className="online_icon"></span>
                    </div>
                    <div className="user_info">
                      <span>Chat with Khalid</span>
                      <p>1767 Messages</p>
                    </div>
                    <div className="video_cam">
                      <span>
                        <i className="fas fa-video"></i>
                      </span>
                      <span>
                        <i className="fas fa-phone"></i>
                      </span>
                    </div>
                  </div>
                  <span id="action_menu_btn">
                    <i className="fas fa-ellipsis-v"></i>
                  </span>
                  <div className="action_menu">
                    <ul>
                      <li>
                        <i className="fas fa-user-circle"></i> View profile
                      </li>
                      <li>
                        <i className="fas fa-users"></i> Add to close friends
                      </li>
                      <li>
                        <i className="fas fa-plus"></i> Add to group
                      </li>
                      <li>
                        <i className="fas fa-ban"></i> Block
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body msg_card_body">
                  <div className="d-flex justify-content-start mb-4">
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
                  </div>
                  <div className="d-flex justify-content-start mb-4">
                    <div className="img_cont_msg"></div>
                    <div className="msg_cotainer">
                      I am good too, thank you for your chat template
                      <span className="msg_time">9:00 AM, Today</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mb-4">
                    <div className="msg_cotainer_send">
                      You are welcome
                      <span className="msg_time_send">9:05 AM, Today</span>
                    </div>
                    <div className="img_cont_msg"></div>
                  </div>
                  <div className="d-flex justify-content-start mb-4">
                    <div className="img_cont_msg"></div>
                    <div className="msg_cotainer">
                      I am looking for your next templates
                      <span className="msg_time">9:07 AM, Today</span>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end mb-4">
                    <div className="msg_cotainer_send">
                      Ok, thank you have a good day
                      <span className="msg_time_send">9:10 AM, Today</span>
                    </div>
                    <div className="img_cont_msg"></div>
                  </div>
                  <div className="d-flex justify-content-start mb-4">
                    <div className="img_cont_msg"></div>
                    <div className="msg_cotainer">
                      Bye, see you
                      <span className="msg_time">9:12 AM, Today</span>
                    </div>
                  </div>
                </div>
                <div className="card-footer">
                  <div className="input-group">
                    <div className="input-group-append">
                      <span className="input-group-text attach_btn">
                        <i className="fas fa-paperclip"></i>
                      </span>
                    </div>
                    <textarea
                      name=""
                      className="form-control type_msg"
                      placeholder="Type your message..."
                    ></textarea>
                    <div className="input-group-append">
                      <span className="input-group-text send_btn">
                        <i className="fas fa-location-arrow"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    </Wrapper>
  );
}

export default Chat;
