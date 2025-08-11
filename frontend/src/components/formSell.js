import React, { useState } from 'react';
import axios from 'axios';
import '../style/forms.css';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

//This component is for employee/manager
//Reprepsents them selling a quantity of certain item (one currently displayed)

function Sell({ user, item_id, class_id, onClose }) {
  const [operationQuantity, setOperationQuantity] = useState('');

  async function doTheSell(e) {
    e.preventDefault(); // Prevent form submit reload

     console.log("Trying to sell: ");

    try {
      const response = await axios.post(`${REACT_APP_API_URL}/item/sell`, {
        item_id: item_id,
        class_id: class_id,
        operation_quantity: operationQuantity,
      }, { withCredentials: true });

      onClose();  // Close the form after success
    } catch (error) {
      console.error("Error in sell", error);
    }
  }

  return (
    <div className="generalContainer">

      <form className="generalForm" onSubmit={doTheSell}>
        <label htmlFor="amountInput">Amount to sell:</label>
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

export default Sell;
