import UIModel from 'esmvc/UIModel';

// class UICollection: Array of models
class UICollection {
	constructor(options = {}) {
		if(!options.schema) {
			throw new Error('ES-MVC: Collection requires schema.');
		}

		this.data = [];
		this.schema = options.schema;
		this.model = options.model || UIModel;
	}
	add(data) {
		let id = this.data.push(
			new this.model({
				schema: this.schema
			})
		);

		id -= 1;

		let model = this.data[id];

		for(var key in data) {
			model.set(key, data[key]);
		}

		return id;
	}
	get(id) {
		if(typeof id === 'undefined') {
			return this.data;
		}
		
		return this.data[id];
	}
	remove(id) {
		this.data.splice(id, 1);
	}
	clear() {
		this.data = [];
	}
}

export default UICollection;