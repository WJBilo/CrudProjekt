import * as React from "react";
import { RouteComponentProps } from "react-router";
import { LoginHeader } from "./LoginHeader";

export class Home extends React.Component<RouteComponentProps<{}>, {}> {
  public render() {
    return (
      <div>
        <LoginHeader
          handleOnClick={() => this.props.history.push("/LoginSide")}
        />
        <h1>Medarbejder administration</h1>
        <h4>
          I navigationsmenuen finder du en side hvor du kan redigere, tilføje og
          slette medarbejdere
        </h4>
      </div>
    );
  }
}
