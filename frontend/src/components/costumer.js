import React, { useState, useEffect } from 'react';
import "../style/costumer.css";
import ItemDisplay from './itemDisplay';
import ClassButton from './classDisplay'; //for displaying what CLasses are there 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;


function Costumer() {
    // This component is for the customer view, displaying Items.


    const location = useLocation();
    const user = location.state?.user;

    const [classes, setClasses] = useState([]);
    const [items, setItems] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState(null);
    const [selectedNameLike, setSelectedNameLike] = useState(null);
    const [searchInput, setSearchInput] = useState("");

    const navigate = useNavigate();


    //Get and make classes 
    useEffect(() => {
        async function fetchClasses() {
            try {
                const response = await axios.get(`${REACT_APP_API_URL}/class/getAllClassesNames`,
                    { withCredentials: true, }
                );

                console.log("Axios response:", response);
                console.log("Axios response data:", response.data);

                if (response.status === 200) {
                    setClasses(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch classes", error);
            }
        }
        fetchClasses();
    }, []);

    console.log("Classes:", classes);

    function handleClassClick(selectedClass) {
        console.log("Clicked:", selectedClass.class_name, selectedClass.class_id);

        setSelectedClassId(selectedClass.class_id);
    }


    //Get and make items 
    useEffect(() => {
        async function fetchItems() {
            try {
                console.log("Selected Class ID:", selectedClassId);
                console.log("Selected Name Like:", selectedNameLike);
                const response = await axios.post(`${REACT_APP_API_URL}/location/getAllItemsInLocation`,
                    {
                        class_id: selectedClassId,
                        nameLike: selectedNameLike
                    },
                    { withCredentials: true }
                );
                console.log("Axios response ITEMS:", response);



                if (response.status === 200) {
                    setItems(response.data);
                }
            } catch (error) {
                console.error("Failed to fetch items", error);
            }
        }
        fetchItems();
    }, [selectedClassId, selectedNameLike]);// Fetch items when class or nameLike changes



    function handleSearch(e) {
        //e.preventDefault();
        const trimmed = searchInput.trim();
        setSelectedNameLike(trimmed === "" ? null : trimmed);
    }

    function resestSeacrh(e) {
        setSelectedNameLike(null);
    }

    async function handleLogOut(e) {
        try {
            const response = await axios.get(`${REACT_APP_API_URL}/user/logout`, { withCredentials: true });
            if (response.data.success === true) {
                navigate('/'); // To login page
            } else {
                console.error("Logout failed");
            }
        } catch (error) {
            console.error("Error during logout:", error);
        }
    }


    // Render the Item component
    function handleItemClick(item, user) {
        navigate('/item-detail', { state: { item, user } });
    };


    return (
        <div className="costumer">
            <h1 className="costumerHeader">Store A</h1>

            <div className="searchBar">
                <input className="search-input" type="text" placeholder="Search..."
                    
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                        handleSearch(e);
                    }}

                    onBlur={resestSeacrh} />

                <button className="logOutButton" onClick={(e) => handleLogOut(e)}>Logout</button>
            </div>

            <div className="displayClasses">

                {classes.map((cls) => (
                    <ClassButton key={cls.class_id} cls={cls} isSelected={cls.class_id === selectedClassId} onClick={handleClassClick} />
                ))}

                <ClassButton key="all" cls={{ class_name: "All", class_id: null }} isSelected={selectedClassId === null} onClick={handleClassClick} />

            </div>

            <div className="display">

                {items.map((item) => (
                    <ItemDisplay //pass the item 
                        key={item.item_id}
                        item={item}
                        onClick={() => handleItemClick(item, user)}
                    />

                ))}
                
            </div>
        </div>
    );
}

export default Costumer;