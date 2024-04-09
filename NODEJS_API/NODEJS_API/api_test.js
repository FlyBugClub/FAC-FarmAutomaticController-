const express = require('express');
const app = express();
const port = 8080; // You can change the port number if needed
const HumidController = require('./Controllers/humid')

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
// Define a sample API endpoint

app.get('/humid/:esp_id', async (req, res) => {
    esp_id = req.params.esp_id
    const humidController = new HumidController();
    console.log("1")
    try {
        console.log("2")

        const humid = await humidController.getHumid(esp_id);
        console.log("3")
        console.log(humid);
        res.json(humid);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
