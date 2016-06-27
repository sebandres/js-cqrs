"use strict";

var Cqrs = function () {
    // Instance stores a reference to the Singleton
    var instance;
    function init() {
        var commandHandlers = new Array();
        var eventListeners = new Array();
        return {
            AddCommandHandler: function (command, commandHandler, context) {
                commandHandlers[command.name] = {handler: commandHandler, context: context};
            },
            AddEventListener: function (event, eventListener, context) {
                if (!eventListeners[event.name])
                {
                    eventListeners[event.name] = new Array();
                }
                eventListeners[event.name].push({listener: eventListener, context: context});
            },
            RemoveCommandHandler: function (command, commandHandler) {
                commandHandlers[command.name] = null;
            },
            RemoveEventListener: function (event, eventListener) {
                var specificEventListeners = eventListeners[event.name];
                if (!(!specificEventListeners)) {
                    for (var i = specificEventListeners.length; i--;) {
                        if (specificEventListeners[i] === eventListener) {
                            specificEventListeners.splice(i, 1);
                        }
                    }
                }
            },
            Send: function (command) {
                if (!commandHandlers[command.constructor.name]) 
                {
                    throw "Command " + command.constructor.name + " has no handler.";
                }
                var commandHandler = commandHandlers[command.constructor.name];
                return commandHandler.handler(command, commandHandler.context);
            },
            Publish: function (event) {
                if (!eventListeners[event.constructor.name])
                    return;
                eventListeners[event.constructor.name].forEach(function (eventListener) {
                    eventListener.listener(event, eventListener.context);
                });
            }
        };
    };
    if (!instance) {
        instance = init();
    }
    return instance;
};

module.exports = new Cqrs();