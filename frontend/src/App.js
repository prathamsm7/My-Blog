import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import Show from "./components/blog/show";
import New from "./components/blog/New";
import Edit from "./components/blog/Edit";

import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Activate from "./components/auth/Activate";
import ForgotPassword from "./components/auth/ForgotPassword";

import AdminRoute from "./helpers/AdminRoutes";
import Home from "./components/core/Home";
import Admin from "./components/core/Admin";

import PrivateRoute from "./helpers/PrivateRoutes";
import Private from "./components/core/Private";
import ResetPassword from "./components/auth/ResetPassword";

export default class App extends Component {
  render() {
    return (
      <div className="App">
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/users/activate/:token" component={Activate} />
          <Route exact path="/signin" component={Login} />
          <Route exact path="/forgot-password" component={ForgotPassword} />
          <Route exact path="/resetpassword/:token" component={ResetPassword} />

          <PrivateRoute exact path="/private" component={Private} />
          <PrivateRoute exact path="/blog/new/:userId" component={New} />
          <PrivateRoute exact path="/blog/:blogId" component={Show} />
          <PrivateRoute exact path="/blog/:blogId/edit" component={Edit} />

          <AdminRoute path="/admin" exact component={Admin} />
        </Switch>
      </div>
    );
  }
}
