import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import BlockIcon from '@mui/icons-material/Block';
import SettingsIcon from '@mui/icons-material/Settings';



export default function BasicSpeedDial(props: {isVisible: (visible: boolean) => void}) {
	
	
  return (
    // <Box sx={{ height: 320, transform: 'translateZ(0px)', flexGrow: 1 }}>
      <SpeedDial
        ariaLabel="SpeedDial"
		direction="right" 
		// hidden={true}
        
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
           
		   icon={<SettingsIcon />}
		   tooltipTitle={'Settings'}
		   onClick={() => props.isVisible(true)}
		   />
          <SpeedDialAction
           
            icon={<BlockIcon />}
            tooltipTitle={'Block'}
			// onClick={() => props.isVisible(true)}
			/>

        
      </SpeedDial>
    // </Box>
  );
}