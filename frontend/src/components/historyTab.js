import React from 'react';
import '../style/history.css';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;


//this component creates one tab of the history 
function History({ log }) {

    return (
        <div className='historyOneTab'>

            <div className='historyImageContainer'>
                <img src={`${REACT_APP_API_URL}/uploads/${log.item_picture}`} alt={log.item_name} />
            </div>

            <div className='historyNotImageContainer'>

                <h1 className='historyTabHeader'>{log.operation_type}</h1>

                <div className='historyData'>
                    <div className='hitroyUserAndItemDetails'>
                        <p>{log.item_name}</p>
                        <p>{log.user_name} </p>
                        <p>{log.operation_date}</p>
                    </div >

                    <div className='historyOppDetails'>
                        <p>{log.old_class_name}</p>
                        <p>{log.new_class_name}</p>
                        <p>{log.operation_quantity}</p>

                    </div>
                </div>
            </div>
        </div>

    );
}


export default History;