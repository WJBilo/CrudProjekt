import * as React from "react";
import { RouteComponentProps } from "react-router";
import { Link, NavLink } from "react-router-dom";
import "../css/SearchBar.css";
import { Pagination } from "./Pagination";
import { LoginHeader } from "./LoginHeader";

interface IFetchMedarbejderState {
  navn: string;
  byNavn: string;
  medarbejderListe: MedarbejderData[];
  loading: boolean;
  RowsReturned: number;
  page: number;
  byListe: Array<any>;
  rowsPerPage: number;
}
// Dette component står for at hente og slette medarbejder objekter
export class FetchMedarbejder extends React.Component<
  RouteComponentProps<{}>,
  IFetchMedarbejderState
> {
  static Authentication = {
    headers: {
      Authorization: "Basic " + localStorage.getItem("user")
    }
  };
  constructor() {
    super();
    // State bliver benyttet til at opdatere componentet når
    // brugeren fortager sig en handling, som f.eks. at trykke
    // på en knap eller indtaste noget i et input felt.
    this.state = {
      navn: "",
      byNavn: "",
      medarbejderListe: [],
      loading: true,
      RowsReturned: 0,
      page: 1,
      byListe: [],
      rowsPerPage: 10
    };

    // Følgende gør sådan at 'this' bliver bundet til klassen, som disse
    // metoder høre til. hvilket vil sige at når 'this' bliver benyttet
    // i følgende metoder referere det til klassen (FetchMedarbejder)

    this.handleDel = this.handleDel.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);
    this.GetData = this.GetData.bind(this);
    this.handleChangeSelectBy = this.handleChangeSelectBy.bind(this);
    this.handleSearchForName = this.handleSearchForName.bind(this);
  }

  componentDidMount() {
    fetch("https://localhost:44390/api/Medarbejder/ByDetaljer", {
      headers: {
        Authorization: "Basic " + localStorage.getItem("user")
      }
    })
      .then(response => {
        return response.json() as Promise<Array<any>>;
      })
      .then(data => {
        this.setState({ byListe: data });
      });
    // Fetcher dataet fra URL'en og så bliver response objektet parsed i parameterværdien
    // af en anonym funktion og der kalder vi json() på objektet for at parse response.body objektet
    // for at gøre det til et JavaScript objekt og det bliver retuneret som et Promise af typen
    // MedarbejderData Array, som bliver resolved hvis det opfylder kravene om at være et array
    // af typen <MedarbejderData[]>
    this.GetData();
  }

  private handleDel(id: number, person: MedarbejderData) {
    if (
      confirm("Er du sikker på du vil slette " + person.Navn + " fra listen?")
    ) {
      fetch("https://localhost:44390/api/Medarbejder/Delete/" + id, {
        method: "delete",
        headers: {
          Authorization: "Basic " + localStorage.getItem("user")
        }
      })
        .then(response => response.json())
        .then(data => {
          this.setState({
            medarbejderListe: this.state.medarbejderListe.filter(medarb => {
              return medarb.MedarbejderId != id;
            }),
            loading: false
          });
          alert(person.Navn + " blev slettet fra listen");
        })
        .catch(() => alert("Der skete en fejl"));
    } else {
      null;
    }
  }
  private handlePageChange(num) {
    this.setState({ page: num }, () => {
      this.GetData();
    });
  }
  private handleEdit(medarbId: number) {
    this.props.history.push("Medarbejder/Edit/" + medarbId);
  }

  private GetData() {
    this.setState({ loading: true });
    let searchString = "";

    let urlEndPoint = "https://localhost:44390/api/Medarbejder";
    if (this.state.navn == "") {
      if (this.state.byNavn == "") {
        searchString = urlEndPoint + "?page=" + this.state.page;
      } else {
        searchString =
          urlEndPoint +
          "?page=" +
          this.state.page +
          "&byNavn=" +
          this.state.byNavn;
      }
    } else {
      if (this.state.byNavn == "") {
        searchString =
          urlEndPoint + "?page=" + this.state.page + "&navn=" + this.state.navn;
      } else {
        searchString =
          urlEndPoint +
          "?page=" +
          this.state.page +
          "&navn=" +
          this.state.navn +
          "&byNavn=" +
          this.state.byNavn;
      }
    }
    searchString = searchString + "&rowsPerPage=" + this.state.rowsPerPage;

    // Sender et aynkront request til API'et
    fetch(searchString, {
      headers: {
        Authorization: "Basic " + localStorage.getItem("user")
      }
    })
      .then(response => {
        // transformere responsen fra API'et om til json-data
        return response.json() as Promise<MedarbejderData[]>;
      })
      .then(data => {
        // Opdatere medarbejderListe og RowsReturned med det json-data
        // vi har fået tilbage
        this.setState({
          medarbejderListe: data["m_Item1"],
          loading: false,
          RowsReturned: data["m_Item2"]
        });
      });
  }

  private handleKeyDown(e: any) {
    if (e.keyCode == 13) {
      this.setState({ page: 1 }, () => {
        this.GetData();
      });
    }
  }
  private handleSearchForName() {
    this.setState({ page: 1 }, () => {
      this.GetData();
    });
  }

  private handleChange(event: any) {
    const val = event.target.value;
    this.setState({
      navn: val
    });
  }
  private handleChangeSelectBy(event: any) {
    const val = event.target.value;
    this.setState({
      byNavn: val
    });
  }

  private renderMedarbejderTable(medarbejderListe: MedarbejderData[]) {
    return (
      <table className="table">
        <thead>
          <tr>
            <th>Medarbejder ID</th>
            <th>Navn</th>
            <th>Bynavn</th>
            <th>Afdeling</th>
          </tr>
        </thead>
        <tbody>
          {medarbejderListe.map(medarbejder => (
            <tr key={medarbejder.MedarbejderId}>
              <td>{medarbejder.MedarbejderId}</td>
              <td>{medarbejder.Navn}</td>
              <td>{medarbejder.ByNavn}</td>
              <td>{medarbejder.Afdeling}</td>
              <td>
                <button
                  onClick={() =>
                    this.handleDel(medarbejder.MedarbejderId, medarbejder)
                  }
                >
                  Slet
                </button>
                <button
                  onClick={() => this.handleEdit(medarbejder.MedarbejderId)}
                >
                  Rediger
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }

  public render() {
    let contents = this.state.loading ? (
      <p>
        <em>Loading...</em>
      </p>
    ) : (
      this.renderMedarbejderTable(this.state.medarbejderListe)
    );

    let byMenu = (
      <div className="form-group row">
        <label className="control-label col-md-12">
          Filtrer listen ud fra bynavn
        </label>
        <div className="col-md-4">
          <select
            className="form-control"
            data-val="true"
            name="byNavn"
            defaultValue=""
            onChange={this.handleChangeSelectBy}
          >
            <option value="">-- Vælg by --</option>
            {this.state.byListe.map(city => (
              <option key={city.ByID} value={city.ByNavnet}>
                {city.ByNavnet}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
    let searchInput = (
      <div>
        <input
          type="text"
          placeholder="Søg efter navn på medarbejder"
          name="navn"
          id="navn"
          onChange={this.handleChange}
          onKeyDown={this.handleKeyDown}
        />
        <button onClick={this.handleSearchForName}>
          Søg
          <i className="fa fa-search" />
        </button>
      </div>
    );

    return (
      <div>
        <LoginHeader
          handleOnClick={() => this.props.history.push("/LoginSide")}
        />
        <h1>Medarbejderliste</h1>

        <h4>
          <Link to="/AddMedarbejder">Tilføj ny medarbejder</Link>
        </h4>
        <br />

        <div className="example">
          {byMenu}
          {searchInput}
        </div>
        {contents}
        <br />
        <Pagination
          currentPage={this.state.page}
          RowsReturned={this.state.RowsReturned}
          handlePageChange={this.handlePageChange}
          rowsPerPage={this.state.rowsPerPage}
        />
      </div>
    );
  }
}

export class MedarbejderData {
  MedarbejderId: number = 0;
  Navn: string = "";
  ByNavn: string = "";
  Afdeling: string = "";
}
