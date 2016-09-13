import $ from 'jquery';

// class UIController
// void setEvent(string sel, string name, function fn)
// void unsetEvent(string sel, string name, function fn)
// void destroy(): Destroy controller and deallocate all resources
class UIController {
	constructor(options = {}) {
		if(!options.view) {
			throw new Error('Photon: UIController must contain a view!');
		}

		if(typeof options.view === 'function') {
			this.view = new options.view;
		}
		else {
			this.view = options.view;
		}
		
		// copy properties and methods to current object
		for(var key in options) {
			if(key === 'view') continue;
			this[key] = options[key];
		}

		// bind event listeners
		// attach events
		if(options.events) {
			for(var key in options.events) {
				let splittedKey = key.split(' ');

				// if length of splitted is less then 2, attach it to the self
				if(splittedKey.length < 2) {
					this.setEvent(this.view.el, key, options.events[key]);
				}
				else {
					let elem = splittedKey[0];
					let evName = splittedKey[1];
					
					this.setEvent(this.view.el.find(elem), evName, options.events[key]);	
				}
			}
		}
	}
	setEvent(sel, name, fn) {
		sel.on(name, (ev) => {
			return fn.call(this, ev);
		});
	}
	unsetEvent(sel, name, fn) {
		sel.off(name, fn);
	}
}

export default UIController;