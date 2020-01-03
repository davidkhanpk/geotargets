import React from "react";
import PlaceTwoTone from "@material-ui/icons/PlaceTwoTone";

export default ({onClick, size, color}) => (
    <PlaceTwoTone onClick={onclick} style={{fontSize: size, color}}  />
);
