import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../style/employee.css';
const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

//employee/manager landing page
//includes search bar for article number vs ean 
function Employee() {

    const location = useLocation();
    const navigate = useNavigate();
    const [searchInput, setSearchInput] = useState("");

    let user = location.state?.user;


    function getHistory() {
        navigate('/make-history', {});
    }

    async function handleSearch(e) {
        e.preventDefault();

        const response = await axios.get(`${REACT_APP_API_URL}/item/getItemArtEan`, {
            params: { number: searchInput }
        });

        if (response.data) {
            //console.log("Item found:", response.data);
            navigate('/item-detail', { state: { item: response.data, user } });

        } else {
            console.log("No item found with the given EAN/Article Number.");
        }
    }

    // Perform search logic here, e.g., make an API call
    return (
        <div className='employee'>
            <h1 className='employeeHeader'>{user.user_role}  {user.user_name}</h1>

            <div className="employeeSearchBar">
                <input className="employeeSearch-input" type="text" placeholder="Search Item by EAN/Article Number..."

                    onChange={e => setSearchInput(e.target.value)}
                
                />

                <button className="employeeSearchButton" onClick={handleSearch} type="submit">Search</button>

            </div>

            <button className="employeeHistoryButton" onClick={getHistory}>View History</button>

        </div>
    )
}

export default Employee;