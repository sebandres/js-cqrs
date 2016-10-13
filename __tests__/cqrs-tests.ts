import { Cqrs, Event, EventListener, Command, CommandHandler } from "../index";

export class SaveUserRequest implements Command{
	data: any;
	constructor(data: any){
			this.data = data;
	}
}

export class SaveUserRequestHandler implements CommandHandler {
	handle(command: SaveUserRequest){
			var event = new UserSaved({firstName: command.data.firstName});
			Cqrs.Instance.Publish(event);
	}
}

export class UserSaved implements Event {
    data: any;
    constructor(data: any) {
        this.data = data;
    }
}

class EventListener1 implements EventListener {
	static processed: boolean = false;
	static firstName: string = "";
	handle(event: UserSaved) {
		EventListener1.processed = true;
		EventListener1.firstName = event.data.firstName;
	}
}

class EventListener2 implements EventListener {
	static processed: boolean = false;
	handle(event: Event): void {
		EventListener2.processed = true;
	}
}

Cqrs.Instance.AddCommandHandler(SaveUserRequest.prototype, new SaveUserRequestHandler(), null);
Cqrs.Instance.AddEventListener(UserSaved.prototype, new EventListener1(), null);
Cqrs.Instance.AddEventListener(UserSaved.prototype, new EventListener2(), null);

describe('Cqrs', () => {
  it('Maps commands and events together', () => {

		let newSaveUserCommand = new SaveUserRequest({ id: '1', firstName: 'Sebastian' });
		Cqrs.Instance.Send(newSaveUserCommand);

    expect(EventListener1.processed).toBe(true);
    expect(EventListener2.processed).toBe(true);
    expect(EventListener1.firstName).toBe("Sebastian");
  });
});
