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

// Export the router object so index.js can access it
module.exports = router