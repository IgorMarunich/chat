import Message from '../models/messages';
import User from '../models/users';


module.exports = function(app) {

    app.get('/messages', function (req, res) {

        Message.find({}, {created: true, userID: true, message: true, _id: false}).exec((err, messages) => {

            if (err) console.log(err);


            User.find({ "_id" : { "$in" : uniqueUserID(messages) }}, {username: true, color: true}).exec((err, users) => {

                if (err) console.log(err);

                res.send(JSON.stringify({
                    messages: addPropertiesToMessages(messages, users)
                }));
            });


            function uniqueUserID(messages) {
                let obj = {};

                for (let i = 0; i < messages.length; i++) {
                    let str = messages[i].userID;
                    obj[str] = true;
                }

                return Object.keys(obj);
            }
            
            function addPropertiesToMessages(messages, users) {
                let newObj = [];

                for (let i = 0; i < messages.length; i++) {
                    for (let j = 0; j < users.length; j++) {
                        if (messages[i].userID == users[j]._id) {

                            newObj[i] = {};

                            newObj[i].m = messages[i].message;
                            newObj[i].created = messages[i].created;
                            newObj[i].id = messages[i]._id;
                            newObj[i].color = users[j].color;
                            newObj[i].name = users[j].username;

                            break;
                        }
                    }
                }
                return newObj;
            }

        });
    });
};