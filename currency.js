const mysql = require('mysql');
const convertCurrency = require('./currency'); // Import the currency conversion function

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'shop'
});

// Function to fetch and convert game prices
async function getGamesWithConvertedPrices(currency) {
    db.connect((err) => {
        if (err) throw err;
        console.log('Connected to MySQL Database!');
    });

    const query = 'SELECT id, name, price FROM games';
    
    db.query(query, async (err, results) => {
        if (err) throw err;
        
        const gamesWithConvertedPrices = [];
        
        for (let game of results) {
            const convertedPrice = await convertCurrency(game.price, currency);
            gamesWithConvertedPrices.push({
                id: game.id,
                name: game.name,
                priceInGBP: game.price,
                convertedPrice: convertedPrice || 'Error' // Handle errors if conversion fails
            });
        }

        // Return the games with their converted prices
        console.log(gamesWithConvertedPrices);
    });
}

// Example usage: Get games with prices converted to USD
getGamesWithConvertedPrices('USD');