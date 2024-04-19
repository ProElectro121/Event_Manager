import express from 'express'
import mongoose from 'mongoose'

const app = express()
const PORT = 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const adminMail = "puspendra@gmail.com";

const Users = [];
let Events = [];
let Myevents = [];

const createUser = (name, email, password) => {
    const newUser = {
        name,
        email,
        password
    }
    return newUser;
};

let x = 0;

const createEvent = (name, place, date, time) => {
    const newEvent = {
        name,
        place,
        'date': date,
        'time': time,
        '_id': x,
        'registered': false
    }
    x += 1
    return newEvent;
};

app.post('/admin/newEvent', async (req, res) => {
    const curEvent = createEvent(req.body.title, req.body.place, req.body.curdate, req.body.curtime);
    Events.push(curEvent);
    res.redirect('/admin/createEvent');
})

app.post('/updateRegisteration', async (req, res) => {
    const eventId = await req.body.eventId;
    const newID = parseInt(eventId);
    console.log(Events);
    for (let i = 0; i < Events.length; i++) {
        if (newID == Events[i]._id) {
            if (Events[i].registered == false) {
                Events[i].registered = true;
            }
            else {
                Events[i].registered = false;
            }
        }
    }
    console.log(Events);
    res.redirect('/main');
})

app.post('/admin/deleteEvent', async (req, res) => {
    const eventId = await req.body.eventId;
    // Implement logic to delete the event from the array
    console.log(Events);
    const newID = parseInt(eventId);
    // Events = Events.filter(event => event._id !== eventId);
    let arr = []
    // for (let i = 0; i < Events.length; i++) {
    //     if (eventId === Events[i]._id) {
    //         continue;
    //     }
    //     arr.push(Events[i]);
    // }
    let index = -1;
    console.log('eventid', eventId);
    console.log("Events[0]._id", Events[0]._id);
    console.log(typeof (Events[0]._id), " ", typeof (eventId));

    for (let i = 0; i < Events.length; i++) {
        if (newID == eventId) {

            console.log('hiiiiiiiiiiiiiii');
            index = i;
            break;
        }
    }
    console.log(index);
    if (index !== -1) {
        // Remove the event from the array
        console.log(Events);
        Events.splice(index, 1);
        console.log(Events);
        res.redirect('/admin/createEvent');
    } else {
        res.status(404).send('Event not found');
    }

});

app.get('/', (req, res) => {
    res.render("index.ejs");
})





app.get('/admin', (req, res) => {
    res.render('admin.ejs');
})

app.get('/login', (req, res) => {
    res.render('loginPage.ejs');
})

app.get('/admin', (req, res) => {
    res.render('admin.ejs');
});

app.post('/login', async (req, res) => {
    console.log(req.body.email);
    const existingUser = Users.find(user => user.email === req.body.email);
    console.log(existingUser);
    if (existingUser) {
        if (existingUser.password === req.body.password) {
            if (req.body.email == adminMail) {
                res.redirect('/admin');
            }
            else {
                res.redirect('/main');
            }
        }
        else {
            res.send('wrong mail or passowrd. Please try again');
        }
    }
    else {
        res.send('User does not exist. Please register');
    }

})

app.get('/Register', (req, res) => {
    res.render('RegisterPage.ejs');
})

app.post('/Register', async (req, res) => {
    const newUser = createUser(req.body.username, req.body.email, req.body.password);
    console.log(Users);
    const existingUser = Users.find(user => user.email === req.body.email);
    if (existingUser) {
        return res.send('User already exist. Please login');
    }
    Users.push(newUser);
    if (req.body.email == adminMail) {
        res.redirect('/admin');
    }
    else {
        res.redirect('/main');
    }
})

app.get('/main', (req, res) => {
    res.render('main.ejs', {
        arr: Events
    })
})

app.get('/admin/createEvent', (req, res) => {

    res.render('createEvent.ejs', {
        arr: Events
    });
})

app.get('/main/regsitered', (req, res) => {
    var newarr = []
    for (let i = 0; i < Events.length; i++) {
        if (Events[i].registered == false) {
            newarr.push(Events[i]);
        }
    }
    res.render('eventsList.ejs', {
        arr: newarr
    })
})

app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
})

