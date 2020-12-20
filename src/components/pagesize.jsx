import React from "react";

export const PageSizeComponent = ({
  title,
  defaultPageSize,
  handleSetPageSize,
  pageSizeArr = [],
}) => {
  return (
    <div className="page_size">
      {title ? title : "Page Size "}
      {pageSizeArr.indexOf(parseInt(defaultPageSize)) === -1 ? (
        defaultPageSize
      ) : (
        <select
          name="table_page_size"
          defaultValue={defaultPageSize}
          onChange={(e) =>
            handleSetPageSize ? handleSetPageSize(e.target.value) : ""
          }
        >
          {pageSizeArr.map((val, key) => {
            let selected = "";
            defaultPageSize =
              typeof defaultPageSize === "string"
                ? parseInt(defaultPageSize)
                : defaultPageSize;
            if (val === defaultPageSize) {
              selected = "selected";
            }
            return (
              <option value={val} key={key} selected={selected}>
                {val}
              </option>
            );
          })}
        </select>
      )}
    </div>
  );
};
