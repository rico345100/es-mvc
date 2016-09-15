import UICollection from 'esmvc/UICollection';
import TodoModel from 'model/Todo';

class TodoCollection extends UICollection {
	constructor(options = {}) {
		options.model = TodoModel;
		super(options);
	}
}

export default TodoCollection;