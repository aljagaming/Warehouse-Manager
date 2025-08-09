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

data.getAllUsers = () => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM User ', (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}



data.registerUser = (user_name, user_lastname, user_email, user_password) => {

    const arr = [user_name, user_lastname, user_email, user_password, "customer"];

    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO User (user_name,user_lastname,user_email, user_password, user_role) VALUES (?, ?, ?, ?, ?)', arr, (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

//-------------------------------------------------------------------------------------------------------------------------
//Location functions
data.createLocation = (location_name, location_address, location_type) => {

    const arr = [location_name, location_address, location_type];

    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Location (location_name, location_address, location_type) VALUES (?, ?, ?)', arr, (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

data.deleteLocation = (location_id) => {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM Location WHERE location_id = ?', [location_id], (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

data.getLocation = (location_id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM Location WHERE location_id =?", [location_id], (err, res, fields) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
}

//used to check so no 2 locations with same names can be created because that would make it too confusing
data.getLocationByName = (location_name) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM Location WHERE location_name= ?", [location_name], (err, res, fields) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
};

data.getAllLocation = () => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM Location ", (err, res, fields) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
}

data.locationGetAllClasses = (location_id) => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT class_id FROM ClassLocation WHERE location_id=?", [location_id], (err, res, fields) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
}


//Class Functions-----------------------------------------------------------------

data.createClass = (class_name, class_position) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Class (class_name, class_position) VALUES (?, ?)', [class_name, class_position], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

data.updateClass = (class_id, class_name, class_position) => {
    if (class_name && class_position) {

        return new Promise((resolve, reject) => {
            conn.query('UPDATE Class SET class_name = ?, class_position = ? WHERE class_id = ?', [class_name, class_position, class_id], (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });

    } else if (!class_position) {

        return new Promise((resolve, reject) => {
            conn.query('UPDATE Class SET class_name = ? WHERE class_id = ?', [class_name, class_id], (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });

    } else {

        return new Promise((resolve, reject) => {
            conn.query('UPDATE Class SET class_position = ? WHERE class_id = ?', [class_position, class_id], (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
        });

    }
}

data.classLocation = (class_id, location_id) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO ClassLocation (class_id, location_id) VALUES (?, ?)', [class_id, location_id], (err, res) => {
            if (err) return reject(err);
            resolve(res);
        });
    });
}

data.deleteClass = (class_id) => {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM Class WHERE class_id = ?', [class_id], (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}


//this looks at ClassLocation table since we need to get the location id as well
data.getClass = (class_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM ClassLocation WHERE class_id = ?', [class_id], (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}


//this acction SHOULD be called deleting class so that no item is left without a class. 
data.classGetItemsIds = (class_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM ItemClass WHERE class_id = ?', [class_id], (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

//Item related functions--------------------------------------------------------------------------------


// item_article_number, item_barcode, item_name, item_price, item_picture, item_dimensions, item_description
//0               1                   2              3           4           5               6               7          8

data.createItem = (arr) => {

    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Item (item_article_number, item_barcode, item_name, item_price, item_picture, item_dimensions, item_description) VALUES (?,?,?,?,?,?,?)',
            arr, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
    });
}

//returns all the classes of an item
data.getItemClasses=(item_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM ItemClass WHERE item_id=?',[item_id], (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
    });
}

data.getItemLocations=(item_id)=>{
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Inventory WHERE item_id=?',[item_id], (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
    });
}

data.itemClass=(item_id,class_id) => {
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO ItemClass (item_id, class_id) VALUES (?,?)',[item_id, class_id], (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
    });
}

data.deleteItemClass = (item_id, class_id) => {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM ItemClass WHERE item_id = ? AND class_id = ?', [item_id, class_id], (err, res) => {
                if (err) return reject(err);
                resolve(res);
            }
        );
    });
}

data.itemInventory=(location_id, item_id, item_quantity, inventory_alert_point)=>{
    arr=[location_id, item_id, item_quantity, inventory_alert_point];
    return new Promise((resolve, reject) => {
        conn.query('INSERT INTO Inventory (location_id, item_id, item_quantity, inventory_alert_point) VALUES (?,?,?,?)',arr, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
    });
}

// item_id location_id operation_quantity 
data.restockInventory=(arr)=>{
    return new Promise((resolve, reject) => {
        //UPDATE Inventory SET item_quantity = item_quantity + ? WHERE item_id = ? AND location_id = ?;
        conn.query('UPDATE Inventory SET item_quantity = item_quantity + ? WHERE item_id = ? AND location_id = ?',arr, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
    });
}
data.sellInventory=(arr)=>{
    return new Promise((resolve, reject) => {
        //UPDATE Inventory SET item_quantity = item_quantity + ? WHERE item_id = ? AND location_id = ?;
        conn.query('UPDATE Inventory SET item_quantity = GREATEST(item_quantity - ?, 0) WHERE item_id = ? AND location_id = ?',arr, (err, res) => {
                if (err) return reject(err);
                resolve(res);
            });
    });
}

//for now we will leave their pictures be 
data.deleteItem = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query('DELETE FROM Item WHERE item_id = ?', [item_id], (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

data.getItem = (item_id) => {
    return new Promise((resolve, reject) => {
        conn.query('SELECT * FROM Item WHERE item_id = ?', [item_id], (err, res, fields) => {
            if (err) { return reject(err) }
            return resolve(res)
        })
    })
}

data.updateItem = (arr) => {
    return new Promise((resolve, reject) => {
        conn.query(
          'UPDATE Item SET item_article_number = ?, item_barcode = ?, item_name = ?, item_price = ?, item_picture = ?, item_dimensions = ?, item_description = ? WHERE item_id = ?',
          arr,
          (err, res) => {
            if (err) return reject(err);
            resolve(res);
          }
        );
    });
}

data.getAllItems = () => {
    return new Promise((resolve, reject) => {
        conn.query("SELECT * FROM Item ", (err, res, fields) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
}


//Opperation Log related functions ----------------------------------------------------------------------------------------------------

//takes user_id, item_id, new_class_id, old_class_id,operation_type,operation_quantity
data.createOppLog=(arr)=>{
    return new Promise((resolve, reject) => {
        conn.query("INSERT INTO OperationLog (user_id, item_id, new_class_id, old_class_id,operation_type,operation_quantity) VALUES (?,?,?,?,?,?)",
            arr,(err, res, fields) => {
            if (err) { return reject(err); }
            return resolve(res);
        });
    });
}








module.exports = data;