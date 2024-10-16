// Create a new router
const express = require("express")
const router = express.Router()

// Importing the bcrypt 
const bcrypt = require('bcrypt')
const saltRounds = 10

router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

router.post('/registered', function (req, res, next) {
    // Hashing the password
    const plainPassword = req.body.password
    bcrypt.hash(plainPassword, saltRounds, function(err, hashedPassword) {
        if (err) {
            return next(err); // Handle error during hashing
        }

        // Using SQLQuery to insert the user data into the database
        let sqlquery = "INSERT INTO users (username, first_name, last_name, email, hashedPassword) VALUES (?, ?, ?, ?, ?)"
        
        // Collecting the user's data from the form and then storing it
        let newUser = [
            req.body.username,
            req.body.first,
            req.body.last,
            req.body.email,
            hashedPassword // Storing the hashed password
        ]

        // SQL Query will save the user data in the database
        db.query(sqlquery, newUser, (err, result) => {
            if (err) {
                return next(err) // Handle the error during database insertion
            }

            // saving data in database
            let message = 'Hello '+ req.body.first + ' '+ req.body.last +' you are now registered!  We will send an email to you at ' + req.body.email
            message += '. Your password is: '+ req.body.password +' and your hashed password is: '+ hashedPassword
            res.send(message)
        });
    });
});

// List all the users without showing any passwords
router.get('/list', function (req, res, next) {
    // Get user data without the hashed passowrd 
    let sqlquery = "SELECT username, first_name, last_name, email FROM users" // Exclude the hashedPassword
    db.query(sqlquery, (err, result) => {
        if (err) {
            return next(err)
        }

        // Render the list of users using list.ejs
        res.render('listusers.ejs', {availableUsers: result})
    });
});   

// Log-in page for users
router.get('/login', function (req, res, next) {
    res.render('login.ejs'); // Render the login page using login.ejs 
});

// Log-in page for users
router.post('/loggedin', function (req, res, next) {
    // Find users in the database
    let sqlquery = "SELECT hashedPassword FROM users WHERE username = ?";
    
    // Finding the users in the database
    db.query(sqlquery, [req.body.username], (err, results) => {
        if (err) {
            return next(err); // Handle error during database query
        }

        // Checking if the user is found
        if (results.length === 0) {
            return res.send('Login failed: Username not found.'); // This is if the user not found
        }

        // Get the hashed password from the database
        const hashedPassword = results[0].hashedPassword;

        // Compare the hashed password with the password entered by the user
        bcrypt.compare(req.body.password, hashedPassword, function(err, result) {
            if (err) {
                return next(err); // Handles any errors during the comparison between entered password and database password
            }
            else if (result === true) {
                // Login was successful
                return res.send('Login was successful! Welcome back, ' + req.body.username + '!');
            }
            else {
                // Login was failed
                return res.send('Login was failed: Your password was incorrect.');
            }
        });
    });
});

// Export the router object so index.js can access it
module.exports = router