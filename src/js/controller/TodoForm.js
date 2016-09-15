import UIController from 'esmvc/UIController';
import TodoCommunicator from 'communicator/Todo';
import TodoFormView from 'view/TodoForm';

class TodoFormController extends UIController {
	constructor(options = {}) {
		options.view = TodoFormView;
		options.communicator = TodoCommunicator;
		options.events = {
			"submit": function(ev) {
				ev.preventDefault();
				
				let text = this.view.el.find('input[type=text]');

				this.communicator.speak('added', text.val());
				text.val('');
			}
		};

		super(options);
	}
}

export default TodoFormController;