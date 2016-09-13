// class UIModel: Represent a single bunch of data
// void get([string field]): Returns specified field or all data
// void set(string field, var data)
// void set(object fields)
// void clear(): Clear model
// void getModel(string field): Define getter
// void setModel(string field, var data): Define setter
class UIModel {
	constructor(options = {}) {
		if(!options.schema) {
			throw new Error('Photon: UIModel must contain a schema!');
		}

		this.data = {};
		this.schema = {};

		// simple schema defs: schema: ["id", "age"] ...
		if(Object.prototype.toString.call(options.schema) === "[object Array]") {
			for(var i = 0; i < options.schema.length; i++) {
				this.schema[options.schema[i]] = 1;
			}
		}
		// advanced schema defs: schema: { id: { default: 0 } } ...
		else {
			this.schema = options.schema;
		}

		// reset fields
		this.clear();
	}
	getModel(field) {
		if(!field) {
			return this.data;
		}

		return this.data[field];
	}
	setModel(field, data) {
		if(typeof field === 'object') {
			for(var key in field) {
				this.set(key, field[key]);
			}
		}
		else if(typeof this.schema[field] === 'undefined') {
			throw new Error('Photon: Unknown field ' + field);
		}
		else {
			this.data[field] = data;
		}
		
		return this;
	}
	get(field) {
		return this.getModel(field);
	}
	set(field, data) {
		return this.setModel(field, data);
	}
	clear() {
		for(var key in this.schema) {
			if(typeof this.schema[key].default === 'undefined') {
				this.data[key] = undefined;
			}
			else {
				this.data[key] = this.schema[key].default; 
			}
		}
		
		return this;
	}
}

export default UIModel;