import mongoose from 'mongoose';
import User from '../models/users';
import userTpl from '../views/userChat';
import adminTpl from '../views/adminChat';

let allUsers = [];
let usersWithoutPass = [];
let name = false;

function sendAll(res, user) {

    usersWithoutPass = usersWithoutPass.filter((item) => {
        return item.username !== 'admin';
    });


    if (user.name === 'admin') {
        res.send(JSON.stringify({
            user: user,
            tpl: adminTpl
        }));
    } else {
        res.send(JSON.stringify({
            user: user,
            tpl: userTpl
        }));
    }

    name = false;
}

function getRandomColor() {
    let colors = [
        '#060','#0C0','#0F0','#393','#499','#099','#066','#069','#033','#06C',
        '#039','#009','#00F','#33F','#06F','#00C','#006','#339','#669','#66F',
        '#60C','#96F','#90F','#90C','#C0F','#606','#939','#909','#C39','#603',
        '#C06','#903','#C00','#F00','#700','#900','#930','#C30','#C60','#960',
        '#C90','#630','#963','#996','#663','#330','#360','#030','#000','#444'];

    return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = function(app) {
    app.post('/check', function(req, res) {

        User.find().exec((err, data) => {

            if (err) console.log(err);

            allUsers = data;

        });

        User.find({}, {username: true, color: true}).exec((err, data) => {

            if (err) console.log(err);

            usersWithoutPass = data;

        });

        User.find({username: req.body.username}).exec((err, data) => {

            if (err) console.log(err);

            if (!data.length) {
                console.log('created a new user');
                let user = new User ({
                    _id: new mongoose.Types.ObjectId(),
                    username: req.body.username,
                    password: req.body.password,
                    color: getRandomColor(),
                    mute: false,
                    ban: false
                });

                user.save(err => {
                    if (err) throw err;

                    console.log('new user successfully saved', user);

                    sendAll(res, {
                        id: user._id,
                        name: user.username,
                        color: user.color,
                        mute: user.mute,
                        ban: user.ban
                    });
                });
            } else if ( req.body.password === data[0].password ) {
                sendAll(res, {
                    id: data[0]._id,
                    name: data[0].username,
                    color: data[0].color,
                    mute: data[0].mute,
                    ban: data[0].ban
                });
            } else res.send(false);

        });

        name = req.body.username;

    });

    app.post('/users', function (req, res) {

        User.find({ "_id" : { "$in" : req.body.users }}, {username: true, color: true, _id: false}).exec((err, data) => {

            if (err) console.log(err);

            res.send(JSON.stringify(data));
        });
    });

    app.post('/usersForAdmin', function (req, res) {

        User.find({ "_id" : { "$in" : req.body.users }}, {username: true, color: true}).exec((err, data) => {

            if (err) console.log(err);

            res.send(JSON.stringify(data));
        });
    });

    app.post('/userBan', function (req, res) {

        User.findByIdAndUpdate(req.body.id, { ban: true },
            function(err, user) {
                if (err) throw err;

                res.send(JSON.stringify(user));
        });
    });

    app.post('/userMute', function (req, res) {

        User.findByIdAndUpdate(req.body.id, { mute: true },
            function(err, user) {
                if (err) throw err;

                res.send(JSON.stringify(user));
        });
    });
};