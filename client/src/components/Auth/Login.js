import React, {useContext} from "react";
import { withStyles } from "@material-ui/core/styles";
import { GoogleLogin} from 'react-google-login';
import { GraphQLClient } from 'graphql-request';
import Context from '../../context';
import { Typography } from "@material-ui/core";
import { ME_QUERY } from '../../graphql/queries';

const Login = ({ classes }) => {
  const { dispatch } = useContext(Context);
  const onSuccess = async (user) => {
    try { 
      const idToken = user.getAuthResponse().id_token;
      const client = new GraphQLClient("http://localhost:4000/graphql", {
        headers: {authorization: idToken}
      })
      const data = await client.request(ME_QUERY);
      dispatch({type: "LOGIN_USER", payload: data.me})
      dispatch({type: "IS_LOGGED_IN", payload: user.isSignedIn()})
    } catch(err) {
      onFailure(err);
    }
  }
  const onFailure = err => {
    console.error("Error Logging In", err)
  }
  return (
    <div className={classes.root}>
      <Typography component="h1" variant="h3" gutterBottom noWrap style={{color: "rgb(66, 133, 244)"}}>Welcome</Typography>
      <GoogleLogin buttonText="Login with Google" theme="dark" onFailure={onFailure} isSignedIn={true} clientId="99811375752-tmjksehfm5bficp6ag2nd838pubr19uv.apps.googleusercontent.com" onSuccess={onSuccess}/>
    
    </div>
  )
};

const styles = {
  root: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    flexDirection: "column",
    alignItems: "center"
  }
};

export default withStyles(styles)(Login);
