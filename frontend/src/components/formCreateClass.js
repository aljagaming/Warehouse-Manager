import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/forms.css';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

function CreateClass({ onClose }) {
    const [locations, setLocations] = useState([]);
    const [className, setClassName] = useState('');
    const [classPos, setClassPos] = useState('');
    const [classLoc, setClassLoc] = useState('');

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const res = await axios.get(`${REACT_APP_API_URL}/location/all`);
                setLocations(res.data); 
            } catch (err) {
                console.error("Error fetching locations:", err);
            }
        };
        fetchLocations();
    }, []);

    async function handleCreateClass(e) {
        e.preventDefault();
        try {
            const res = await axios.post(`${REACT_APP_API_URL}/class/create`, {
                class_name: className,
                class_position: classPos,
                location_id: classLoc
            }, { withCredentials: true });

            if (res.data.success) {
                console.log("Class created!");
                onClose();
            } else {
                console.log("Error creating class");
            }
        } catch (err) {
            console.error("Error creating class:", err);
        }
    }



    return (
        <div className="generalContainer">
            <form className="generalForm" onSubmit={handleCreateClass}>
                <h2>Create Class</h2>

                <label htmlFor="className">Class Name:</label>
                <input
                    id="className"
                    type="text"
                    className="generalInput"
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    required
                />

                <label htmlFor="classPos">Class Position:</label>
                <input
                    id="classPos"
                    type="text"
                    className="generalInput"
                    value={classPos}
                    onChange={(e) => setClassPos(e.target.value)}
                    required
                />

                <label htmlFor="classLocation">Class Location:</label>
                <select
                    id="classLocation"
                    className="generalInput"
                    value={classLoc}
                    onChange={(e) => setClassLoc(e.target.value)}
                    required
                >
                    <option value="">-- Select location --</option>
                    {locations.map((loc) => (
                        <option key={loc.location_id} value={loc.location_id}>
                            {loc.location_name}
                        </option>
                    ))}
                </select>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button type="submit" className="generalSubmitButton">
                        Submit
                    </button>
                    <button type="button" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default CreateClass;
