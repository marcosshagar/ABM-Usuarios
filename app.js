var express = require('express');
var app = express();

require("./helpers/db");

app.get('/', function(req, res){
    res.send("Hello World");
});

app.listen(5000, function (){
  console.log("El servidor esta conectado");
});
