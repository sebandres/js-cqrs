export class Event { }
export class Command { }

export interface EventListener { handle(event: Event) }
export interface CommandHandler { handle(command: Command) }

interface EventListenerContainer { listener: any, context: any }
interface CommandHandlerContainer { handler: any, context: any }

export class Cqrs {
    private static _instance: Cqrs;

    public static get Instance()
    {
        return this._instance || (this._instance = new this());
    }
    
    commandHandlers: Array<CommandHandlerContainer>;
    eventListeners: Array<Array<EventListenerContainer>>;
    constructor() {
        this.commandHandlers = new Array<CommandHandlerContainer>();
        this.eventListeners = new Array<Array<EventListenerContainer>>();
    }
    AddCommandHandler(command: Command, commandHandler: CommandHandler, context) {
        this.commandHandlers[typeof command.constructor.prototype] = { handler: commandHandler, context: context };
    }
    AddEventListener(event: Event, EventListener: EventListener, context) {
        if (!this.eventListeners[typeof event.constructor.prototype]) {
            this.eventListeners[typeof event.constructor.prototype] = new Array();
        }
        this.eventListeners[typeof event.constructor.prototype].push({ listener: EventListener, context: context });
    }
    RemoveCommandHandler(command: Command, commandHandler) {
        this.commandHandlers[typeof command.constructor.prototype] = null;
    }
    RemoveEventListener(event: Event, EventListenerContainer) {
        var specificEventListeners = this.eventListeners[typeof event.constructor.prototype];
        if (specificEventListeners) {
            for (var i = specificEventListeners.length - 1; i >= 0; i--) {
                if (specificEventListeners[i].listener === EventListenerContainer) {
                    specificEventListeners.splice(i, 1);
                }
            }
        }
    }
    Send(command: Command) {
        if (!this.commandHandlers[typeof command.constructor.prototype]) {
            throw "Command " + typeof command.constructor.prototype + " has no handler.";
        }
        var commandHandler = this.commandHandlers[typeof command.constructor.prototype];
        return commandHandler.handler.handle(command, commandHandler.context);
    }
    Publish(event: Event) {
        if (!this.eventListeners[typeof event.constructor.prototype])
            return;
        this.eventListeners[typeof event.constructor.prototype].forEach(function (EventListenerContainer: EventListenerContainer) {
            EventListenerContainer.listener.handle(event, EventListenerContainer.context);
        });
    }
};
