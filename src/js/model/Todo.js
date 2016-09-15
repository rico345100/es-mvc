import UIModel from 'esmvc/UIModel';

class TodoModel extends UIModel {
	constructor(options = {}) {
		options.schema = ["text"];
		super(options);	
	}
}

export default TodoModel;