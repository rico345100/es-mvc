import UIController from 'esmvc/UIController';
import TodoCollection from 'collection/Todo';
import TodoCommunicator from 'communicator/Todo';
import TodoListView from 'view/TodoList';
import TodoItemController from 'controller/TodoItem';
import 'view/TodoList.css';

class TodoListController extends UIController {
	constructor(options = {}) {
		options.view = TodoListView;
		options.communicator = TodoCommunicator;
		options.model = TodoCollection;
		options.listen = {
			'added': function(text) {
				this.model.add({ text: text });
				this.update();
			},
			'updated': function(info) {
				let { idx, text } = info;

				this.model.set(idx, { text: text });
				this.update();
			},
			'deleted': function(info) {
				let { idx } = info;

				this.model.remove(idx);
				this.update();
			}
		};

		super(options);
	}
	update() {
		this.view.reset();
		
		this.model.get().map((md, idx) => {
			const todoItemController = new TodoItemController();
			todoItemController.setIdx(idx);
			todoItemController.setParent(this.view.el);
			todoItemController.bindModel(md);
		});
	}
}

export default TodoListController;