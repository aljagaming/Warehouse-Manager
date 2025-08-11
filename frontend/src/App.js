import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Login from "./components/login.js";
import Costumer from "./components/costumer.js"
import Employee from "./components/employee.js";
import ItemDetail from "./components/itemDetailsDisplay.js";
import MakeHistory from "./components/historyAll.js";
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/" element={<Login/>}/>
        <Route path="/costumer" element={<Costumer />}/>
        <Route path="/employee" element={<Employee />}/>
        <Route path="/item-detail" element={<ItemDetail />} />
        <Route path="/make-history" element={<MakeHistory />} />
        

      </Routes>
    </Router>

  );
}

export default App;
