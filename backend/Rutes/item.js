const path = require('path');
const express = require("express");
const DB = require('../DB/DBconn.js');
const item = express.Router();

const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage: storage });




item.post("/create", upload.single('item_picture'), async (req, res) => {


    let user_id = req.session.user_id;

    let item_quantity = req.body.item_quantity;
    let inventory_alert_point = req.body.inventory_alert_point;
    let class_id = req.body.class_id;
    let item_article_number=req.body.item_article_number;
    let item_barcode=req.body.item_barcode;
    let item_name=req.body.item_name;
    let item_price=req.body.item_price;
    let item_description=req.body.item_description;


    // Check must have attributes
    if (!user_id || !class_id || !item_article_number
        || !item_barcode
        || !item_name| !item_price ||
        !item_description) {

        return res.json({
            success: false,
            msg: "Some necessary attribute is missing"
        });
    }

    // Set item quantity nad alert point to 0 if they are not defined
    if (!item_quantity || item_quantity <= 0) item_quantity = 0;
    if (!inventory_alert_point || inventory_alert_point < 0) inventory_alert_point = 10;



    const file = req.file;
    let filename = null;
    if (file) {
        filename = file.filename;
    }

    const arr = [
        req.body.item_article_number,
        req.body.item_barcode,
        req.body.item_name,
        req.body.item_price,
        filename,
        req.body.item_dimensions || null,
        req.body.item_description
    ];

    try {
        // Check if class exists
        let classExists = await DB.getClass(class_id);
        if (!classExists || classExists.length === 0) {
            return res.json({
                success: false,
                msg: "Class with this id doesn't exist, can't create item."
            });
        }

        //get Location of that class
        const location_id = classExists[0].location_id;

        if (!location_id) {
            return res.json({
                success: false,
                msg: "Somehow class doesnt have location_id! "
            });
        }

        // Create item
        let createItem = await DB.createItem(arr);
        if (!createItem) {
            return res.json({
                success: false,
                msg: "Could not create the item."
            });
        }
        let insertedID = createItem.insertId;

        // Link item to class
        let itemClass = await DB.itemClass(insertedID, class_id);
        if (!itemClass) {
            return res.json({
                success: false,
                msg: "Could not link ItemClass."
            });
        }

        // Put item into inventory - tie it to location
        let inventory = await DB.itemInventory(location_id, insertedID, item_quantity, inventory_alert_point);
        if (!inventory) {
            return res.json({
                success: false,
                msg: "Could not put item into inventory"
            });
        }

        //takes user_id, item_id, new_class_id, old_class_id,operation_type,operation_quantity
        let uppLogData = [
            user_id,
            insertedID,
            class_id || null,
            null,
            "creation",
            item_quantity
        ];


        let createUpdateLog = await DB.createOppLog(uppLogData);
        if (!createUpdateLog || createUpdateLog.length === 0) {
            return res.json({
                success: false,
                msg: "Failed to create oppLog!"
            });
        }


        res.json({
            success: true,
            msg: `Created a new item id: ${insertedID}, class: ${class_id}, location: ${location_id}, oppLog: ${createUpdateLog.insertId}`
        });

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

item.post("/delete", async (req, res) => {
    let { item_id } = req.body;
    try {
        let deleteStat = await DB.deleteItem(item_id);
        if (deleteStat.affectedRows > 0) {
            res.json({
                success: true,
                msg: `Deleted item: ` + item_id
            });
        } else {
            res.json({
                success: false,
                msg: `No item with such id! `
            });
        }
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }

});




//------------------------------------------------------------------------------------------------------------------------------






item.post("/update", upload.single('item_picture'), async (req, res) => {
    //do it this way in case they are not in right order
    let user_id = req.body.user_id;
    let class_id = req.body.class_id;
    let item_id = req.body.item_id;

    if (!user_id || !item_id) {
        return res.json({
            success: false,
            msg: "user_id or item_id is missing"
        });
    }

    try {
        let item = await DB.getItem(item_id);
        if (!item || item.length === 0) {
            res.json({
                success: false,
                msg: `No item with such id! `
            });
        }

        const file = req.file;
        let filename = null;
        if (file) {
            filename = file.filename;
        }

        //console.log(req.body.item_article_number+" "+item[0].item_article_number)

        //change only things that changed rest just return to normal
        let arr = [
            cleanUpdate(req.body.item_article_number, item[0].item_article_number),
            cleanUpdate(req.body.item_barcode, item[0].item_barcode),
            cleanUpdate(req.body.item_name, item[0].item_name),
            cleanUpdate(req.body.item_price, item[0].item_price), //its form data so all numbers must 
            cleanUpdate(filename, item[0].item_picture),
            cleanUpdate(req.body.item_dimensions, item[0].item_dimensions),
            cleanUpdate(req.body.item_description, item[0].item_description),
            item_id
        ]

        let itemUpdate = await DB.updateItem(arr);
        if (!itemUpdate) {
            res.json({
                success: false,
                msg: `No item with such id! `
            });
        }

        //since one item can be in 2 different classes we need to delet ties with one
        // which has the same location
        if (class_id) {
            //IF item class updated there is a LOT of things to do;

            //Either the new class is in completely new Inventory

            //New class is in some inventroy where our item already is
            //We need to break link with old Class in that case

            // but to know which one is old we need to get location
            // item can only be in ONE CLASS PER LOCATION
            try {
                let oldClass = null;

                const newClass = await DB.getClass(class_id);
                if (!newClass || newClass.length === 0) {
                    return res.json({
                        success: false,
                        msg: `There is no valid class with that id! Didnt update class!`
                    });
                }

                const itemClasses = await DB.getItemClasses(item_id);
                if (!itemClasses || itemClasses.length === 0) {
                    return res.json({
                        success: false,
                        msg: `Can't find which classes the item belongs to!`
                    });
                }

                for (let i = 0; i < itemClasses.length; i++) {
                    let currentClass = await DB.getClass(itemClasses[i].class_id);

                    if (currentClass && currentClass.length > 0 && currentClass[0].location_id === newClass[0].location_id) {
                        oldClass = currentClass[0];
                        break;
                    }
                }
                if (oldClass && oldClass.class_id === class_id) {
                    return res.json({
                        success: true,
                        msg: `Class didn't change at all`
                    });
                }





                let type = "reclassified";//if location didnt change then its reclassified

                //scenario 1 the new class is in completely new Location
                if (!oldClass) {
                    // no old class in this location, so just create new link
                    const newLink = await DB.itemClass(item_id, class_id);
                    if (!newLink || newLink.affectedRows !== 1) {
                        return res.json({
                            success: false,
                            msg: `Could NOT update, new class is in new location`
                        });
                    }
                    const newInv = await DB.itemInventory(newClass[0].location_id, item_id, 0, 10);
                    if (newInv) {
                        type = "new Class and Location";
                        /*
                        return res.json({
                            success: true,
                            msg: `Updated, completely new class and completely new location`
                        });
                        */
                    } else {
                        return res.json({
                            success: false,
                            msg: `Could NOT update, cant create Inventory ling`
                        });
                    }
                } else {


                    //scenario 2 new class is in old LOCATION
                    // Delete old link and create new link
                    const destroyOldLink = await DB.deleteItemClass(item_id, oldClass.class_id);
                    if (!destroyOldLink || destroyOldLink.affectedRows !== 1) {
                        return res.json({
                            success: false,
                            msg: `Could NOT delete old itemClass link`
                        });
                    }

                    const createNewLink = await DB.itemClass(item_id, class_id);
                    if (createNewLink && createNewLink.affectedRows === 1) {
                        /*
                        return res.json({
                            success: true,
                            msg: `Updated item, destroyed old link, and created new one, newclass in old Location!`
                        });
                        */
                    } else {
                        return res.json({
                            success: false,
                            msg: `Could NOT create new itemClass link`
                        });
                    }
                }

                let oppLogOldClassID
                if (!oldClass) {

                    oppLogOldClassID = null;

                } else {

                    oppLogOldClassID = oldClass[0].class_id;

                }


                let uppLogData = [
                    user_id,
                    item_id,
                    class_id || null,
                    oppLogOldClassID,
                    type,
                    null
                ];



                let createUpdateLog = await DB.createOppLog(uppLogData);
                if (!createUpdateLog || createUpdateLog.length === 0) {
                    return res.json({
                        success: false,
                        msg: "Failed to create oppLog!"
                    });
                } else {
                    res.json({
                        success: true,
                        msg: `Class changed and item is UPDATED, oppLog created! `
                    });
                }







            } catch (error) {
                console.error(error);
                return res.sendStatus(500);
            }
        } else {
            res.json({
                success: true,
                msg: `Class didnt change and item is UPDATED! `
            });
        }


    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }



});
function cleanUpdate(a, b) {
    if (a !== undefined && a !== null) {
        return a;
    }
    if (b !== undefined && b !== null) {
        return b;
    }
    return null;
}
//-------------------------------------------------------------------------------------------------

item.post("/restock", async (req, res) => {

    let user_id = req.session.user_id;
    let item_id = req.body.item_id;
    let class_id = req.body.class_id;
    let operation_quantity = req.body.operation_quantity;

    if (!user_id || !item_id || !class_id || !operation_quantity || operation_quantity <= 0) {
        return res.json({
            success: false,
            msg: `Missing some key attributes `
        });
    }

    let uppLogData = [
        user_id,
        item_id,
        class_id || null,
        null,
        "restock",
        operation_quantity
    ];

    try {
        //get location
        //update inventory  //check if item exists //check if inventory exists
        //create oppLog 
        let item = await DB.getItem(item_id);
        if (!item || item.length === 0) {
            return res.json({
                success: false,
                msg: `No item with such id! `
            });
        }

        //you didnt check here if class is correctly linked to the item
        //--------------------------------------------------
        //--------------------------------------------------

        let location = await DB.getClass(class_id); // once again getClass returns ClassLocation pairs
        if (!location || location.length === 0) {
            return res.json({
                success: false,
                msg: `Could not get location of the class`
            });
        } //but if class exists it must be in an inventory 

        let updateInventory = await DB.restockInventory([operation_quantity, item_id, location[0].location_id]);
        if (updateInventory.affectedRows === 0) {
            return res.json({
                success: false,
                msg: `Could not update inventory`
            });
        }

        let createOppLog = await DB.createOppLog(uppLogData)
        if (createOppLog.affectedRows === 0) {
            return res.json({
                success: false,
                msg: `Could not create oppLog`
            });
        }

        return res.json({
            success: true,
            msg: `Restocked item and created an opp log`
        });


    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }

})




//-------------------------------------------------------------------------------------------------

item.post("/sell", async (req, res) => {
    let user_id = req.session.user_id;
    let item_id = req.body.item_id;
    let class_id = req.body.class_id;
    let operation_quantity = req.body.operation_quantity;

    if (!user_id || !item_id || !class_id || !operation_quantity || operation_quantity <= 0) {
        return res.json({
            success: false,
            msg: `Missing some key attributes `
        });
    }

    let uppLogData = [
        user_id,
        item_id,
        class_id || null,
        null,
        "sell",
        operation_quantity
    ];

    try {
        //get location
        //update inventory  //check if item exists //check if inventory exists
        //create oppLog 
        let item = await DB.getItem(item_id);
        if (!item || item.length === 0) {
            return res.json({
                success: false,
                msg: `No item with such id! `
            });
        }

        //you didnt check here if class is correctly linked to the item
        //--------------------------------------------------
        //--------------------------------------------------

        let location = await DB.getClass(class_id); // once again getClass returns ClassLocation pairs
        if (!location || location.length === 0) {
            return res.json({
                success: false,
                msg: `Could not get location of the class`
            });
        } //but if class exists it must be in an inventory 


        //Also you didnt check if you have that many to sell but of well 
        let updateInventory = await DB.sellInventory([operation_quantity, item_id, location[0].location_id]);
        if (updateInventory.affectedRows === 0) {
            return res.json({
                success: false,
                msg: `Could not update inventory`
            });
        }



        let createOppLog = await DB.createOppLog(uppLogData)
        if (createOppLog.affectedRows === 0) {
            return res.json({
                success: false,
                msg: `Could not create oppLog`
            });
        }

        return res.json({
            success: true,
            msg: `Sold item and created an opp log`
        });


    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }

})

item.post("/move", async (req, res) => {
    let user_id = req.body.user_id;
    let from_class = req.body.from_class;
    let to_class = req.body.to_class;
    let operation_quantity = req.body.operation_quantity;
    let item_id = req.body.item_id;

    if (!user_id || !from_class || !to_class || !operation_quantity || operation_quantity <= 0) {
        return res.json({
            success: false,
            msg: `Missing some key attributes `
        });
    }

    let oppLogData = [
        user_id,
        item_id,
        from_class || null,
        to_class || null,
        "move",
        operation_quantity
    ];


    try {
        let item = await DB.getItem(item_id);
        if (!item || item.length === 0) {
            return res.json({
                success: false,
                msg: `No item with such id! `
            });
        }

        let from_location = await DB.getClass(from_class); // once again getClass returns ClassLocation pairs
        if (!from_location || from_location.length === 0) {
            return res.json({
                success: false,
                msg: `Could not get from location of the class`
            });
        }

        let to_location = await DB.getClass(to_class); // once again getClass returns ClassLocation pairs
        if (!to_location || to_location.length === 0) {
            return res.json({
                success: false,
                msg: `Could not get to location of the class`
            });
        }

        console.log(from_location[0].location_id);
        console.log(to_location[0].location_id);



        let sellInventory = await DB.sellInventory([operation_quantity,item_id, from_location[0].location_id]);
        if (sellInventory.affectedRows === 0) {
            return res.json({
                success: false,
                msg: `Could not sell Inventory`
            });
        }

        let restockInventory = await DB.restockInventory([operation_quantity,item_id, to_location[0].location_id]);
        if (restockInventory.affectedRows === 0) {
            return res.json({
                success: false,
                msg: `Could not restock Inventory`
            });
        }

        let createOppLog = await DB.createOppLog(oppLogData);
        if (createOppLog.affectedRows === 0) {
            return res.json({
                success: false,
                msg: `Could not create Opp log`
            });
        }



        return res.json({
            success: true,
            msg: `Moved the give quantity of items to new location!`
        });




    } catch (error) {
        console.error(error);
        return res.sendStatus(500);
    }
});



item.get("/getItemArtEan", async (req, res) => {
    let number = req.query.number;
    if (!number || number <= 0) {
        return res.json({
            success: false,
            msg: "Item number is missing"
        });
    }
    try {
        let item = await DB.getItemByArtEan(number);
        if (!item || item.length === 0) {
            return res.json({
                success: false,
                msg: `No item with such id! `
            });
        }
        res.json(item[0]);

    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
})



item.get("/allOppLogs", async (req, res) => {

    try {
        let allLogs = await DB.getAllOppLogs();
        if (!allLogs || allLogs.length === 0) {
            return res.json({
                success: false,
                msg: "No operation logs found"
            });
        }
        res.json(allLogs);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
}); 




module.exports = item;
