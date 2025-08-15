import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sell from './formSell.js';
import Restock from './formRestock.js';
import Create from './formCreate.js';
import CreateClass from './formCreateClass.js';
import DeleteClass from './formDeleteClass.js';
import '../style/costumer.css';
import axios from 'axios';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

// single Item full page - all details
function ItemDetail() {

    const [showSellForm, setShowSellForm] = useState(false);
    const [showRestockForm, setShowRestockForm] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showCreateClassForm, setShowCreateClassForm] = useState(false);
    const [showDeleteClassForm, setShowDeleteClassForm] = useState(false);

    const location = useLocation();
    const item = location.state?.item;
    const user = location.state?.user;


    //console.log("Item detail ", item);
    //console.log("User detai ", user);


    const employeeDetails = user.user_role === 'manager' || user.user_role === 'employee';


    function handleCreateItem() {
        setShowCreateForm(true);
    }

    async function handleDeleteItem() {

        try {
            const response = await axios.post(`${REACT_APP_API_URL}/item/delete`, {
                item_id: item.item_id,
            }, { withCredentials: true });

            
            console.log(response.data.success);


            if (response.data.success) {
                window.history.back();
                console.log("Deleted item!");
            } else {
                console.log("Could not delete item!");
            }
        } catch (error) {
            console.error("Error deleting item:", error);
        }
    }

    async function handleCreateClass(){
        setShowCreateClassForm(true);
    }

    function handleDeleteClass(){
       setShowDeleteClassForm(true);
    }

    function handleSell() {
        setShowSellForm(true);
    }

    function handleRestock() {
        setShowRestockForm(true);
    }


    return (
        <div className="itemDetailPage">
            <div className='itemDetailImageContainer'>

                <div className="itemDetailImageContainerBorder">
                    <img src={`${REACT_APP_API_URL}/uploads/${item.item_picture}`} alt={item.item_name} />
                </div>

                {(user.user_role === 'manager') && ( //manager can see all the functionalities, not all of them are immplemented

                    <div className='employeeMenue'>
                        <button className="employeeMenuButton" onClick={handleCreateItem}>Create New Item</button>
                        <button className="employeeMenuButton" onClick={handleDeleteItem}>Delete Item</button>
                        <button className="employeeMenuButton" onClick={handleCreateClass}>Create New Class</button>
                        <button className="employeeMenuButton" onClick={handleDeleteClass}>Delete Class</button>
                        <button className="employeeMenuButton" onClick={handleSell}>Sell</button>
                        <button className="employeeMenuButton" onClick={handleRestock}>Restock</button>
                        <button className="employeeMenuButton">Move </button>
                    </div>

                )}

                {showCreateForm && //create Form if conditional rendering true
                    <Create onClose={() => setShowCreateForm(false)} />
                }

                {showCreateClassForm && //create Form if conditional rendering true
                    <CreateClass onClose={() => setShowCreateClassForm(false)} />
                }

                {showDeleteClassForm && 
                    <DeleteClass onClose={() => setShowDeleteClassForm(false)} />
                }


                {showSellForm && ( //sell Form if conditional rendering true
                    <Sell
                        user={user}
                        item_id={item.item_id}
                        class_id={item.class_id}  // <-- pass class_id here
                        onClose={() => setShowSellForm(false)}
                    />
                )}

                {showRestockForm && ( //Restock Form if conditional rendering true
                    <Restock
                        user={user}
                        item_id={item.item_id}
                        class_id={item.class_id}
                        onClose={() => setShowRestockForm(false)}
                    />
                )}


                {(user.user_role === 'employee') && (//employee can see some features, more then costumer less then manager

                    <div className='employeeMenue'>
                        <button className="employeeMenuButton" onClick={handleSell}>Sell</button>
                        <button className="employeeMenuButton" onClick={handleRestock}>Restock</button>
                        <button className="employeeMenuButton">Move </button>
                    </div>

                )}

            </div>

            <div className='itemDetailInfoContainer'>



                <h1 className='itemDetailHeader'>{item.item_name}</h1>
                <p className='itemDetailPrice'>{item.item_price}</p>


                {employeeDetails && ( // Check if user is manager or employee
                    <>
                        <p className='itemDetailArticleNumber'>{item.item_article_number}</p>
                        <p className='itemDetailBarcode'>{item.item_barcode}</p>
                    </>
                )}

                <p className='itemDetailDesc'>{item.item_description}</p>
                <p className='itemDetailDimensions'>{item.item_dimensions}</p>
                <p className='itemDetailClass'>{item.class_name}</p>

                {employeeDetails && (
                    <>
                        <p className='itemDetailPosition'>{item.class_position}</p>
                    </>
                )}

                <p className='itemDetailAvailable'>{item.item_quantity}</p>

                <button className='goBackButton' onClick={() => window.history.back()}>Go back</button>

            </div>
        </div>
    );

}
export default ItemDetail;