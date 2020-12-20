import React, { Component } from 'react';
import TableWithApiClass from './components/TableWithApiClass';
import './datatable.corestyle.css';

class App3 extends Component {
    state = {
        data: null,
        orgData: null,
        count: 0,
        loading: false,
        error: false,
        message: "",
        limit: 10,
        offset: 0,
        searchField: ""
    }
    componentDidMount() {
        this.fetchMyAPI();
    }

    fetchMyAPI = async (limit = this.state.limit, offset = this.state.offset) => {
        this.setState({ loading: true });
        let urlobj = { url: `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}` }
        await fetch(urlobj.url)
            .then((res) => res.json())
            .then((data) => {
                if (data["count"]) {
                    this.setState({ data: data.results, orgData: data.results, count: data.count, loading: false, error: false });
                } else {
                    this.setState({ loading: false, error: true, message: data.message ? data.message : "" });
                }
            });
    }

    pageChangeCallback = (page, limit) => {
        let offset = limit * (page - 1);
        this.setState({ limit, offset });
        this.fetchMyAPI(limit, offset);
    }
    filterTableCallback = (searchText) => {
        let sortData = this.state.orgData.filter(el => {
            let searchString = el && el.name ? el.name : "";
            searchString += el && el.url ? "," + el.url : "";
            if (searchString.indexOf(searchText) !== -1) {
                return true;
            }
            return false;
        });
        this.setState({ searchField: searchText, data: sortData });
    }
    pageSizeCallback = (value) => {
        let limit = value;
        this.setState({ limit });
        this.fetchMyAPI(limit, 0);
    }
    fieldSortingCallback = (field, order) => {
        let SortData = this.state.orgData;
        if (order === "up") {
            SortData.sort((a, b) => {
                if (a[field] > b[field]) {
                    return 1;
                }
                return -1;
            });
        } else {
            SortData.sort((a, b) => {
                if (a[field] > b[field]) {
                    return -1;
                }
                return 1;
            });
        }
        this.setState({ data: SortData });
    }

    render() {

        let tableHeadArray = [
            { title: "S.no.", serial: true },
            { title: "Name", field: "name", sorting: true },
            {
                title: "Url",
                field: "url",
                sorting: true,
                tdStyle: (obj) => {
                    let style = {};
                    if (obj.url.indexOf("1") !== -1) {
                        style = { background: "#ffe047" };
                    }
                    return style;
                },
                return: (obj) => {
                    return <a href={`${obj.url}`} target="_blank" rel="noopener noreferrer">{obj.url}</a>;
                },
            },
            {
                title: "Action",
                return: (obj) => {
                    return (
                        <>
                            <button
                                onClick={() => console.log("edit obj =", obj)}
                            >
                                Edit
                        </button>
                            <button onClick={() => console.log("Delete obj ", obj)}>
                                Delete
                        </button>
                        </>
                    );
                },
            },
        ];

        return (
            <div>
                {<TableWithApiClass
                    header={tableHeadArray}
                    dataArr={this.state.data}
                    loading={this.state.loading}
                    searchVal={this.state.searchField}
                    pageChangeCallback={this.pageChangeCallback}
                    fieldSortingCallback={this.fieldSortingCallback}
                    filterTableCallback={this.filterTableCallback}
                    pageSizeCallback={this.pageSizeCallback}
                    showPageSize={{
                        title: "पृष्ठ संख्या: ",
                        defaultValue: this.state.limit,
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
                    showTotalRecord={{ top: true, bottom: true, value: this.state.count }}
                />}
            </div>
        );
    }
}

export default App3;