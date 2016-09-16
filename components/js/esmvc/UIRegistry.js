const appRegistry = {};

export function hasRegistry(key) {
	return typeof appRegistry[key] !== 'undefined';
}

class UIRegistry {
	constructor(key, options = {}) {
		if(!key) {
			throw new Error('ES-MVC: Registry needs key.');
		}

		this.key = key;
		
		if(!hasRegistry(key)) {
			appRegistry[key] = {};
		}

		this._registry = appRegistry[key];
	}
	setData(key, value) {
		this._registry[key] = value;
	}
	getData(key) {
		return this._registry[key];
	}
	removeData(key) {
		delete this._registry[key]
	}
	clearData() {
		this._registry = {};
	}
	set(key, value) {
		this.setData(key, value);
	}
	get(key) {
		return this.getData(key);
	}
	remove(key) {
		this.removeData(key);
	}
	clearData() {
		this.clearData();
	}
}

export default UIRegistry;