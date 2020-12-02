var express = require("express");
var app = express();
var PORT = process.env.PORT || 8080;

// Express app for parsing
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
require("./Routes/apiRouts")(app);
require("./Routes/htmlRoutes")(app);

app.listen(PORT, function() {
    console.log("App listening on PORT: " + PORT);
});