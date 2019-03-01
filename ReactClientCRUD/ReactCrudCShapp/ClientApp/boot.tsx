import "./css/site.css";
import "bootstrap";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { AppContainer } from "react-hot-loader";
import { BrowserRouter } from "react-router-dom";
import * as RoutesModule from "./routes";
let routes = RoutesModule.routes;

function renderApp() {
  // Denne kode starter React-appen, når den kører i en browser. Det opretter routing
  // konfiguration og injecter appen ind i DOM elementet react-app.
  const baseUrl = document
    .getElementsByTagName("base")[0]
    .getAttribute("href")!;
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter children={routes} basename={baseUrl} />
    </AppContainer>,
    document.getElementById("react-app")
  );
}

renderApp();

// Allow Hot Module Replacement
if (module.hot) {
  module.hot.accept("./routes", () => {
    routes = require<typeof RoutesModule>("./routes").routes;
    renderApp();
  });
}