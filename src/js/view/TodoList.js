import $ from 'jquery';
import UITemplate from 'esmvc/UITemplate';
import TodoListTpl from 'template/todo-list.tpl';
import 'view/TodoList.css';

class TodoList extends UITemplate {
	constructor(options) {
		super(TodoListTpl, options);

		$('#todo-list').replaceWith(this.el);
		this.el.show();
	}
	reset() {
		this.el.empty();
	}
}

export default TodoList;