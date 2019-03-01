import * as React from "react";

interface MyComponentProps {
  currentPage: number;
  RowsReturned: number;
  handlePageChange: any;
  rowsPerPage: number;
}
// Dette component skaber page navigation nederst på Fetmedarbejder siden.
export class Pagination extends React.Component<MyComponentProps> {
  constructor(props: MyComponentProps) {
    super(props);
  }
  render() {
    let pageAmount = Math.ceil(
      this.props.RowsReturned / this.props.rowsPerPage
    );
    let arrayPageNumbs: Array<number> = new Array();

    for (let i = 0; i < pageAmount; i++) {
      arrayPageNumbs[i] = i + 1;
    }

    return (
      <nav className="pagination">
        <ul className="pagination pagination-sm">
          {arrayPageNumbs.map(num => (
            <li className="page-item" key={num}>
              <button
                className={
                  num == this.props.currentPage
                    ? "page-link-active"
                    : "page-link"
                }
                key={num}
                onClick={() => this.props.handlePageChange(num)}
              >
                {num}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    );
  }
}
