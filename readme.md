# Usage

```
var cqrs = require('js-cqrs');
var saveUser = require('./requests/SaveUserRequest');
var saveUserRequestHandler = require('./requests/SaveUserRequestHandler');
var userSaved = require('./events/UserSaved');

var eventListener = function(event){
	console.log('Processing UserSaved event');
	console.log(event);
}

cqrs.AddCommandHandler(saveUser, saveUserRequestHandler);
cqrs.AddEventListener(userSaved, eventListener);

var newSaveUserCommand = new saveUser({id: '1', firstName: 'Sebastian'});
cqrs.Send(newSaveUserCommand);
```