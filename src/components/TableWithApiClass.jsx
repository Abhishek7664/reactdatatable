import React, { Component } from "react";
import { PageSizeComponent } from "./pagesize";
import { PaginationComponent } from "./pagination";

class TableWithApiClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      header: [],
      dataArr: [],
      orgData: [],
      loading: false,
      pagination: true,
      searchShow: true,
      searchVal: "",
      page: 1,
      defaultPageSize: 10,
      showPagination: { bottom: true },
      sort_updown: { field: "", order: "" },
      showPageSize: {
        top: true,
        defaultValue: 10,
        pageSizeArr: [10, 20, 50, 100, 250],
      },
      showTotalRecord: { bottom: true, value: null },
    };
  }
  componentWillReceiveProps(nextProps) {
    if (this.props.dataArr !== nextProps.dataArr) {
      this.setState({
        header: nextProps.header ? nextProps.header : this.state.header,
        dataArr: nextProps.dataArr ? nextProps.dataArr : this.state.dataArr,
        orgData: nextProps.dataArr ? nextProps.dataArr : this.state.orgData,
        loading: nextProps.loading ? nextProps.loading : this.state.loading,
        searchVal: nextProps.searchVal,
        pagination: nextProps.showPagination
          ? nextProps.showPagination
          : this.state.pagination,
        searchShow: nextProps.searchShow
          ? nextProps.searchShow
          : this.state.searchShow,
        showPagination: nextProps.showPagination
          ? nextProps.showPagination
          : this.state.showPagination,
        showPageSize: nextProps.showPageSize
          ? nextProps.showPageSize
          : this.state.showPageSize,
        showTotalRecord: nextProps.showTotalRecord
          ? nextProps.showTotalRecord
          : this.state.showTotalRecord,
      });
    }
  }

  handlePageChange = async (pageno) => {
    this.setState({ page: pageno });
    await this.props.pageChangeCallback(pageno, this.state.defaultPageSize);
    let field = this.state.sort_updown.field;
    this.setState({ sort_updown: { field, order: "" } });
    if (!this.props.filterTableCallback) {
      this.setState({ searchVal: "" });
    }
  };

  handleSorting = (field, order = this.state.sort_updown.order) => {
    if (field !== this.state.sort_updown.field || order === "") {
      order = "up";
    }
    if (this.props.fieldSortingCallback) {
      this.props.fieldSortingCallback(field, order);
    } else {
      let dataArr = this.state.dataArr;
      if (order === "up") {
        dataArr.sort((a, b) => {
          if (a[field] > b[field]) {
            return 1;
          }
          return -1;
        });
      } else {
        dataArr.sort((a, b) => {
          if (a[field] > b[field]) {
            return -1;
          }
          return 1;
        });
      }
      this.setState({ dataArr });
    }
    if (order === "up") {
      this.setState({ sort_updown: { field, order: "down" } });
    } else {
      this.setState({ sort_updown: { field, order: "up" } });
    }
  };
  handleSearchText = (value) => {
    if (this.props.filterTableCallback) {
      this.props.filterTableCallback(value);
    } else {
      if (
        value !== "" &&
        this.state.orgData &&
        this.state.orgData.length > 0 &&
        this.state.header
      ) {
        let sortData = this.state.orgData.filter((el) => {
          let searchString = "";
          this.state.header.forEach((el2) => {
            if (el2 && el2.field) {
              searchString += el && el[el2.field] ? "," + el[el2.field] : "";
            }
          });
          if (searchString.indexOf(value) !== -1) {
            return true;
          }
          return false;
        });
        this.setState({ dataArr: sortData });
      } else {
        this.setState({ dataArr: this.state.orgData });
      }
    }
    this.setState({ searchVal: value });
  };
  handlePageSizeChange = (value) => {
    this.props.pageSizeCallback(value);
    let field = this.state.sort_updown.field;
    this.setState({
      page: 1,
      defaultPageSize: value,
      sort_updown: { field, order: "" },
    });
    if (!this.props.filterTableCallback) {
      this.setState({ searchVal: "" });
    }
  };

  render() {
    let {
      header,
      showPageSize,
      searchShow,
      pagination,
      defaultPageSize,
      showTotalRecord,
      showPagination,
      sort_updown,
      searchVal,
      page,
      dataArr,
      loading,
    } = this.state;

    let totalpage = dataArr
      ? Math.ceil(showTotalRecord.value / defaultPageSize)
      : 0;

    return (
      <div>
        {header && (showPageSize || showPagination || searchShow) && (
          <div className="above_table">
            {showPageSize.top && header && pagination && (
              <PageSizeComponent
                title={showPageSize.title}
                defaultPageSize={defaultPageSize}
                pageSizeArr={showPageSize.pageSizeArr}
                handleSetPageSize={(size) => this.handlePageSizeChange(size)}
              />
            )}

            {searchShow && (
              <div className="search_field">
                <input
                  type="text"
                  id="searchID"
                  value={searchVal}
                  onChange={(e) => this.handleSearchText(e.target.value)}
                  placeholder="Search"
                />
              </div>
            )}

            {showPagination.top && (
              <div className="pagination">
                {header && pagination && (
                  <PaginationComponent
                    activepage={page}
                    totalpage={totalpage}
                    handleChange={(p) => this.handlePageChange(p)}
                    paginationImg={showPagination}
                  />
                )}
              </div>
            )}

            {showTotalRecord && showTotalRecord.top && showTotalRecord.value && (
              <div className="total_record">
                {showTotalRecord && showTotalRecord.title
                  ? showTotalRecord.title
                  : "Total Records: "}
                {showTotalRecord.value}
              </div>
            )}
          </div>
        )}

        <table>
          <thead>
            <tr>
              {header &&
                header.map((el, key) => {
                  let action_field = el.field ? el.field : "field_" + key;
                  let sortclass = "sorting";
                  sortclass = el.sorting ? "sorting" : "";
                  sortclass =
                    sort_updown.order === ""
                      ? sortclass
                      : sort_updown.field === action_field
                      ? sort_updown.order === "up"
                        ? "sort-down"
                        : "sort-up"
                      : sortclass;
                  // sortclass = el.return ? "" : sortclass;
                  sortclass = el.serial ? "" : sortclass;

                  return (
                    <th
                      key={key}
                      className={sortclass}
                      onClick={() => {
                        if (sortclass !== "") {
                          this.handleSorting(action_field);
                        }
                      }}
                    >
                      {el.title}
                    </th>
                  );
                })}
            </tr>
          </thead>
          <tbody>
            {!loading && dataArr ? (
              dataArr.length > 0 ? (
                dataArr.map((el, key) => {
                  return (
                    <tr key={key} style={el.trStyle ? el.trStyle : {}}>
                      {header &&
                        header.map((el2, key2) => {
                          if (el2.serial) {
                            return (
                              <td
                                key={key2}
                                style={el2.tdStyle ? el2.tdStyle(el) : {}}
                              >
                                {key + 1}
                              </td>
                            );
                          }
                          if (el2.return) {
                            return (
                              <td
                                key={key2}
                                style={el2.tdStyle ? el2.tdStyle(el) : {}}
                              >
                                {el2.return(el)}
                              </td>
                            );
                          }
                          return (
                            <td
                              key={key2}
                              style={el2.tdStyle ? el2.tdStyle(el) : {}}
                            >
                              {el[el2.field] || el[el2.field] === 0
                                ? el[el2.field]
                                : ""}
                            </td>
                          );
                        })}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={header ? header.length : 10}
                    className="text-center"
                  >
                    {loading ? (
                      <div>
                        <i
                          className="fa fa-spinner fa-pulse"
                          aria-hidden="true"
                        ></i>{" "}
                        Loading...
                      </div>
                    ) : (
                      "No records found"
                    )}
                  </td>
                </tr>
              )
            ) : (
              ""
            )}
          </tbody>
        </table>

        {header && (showPageSize || showPagination) && (
          <div className="below_table">
            {showPageSize.bottom && header && pagination && (
              <PageSizeComponent
                title={showPageSize.title}
                defaultPageSize={defaultPageSize}
                pageSizeArr={showPageSize.pageSizeArr}
                handleSetPageSize={(size) => this.handlePageSizeChange(size)}
              />
            )}

            {showPagination.bottom && (
              <div className="pagination">
                {header && pagination && showTotalRecord.value && (
                  <PaginationComponent
                    activepage={page}
                    totalpage={totalpage}
                    handleChange={(p) => this.handlePageChange(p)}
                    paginationImg={showPagination}
                  />
                )}
              </div>
            )}

            {showTotalRecord &&
              showTotalRecord.bottom &&
              showTotalRecord.value && (
                <div className="total_record">
                  {showTotalRecord && showTotalRecord.title
                    ? showTotalRecord.title
                    : "Total Records: "}
                  {showTotalRecord.value}
                </div>
              )}
          </div>
        )}
      </div>
    );
  }
}

export default TableWithApiClass;
