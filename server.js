import express from 'express';
import WebSocket from 'ws';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import routes from './controllers';
import Message from './models/messages';
import User from './models/users';


const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.listen(port, () => { console.log('We are on ' + port); });

routes(app);


mongoose.connect('mongodb://localhost/chat').then(
    () => { console.log('db is ready') },
    err => { console.log('connection error ', err) }
);

let clients = {};

// WebSocket-сервер on 3001
const wsServer = new WebSocket.Server({
    port: 3001
});
wsServer.on('connection', function(ws) {

    let id = ws.protocol;


    User.find({ "_id" : id}).exec((err, data) => {

        if (err) console.log(err);

        if (data[0].ban) {
            clients[data[0]._id].close();
        }

        if (data[0].mute) {
            clients[data[0]._id].send(JSON.stringify({
                key: 'mute',
                data: [data[0]._id]
            }));
        }

    });

    clients[id] = ws;


    function isOnline(k, data) {


        wsServer.clients.forEach((client) => {

            if (client === ws && client.readyState === WebSocket.OPEN) {
                for (let key in clients) {
                    clients[key].send(JSON.stringify({
                        key: k,
                        data: data
                    }));
                }
            } else {
                ws.on('error', () => console.log("ws closed ", client.protocol))
            }
        });
    }

    function getClientsId(clients) {
        let c = [];
        for (let id in clients) {
            c.push(id);
        }
        return c;
    }

    isOnline('ids', getClientsId(clients));


    ws.on('message', function(message) {

        let m = JSON.parse(message);


        switch (m.sendKey){
            case 'message':

                User.find({ "_id" : m.id}).exec((err, data) => {

                    if (err) console.log(err);

                    if (!data[0].mute) {

                        let mess = new Message ({
                            _id: new mongoose.Types.ObjectId(),
                            message: m.m,
                            userID: m.id
                        });

                        mess.save(err => {
                            if (err) throw err;
                            console.log(m.m + ' successfully saved');
                        });

                        console.log('message data ', m );
                        isOnline('message', message);

                    } else {
                        console.log('id is mute ', m.id);
                    }

                });


                break;
            case 'logout':

                delete clients[m.id];
                isOnline('logout', getClientsId(clients));

                break;
            case 'mute':

                clients[m.id].send(JSON.stringify({
                    key: 'mute',
                    data: [m.id]
                }));

                break;
            case 'ban':

                clients[m.id].close();
                delete clients[m.id];
                isOnline('ban', getClientsId(clients));

                break;
            default:
                console.log("cannot get data");
        }

    });

    ws.on('close', function() {

        delete clients[id];

        isOnline('ids', getClientsId(clients));
    });

    ws.on('error', () => {
        console.log('error server');
    })

});