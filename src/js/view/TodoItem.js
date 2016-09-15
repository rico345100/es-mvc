import UITemplate from 'esmvc/UITemplate';
import TodoItemTpl from 'template/todo-item.tpl';

class TodoItem extends UITemplate {
	constructor(options) {
		super(TodoItemTpl, options);
	}
	show() {
		this.el.show();
	}
	update() {
		this.el.find('p').text(this.model.get('text'));
	}
}

export default TodoItem;