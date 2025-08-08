const mysql = require('mysql2');
const express = require('express');
require('dotenv').config();

let data = {};

const conn = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE
})

conn.connect((err) => {
    if (err) {
        console.log("ERROR: " + err)
        return;
    } else {
        console.log("Connection with the database established !!!")
    }
})


//User related functions ---------------------------------------------------------------------------------------------------

data.AuthUserEmail = (user_email) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM User WHERE user_email = ?', [user_email], (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

data.getAllUsers = ()=>{
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM User ', (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}



data.registerUser = (user_name,user_lastname,user_email,user_password) => {

    const arr= [user_name,user_lastname,user_email,user_password,"customer"];

    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO User (user_name,user_lastname,user_email, user_password, user_role) VALUES (?, ?, ?, ?, ?)', arr, (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

//-------------------------------------------------------------------------------------------------------------------------
//Items functions





module.exports = data;