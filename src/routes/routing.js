const express = require('express');
const routing = express.Router();
const app = express();
const cors = require('cors');
const mongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://admin:admin123@freeclusterinmum.tstjq.mongodb.net/primary?retryWrites=true&w=majority'
const dbClient = new mongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
const Team = require('../model/team');
const { ObjectID } = require('mongodb');

app.use(cors())
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Route to fetch all teams data
routing.get('/teams', (req, res) => {
    dbClient.connect(err => {
        let teamsCollection = dbClient.db("primary").collection("teams");
        let query = {};
        teamsCollection.find(query).toArray((readError, result) => {
            if (readError) {
                // next(readError)
            } else if (result) {
                // res.status(200).json(result);
                res.json(result);
            }
        });
    });
    dbClient.close();
});

// Route to add new team data
routing.post('/teams/add', (req, res, next) => {

    let name = req.body.team_name;
    let wins = req.body.wins;
    let losses = req.body.losses;
    let ties = req.body.ties;
    let score = req.body.score;
    let newTeam = new Team(name, wins, losses, ties, score);
    dbClient.connect(url, (err, db) => {
        if (err) {
            return res.status(204).json(err);
        }
        let dbo = db.db('primary');
        dbo.collection("teams").insertOne(newTeam, (err, result) => {
            if (err) {
                return res.status(400).json(err);
            } else if (result) {
                res.status(201).json(result);
            }
        });
    });

})


// Route to find teams by name

routing.get('/teams/:name', (req, res, next) => {

    const nametoSearch = req.params.name;

    console.log(nametoSearch)

    dbClient.connect(url, (err, db) => {
        if (err) {
            res.status = 204;
            res.json(err);
        }
        let dbo = db.db('primary');
        var query = { $text: { $search: nametoSearch } }
        dbo.collection("teams").find(query).toArray(function(err, result) {
            if (err) {
                res.status = 400;
                res.json(err);
            } else if (result) {
                res.status = 201;
                res.json(result);
                db.close();
            }
        });
    });

});


// Route to add  match result

routing.post('/teams/result', (req, res, next) => {

    dbClient.connect(url, (err, db) => {
        if (err) {
            res.status(204).json(err);
        }

        let dbo = db.db('primary');

        var matchresult = req.body;
        var winnerId = req.body.winnerId;
        var looserId = req.body.looserId;
        var teamOne = req.body.teamOne;
        var teamTwo = req.body.teamTwo;

        if (looserId == "0" && winnerId == "0") {
            dbo.collection("teams").updateOne({ _id: ObjectID(teamOne) }, { $inc: { score: 1, ties: 1 } });

            dbo.collection("teams").updateOne({ _id: ObjectID(teamTwo) }, { $inc: { score: 1, ties: 1 } });
        } else {
            dbo.collection("teams").updateOne({ _id: ObjectID(winnerId) }, { $inc: { score: 3, wins: 1 } });

            dbo.collection("teams").updateOne({ _id: ObjectID(looserId) }, { $inc: { losses: 1 } });
        }

        dbo.collection("matchResults").insertOne(matchresult, (err, result) => {
            if (err) {
                return res.status(400).json(err);
            } else if (result) {
                return res.status(201).json(result);
            }
        });

        db.close();

    });

});

module.exports = routing;