import { Fab } from "@mui/material";
import { height } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import ProfilePopUp1 from "../components/ProfilePopUp1";
import Wrapper from "../components/Wrapper";
import { User } from "../models/User.interface";
import { DisplayUser } from '../models/User.interface';
import '../styles/Profile.css';
import NavigationIcon from '@mui/icons-material/Navigation';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import { useNavigate } from "react-router-dom";
import BasicSpeedDial from "../components/SpeedDeal";
export default function Profile() {

	const [user, setUser] = useState<User>();
	const [visibility, setVisibility] = useState(false);
  	const [invisible, setInvisible] = useState(false);
	  const navigate = useNavigate();
	  
	
    useEffect(() => {(
      async () => {
        const {data} = await axios.get(`http://${process.env.REACT_APP_BASE_IP}:3001/api/user`, {withCredentials: true});
		setUser(data);
      }
	  
    )();
	
    }, []);

	const updateUser = async (updatedUser: User) => {
		const res = await axios.put(
		  `http://${process.env.REACT_APP_BASE_IP}:3001/api/users/update/${updatedUser.id}`,
		  {
			...updatedUser,
		  }
		);
		setUser(res.data);
	  };

	  const popupCloseHandler = () => {
		setVisibility(false);
	  };

	  

	return(
		<Wrapper>
			
	<div className="container mt-5 mb-5">
    <div className="row no-gutters">
        <div className="col-md-8 col-lg-8">
            <div className="d-flex flex-column">
                <div className="info-header d-flex flex-row justify-content-between align-items-center p-5 bg-dark text-white">
        		<div className="col-md-4 col-lg-4" >
					<img className="img--profile" src={user?.avatar}/></div>
                    <h3 className="display-5" >{user?.username} </h3>
					<Fab  onClick={() => navigate(-1)}>
  						<ArrowBackRoundedIcon />
					</Fab>
					<i>
						<BasicSpeedDial isVisible={setVisibility}/>
					</i>
					{/* <Fab color="secondary" aria-label="edit" onClick={() => setVisibility(true)}>
					<i className="bi bi-gear" style={{ fontSize: "1.5rem", }}></i>
  						
					</Fab> */}
					{/* <i className="bi bi-pencil popup--form--icon"></i> */}
					{/* <Fab  onClick={() => navigate(-1)}>
  						<ArrowBackRoundedIcon />
  						
					</Fab> */}

						
					{/* <i className=""></i>
					 */}
                </div>
                <div className="p-3 bg-black text-white">
                    {/* <h6>Test</h6> */}
                </div>
					 
					 
                <div className="d-flex flex-row text-white" >
                    <div className="p-3 mx-2 bg-primary text-center info-block">
                        <h4>Wins</h4>
                        <h6>{user?.wins}</h6>
                    </div>
                    <div className="p-3 bg-success text-center info-block">
                        <h4>Losses</h4>
                        <h6>{user?.losses}</h6>
                    </div>
                    <div className="p-3 mx-2 bg-warning text-center info-block">
                        <h4>Points</h4>
                        <h6>{user?.points}</h6>
                    </div>
                    
                </div>
				
            </div>
			<div>

					<ProfilePopUp1
					onClose={popupCloseHandler}
					show={visibility}
					user={user!}
					updateState={updateUser}
					/>
        </div>
			</div>
    </div>
</div>
		</Wrapper>
	)
}