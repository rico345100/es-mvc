import UIController from 'esmvc/UIController';
import TodoCollection from 'collection/Todo';
import TodoCommunicator from 'communicator/Todo';
import TodoListView from 'view/TodoList';
import TodoItemView from 'view/TodoItem';
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
			'updated': function() {
				this.update();
			},
			'deleted': function() {
				this.update();
			}
		};

		super(options);
	}
	update() {
		const todoListView = this.view.el;
		const col = this.model;
		const com = this.communicator;
		this.view.reset();
		
		this.model.get().map((md, idx) => {
			const todoItemController = new UIController({
				view: TodoItemView,
				model: md,
				communicator: com,
				events: {
					'model-binded': function() {
						this.view.update();
						this.view.appendTo(todoListView);
						this.view.show();
					},
					'.edit click': function() {
						let newText = prompt('Update', md.get('text'));
						col.set(idx, { text: newText });
						this.communicator.speak('updated');
					},
					'.delete click': function() {
						col.remove(idx);
						this.communicator.speak('deleted');
					}
				}
			});
		});
	}
}

export default TodoListController;