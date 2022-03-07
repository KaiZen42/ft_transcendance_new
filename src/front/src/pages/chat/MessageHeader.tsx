import { RestorePageOutlined, Room } from '@mui/icons-material';
import { Avatar } from '@mui/material';
import { useEffect, useState } from 'react';
import { ChatInfo } from '../../models/Chat.interface';
import StyledBadge from '../../styles/StyleBage';

interface Prop {
  chatInfo: ChatInfo | undefined;
}

export default function MessageHeader({ chatInfo }: Prop) {
  useEffect(() => {
    
  }, [chatInfo])

  return (
    <div className="card-header msg_head">
      <div className="d-flex bd-highlight">
        <div className="img_cont">
          <StyledBadge
            overlap="circular"
            invisible={chatInfo?.avatar === undefined}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            variant="dot"
          >
            <Avatar alt="Img" src={chatInfo?.avatar === undefined ? "./group_icon.png" : chatInfo?.avatar} />
          </StyledBadge>
        </div>
        <div className="user_info">
          <span>{chatInfo?.username}</span>
          <p>{chatInfo?.avatar === undefined ? 
          "Gente"
          : null}</p>
        </div>

        {/* <div className="video_cam">
								<span>
								<i className="fas fa-video"></i>
								</span>
								<span>
								<i className="fas fa-phone"></i>
								</span>
							</div> */}
      </div>
      {/* <span id="action_menu_btn">
							<i className="fas fa-ellipsis-v"></i>
						</span>  */}
      {/* <div className="action_menu">
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
						</div> */}
    </div>
  );
}
