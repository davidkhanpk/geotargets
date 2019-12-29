import React from "react";
import withRoot from "../withRoot";
import Header from '../components/Header';
import Map from '../components/Map';

const App = () => (
  <React.Fragment>
    <Header />
    <Map />
  </React.Fragment>
);

export default withRoot(App);
