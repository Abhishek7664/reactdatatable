import React, { useState, useEffect } from "react";
import { PaginationComponent } from "./pagination";
import { PageSizeComponent } from "./pagesize";

export const TableComponent = ({
  header,
  dataArr = [],
  loading = false,
  pagination = true,
  searchShow = true,
  showPagination = { bottom: true },
  defaultSearch = "",
  showPageSize = {
    top: true,
    defaultValue: 10,
    pageSizeArr: [10, 20, 50, 100, 250],
  },
  showTotalRecord = { bottom: true },
}) => {
  showPageSize.defaultValue = showPageSize.defaultValue
    ? showPageSize.defaultValue
    : 10;
  const [orgDataArr, setOrgDataArr] = useState(dataArr ? dataArr : []);
  const [dataPageArr, setDataPageArr] = useState([]);
  const [page, setPage] = useState(1);
  const [loadingPage, setLoadingPage] = useState(loading);
  const [defaultPageSize, setDefaultPageSize] = useState(
    showPageSize.defaultValue
  );
  const [sort_updown, setSortUpDown] = useState({ field: "", order: "" });
  const [searchVal, setSearchValue] = useState(defaultSearch);

  const handlePageChange = (pageno, tabledataArr = orgDataArr) => {
    setLoadingPage(true);
    setPage(pageno);
    let newArr = [];
    let start = pageno * defaultPageSize - defaultPageSize * 1;
    let end = pageno * defaultPageSize;
    if (tabledataArr && tabledataArr.length > 0) {
      for (let i = start; i < end; i++) {
        const el = tabledataArr[i];
        if (el) {
          newArr.push(el);
        }
      }
      setDataPageArr(newArr);
    } else {
      setDataPageArr([]);
    }
    setLoadingPage(false);
  };
  let totalpage = orgDataArr
    ? Math.ceil(orgDataArr.length / defaultPageSize)
    : 0;

  const handleSorting = (field, order = sort_updown.order) => {
    let dArr = [];
    if (field !== sort_updown.field || order === "") {
      order = "up";
    }
    if (order === "up") {
      dArr = orgDataArr.sort((a, b) => {
        if (a[field] > b[field]) {
          return 1;
        }
        return -1;
      });
      setSortUpDown({ field, order: "down" });
    } else {
      dArr = orgDataArr.sort((a, b) => {
        if (a[field] > b[field]) {
          return -1;
        }
        return 1;
      });
      setSortUpDown({ field, order: "up" });
    }
    handlePageChange(page, dArr);
  };

  const handleSearch = (val, tabledataArr = dataArr) => {
    setSearchValue(val);
    if (tabledataArr && tabledataArr.length > 0) {
      let newArr = tabledataArr.filter((el, key) => {
        let searchRowStr = "";
        if (el) {
          Object.values(el).forEach((record) => {
            searchRowStr += record + ", ";
          });
          if (
            searchRowStr !== "" &&
            searchRowStr.toLowerCase().indexOf(val) !== -1
          ) {
            return true;
          }
        }
        return false;
      });
      setOrgDataArr(newArr);
      handlePageChange(1, newArr);
    }
  };

  useEffect(() => {
    handlePageChange(page);
  }, [orgDataArr, defaultPageSize]);

  return (
    <div>
      {header && (showPageSize || showPagination || searchShow) && (
        <div className="above_table">
          {showPageSize.top && header && pagination && (
            <PageSizeComponent
              title={showPageSize.title}
              defaultPageSize={defaultPageSize}
              pageSizeArr={showPageSize.pageSizeArr}
              handleSetPageSize={(size) => setDefaultPageSize(size)}
            />
          )}

          {searchShow && (
            <div className="search_field">
              <input
                type="text"
                id="searchID"
                value={searchVal}
                onChange={(e) => handleSearch(e.target.value)}
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
                  handleChange={(p) => handlePageChange(p)}
                  paginationImg={showPagination}
                />
              )}
            </div>
          )}

          {showTotalRecord && showTotalRecord.top && orgDataArr.length && (
            <div className="total_record">
              {showTotalRecord && showTotalRecord.title
                ? showTotalRecord.title
                : "Total Records: "}
              {orgDataArr.length}
            </div>
          )}
        </div>
      )}

      <table>
        <thead>
          <tr>
            {header &&
              header.map((el, key) => {
                let field_val = el.field ? el.field : "field_" + key;
                let sortclass = "sorting";
                sortclass = el.sorting ? "sorting" : "";
                sortclass = el.serial ? "" : sortclass;
                sortclass =
                  sort_updown.order === ""
                    ? sortclass
                    : sort_updown.field === field_val
                    ? sort_updown.order === "up"
                      ? "sort-down"
                      : "sort-up"
                    : sortclass;
                // sortclass = el.return ? "" : sortclass;

                return (
                  <th
                    key={key}
                    className={sortclass}
                    onClick={() => {
                      if (sortclass !== "") {
                        handleSorting(field_val);
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
          {dataPageArr ? (
            dataPageArr.length > 0 ? (
              dataPageArr.map((el, key) => {
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
                  {loadingPage ? (
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
              handleSetPageSize={(size) => setDefaultPageSize(size)}
            />
          )}

          {showPagination.bottom && (
            <div className="pagination">
              {header && pagination && (
                <PaginationComponent
                  activepage={page}
                  totalpage={totalpage}
                  handleChange={(p) => handlePageChange(p)}
                  paginationImg={showPagination}
                />
              )}
            </div>
          )}

          {showTotalRecord && showTotalRecord.bottom && orgDataArr.length && (
            <div className="total_record">
              {showTotalRecord && showTotalRecord.title
                ? showTotalRecord.title
                : "Total Records: "}
              {orgDataArr.length}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
