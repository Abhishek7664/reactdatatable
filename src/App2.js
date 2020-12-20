import React, { useEffect, useState } from 'react';
// import { TableWithApi } from './components/TableWithApi';
import TableWithApiClass from './components/TableWithApiClass';
import './datatable.corestyle.css';

const App2 = () => {
    const [searchField, setSearchField] = useState("");
    const [state, setState] = useState({
        data: null,
        orgData: null,
        count: 0,
        loading: true,
        error: false,
        message: "",
        limit: 10,
        offset: 0
    });
    const fetchMyAPI = async (limit = state.limit, offset = state.offset) => {
        let urlobj = { url: `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}` }
        setState({ ...state, data: state.data, loading: true });
        await fetch(urlobj.url)
            .then((res) => res.json())
            // ...then we update the users state
            .then((data) => {
                if (data["count"]) {
                    setState({ ...state, data: data.results, orgData: data.results, count: data.count, loading: false, error: false });
                } else {
                    setState({
                        ...state, 
                        data: data,
                        loading: false,
                        error: true,
                        message: data.message ? data.message : "",
                    });
                }
            });
    }
    const fetchMySearchAPI = async (searchText) => {
        let urlobj = { url: `https://pokeapi.co/api/v2/pokemon?limit=${state.limit}&offset=${state.offset}` }
        setState({ ...state, data: state.data, loading: true });
        await fetch(urlobj.url)
            .then((res) => res.json())
            // ...then we update the users state
            .then((data) => {
                if (data["count"]) {
                    let sortData = data.results.filter(el => {
                        let searchString = el && el.name ? el.name : "";
                        searchString += el && el.url ? "," + el.url : "";
                        if (searchString.indexOf(searchText) !== -1) {
                            return true;
                        }
                        return false;
                    });
                    setState({ ...state, data: sortData, count: data.count, loading: false, error: false });
                } else {
                    setState({
                        ...state,
                        data: data,
                        loading: false,
                        error: true,
                        message: data.message ? data.message : "",
                    });
                }
            });
    }
    useEffect(() => {
        fetchMyAPI();
    }, []);

    const pageChangeCallback = (page, limit) => {
        let offset = limit * (page - 1);
        let stateData = state;
        stateData.limit = limit;
        stateData.offset = offset;
        setState(stateData);
        fetchMyAPI(limit, offset);
    }
    const filterTableCallback = (searchText) => {
        fetchMySearchAPI(searchText);
        setSearchField(searchText);
    }
    const pageSizeCallback = (value) => {
        let limit = value;
        let stateData = state;
        stateData.limit = limit;
        setState(stateData);
        fetchMyAPI(limit, 0);
    }
    const fieldSortingCallback = (field, order) => {
        let SortData = state;
        if (order === "up") {
            SortData.data.sort((a, b) => {
                if (a[field] > b[field]) {
                    return 1;
                }
                return -1;
            });
        } else {
            SortData.data.sort((a, b) => {
                if (a[field] > b[field]) {
                    return -1;
                }
                return 1;
            });
        }
        setState(SortData);
    }

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
                return <a href={`${obj.url}`} target="_blank">{obj.url}</a>;
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
                dataArr={state.data}
                loading={state.loading}
                searchVal={searchField}
                pageChangeCallback={pageChangeCallback}
                fieldSortingCallback={fieldSortingCallback}
                filterTableCallback={filterTableCallback}
                pageSizeCallback={pageSizeCallback}
                // showPageSize={{
                //     title: "Page Size:: ",
                //     defaultValue: state.limit,
                //     pageSizeArr: [10, 20, 50, 100, 250],
                //     top: true, bottom: true
                // }}
                // showPagination={{
                //     top: true, bottom: true,
                //     doubleLeftImg: "", leftImg: "",
                //     rightImg: "", doubleRightImg: "",
                //     dleft_tooltip: "first page",
                //     left_tooltip: "prev. page",
                //     right_tooltip: "next page",
                //     dright_tooltip: "last page"
                // }}
                showTotalRecord={{ top: true, bottom: true, value: state.count }}
            />}
        </div>
    );
}

export default App2;
