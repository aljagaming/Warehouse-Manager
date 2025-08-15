import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../style/forms.css';

const REACT_APP_API_URL = process.env.REACT_APP_API_URL;

//form upon which completion api is called to create new Item
//example of manager functionallity 
function Create({ onClose }) {

  const [itemName, setItemName] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [itemArticleNumber, setItemArticleNumber] = useState('');
  const [itemBarcode, setItemBarcode] = useState('');

  const [itemPrice, setItemPrice] = useState('');
  const [itemPicture, setItemPicture] = useState(null);

  const [itemDimensions, setItemDimensions] = useState('');
  const [itemQuantity, setItemQuantity] = useState('');
  const [inventoryAlertPoint, setInventoryAlertPoint] = useState('');

  const [classId, setClassId] = useState("");
  const [classes, setClasses] = useState([]);

  useEffect(() => {
    
    const fetchClasses = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/class/getAllClassesNames`);
        const data = await res.json(); 
        setClasses(data); 
      } catch (err) {
        console.error("Error fetching classes:", err);
      }
    };
    fetchClasses();
  }, []);


  async function handleCreate(e) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append('item_article_number', itemArticleNumber);
      formData.append('item_barcode', itemBarcode);
      formData.append('item_name', itemName);
      formData.append('item_description', itemDescription);
      if (itemPicture) {
        formData.append('item_picture', itemPicture);
      }
      formData.append('item_price', itemPrice);
      formData.append('item_dimensions', itemDimensions);
      formData.append('item_quantity', itemQuantity);
      formData.append('inventory_alert_point', inventoryAlertPoint);
      formData.append('class_id', classId);

      console.log("-----------------------------------------------------------------------")
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(
        `${REACT_APP_API_URL}/item/create`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      console.log('Create item response:', response.data);
      onClose();
    } catch (error) {
      console.error('Error creating item:', error);
    }
  }

  return (
    <div className="generalContainer">
      <form className="generalForm" onSubmit={handleCreate}>
        <h2>Create Item</h2>


        <label htmlFor="name" >Name:</label>
        <input
          id="name"
          type="text"
          className="generalInput"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          required
        />

        <label htmlFor="articleNumber">Article Number:</label>
        <input
          id="articleNumber"
          type="text"
          className="generalInput"
          value={itemArticleNumber}
          onChange={(e) => setItemArticleNumber(e.target.value)}
          required
        />

        <label htmlFor="barcode">Barcode:</label>
        <input
          id="barcode"
          type="text"
          className="generalInput"
          value={itemBarcode}
          onChange={(e) => setItemBarcode(e.target.value)}
          required
        />


        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          className="generalInput"
          style={{ height: '80px', resize: 'vertical' }}
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          required
        />

        <label htmlFor="picture">Picture:</label>
        <input
          id="picture"
          type="file"
          className="generalInput"
          onChange={(e) => setItemPicture(e.target.files[0])}
          accept="image/*"
        />

        <label htmlFor="price">Price:</label>
        <input
          id="price"
          type="number"
          step="0.01"
          className="generalInput"
          value={itemPrice}
          onChange={(e) => setItemPrice(e.target.value)}
          required
        />

        <label htmlFor="dimensions">Dimensions:</label>
        <input
          id="dimensions"
          type="text"
          className="generalInput"
          value={itemDimensions}
          onChange={(e) => setItemDimensions(e.target.value)}
        />

        <label htmlFor="quantity">Quantity:</label>
        <input
          id="quantity"
          type="number"
          className="generalInput"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(e.target.value)}
        />

        <label htmlFor="alertPoint">Inventory Alert Point:</label>
        <input
          id="alertPoint"
          type="number"
          className="generalInput"
          value={inventoryAlertPoint}
          onChange={(e) => setInventoryAlertPoint(e.target.value)}
        />


        <label htmlFor="classId">Class Name:</label>
        <select
          id="classId"
          className="generalInput"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          required
        >
          <option value="">-- Select class --</option>
          {classes.map((cls) => (
            <option key={cls.class_id} value={cls.class_id}>
              {cls.class_name}, {cls.location_name}
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

export default Create;
