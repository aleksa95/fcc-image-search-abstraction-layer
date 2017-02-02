var express = require('express'),
    mongodb = require('mongodb'),
    router  = express.Router(),
    imigur  = require('../modules/imigur');

const databaseURL = process.env.MONGOLAB_URI;    
const MongoClient = mongodb.MongoClient;

function render (res, json) {
    var json = JSON.stringify(json, null, ' ');
    res.render('output', { json: json });
}

router.get('/', (req, res) => {
    res.render('index');
});

router.get('/search/:q*', (req, res) => {
    let q = req.params.q;
    let page = req.query.offset || 1;

    imigur(q, page, function (err, response) {
        if (err) return;

         MongoClient.connect(databaseURL, function (err, db) {
            if (err) 
                console.log('Unable to connect to the mongoDB server. Error:', err);

            let collection = db.collection('searches');

            let currentdate = new Date(); 
            let datetime =  currentdate.getDate() + "/"
                            + (currentdate.getMonth()+1)  + "/" 
                            + currentdate.getFullYear() + " @ "  
                            + currentdate.getHours() + ":"  
                            + currentdate.getMinutes() + ":" 
                            + currentdate.getSeconds();

            let databaseItem = {
                query: q,
                when: datetime
            }

            collection.insert(databaseItem, (err, result) => {
                if (err) console.log(err);
                db.close();
                render(res, response);
            });       
        });
    });     
});

router.get('/latest', (req, res) => {

    MongoClient.connect(databaseURL, function (err, db) {
        if (err) 
            console.log('Unable to connect to the mongoDB server. Error:', err);

        var collection = db.collection('searches');

        collection.find({}, {_id: 0}).sort({$natural: -1}).limit(10).toArray(function(err, items) {
            if (err)
                console.log(err);
            
            db.close();
            render(res, items);                       
        });
    });
});

module.exports = router;
