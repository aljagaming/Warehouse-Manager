import "../style/costumer.css";
const REACT_APP_API_URL= process.env.REACT_APP_API_URL;

//A button for each class displayed in Costumer component
function itemButton({ item, onClick }) {
  return (
    <button className="displayButton" onClick={() => onClick(item)}>
      <div className="itemPicture">
        <img src={`${REACT_APP_API_URL}/uploads/${item.item_picture}`} alt={item.item_name} />
      </div>
      <div className="itemText">
        <div className="itemName">{item.item_name}</div>
        <div className="itemPrice">{item.item_price}</div>
        <div className="itemQuantity">{item.item_quantity}</div>
        <div className="itemClass">{item.class_name}</div>
      </div>
    </button>
  );
}

export default itemButton;