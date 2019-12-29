import React, {useState} from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, {NavigationControl} from 'react-map-gl';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";

const INITAIL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
}

const Map = ({ classes }) => {
  const [viewport, setViewport] = useState(INITAIL_VIEWPORT)
  return (<div className={classes.root}>
      <ReactMapGL onViewStateChange={viewport => setViewport(viewport)} {...viewport } width="100vw" height="calc(100vh - 64px)" mapStyle="mapbox://styles/mapbox/streets-v9"vie mapboxApiAccessToken="pk.eyJ1IjoiZGF2aWRraGFucGsiLCJhIjoiY2s0cTFmOW95MGp3ZDNlbGFlNzVmYXBmZiJ9.0NIim75_HSm1cwZo9PHPHw" >
        <div className={classes.navigationControl}>
          <NavigationControl onViewStateChange={viewport => setViewport(viewport)}/>
        </div>
      </ReactMapGL>
  </div>);
};

const styles = {
  root: {
    display: "flex"
  },
  rootMobile: {
    display: "flex",
    flexDirection: "column-reverse"
  },
  navigationControl: {
    position: "absolute",
    top: 0,
    left: 0,
    margin: "1em"
  },
  deleteIcon: {
    color: "red"
  },
  popupImage: {
    padding: "0.4em",
    height: 200,
    width: 200,
    objectFit: "cover"
  },
  popupTab: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  }
};

export default withStyles(styles)(Map);
