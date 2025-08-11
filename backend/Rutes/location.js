const express = require("express");
const DB = require('../DB/DBconn.js');
const location = express.Router();

location.post("/create", async (req, res) => {
    let { location_name, location_address, location_type } = req.body;

    try {
        let nameExists = await DB.getLocationByName(location_name);

        if (!nameExists || nameExists.length === 0) {//if the name exists already - no 2 locations with same name

            let result = await DB.createLocation(location_name, location_address, location_type);
            if (result) {
                return res.json({
                    success: true,
                    msg: "Created new Location!"
                });
            } else {
                return res.json({
                    success: false,
                    msg: "Couldn't create new location!"
                });
            }

        } else {
            return res.json({
                success: false,
                msg: "Location with that name already exists!"
            });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});



location.post("/delete", async (req, res) => {
    let { location_id } = req.body;

    try {
        let deleteLoc = await DB.deleteLocation(location_id);
        if (deleteLoc.affectedRows > 0) {
            res.json({
                success: true,
                msg: "Deleted location with id: " + location_id
            });
        } else {
            res.json({
                success: false,
                msg: "Could not delete location. It may not exist."
            });
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

//returns all existing LOCATIONS
location.get("/all", async (req,res,next)=>{
    try {
        const result = await DB.getAllLocation();
        res.json(result);
    } catch (err) {
        console.error( err);
        res.status(500).json({});
    }
})

//returns all existing Classes in a particular location
location.post("/allClasses", async (req,res,next)=>{
    let {location_id} = req.body;
    try {
        const result = await DB.locationGetAllClasses(location_id);
        res.json(result);
    } catch (err) {
        console.error( err);
        res.status(500).json({});
    }
});

location.post("/getLocation", async (req,res,next)=>{
    let { location_id } = req.body;
    try {
        const result = await DB.getLocation(location_id);
        res.json(result);
    } catch (err) {
        console.error( err);
        res.status(500).json({});
    }
})


location.post("/getAllItemsInLocation", async (req, res) => {
    //let location_id = req.session.location_id;
    let location_id=1;
    let class_id= req.body.class_id;
    let nameLike = req.body.nameLike;
    try {
        const result = await DB.getAllItemsInLocation(location_id, class_id, nameLike);
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({});
    }

});



module.exports = location;
