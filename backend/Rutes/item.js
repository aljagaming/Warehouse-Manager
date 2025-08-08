const express = require("express");
const DB = require('../DB/DBconn.js');
const item = express.Router();


item.post('/create', async (req, res, next))=>{

    //item_id	item_article_number	item_barcode	item_name	item_price	item_picture	item_dimensions	item_description
    let {item_class,item_article_number, item_barcode, item_name, item_price, item_picture, item_dimensions, item_description} = req.body;

    if (!item_class){
        
    }


}

module.exports = item;
