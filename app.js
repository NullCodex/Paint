require('newrelic');

// Set up variables
var app = require('express')();
var port = process.env.PORT || 8080;
var express = require('express');
var request = require('request');
var path = require('path');

require('./config')(app);
require('./routes')(app);

app.listen(port);