const express = require("express");
const DB = require('../DB/DBconn.js');
const user = express.Router();

user.post('/login', async (req, res, next) => {
    let { user_email, user_password } = req.body;

    req.session.logged_in = false;
    req.session.user_name = null;
    req.session.user_id = null;
    req.session.user_role = null;
    req.session.user_email = null;
    req.session.currentStoreId = null;


    try {
        let queryResult = await DB.AuthUserEmail(user_email);

        if (queryResult.length > 0) { //if there is a user with such a name

            if (queryResult[0].user_password === user_password) {

                req.session.logged_in = true;
                req.session.user_name = queryResult[0].user_name;
                req.session.user_email = queryResult[0].user_email;
                req.session.user_role = queryResult[0].user_role;
                req.session.user_id = queryResult[0].user_id;
                req.session.location_id = 1;

                res.json({
                    success: true,
                    msg: "Username && Password CORRECT; LOGGED IN!",
                    user_role: queryResult[0].user_role, 
                    user_name: queryResult[0].user_name,
                    user_id: queryResult[0].user_id,
                    //send this as well so we know what page to open
                });

            } else {
                res.json({
                    success: false,
                    msg: "Username CORRECT; Password ERROR!"
                });
            }

        } else {
            res.json({
                success: false,
                msg: "There is no user with this email"
            });
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});



user.get("/logout", (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, msg: "Logout failed, couldn't destroy sesh" });
        }
        res.clearCookie("connect.sid"); // optional, clears session cookie
        res.json({ success: true, msg: "Logged out successfully, sesh destroyed!" });
    });
});


user.post('/register', async (req, res, next) => {


    let user_name = req.body.user_name;
    let user_lastname = req.body.user_lastname;
    let user_email = req.body.user_email;
    let user_password = req.body.user_password;

    try {
        let queryResult = await DB.AuthUserEmail(user_email);

        if (queryResult.length > 0) { //if there is a user with such a name

            res.json({
                success: false,
                msg: "Email already in use!"
            });


        } else {
            let createUser = await DB.registerUser(user_name, user_lastname, user_email, user_password);
            if (createUser) {
                res.json({
                    success: true,
                    msg: "Registered a new user: " + user_name
                });
            } else {
                res.json({
                    success: false,
                    msg: "Failed to create User"
                });
            }
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});



//just for testing 
user.get("/all", async (req, res, next) => {
    try {
        const result = await DB.getAllUsers();
        res.json(result);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
})

user.get("/sesh", (req, res) => {
  if (req.session.logged_in) {
    res.json({
      loggedIn: true,
      userName: req.session.user_name,
      userEmail: req.session.user_email,
      userRole: req.session.user_role,
      userId: req.session.user_id,
      currentStoreId: req.session.currentStoreId,
    });
  } else {
    res.json({ loggedIn: false });
  }
});

module.exports = user;
