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
	}
	set(key, value) {
		appRegistry[this.key][key] = value;
	}
	get(key) {
		return appRegistry[this.key][key];
	}
	clear(key) {
		appRegistry[this.key][key] = {};
	}
}

export default UIRegistry;