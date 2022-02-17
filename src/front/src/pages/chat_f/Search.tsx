import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import { User } from '../../models/User.interface';
import { styled } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { Avatar, Box } from '@mui/material';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

interface props {
  setSearch: (str: string) => void;
}

export default function SearchBox({ setSearch }: props) {
  const [data, setData] = useState<User[]>([]);

  async function getter() {
    const res = await fetch(
      `http://${process.env.REACT_APP_BASE_IP}:3001/api/users`,
      { credentials: 'include' }
    );
    setData(await res.json());
  }

  useEffect(() => {
    getter();
  }, []);

  function selection(e: any): void {
    const str = e.target.value;
    const arr = data.map((users) => users.username);
    for (let i: number = 0; i < arr.length; i++) {
      if (arr[i] === str) {
        setSearch(str);
        return;
      }
    }
    setSearch('');
  }

  // return (
  //   <>
  //     <Stack spacing={2} sx={{ width: '100%'}}>
  //       <Autocomplete
  //         id="Search a User"
  //         freeSolo
  //         options={data}
  //         getOptionLabel={(option) => option.username}
  //         renderOption={(props, option) => (
  //           <Box component="li" {...props}>
  //             <StyledBadge
  //               overlap="circular"
  //               // invisible={true}
  //               anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
  //               variant="dot"
  //             >
  //               <Avatar alt="Image" src={option.avatar} />
  //             </StyledBadge>
  //             {option.username}
  //           </Box>
  //         )}
  //         renderInput={(params) => (
  //           <TextField
  //             onKeyDown={(e) => {
  //               if (e.key === 'Enter') {
  //                 selection(e);
  //               }
  //             }}
  //             {...params}
  //             label="Search a User"
  //           />
  //         )}
  //       />
  //     </Stack>
  //   </>
  // );

  return (
    <div className="col-md-4 col-xl-3 chat">
      <div className="card-search mb-sm-3 mb-md-0 contacts_card">
        <div className="card-header">
          <div className="input-group">
            <input
              type="text"
              placeholder="Search..."
              name=""
              className="form-control search"
              // onChange={(e) => }
            />
            <div className="input-group-prepend">
              <span className="input-group-text search_btn">
                <i className="fas fa-search"></i>
              </span>
            </div>
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
  );
}
