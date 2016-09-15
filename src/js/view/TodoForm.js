import $ from 'jquery';
import UITemplate from 'esmvc/UITemplate';
import TodoFormTpl from 'template/todo-form.tpl';
import 'view/TodoForm.css';

class TodoForm extends UITemplate {
	constructor(options) {
		super(TodoFormTpl, options);

		$('#todo-form').replaceWith(this.el);
		this.el.show();
	}
}

export default TodoForm;