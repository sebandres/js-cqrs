export class Event { 
}
export class Command { 
}

export interface EventListener { handle(event: Event, context: any) }
export interface CommandHandler { handle(command: Command, context: any) }

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
        this.commandHandlers[(command as any).name] = { handler: commandHandler, context: context };
    }
    AddEventListener(event: Event, EventListener: EventListener, context) {
        if (!this.eventListeners[(event as any).name]) {
            this.eventListeners[(event as any).name] = new Array();
        }
        this.eventListeners[(event as any).name].push({ listener: EventListener, context: context });
    }
    RemoveCommandHandler(command: Command, commandHandler: CommandHandler) {
        this.commandHandlers[(command as any).name] = null;
    }
    RemoveEventListener(event: Event, EventListener: EventListener) {
        var specificEventListeners = this.eventListeners[(event as any).name];
        if (specificEventListeners) {
            for (var i = specificEventListeners.length - 1; i >= 0; i--) {
                if (specificEventListeners[i].listener === EventListener) {
                    specificEventListeners.splice(i, 1);
                }
            }
        }
    }
    Send(command: Command) {
        if (!this.commandHandlers[(command.constructor as any).name]) {
            throw "Command " + (command.constructor as any).name + " has no handler.";
        }
        var commandHandler = this.commandHandlers[(command.constructor as any).name];
        return commandHandler.handler.handle(command, commandHandler.context);
    }
    Publish(event: Event) {
        if (!this.eventListeners[(event.constructor as any).name])
            return;
        this.eventListeners[(event.constructor as any).name].forEach(function (EventListenerContainer: EventListenerContainer) {
            EventListenerContainer.listener.handle(event, EventListenerContainer.context);
        });
    }
};
