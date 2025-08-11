import axios from 'axios';
import '../style/history.css';
import History from './historyTab';
import React, { useEffect, useState } from 'react';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;


function MakeHistory() {
    // This component displays a single history tab

    const [logs, setLogs] = useState([]);

    useEffect(() => {
        console.log("Making history rn");

        async function fetchLogs() {
            try {
                const response = await axios.get(`${REACT_APP_API_URL}/item/allOppLogs`);
                if (response && response.data && response.data.length > 0) {
                    setLogs(response.data);

                    console.log("From response", response);
                    console.log("From logs set ", logs);
                } else {
                    console.log("No logs found!");
                }
            } catch (error) {
                console.error("Error fetching logs:", error);
            }
        }
        fetchLogs();
        
    }, []);


    return (
        <div className='history'>

            <div className='history'>
                {logs.map((log) => (
                    <History key={log.operation_id} log={log} />
                ))}
            </div>

        </div>
    );

}

export default MakeHistory;