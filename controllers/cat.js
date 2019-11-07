'use strict';  // sử dụng sự nghiêm ngặt của JS

let uuid = require("uuid");  // Kiểu id random BINARY
let Cat = require("../models/CatModel");

module.exports = {
    createCat: (event, context, callback) => {
        let body = JSON.parse(event.body); // lấy dữ liệu truyền lên từ body, API Getway thì phải bỏ JSON.parse (API Getway tự decode rồi)
        
        if (typeof body.name !== 'string') {
            return callback(null, {
                statusCode: 500,
                body: JSON.stringify({
                    error: 'The name and kind of cat must be string',
                    data: JSON.parse(event.body)
                })
            })
        }
        
        try {
             // save data
             Cat.saveTaco(body.name, function(returnValue) {
                return callback(null, {
                    statusCode: 200,
                    body: JSON.stringify({
                        cat: returnValue
                    })
                })
              });
        } catch (error) {
            return callback(null, {
                statusCode: 500,
                error: error
            })
        }
       
    },

    listCat: (event, context, callback) => {
        try {
            // get data
            Cat.getTaco(function(returnValue) {
               return callback(null, {
                   statusCode: 200,
                   body: JSON.stringify({
                       cat: returnValue
                   })
               })
             });
       } catch (error) {
           return callback(null, {
               statusCode: 500,
               error: error
           })
       }
      
    }
};