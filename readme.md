# Usage

js-cqrs is a lightweight and easy to use implementation of the cqrs pattern. It allows for quick integration due to simplified API.

```
var cqrs = require('js-cqrs');
var saveUser = require('./requests/SaveUserRequest');
var saveUserRequestHandler = require('./requests/SaveUserRequestHandler');
var userSaved = require('./events/UserSaved');

var eventListener1 = function(event){
	console.log('Processing UserSaved event 1');
	console.log(event);
}

var eventListener2 = function(event){
	console.log('Processing UserSaved event 2');
	console.log(event);
}

cqrs.AddCommandHandler(saveUser, saveUserRequestHandler);
cqrs.AddEventListener(userSaved, eventListener1);
cqrs.AddEventListener(userSaved, eventListener2);

var newSaveUserCommand = new saveUser({id: '1', firstName: 'Sebastian'});
cqrs.Send(newSaveUserCommand);
```