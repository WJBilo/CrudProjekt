import * as React from "react";
import { RouteComponentProps } from "react-router";

interface LoginPageState {
  brugernavn: string;
  kodeord: string;
  submitted: boolean;
  loading: boolean;
  error: string;
}
// Loginsiden
class LoginSide extends React.Component<
  RouteComponentProps<{}>,
  LoginPageState
> {
  constructor() {
    super();

    this.logout();

    this.state = {
      brugernavn: "",
      kodeord: "",
      submitted: false,
      loading: false,
      error: ""
    };
    // Følgende gør sådan at 'this' bliver bundet til klassen, som disse
    // metoder høre til. hvilket vil sige at når 'this' bliver benyttet
    // i følgende metoder referere det til klassen (LoginSide)
    this.handlebrugernavnChange = this.handlebrugernavnChange.bind(this);
    this.handlePassChange = this.handlePassChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // Sender et request til api'et, med et specificeret url-endpoint, kodeord og brugernavn
  // og i tilfælde af at brugernavnet og kodeordet er gyldigt, så bliver
  // der gemt et 'user' objekt i domænets lokale storage objekt
  // som kan bruges til at sende autoriserede kald til api'et
  login(brugernavn, kodeord, url) {
    // I API'et er der implementeret basic auth så derfor
    // skal vi base 64 encode kodeordet og brugernavnet
    // Og sætter dette ind i authorization headeren af
    // vores request
    let credentials = window.btoa(brugernavn + ":" + kodeord);
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Basic " + credentials
      }
    };
    //

    // Sender et aynkront request til API'et
    fetch(url, requestOptions)
      .then(response => {
        // transformere responsen fra API'et om til json-data
        return response.json();
      })
      .then(
        succes => {
          console.log(succes);
          // Her får vi adgang til domænets lokale storage objekt
          // og tilføjer et user item til det
          // som kan bruges til at sende gyldige requests til API'et
          // I de andre componenter
          localStorage.setItem("user", credentials);

          // Redirecter til forsiden
          this.props.history.push("/");
        },
        error => {
          console.log(error);
          this.setState({
            error: "Fokert adgangskode eller brugernavn",
            loading: false
          });
        }
      );
  }

  logout() {
    // fjern user fra local storage for logge ham ud
    localStorage.removeItem("user");
  }

  // hver gang der bliver indtastet noget i brugernavn feltet
  // bliver denne metode kørt og opdatere this.state.brugernavn
  // med værdien af inpu feltet.
  handlebrugernavnChange(e) {
    const val = e.target.value;

    this.setState({ brugernavn: val });
  }

  handlePassChange(e) {
    const val = e.target.value;
    this.setState({ kodeord: val });
  }

  handleSubmit(e) {
    // Metoden preventDefault () annullerer hændelsen,
    // hvis den er annullerbar, hvilket betyder at standardhandlingen,
    // der hører til hændelsen, ikke vil forekomme
    e.preventDefault();

    this.setState({ submitted: true });
    const { brugernavn, kodeord } = this.state;

    // Stop her hvis der ikke står noget
    // i brugernavn og kodeord input felterne.
    if (!(brugernavn && kodeord)) {
      return;
    }

    this.setState({ loading: true });
    this.login(
      brugernavn,
      kodeord,
      "https://localhost:44390/api/Medarbejder/AccesGranted"
    );
  }

  render() {
    const { brugernavn, kodeord, submitted, loading, error } = this.state;
    return (
      <div className="col-md-6 col-md-offset-3">
        <h2>Login</h2>
        <form name="form" onSubmit={this.handleSubmit}>
          <div
            // hvis formen er submitted og brugernavn feltet
            // er tomt skal denne div have klassen form-group has-error
            // hvilket laver en rød outline omkring boksen, som indikere en fejl
            // ellers bare klassen form-group
            className={
              "form-group" + (submitted && !brugernavn ? " has-error" : "")
            }
          >
            <label>Brugernavn</label>
            <input
              type="text"
              className="form-control"
              name="brugernavn"
              value={brugernavn}
              onChange={this.handlebrugernavnChange}
            />
            {submitted && !brugernavn && (
              <div className="help-block">Brugernavn er nødvendigt</div>
            )}
          </div>
          <div
            className={
              "form-group" + (submitted && !kodeord ? " has-error" : "")
            }
          >
            <label>kodeord</label>
            <input
              type="kodeord"
              className="form-control"
              name="kodeord"
              value={kodeord}
              onChange={this.handlePassChange}
            />
            {submitted && !kodeord && (
              <div className="help-block">kodeord er nødvendigt</div>
            )}
          </div>
          <div className="form-group">
            <button className="btn btn-primary" disabled={loading}>
              Login
            </button>
          </div>
          {error && <div className={"alert alert-danger"}>{error}</div>}
        </form>
      </div>
    );
  }
}

export { LoginSide };
