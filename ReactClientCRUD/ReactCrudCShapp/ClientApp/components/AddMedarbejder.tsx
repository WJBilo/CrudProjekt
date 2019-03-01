import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link, NavLink } from "react-router-dom";
import { MedarbejderData } from "./FetchMedarbejder";
import { LoginHeader } from "./LoginHeader";

interface IAddMedarbejderState {
  titel: string;
  loading: boolean;
  medarbejderListe: MedarbejderData;
  byListe: Array<any>;
  urlParameter: any;
}
// Dette component står for at opdatere og skabe medarbejder objekter
export class AddMedarbejder extends React.Component<
  RouteComponentProps<{}>,
  IAddMedarbejderState
> {
  constructor() {
    super();

    this.state = {
      titel: "",
      loading: true,
      medarbejderListe: new MedarbejderData(),
      byListe: [],
      urlParameter: {}
    };
    // Følgende gør sådan at 'this' bliver bundet til klassen, som disse
    // metoder høre til. hvilket vil sige at når 'this' bliver benyttet
    // i følgende metoder referere det til klassen

    this.handleSave = this.handleSave.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    // Fetcher dataet fra URL'en og så bliver response objektet parsed i parameterværdien
    // af en anonym funktion og der kalder vi json() på objektet for at parse response.body objektet
    // for at gøre det til et JavaScript objekt og det bliver retuneret som et Promise af typen
    // MedarbejderData Array, som bliver resolved hvis det opfylder kravene om at være et array
    // af typen <MedarbejderData[]>
    fetch("https://localhost:44390/api/Medarbejder/ByDetaljer", {
      headers: {
        Authorization: "Basic " + localStorage.getItem("user")
      }
    })
      .then(response => {
        return response.json() as Promise<Array<any>>;
      })
      .then(data => {
        this.setState(
          { byListe: data, urlParameter: this.props.match.params },
          () => {
            this.prepareEditOrCreateMedarbejder();
          }
        );
      });
  }

  prepareEditOrCreateMedarbejder() {
    // Her checker vi om der er en parameter værdi i url'en
    // og i det tilfælde så er det fordi at brugeren
    // har valgt at redigere en eksisterende medarbejder.
    if (this.state.urlParameter.medarbId > 0) {
      fetch(
        "https://localhost:44390/api/Medarbejder/Detaljer/" +
          this.state.urlParameter.medarbId,
        {
          headers: {
            Authorization: "Basic " + localStorage.getItem("user")
          }
        }
      )
        .then(response => response.json() as Promise<MedarbejderData>)
        .then(data => {
          this.setState({
            titel: "Rediger",
            loading: false,
            medarbejderListe: data
          });
        });
    }

    // Hvis der ikke er nogen parameterværdi i url'en
    // så er det fordi at brugeren har trykket på tilføj ny
    else {
      this.setState({
        titel: "Tilføj",
        loading: false
      });
    }
  }

  public render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderCreateForm(this.state.byListe)
    );

    return (
      <div>
        <LoginHeader
          handleOnClick={() => this.props.history.push("/LoginSide")}
        />
        <h1>{this.state.titel}</h1>
        <h3>Medarbejder</h3>
        <hr />
        {contents}
      </div>
    );
  }

  // Dette vil håndtere submit form eventet.
  private handleSave(event: any) {
    // Metoden preventDefault () annullerer hændelsen,
    // hvis den er annullerbar, hvilket betyder at standardhandlingen,
    // der hører til hændelsen, ikke vil forekomme
    event.preventDefault();

    // Her laver jeg et FormData objekt ud fra
    // de data om medarbejderen som bliver sendt
    // afsted når brugeren trykker på gem knappen
    const formdata = new FormData(event.target);

    // Her tilgår jeg de enkelte data værdier
    // fra form objektet og sætter værdierne
    // ind i et nyt MedarbejderData objekt.
    var medarb = new MedarbejderData();
    (medarb.MedarbejderId = this.state.medarbejderListe.MedarbejderId),
      (medarb.Navn = formdata.getAll("Navn")[0].toString()),
      (medarb.Afdeling = formdata.getAll("Afdeling")[0].toString()),
      (medarb.ByNavn = formdata.getAll("ByNavn")[0].toString());

    // Hvis medarbjederlisten indeholder en medarbejder
    // så er det fordi at vi er igang med at redigere en
    // eksisterende medarbejder og så bliver følgende
    // evalueret til true
    if (this.state.medarbejderListe.MedarbejderId > 0) {
      fetch("https://localhost:44390/api/Medarbejder/Update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          dataType: "application/json",
          Authorization: "Basic " + localStorage.getItem("user")
        },
        body: JSON.stringify(medarb)
      });

      this.props.history.push("/FetchMedarbejder");
    }

    // Ellers kalder vi API'ets Create metode
    // og skaber et nyt objekt.
    else {
      fetch("https://localhost:44390/api/Medarbejder/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          dataType: "application/json",
          Authorization: "Basic " + localStorage.getItem("user")
        },
        body: JSON.stringify(medarb)
      });

      this.props.history.push("/FetchMedarbejder");
    }
  }

  // Dette vil håndtere Cancel button click event.
  private handleCancel(e: any) {
    e.preventDefault();
    this.props.history.push("/FetchMedarbejder");
  }

  private renderCreateForm(byListe: Array<any>) {
    return (
      <form onSubmit={this.handleSave}>
        <div className="form-group row">
          <label className=" control-label col-md-12">Navn</label>
          <div className="col-md-4">
            <input
              className="form-control"
              type="text"
              name="Navn"
              defaultValue={this.state.medarbejderListe.Navn}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-md-12">Afdeling</label>
          <div className="col-md-4">
            <input
              className="form-control"
              type="text"
              name="Afdeling"
              defaultValue={this.state.medarbejderListe.Afdeling}
              required
            />
          </div>
        </div>
        <div className="form-group row">
          <label className="control-label col-md-12">Bynavn</label>
          <div className="col-md-4">
            <select
              className="form-control"
              data-val="true"
              name="ByNavn"
              defaultValue={this.state.medarbejderListe.ByNavn}
              required
            >
              <option value="">-- Vælg by --</option>
              {byListe.map(city => (
                <option key={city.ByID} value={city.ByNavnet}>
                  {city.ByNavnet}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-default">
            Gem
          </button>
          <button className="btn" onClick={this.handleCancel}>
            Annuller
          </button>
        </div>
      </form>
    );
  }
}
