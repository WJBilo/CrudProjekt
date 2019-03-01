import * as React from "react";
import { Link, NavLink } from "react-router-dom";
import { RouteComponentProps } from "react-router";

interface MyComponentProps {
  handleOnClick: any;
}
// Dette component tilføjer login/logout knappen oppe i højre hjørne på siden
export class LoginHeader extends React.Component<MyComponentProps, {}> {
  public render() {
    return (
      <div className="form-group">
        <button
          id="HeaderLogoutButton"
          className="btn btn-primary"
          onClick={this.props.handleOnClick}
        >
          {localStorage.getItem("user") ? "Logout" : "Login"}
        </button>
      </div>
    );
  }
}
