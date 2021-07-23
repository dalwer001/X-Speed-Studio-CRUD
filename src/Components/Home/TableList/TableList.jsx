import axios from 'axios';
import React, { useEffect } from 'react';
import { useState } from 'react';
import TableListInfo from './TableListInfo';

const TableList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const dataLoad = async () => {
            const res = await axios.get('/list.php');
            setUsers([res.data.data]);
        }
        dataLoad();
    }, [])


    return (
        <div>
            {
                users.map(user => <TableListInfo user={user} />)
            }
        </div>
    );
};

export default TableList;