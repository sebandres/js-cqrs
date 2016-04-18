"use strict";

var jquery = require('jquery');
var UserSavedEvent = require('../events/UserSaved');
var cqrs = require('js-cqrs');

var SaveUserRequestHandler = function SaveUserRequestHandler(command) {

	console.log('Processing SaveUserRequestHandler');
	console.log(command);

	var root = 'http://jsonplaceholder.typicode.com';

	jquery.ajax({
	  url: root + '/users/1',
	  method: 'GET',
	  dataType: 'jsonp'
	}).then(function(data) {
	  var event = new UserSavedEvent();
	  event.newUser = data;
	  cqrs.Publish(event);
	});

	return null;
};

module.exports = SaveUserRequestHandler;