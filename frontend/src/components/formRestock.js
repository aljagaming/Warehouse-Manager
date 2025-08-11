import React, { useState } from 'react';
import axios from 'axios';
import '../style/forms.css';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

//simillar to sell component except it adds to the amount of item
function Restock({ user, item_id, class_id, onClose }) {
  const [operationQuantity, setOperationQuantity] = useState('');
  

  async function doTheRestock(e) {
    e.preventDefault(); // Prevent form submit reload

    try {
      const response = await axios.post(`${REACT_APP_API_URL}/item/restock`, {
        item_id: item_id,
        class_id: class_id,
        operation_quantity: operationQuantity,
      }, { withCredentials: true });

      console.log("Restock response:", response.data);
      onClose();  // Close the form after success
    } catch (error) {
      console.error("Error in restock", error);
    }
  }

  return (
    <div className="generalContainer">
      <form className="generalForm" onSubmit={doTheRestock}>
        <label htmlFor="amountInput">Amount to restock:</label>
        <input
          id="amountInput"
          type="text"
          className="generalInput"
          value={operationQuantity}
          onChange={(e) => setOperationQuantity(e.target.value)}
          required
        />
        <button type="submit" className="generalSubmitButton">Submit</button>
        <button type="button" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}

export default Restock;