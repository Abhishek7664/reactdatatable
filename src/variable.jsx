import React from "react";

export let tableHeadArray = [
  { title: "S.No.", serial: true },
  { title: "App Id", field: "app_id", sorting: true },
  { title: "User Id", field: "user_id", sorting: true },
  { title: "Contact Number", field: "mobile", sorting: true },
  {
    title: "Link",
    tdStyle: (obj) => {
      let style = {};
      if (obj.user_id.indexOf("1") !== -1) {
        style = { background: "#ffe047" };
      }
      return style;
    },
    return: (obj) => {
      return (
        <a href={`http://localhost:3100/link/${obj.app_id}`} target="_blank">
          Link
        </a>
      );
    },
  },
  {
    title: "Action",
    return: (obj) => {
      return (
        <>
          <button onClick={() => console.log("edit obj =", obj)}>Edit</button>
          <button onClick={() => console.log("Delete obj ", obj)}>
            Delete
          </button>
        </>
      );
    },
  },
];

export const tableData = (limit = 100) => {
  let dArr = [];
  for (let i = 0; i < limit; i++) {
    dArr.push({
      app_id: Math.floor(Math.random() * 10001),
      user_id: Math.floor(Math.random() * 9999) + "-HKJ",
      mobile:
        Math.floor(Math.random() * (9999999999 - 5000000000 + 1)) + 5000000000,
      trStyle: i%2===1 ? {backgroundColor:"#bbeeff"}:"",
    });
  }
  return dArr;
};
