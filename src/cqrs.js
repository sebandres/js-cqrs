"use strict";

var Cqrs = function () {
    // Instance stores a reference to the Singleton
    var instance;
    function init() {
        var commandHandlers = new Array();
        var eventListeners = new Array();
        return {
            AddCommandHandler: function (command, commandHandler) {
                commandHandlers[command.name] = commandHandler;
            },
            AddEventListener: function (event, eventListener) {
                if (!eventListeners[event.name])
                {
                    eventListeners[event.name] = new Array();
                }
                eventListeners[event.name].push(eventListener);
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
            Send(command) {
                if (!commandHandlers[command.constructor.name]) 
                {
                    throw "Command " + command.constructor.name + " has no handler.";
                }
                return commandHandlers[command.constructor.name](command);
            },
            Publish(event) {
                if (!eventListeners[event.constructor.name])
                    return;
                eventListeners[event.constructor.name].forEach(function (eventListener) {
                    eventListener(event);
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