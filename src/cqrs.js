"use strict";

var Cqrs = function () {
    // Instance stores a reference to the Singleton
    var instance;
    function init() {
        var commandHandlers = new Array();
        var eventListeners = new Array();
        return {
            AddCommandHandler: function (command, commandHandler) {
                commandHandlers[command.constructor.name] = commandHandler;
            },
            AddEventListener: function (event, eventListener) {
                if (!eventListeners[event.constructor.name])
                {
                    eventListeners[event.constructor.name] = new Array();
                }
                eventListeners[event.constructor.name].push(eventListener);
            },
            RemoveCommandHandler: function (command, commandHandler) {
                commandHandlers[command.constructor.name] = null;
            },
            RemoveEventListener: function (event, eventListener) {
                var specificEventListeners = eventListeners[event.constructor.name];
                if (!(!specificEventListeners)) {
                    for (var i = specificEventListeners.length; i--;) {
                        if (specificEventListeners[i] === eventListener) {
                            specificEventListeners.splice(i, 1);
                        }
                    }
                }
            },
            Send(command) {
                commandHandlers[command.constructor.name](command);
            },
            Publish(event) {
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