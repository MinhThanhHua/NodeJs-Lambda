let Joi = require('joi'); // Thư viện validate
// let dynamo = require('dynamodb'); // Cơ sở dữ liệu nosql
// let dynamodb = require('serverless-dynamodb-client'); // Cơ sở dữ liệu local
let uuid = require("uuid"); 

// Server
let AWS = require('aws-sdk');

class Cat {
    /**
     * Tạo data insert
     */
    constructor() {
        // this.db = dynamodb.doc;
        this.db = new AWS.DynamoDB.DocumentClient();
    }

    saveTaco(tacoName, callback) {
        try {
            let id = uuid.v1();
            
            var params = {
                TableName:'Cats',
                Item:{
                    "id": id,
                    "name": tacoName
                },
                ReturnValues: 'ALL_OLD'
            };

            this.db.put(params).promise();

            var params = {
                TableName: 'Cats',
                KeyConditionExpression: 'id = :value', // a string representing a constraint on the attribute
                ExpressionAttributeValues: { // a map of substitutions for all attribute values
                  ':value': id,
                },
                ScanIndexForward: true, // optional (true | false) defines direction of Query in the index
                Limit: 1, // optional (limit the number of items to evaluate)
                ConsistentRead: false, // optional (true | false)
                Select: 'ALL_ATTRIBUTES', // optional (ALL_ATTRIBUTES | ALL_PROJECTED_ATTRIBUTES | 
                ReturnConsumedCapacity: 'NONE', // optional (NONE | TOTAL | INDEXES)
            };

            return this.db.query(params).promise().then(
                function(data) {
                    callback(data)
                },
                function(error) {
                    console.log(error)
                }
            );
             
        } catch (error) {
            return error;
        }
		
    }
    
    getTaco(callback) {
        try {
            var params = {
                TableName: "Cats",
                ProjectionExpression: "id, #name",
                ExpressionAttributeNames: {     
                    "#name": "name",
                }
            };
            
            this.db.scan(params).promise().then(
                function(data) {
                    callback(data)
                },
                function(error) {
                    console.log(error)
                }
            );
             
        } catch (error) {
            return error;
        }
		
	}
}

module.exports = new Cat();
