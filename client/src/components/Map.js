import React, {useContext, useState, useEffect} from "react";
import { withStyles } from "@material-ui/core/styles";
import ReactMapGL, {NavigationControl, Marker, Popup} from 'react-map-gl';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import DeleteIcon from "@material-ui/icons/DeleteTwoTone";
import PinIcon from './PinIcon';
import Context from '../context';
import Blog from './Blog';
import { useClient } from '../client';
import { GET_PINS_QUERY } from '../graphql/queries';
import { DELETE_PIN_MUTATION } from '../graphql/mutations';
import differenceInMinutes from 'date-fns/difference_in_minutes'; 

const INITAIL_VIEWPORT = {
  latitude: 37.7577,
  longitude: -122.4376,
  zoom: 13
}

const Map = ({ classes }) => {
  const client = useClient();
  const {state, dispatch} = useContext(Context)
  const [viewport, setViewport] = useState(INITAIL_VIEWPORT);
  const [userPosition, setUserPostion] = useState(null)
  useEffect(() => {
    getUserPosition()
  }, []);
  useEffect(() => {
    getPins()
  }, [])
  const [popup, setPopup] = useState(null);
  const getPins = async () => {
    const { getPins } = await client.request(GET_PINS_QUERY);
    dispatch({type: "GET_PINS", payload: getPins})
  }

  const handleMapClick = ({lngLat, leftButton}) => {
    if(!leftButton) return;
    if(!state.draft) {
      dispatch({type: "CREATE_DRAFT"})
    }
    const [longitude, latitude] = lngLat
    console.log(state.draft);
    dispatch({
      type: "UPDATE_DRAFT_LOCATION",
      payload: {longitude, latitude}
    })
  }
  const getUserPosition = () => {
    if("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(position => {
        const {latitude, longitude} = position.coords
        setViewport({...viewport, latitude, longitude}) ;
        setUserPostion({longitude, latitude})
      })
    }
  }
  const highlightNewPin = (pin) => {
    const isNewPin = differenceInMinutes(Date.now(), Number(pin.createdAt)) <= 30
    return isNewPin ? "limegreen" : "darkblue"
  }
  const handleSelectPin = (pin) => {
    console.log("popup")
    setPopup(pin);
    dispatch({type: "SET_PIN", payoad: pin})
  }
  const handleDeletePin = async (pin) => {
    const variables = {pinId: pin._id}
    const { deletePin } = await client.request(DELETE_PIN_MUTATION, variables);
    dispatch({type: "DELETE_PIN", payload: deletePin});
    setPopup(null);
  }
  const isAuthUser = () => state.currentUser._id === popup.author._id
  return (<div className={classes.root}>
      <ReactMapGL onClick={handleMapClick} onViewStateChange={viewport => setViewport(viewport)} {...viewport } width="100vw" height="calc(100vh - 64px)" mapStyle="mapbox://styles/mapbox/streets-v9"vie mapboxApiAccessToken="pk.eyJ1IjoiZGF2aWRraGFucGsiLCJhIjoiY2s0cTFmOW95MGp3ZDNlbGFlNzVmYXBmZiJ9.0NIim75_HSm1cwZo9PHPHw" >
        <div className={classes.navigationControl}>
          <NavigationControl onViewStateChange={viewport => setViewport(viewport)}/>
        </div>
        {userPosition && (
          <Marker latitude={userPosition.latitude} longitude={userPosition.longitude} offsetTop={-37} offsetLeft={-19}>
            <PinIcon size={40} color="red"/>
          </Marker>
        )}
        {state.draft && (
        <Marker latitude={state.draft.latitude} longitude={state.draft.longitude} offsetTop={-37} offsetLeft={-19}>
          <PinIcon size={40} color="hotpink"/>
        </Marker>
        )}
        {state.pins.map(pin => (
          <Marker key={pin._id} latitude={pin.latitude} longitude={pin.longitude} offsetTop={-37} offsetLeft={-19}>
            <PinIcon onClick={() => handleSelectPin(pin)}  size={40} color={highlightNewPin(pin)}/>
          </Marker>
        ))}
        { popup && (
          <Popup anchor="top" latitude={popup.latitude} longitude={popup.longitude} closeOnClick={false} onClose={() => setPopup(null)}>
            <img className={classes.popupImage} src={popup.image} alt={popup.title} />
            <div className={classes.popupTab}>
              <Typography>
                {popup.latitude.toFixed(6)}, {popup.longitude.toFixed(6)}
              </Typography>
              {isAuthUser() && (
                <Button onClick={() => handleDeletePin(popup)}>
                  <DeleteIcon className={classes.deleteIcon} />
                </Button>
              )}
            </div>
          </Popup>
        )}
      </ReactMapGL>
      <Blog />
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
