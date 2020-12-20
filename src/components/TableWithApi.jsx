import React, { useState } from "react";
import { PaginationComponent } from "./pagination";
import { PageSizeComponent } from "./pagesize";

export const TableWithApi = ({
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
  showTotalRecord = { bottom: true, value: null },
  pageChangeCallback = () => {},
  filterTableCallback = () => {},
  pageSizeCallback = () => {},
  fieldSortingCallback = () => {},
}) => {
  showPageSize.defaultValue = showPageSize.defaultValue
    ? showPageSize.defaultValue
    : 10;

  const [page, setPage] = useState(1);
  const [defaultPageSize, setDefaultPageSize] = useState(
    showPageSize.defaultValue
  );
  const [sort_updown, setSortUpDown] = useState({ field: "", order: "" });
  const [searchVal, setSearchValue] = useState(defaultSearch);

  const handlePageChange = (pageno) => {
    setPage(pageno);
    pageChangeCallback(pageno, defaultPageSize);
  };
  let totalpage = dataArr
    ? Math.ceil(showTotalRecord.value / defaultPageSize)
    : 0;

  const handleSorting = (field, order = sort_updown.order) => {
    if (field !== sort_updown.field || order === "") {
      order = "up";
    }
    fieldSortingCallback(field, order);
    if (order === "up") {
      setSortUpDown({ field, order: "down" });
    } else {
      setSortUpDown({ field, order: "up" });
    }
  };

  const handleSearchText = (value) => {
    filterTableCallback(value);
    setSearchValue(value);
  };
  const handlePageSizeChange = (value) => {
    pageSizeCallback(value);
    setDefaultPageSize(value);
  };

  return (
    <div>
      {header && (showPageSize || showPagination || searchShow) && (
        <div className="above_table">
          {showPageSize.top && header && pagination && (
            <PageSizeComponent
              title={showPageSize.title}
              defaultPageSize={defaultPageSize}
              pageSizeArr={showPageSize.pageSizeArr}
              handleSetPageSize={(size) => handlePageSizeChange(size)}
            />
          )}

          {searchShow && (
            <div className="search_field">
              <input
                type="text"
                id="searchID"
                value={searchVal}
                onChange={(e) => handleSearchText(e.target.value)}
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
                        handleSorting(action_field);
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
          {dataArr ? (
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
              handleSetPageSize={(size) => handlePageSizeChange(size)}
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

          {showTotalRecord && showTotalRecord.bottom && showTotalRecord.value && (
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
};
