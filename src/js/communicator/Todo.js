import UICommunicator from 'esmvc/UICommunicator';

class TodoCommunicator extends UICommunicator {
	constructor(options = {}) {
		options.topic = 'todo';
		super(options);
	}
}

export default TodoCommunicator;