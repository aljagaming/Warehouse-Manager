import "../style/costumer.css";
function ClassDisplay({ cls, onClick }) {
  return (
    <button className="oneClassButton" onClick={() => onClick(cls)}>
       {cls.class_name}
    </button>
  );
}

export default ClassDisplay;