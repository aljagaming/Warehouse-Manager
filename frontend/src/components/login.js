import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';
const REACT_APP_API_URL= process.env.REACT_APP_API_URL;

function Login() {

  const navigate = useNavigate();

  const [isRegistering, setIsRegistering] = useState(false);

  //user Credentials
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');



  //Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await axios.post(`${REACT_APP_API_URL}/user/login`, {
        user_email: email,
        user_password: password,
      }, { withCredentials: true });

      // Handle login success/failure here
      if (response.data.success) {


        if (response.data.user_role === 'costumer') { //its 
          navigate('/costumer', { state: {user:response.data} }); //pass the user state
        } else {
          navigate('/employee', { state: {user: response.data} });
        }

      } else {
        setMessage("Wrong username or password!");
      }
    } catch (error) {
      setMessage("Wrong username or password!");
    }
  };

  //Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await axios.post(`${REACT_APP_API_URL}/user/register`, {
        user_name: name,
        user_lastname: lastName,
        user_email: email,
        user_password: password,
      });

      //console.log(response);
      if (response.data.success) {
        setMessage("Registration successful! Please login.");
        setEmail('');
        setPassword('');
        setName('');
        setLastName('');
        setIsRegistering(false); // Go back to login form
      
      } else {
        setMessage("Email already in use ");
      }
    } catch (error) {
      setMessage("Registration error: " + error.message);
    }
  };






  return (

    <div className="login-container">

      <h1>Welcome to Warehouse Manager</h1>

      <p className="errorMessage">{message || "\u00A0"}</p>

      {!isRegistering ? ( // conditional rendering for login/register

        <form onSubmit={handleLogin}>

          <div>
            <label htmlFor="email">Email:</label><br/>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label><br/>
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="login-btn">Log In</button>

          <button type="button" className="register-btn" onClick={() => {
            setIsRegistering(true); 
            setMessage(''); 
            setName('');
            setLastName(''); 
            setEmail(''); 
            setPassword('');
          }}>
            Register
          </button>
        </form>

      ) : (

        <form onSubmit={handleRegister}>
          <div>
            <label htmlFor="name">First Name:</label><br />
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="lastName">Last Name:</label><br />
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Email:</label><br />
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password">Password:</label><br />
            <input
              type="password"
              id="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="register-btn">Register</button>

          <button type="button" className="login-btn" onClick={() => {
            setIsRegistering(false); 
            setMessage(''); 
            setName('');
            setLastName(''); 
            setEmail(''); 
            setPassword('');
          }}>
            Back to Login
          </button>

        </form>
      )}
    </div>

  );
}

export default Login;
