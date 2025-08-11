const express = require("express");
const DB = require('../DB/DBconn.js');
const myClass = express.Router();





myClass.post("/create", async (req, res) => {
    let location_id= req.body.location_id;
    let class_name=req.body.class_name;
    let class_position=req.body.class_position;
    if (!location_id) {
        return res.json({
            success: false,
            msg: "Class has to have a parent Location ID"
        });
    } else {
        try {
            const checkId = await DB.getLocation(location_id);
            if (checkId.length === 0) {
                return res.json({
                    success: false,
                    msg: "Location with this ID doesn't exist"
                });
            }
        } catch (error) {
            console.error(error);
            return res.sendStatus(500);
        }
    }

    try {
        let createClass = await DB.createClass(class_name, class_position);
        if (createClass && createClass.insertId) {
            try {
                let classId = createClass.insertId;
                let classLocation = await DB.classLocation(classId, location_id);
                if (classLocation) {
                    return res.json({
                        success: true,
                        msg: "Created new Class and linked to its Location!"
                    });
                } else {
                    return res.json({
                        success: false,
                        msg: "Created new Class but failed to link classLocation."
                    });
                }
            } catch (error) {
                console.error(error);
                return res.sendStatus(500);
            }
        } else {
            return res.json({
                success: false,
                msg: "Could NOT create new Class."
            });
        }
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});



myClass.post("/delete", async (req, res) => {
    const class_id= req.body.class_id;
    try {
        let deleteClass = await DB.deleteClass(class_id);
        if (deleteClass.affectedRows > 0) {
            res.json({
                success: true,
                msg: "Deleted class with id: " + class_id
            });
        } else {
            res.json({
                success: false,
                msg: "Could not delete class."
            });
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});



myClass.post("/getItems", async (req, res) => {
    let class_id = req.body.class_id;
    try {
        let items = await DB.classGetItemsIds(class_id);
        if (items && items.length > 0) {
            // Found some items, send them back
            res.json(items);
        } else {
            res.json({
                success: false,
                msg: "No items found for this class."
            });
        }

    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});


myClass.post("/update", async (req, res) => {
    let class_id=req.body.class_id;
    let class_name=req.body.class_name;
    let class_position=req.body.class_position;
    if (!class_id) {
        return res.status(400).json({
            success: false,
            msg: "class_id required"
        });
    }

    if (class_name === undefined) { //PS. trim throws null on undifined 
        class_name=null;
    }else if(class_name.trim() === ""){
        class_name=null;
    }

    if (class_position === undefined ) {
        class_position=null;
    }else if(class_position.trim() === ""){
        class_position=null;
    }

    //if both of them are null throw mistake
    //a bit overdooing it as this should be sanctioned in frontend as well but stupiproofing it
    if (!class_position && !class_name) {
        return res.json({
            success: false,
            msg: "Nothing to update"
        });
    }

    try {
        const result = await DB.updateClass(class_id, class_name, class_position);
        if (result.affectedRows > 0) {
            return res.json({
                success: true,
                msg: "Class updated successfully! "
            });
        } else {
            return res.json({
                success: false,
                msg: "Class not found, no changes made! "
            });
        }
    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});




myClass.get("/getAllClassesNames", async (req, res) => {
    let location_id = req.session.location_id ; // Default to 1 for now user can only view location id 1 
    //location_id=1
    try {
        let classes = await DB.getAllClassesNames(location_id);
        if (classes && classes.length > 0) {
            return res.json(classes)
        } else {
            return res.json({
                success: false,
                msg: "No classes found for this location."
            });
        }
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
});

/*
myClass.get("/all", async (req,res,next)=>{
    try {
        const result = await DB.getAllLocation();
        res.json(result);
    } catch (err) {
        console.error( err);
        res.status(500).json({});
    }
})
*/


module.exports = myClass;