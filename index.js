const express = require('express')
const app = express()
const session = require('express-session')
const port = 3000
const bodyParser = require('body-parser')
// Include the hash function
const bcrypt = require('bcrypt')
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

const mongoose = require('mongoose')

// require the routers
const { cssRouter, jsRouter, assetsRouter } = require('./routers/static_files_serving.js')

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/plan_it', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to the database');
});
app.use(session({
    secret: 'yxaybmcy9j', // Change this to a secret key for session encryption
    resave: false,
    saveUninitialized: true
}));
const usersSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
  });
const remindersSchema = new mongoose.Schema({
    email: String,
    reminder: String,
    isdone: Boolean
  });
const tasksSchema = new mongoose.Schema({
    email: String,
    task: String,
    priority: String,
    isdone: Boolean
  });

const Users = mongoose.model('Users', usersSchema);
const Reminders = mongoose.model('Reminders', remindersSchema);
const Tasks = mongoose.model('Tasks', tasksSchema);

app.get('/done-reminder', (req, res) => {
    if (req.session.login != true) {
        res.send('<script>alert("You need to login to view this page!"); window.location.href = "/log-in";</script>')
    }
    else {
    const id = req.query.id;
    Reminders.findByIdAndUpdate(id, { isdone: true }).then(() => {
        // Redirect to "/reminders" after successful update
            res.redirect('/reminders');
    }).catch((err) => {
        console.log(err);
    });
    }
    })
app.get('/done-task', (req, res) => {
    if (req.session.login != true) {
        res.send('<script>alert("You need to login to view this page!"); window.location.href = "/log-in";</script>')
    }
    else {
    const id = req.query.id;
    Tasks.findByIdAndUpdate(id, { isdone: true }).then(() => {
        // Redirect to "/reminders" after successful update
            res.redirect('/tasks');
    }).catch((err) => {
        console.log(err);
    });
    }
    })
app.get('/delete-reminder', (req, res) => {
    if (req.session.login != true) {
        res.send('<script>alert("You need to login to view this page!"); window.location.href = "/log-in";</script>')
    }
    else {
    const id = req.query.id;
    Reminders.findByIdAndDelete(id).then(() => {
        // Redirect to "/reminders" after successful deletion
            res.redirect('/reminders');
    }).catch((err) => {
        console.log(err);
    });
    }
    })
app.get('/delete-task', (req, res) => {
    if (req.session.login != true) {
        res.send('<script>alert("You need to login to view this page!"); window.location.href = "/log-in";</script>')
    }
    else {
    const id = req.query.id;
    Tasks.findByIdAndDelete(id).then(() => {
        // Redirect to "/reminders" after successful deletion
            res.redirect('/tasks');
    }).catch((err) => {
        console.log(err);
    });
    }
    })

// Mount the routers
app.use('/css', cssRouter);
app.use('/js', jsRouter);
app.use('/assets', assetsRouter);


// Set view engine to ejs and serving from the views folder
app.set('view engine', 'ejs')
app.set('views', './views')

app.get('/', (req, res) => {
    res.render('index', { title: 'Home', login: req.session.login, username: req.session.username, email: req.session.email  })
    })

app.get('/reminders',async (req, res) => {
        if (req.session.login == true && req.session.email != null) {
        const reminders = await Reminders.find({ email: req.session.email });
        const num_reminders = await Reminders.countDocuments({ email: req.session.email });
        res.render(`reminders`, { title: req.params.slug, login: req.session.login, username: req.session.username, email: req.session.email , reminders: reminders, num_reminders: num_reminders })
        }
        else {
            res.send('<script>alert("You need to login to view this page!"); window.location.href = "/log-in";</script>')
        }
        })
app.get('/tasks',async (req, res) => {
        if (req.session.login == true && req.session.email != null) {
        const tasks = await Tasks.find({ email: req.session.email });
        const num_tasks = await Tasks
        .countDocuments({ email: req.session.email });
        res.render(`tasks`, { title: req.params.slug, login: req.session.login, username: req.session.username, email: req.session.email , tasks: tasks, num_tasks: num_tasks })
        }
        else {
            res.send('<script>alert("You need to login to view this page!"); window.location.href = "/log-in";</script>')
        }
        })

app.get('/profile',(req, res) => {
        if (req.session.login == true && req.session.email != null) {
            res.render(`profile`, {login: req.session.login, username: req.session.username, email: req.session.email  })
        }
        else {
            res.send('<script>alert("You need to login to view this page!"); window.location.href = "/log-in";</script>')
        }
        })
app.get('/log-out', (req, res) => {
    req.session.destroy();
    res.send('<script>alert("You have successfully logged out!"); window.location.href = "/";</script>')
    })
app.get('/:slug', (req, res) => {
    res.render(`${req.params.slug}`, { title: req.params.slug, login: req.session.login, username: req.session.username, email: req.session.email  })
    })


app.post('/signup-process', async (req, res) => {
    const { name, email, password, confirmPassword} = req.body;
    const isthereuser = await Users.countDocuments({ email: email });
    if ((name, email, password != null) && (name, email, password != '')&& password == confirmPassword && isthereuser == 0) {
         // Hash and salt the password
         const hashedPassword = await bcrypt.hash(password, saltRounds);
        const User = new Users({
            name: name,
            email: email,
            password: hashedPassword
            });
        await User.save().then(() => {
            req.session.login = true;
            req.session.username = name;
            req.session.email = email;
            console.log('User saved!')});
        
        res.send('<script>alert("You have successfully signed up!"); window.location.href = "/";</script>')
    }
    else if(isthereuser != 0){
        res.send('<script>alert("User already exists! Please login."); window.location.href = "/sign-up";</script>')
    }
    else if(password != confirmPassword){
        res.send('<script>alert("Passwords do not match! Please try again."); window.location.href = "/sign-up";</script>')
    }
    else{
        res.send('<script>alert("Please fill in all the fields correctly"); window.location.href = "/sign-up";</script>')
    }
    })    
app.post('/add_reminder', async (req, res) => {
    const reminder = req.body.reminder;
    const Reminder = new Reminders({
        email: req.session.email,
        reminder: reminder,
        isdone: false
        });
    await Reminder.save().then(() => {
        console.log('Reminder saved!')});
    res.redirect('/reminders')
    })
app.post('/add-task', async (req, res) => {
    const task = req.body.task;
        const Task = new Tasks({
            email: req.session.email,
            task: task,
            priority: 'none',
            isdone: false
        });

        try {
            await Task.save();
            console.log('Task saved!');
            res.redirect('/tasks');
        } catch (error) {
            console.error('Error saving task:', error);
            res.status(500).send('Error saving task.');
        }
});

app.post('/login-process', async (req, res) => {
    const {email, password} = req.body;
    // Write to find the user in the database
    const user = await Users.findOne({ email: email});
    if (user != null && await bcrypt.compare(password, user.password)) {
        req.session.login = true;
        req.session.username = user.name;
        req.session.email = user.email;
        res.send('<script>alert("You have successfully logged in!"); window.location.href = "/";</script>')
    } else {
        res.send('<script>alert("Invalid email or password"); window.location.href = "/log-in";</script>')
    }
    })    

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    })