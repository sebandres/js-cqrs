import { Cqrs, Event, EventListener, Command, CommandHandler } from "../index";

export class SaveUserRequest extends Command{
	constructor(public data: any){
		super()
	}
}

export class SaveUserRequestHandler implements CommandHandler {
	handle(command: SaveUserRequest){
			var event = new UserSaved({firstName: command.data.firstName});
			Cqrs.Instance.Publish(event);
	}
}

export class UserSaved extends Event {
    constructor(public data: any) {
		super()
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

var listener2 = new EventListener2()
Cqrs.Instance.AddCommandHandler(SaveUserRequest, new SaveUserRequestHandler(), null);
Cqrs.Instance.AddEventListener(UserSaved, new EventListener1(), null);
Cqrs.Instance.AddEventListener(UserSaved, listener2, null);

describe('Cqrs', () => {
  it('Maps commands and events together', () => {

		let newSaveUserCommand = new SaveUserRequest({ id: '1', firstName: 'Sebastian' });
		Cqrs.Instance.Send(newSaveUserCommand);

    expect(EventListener1.processed).toBe(true);
    expect(EventListener2.processed).toBe(true);
    expect(EventListener1.firstName).toBe("Sebastian");
  });
});

describe('Cqrs', () => {
  it('Should deal with removing listeners', () => {

		EventListener2.processed = false;
		
		Cqrs.Instance.RemoveEventListener(UserSaved, listener2);

		let newSaveUserCommand = new SaveUserRequest({ id: '1', firstName: 'Sebastian' });
		Cqrs.Instance.Send(newSaveUserCommand);

    expect(EventListener1.processed).toBe(true);
    expect(EventListener2.processed).toBe(false);
    expect(EventListener1.firstName).toBe("Sebastian");
  });
});
