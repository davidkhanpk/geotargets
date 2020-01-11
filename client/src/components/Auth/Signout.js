import React, {useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Typography from "@material-ui/core/Typography";
import { GoogleLogout } from 'react-google-login';
import Context from '../../context';
import { unstable_useMediaQuery as useMediaQuery } from '@material-ui/core/useMediaQuery';

const Signout = ({ classes }) => {
  const mobileSize = useMediaQuery("(max-width: 650px)")  
  const { dispatch} = useContext(Context);
  const onSignout = () => {
    dispatch({type: "SIGNOUT_USER"})

  }
  return (
    <GoogleLogout onLogoutSuccess={onSignout} buttonText="Signout" render={({onClick}) => (
      <span className={classes.root} onClick={onClick}>
        <Typography style={{display: mobileSize ? "none" : "block"}} variant="body1" className={classes.buttonText}>Signout</Typography>
        <ExitToAppIcon className={classes.buttonIcon} />
      </span>
    )}/>
  )
};

const styles = {
  root: {
    cursor: "pointer",
    display: "flex"
  },
  buttonText: {
    color: "orange"
  },
  buttonIcon: {
    marginLeft: "5px",
    color: "orange"
  }
};

export default withStyles(styles)(Signout);
