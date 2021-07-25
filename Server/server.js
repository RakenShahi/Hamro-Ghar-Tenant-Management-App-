const express = require('express');
const app = express();
const cors=require('cors');
const bodyParser=require('body-parser');
var config = require('./config.js')
const MongoClient = require('mongodb').MongoClient;
var ObjectID=require('mongodb').ObjectID;
var currentCollection;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const uri=config.mongohq.uri; //getting mongodb url link
const client = new MongoClient(uri, { useNewUrlParser: true,  useUnifiedTopology: true});
client.connect(err => { //connecting to the database
    currentCollection = client.db(config.mongohq.database_name).collection(config.mongohq.collection_name);
    // perform actions on the collection object
    console.log("Database Connected!");
}); //connection to mongodb

//route to homepage
app.get('/', function(req,res) {
    res.send("Tenant Homepage / Run index.html via cordova");
});

//route to perform search required Tenant from database
app.get('/search/:query', function (req,res){
    client.db(config.mongohq.database_name).collection(config.mongohq.collection_name)
        .find({_id:ObjectID(req.params.query)}).toArray( function(err,docs) {
        if(err) {
            console.log("Some error.. " + err);
        } else {
            res.send(docs);
        }
    });
})

//route to perform remove Tenant operation from database
app.get('/remove/:query', function (req,res){
    var id=req.params.query
    console.log("Removing.. "+id );
    updateStatus(client,id);//Status field is updated from active to REMOVED
})

//route to perform search transaction from database
app.get('/searchTransaction/:query', function (req,res){
    console.log("search transaction of id.. "+ req.params.query);
    client.db(config.mongohq.database_name).collection(config.mongohq.invoice_collection)
        .find({tenantID:req.params.query}).toArray( function(err, docs) {

        if(err) {
            console.log("Some error.. " + err);
        } else {
            res.send(docs);
            console.log(docs);
        }
    });
})

//route to perform get all Tenant from database
app.get('/getAll', function (req,res){
    client.db(config.mongohq.database_name).collection(config.mongohq.collection_name).find({status:"Active"})
        .toArray( function(err,docs) {

        if(err) {
            console.log("Some error.. " + err);
        } else {
            res.send(docs);
        }
    });

})

//route to send data to server
app.post('/postData', function(req,res) {
    var data= req.body;
    res.send(req.body);
    addTenant(client,data);
});

//route to send Invoice to server
app.post('/postInvoice/:query', function(req,res) {
    var tenantID=req.params.query;
    var data= req.body;

    res.send(req.body);
    addInvoice(client,data);
});

app.listen( 3000, () => {
    console.log("Web Server started on port 3000");
});

async function updateStatus(client,data){
    console.log("Removed "+ data);
    result = await client.db(config.mongohq.database_name).collection(config.mongohq.collection_name)
        .updateOne({_id:ObjectID(data)},{$set:{status:"REMOVED"}});
    console.log(result);
}

//function to send list of data to server
async function addTenant(client, newListings){
    console.log("SENDJSON:")
    const result =  await client.db(config.mongohq.database_name)
        .collection(config.mongohq.collection_name).insertMany(newListings);
    console.log(`${result.insertedCount} new list(s) created :`);
    console.log(result);
}

//function to add invoice in database
async function addInvoice(client, data) {
    result = await client.db(config.mongohq.database_name).collection(config.mongohq.invoice_collection)
        .insertMany(data);
    console.log(`${result.insertedCount} new list(s) created :`);
    console.log(result);
}



