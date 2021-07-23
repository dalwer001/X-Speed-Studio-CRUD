import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const TableListInfo = ({ user }) => {

    const { headers, rows } = user;
    const history = useHistory();
    const [tableHeader, setTableHeader] = useState([]);
    const [hidden, setHidden] = useState([]);
    const [row, setRow] = useState([]);
    const [searchable, setSearchable] = useState([]);
    const [searchValue, setSearchValue] = useState([]);
    const [searchById, setSearchById] = useState([]);
    const [searchByIdStatus, setSearchByIdStatus] = useState(false);
    const [searchByName, setSearchByName] = useState([]);
    const [searchByNameStatus, setSearchByNameStatus] = useState(false);
    const [searchByDate, setSearchByDate] = useState([]);
    const [searchByDateStatus, setSearchByDateStatus] = useState(false);
    const [allDataShowStatus, setAllDataShowStatus] = useState(true);


    useEffect(() => {
        var columnName = Object.values(headers[0])
        setTableHeader(columnName)
    }, [headers])


    //filtering hidden data
    useEffect(() => {
        let hidden = tableHeader.filter(tableHeader => tableHeader.hidden === false)
        setHidden(hidden);
    }, [tableHeader])


    //filtering searchable fields
    useEffect(() => {
        let search = hidden.filter(hidden => hidden.searchable === true)
        setSearchable(search);
    }, [hidden])


    const handleOnClick = (id) => {
        history.push(`/update/${id}`)
    }


    // taking the searching value
    const handleOnBlur = (e) => {
        setSearchValue(e.target.value)
    }


    // For searching 
    const handleSearchClick = (title) => {

        if (title === 'ID') {
            const search = rows.filter(row => row.id == searchValue)
            setSearchById(search)
            setSearchByIdStatus(true)
            setSearchByNameStatus(false)
            setSearchByDateStatus(false)
            setAllDataShowStatus(false)
        }
        if (title === 'Name') {
            const search = rows.filter(row => row.name == searchValue)
            setSearchByName(search)
            setSearchByNameStatus(true)
            setSearchByIdStatus(false)
            setSearchByDateStatus(false)
            setAllDataShowStatus(false)
        }
        if (title === 'Submision Date') {
            const search = rows.filter(row => row.created_at == searchValue)
            setSearchByDate(search)
            setSearchByDateStatus(true)
            setSearchByNameStatus(false)
            setSearchByIdStatus(false)
            setAllDataShowStatus(false)
        }
    }


    //For the searched button
    const handleClickShowAllButton = () => {
        setAllDataShowStatus(true)
        setSearchByDateStatus(false)
        setSearchByNameStatus(false)
        setSearchByIdStatus(false)
    }



    //For reorder dragging 
    const reorder = (row, startIndex, endIndex) => {
        const result = Array.from(row);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }

    const onEnd = (result) => {
        if (!result.destination) return;
        setRow(reorder(row, result.source.index, result.destination.index));
    }



    return (

        <div className="container mt-3">
            {!allDataShowStatus && <button onClick={handleClickShowAllButton} style={{ marginLeft: '91%' }} className="btn btn-outline-success">Show all</button>}
            <br />


            {/* Search fields */}
            {searchable.map(search =>
                <>
                    <input className="ms-5 mb-3" placeholder={search.title} onBlur={handleOnBlur} type="search" name="" id="" />
                    <button onClick={() => handleSearchClick(search.title)} className="btn btn-success mx-2 btn-sm">{search.title}</button>
                </>
            )}


            {allDataShowStatus ?

                <table className="table table-bordered border-secondary">

                    <thead>
                        <tr>
                            {
                                hidden.map(hidden =>
                                    <th scope="col">{hidden.title}</th>
                                )}
                        </tr>
                    </thead>



                    {/* Draggable part */}
                    <DragDropContext onDragEnd={onEnd}>
                        <Droppable droppableId="12345678">
                            {(provided, snapshot) => (
                                <tbody className="table table-bordered border-secondary"
                                    ref={provided.innerRef}
                                >
                                    {
                                        rows.map((row, index) => (
                                            <Draggable
                                                draggableId="{row.id}"
                                                key={row.id}
                                                index={index}
                                            >
                                                {(provided, snapshot) => (
                                                    <tr
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                    >
                                                        <td>
                                                        <button onClick={() => handleOnClick(row.id)} className="btn btn-outline-secondary btn-sm ">
                                                            {row.id}
                                                        </button>
                                                        </td>
                                                        <td>{row.name}</td>
                                                        <td>{row.message}</td>
                                                        <td>{row.created_at}</td>
                                                        <td>{row.extra_junk_field}</td>
                                                    </tr>

                                                )}
                                            </Draggable>
                                        ))}
                                    {provided.placeholder}
                                </tbody>
                            )}
                        </Droppable>
                    </DragDropContext>
                </table>

                : ''}



            {/* Search by Id */}
            {searchByIdStatus && <table className="table table-bordered bordered-secondary">
                <thead>
                    <tr>
                        {
                            tableHeader.map(tableHeader =>
                                <th scope="col">{tableHeader.title}</th>
                            )}
                    </tr>
                </thead>

                {
                    searchById.map(row =>
                        <tbody>
                            <tr>
                                <td>
                                    <button onClick={() => handleOnClick(row.id)} className="btn btn-success btn-sm ">
                                        {row.id}
                                    </button>
                                </td>
                                <td>{row.name}</td>
                                <td>{row.message}</td>
                                <td>{row.created_at}</td>
                                <td>{row.extra_junk_field}</td>
                            </tr>
                        </tbody>
                    )}
            </table>}



            {/* Search By Name */}
            {searchByNameStatus && <table className="table">
                <thead>
                    <tr>
                        {
                            tableHeader.map(tableHeader =>
                                <th scope="col">{tableHeader.title}</th>
                            )}
                    </tr>
                </thead>

                {
                    searchByName.map(row =>
                        <tbody>
                            <tr>
                                <button onClick={() => handleOnClick(row.id)} className="btn btn-info btn-sm m-1">
                                    <td>{row.id}</td>
                                </button>
                                <td>{row.name}</td>
                                <td>{row.message}</td>
                                <td>{row.created_at}</td>
                                <td>{row.extra_junk_field}</td>
                            </tr>
                        </tbody>
                    )}
            </table>}



            {/* Search By Submission Date */}
            {searchByDateStatus && <table className="table">
                <thead>
                    <tr>
                        {
                            tableHeader.map(tableHeader =>
                                <th scope="col">{tableHeader.title}</th>
                            )}
                    </tr>
                </thead>

                {
                    searchByDate.map(row =>
                        <tbody>
                            <tr>
                                <button onClick={() => handleOnClick(row.id)} className="btn btn-info btn-sm m-1">
                                    <td>{row.id}</td>
                                </button>
                                <td>{row.name}</td>
                                <td>{row.message}</td>
                                <td>{row.created_at}</td>
                                <td>{row.extra_junk_field}</td>
                            </tr>
                        </tbody>
                    )}
            </table>}


        </div>
    );
};

export default TableListInfo;