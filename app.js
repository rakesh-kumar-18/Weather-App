const express = require("express");
const https = require("https");
require("dotenv").config();

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

app.set("view engine", "ejs");

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function (req, res) {

    let query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function (response) {

        const statusCode = response.statusCode;

        if (statusCode === 200) {

            response.on("data", function (data) {

                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const desc = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageURL = " http://openweathermap.org/img/wn/" + icon + "@2x.png";

                query = query.toUpperCase();

                res.render('weather', { city: query, temperature: temp, explain: desc, image: imageURL });

                res.end();
            });

        } else {
            res.sendFile(__dirname + "/failure.html");
        }

    });
});

app.post("/failure", function (req, res) {
    res.redirect("/");
});

app.listen(process.env.PORT || 3000, function () {
    console.log("Server is running on port 3000");
});