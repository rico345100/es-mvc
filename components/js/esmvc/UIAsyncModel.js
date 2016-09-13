import UIModel from 'esmvc/UIModel';

class UIAsyncModel extends UIModel {
	constructor(options) {
		super(options);
		this.get = options.get ? options.get : super.getModel;
		this.set = options.set ? options.set : super.setModel;
	}
	getModel(field) {
		return this.get.apply(this, arguments);
	}
	setModel(field, data) {
		return this.set.apply(this, arguments);
	}
}

export default UIAsyncModel;