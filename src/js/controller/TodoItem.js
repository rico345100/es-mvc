import UIController from 'esmvc/UIController';
import TodoCommunicator from 'communicator/Todo';
import TodoItemView from 'view/TodoItem';

class TodoItemController extends UIController {
	constructor(options = {}) {
		options.view = TodoItemView;
		options.communicator = TodoCommunicator;
		options.events = {
			'model-binded': function() {
				this.view.update();
				this.view.appendTo(this.parent);
				this.view.show();
			},
			'.edit click': function() {
				let newText = prompt('Update', this.model.get('text'));
				this.communicator.speak('updated', {
					idx: this.idx,
					text: newText
				});
			},
			'.delete click': function() {
				this.communicator.speak('deleted', {
					idx: this.idx
				});
			}
		}; 
		super(options);
	}
	setIdx(idx) {
		this.idx = idx;
	}
	setParent(el) {
		this.parent = el;
	}
}

export default TodoItemController;