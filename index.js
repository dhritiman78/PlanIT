const express = require('express')
const app = express()
const session = require('express-session')
const port =  process.env.PORT || 3000
const bodyParser = require('body-parser')
const nodemailer = require('nodemailer');
const otpGenerator = require('otp-generator');
// Include the hash function
const bcrypt = require('bcrypt')
const saltRounds = 10;

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


const mongoose = require('mongoose')

// require the routers
const { cssRouter, jsRouter, assetsRouter } = require('./routers/static_files_serving.js')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    port: 465,
    auth: {
        user: 'planit.team.224@gmail.com', // Change this to your email
        pass: 'lfcz szsi mfhk ohyt' // Change this to your password
    }
});

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
    app.post('/send-otp', async (req, res) => {
        const email = req.body.email;
        const user = await Users
        .findOne({ email: email });
        if (user != null) {
            const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
            req.session.otp = otp;
            req.session.emailforotp = email;
            
            const mailOptions = {
                from: 'planit.team.224@gmail.com', // Change this to your email
                to: email,
                subject: 'OTP for password reset',
                text: `Your OTP is ${otp}`
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                    req.session.isEmailsent = true;
                    res.send('<script>alert("OTP sent to your email!"); window.location.href = "/verify-otp";</script>')
                }
            });
        } else {
            res.send('<script>alert("User not found!"); window.location.href = "/forgot-password";</script>')
        }
    })
    app.post('/verify-otp', async (req, res) => {
        const otp = req.body.otp;
        if (otp == req.session.otp) {
            req.session.isOTPverified = true;
            res.send('<script>alert("OTP verified!"); window.location.href = "/forgot-password";</script>')
        } else {
            res.send('<script>alert("Invalid OTP!"); window.location.href = "/verify-otp";</script>')
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

        app.post('/forgot-password', async (req, res) => {
            const { password, confirmPassword } = req.body;
            if (password == confirmPassword) {
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                Users.findOneAndUpdate({ email: req.session.emailforotp }, { password: hashedPassword }).then(() => {
                    req.session.isOTPverified = false;
                    req.session.isEmailsent = false;
                    req.session.emailforotp = null;
                    req.session.otp = null;
                    if (req.session.isOTPverified == false && req.session.isEmailsent == false && req.session.emailforotp == null && req.session.otp == null) {
                        res.send('<script>alert("Password reset successful!"); window.location.href = "/log-in";</script>')
                    }
                }).catch((err) => {
                    console.log(err);
                });
            } else {
                res.send('<script>alert("Passwords do not match!"); window.location.href = "/forgot-password";</script>')
            }
        })
app.get('/forgot-password',async (req, res) => {
        if (req.session.isOTPverified == true) {
        res.render(`forgot-password`,{login: req.session.login, username: req.session.username, email: req.session.email})
        }
        else {
            res.redirect('/verify-otp')
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
    res.render(`${req.params.slug}`, { title: req.params.slug, login: req.session.login, username: req.session.username, email: req.session.email, isEmailsent: req.session.isEmailsent })
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
            const welcomenote = {
                from: 'planit.team.224@gmail.com', // Change this to your email
                to: email,
                subject: 'Welcome to PlanIT - Your Personal Productivity Assistant 🚀',
                text: `Dear ${name},

                Welcome aboard to PlanIT, your ultimate tool for maximizing productivity and staying organized! We're thrilled to have you join our community of empowered individuals who are taking charge of their tasks, reminders, and time management.
                
                At PlanIT, we understand the importance of staying on top of your responsibilities while maintaining a healthy work-life balance. With our intuitive task manager, reminder manager, and clock screensaver features, we've got you covered every step of the way.
                
                Here's a quick overview of what you can expect from PlanIT:
                
                Task Manager: Easily organize your tasks, set priorities, and track your progress towards your goals.

                Reminder Manager: Never miss a deadline or appointment again with customizable reminders tailored to your schedule.

                Clock Screensaver: Stay updated with the current time in real-time, keeping you on track and focused throughout your day.
                
                We're committed to providing you with a seamless and personalized experience to help you achieve your goals efficiently. If you ever have any questions, feedback, or need assistance, don't hesitate to reach out to our friendly support team at planit.team.224@gmail.com.
                
                Once again, welcome to the PlanIT family! We can't wait to see how you'll make the most out of our app and accomplish great things.
                
                Best regards,
                
                Team PlanIT`,
            };
            transporter.sendMail(welcomenote, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
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