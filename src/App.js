import React from 'react';
import './datatable.corestyle.css';
import { TableComponent } from './components/table';
import { tableHeadArray, tableData } from './variable';

function App() {
  let dataArr = tableData(100);
  let tableHead = tableHeadArray;

  return (
    <div>
      <TableComponent
        header={tableHead}
        dataArr={dataArr}
        showTotalRecord={{
          title: "Total Records:: ",
          top: false, bottom: true
        }}
        showPageSize={{
          title: "Page Size:: ",
          defaultValue: 10,
          pageSizeArr: [10, 20, 50, 100, 250],
          top: true, bottom: true
        }}
        showPagination={{
          top: true, bottom: true,
          doubleLeftImg: "", leftImg: "",
          rightImg: "", doubleRightImg: "",
          dleft_tooltip: "first page",
          left_tooltip: "prev. page",
          right_tooltip: "next page",
          dright_tooltip: "last page"
        }}
      />
    </div>
  );
}

export default App;
