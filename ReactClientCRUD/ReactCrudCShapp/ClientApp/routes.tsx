import * as React from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Redirect,
  withRouter
} from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { FetchMedarbejder } from "./components/FetchMedarbejder";
import { AddMedarbejder } from "./components/AddMedarbejder";
import { LoginSide } from "./components/LoginSide";

const PrivatRute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => 
      localStorage.getItem("user") ? (
        <Component {...props} />
      ) : (
        <Redirect to={{ pathname: "/LoginSide" }} />
      )
    }
  />
);

export const routes = (
  <Layout>
    <Route exact path="/" component={Home} />
    <Route path="/LoginSide" component={LoginSide} />
    <PrivatRute path="/FetchMedarbejder" component={FetchMedarbejder} />
    <PrivatRute path="/addMedarbejder" component={AddMedarbejder} />
    <PrivatRute path="/Medarbejder/Edit/:medarbId" component={AddMedarbejder} />
  </Layout>
);
