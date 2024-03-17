var humidController = require('./Controllers/humid')
const humid = new humidController()

var express = require('express');
var bodyParser = require('body-parser');
var app = express()
var cors = require('cors')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

var port = process.env.port || 8080;


//example API : http://localhost:8080/humid?esp_id=ESP001
app.get('/humid', async function (req, res) {
    const esp_id = req.query.esp_id; // Đảm bảo khai báo biến esp_id với từ khóa const để tránh lỗi
    try {
        const result = await humid.getHumid(esp_id);
        console.log(result);
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
