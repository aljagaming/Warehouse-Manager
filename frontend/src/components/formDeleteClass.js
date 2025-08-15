import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/forms.css';

function DeleteClass({ onClose }) {
    const [classId, setClassId] = useState("");
    const [classes, setClasses] = useState([]);

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const res = await axios.get(`${process.env.REACT_APP_API_URL}/class/getAllClassesNames`);
                setClasses(res.data);
            } catch (err) {
                console.error("Error fetching classes:", err);
            }
        };
        fetchClasses();
    }, []);

    const handleDeleteClass = async (e) => {
        e.preventDefault();
        try {
            // Check if the class has items
            const res1 = await axios.post(`${process.env.REACT_APP_API_URL}/class/isEmpty`, {
                class_id: classId,
            });

            if (res1.data.isEmpty) {
                console.log("Deleteing class");

                
                const res2 = await axios.post(`${process.env.REACT_APP_API_URL}/class/delete`, {
                    class_id: classId,
                });

                if (res2.data.success) {
                    console.log("Deleted the class");
                    onClose();
                } else {
                    console.log("Couldn't delete class, failure at 2nd step");
                };
            } else {

                console.log("There are items in this class. Didn't delete it.");
            }

        } catch (error) {
            console.error("Error deleting class:", error);
        }
    };

    return (
        <div className="generalContainer">
            <form className="generalForm" onSubmit={handleDeleteClass}>
                <h2>Delete Class</h2>

                <label htmlFor="className">Class Name:</label>
                <select
                    id="className"
                    className="generalInput"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    required
                >
                    <option value="">-- Select class --</option>
                    {classes.map((cls) => (
                        <option key={cls.class_id} value={cls.class_id}>
                            {cls.class_name}
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

export default DeleteClass;
