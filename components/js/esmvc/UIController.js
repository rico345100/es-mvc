import $ from 'jquery';

// class UIController
// void setEvent(string sel, string name, function fn)
// void unsetEvent(string sel, string name, function fn)
// void destroy(): Destroy controller and deallocate all resources
class UIController {
	constructor(options = {}) {
		if(!options.view) {
			throw new Error('ES-MVC: UIController must contain a view!');
		}
		// bind view
		if(typeof options.view === 'function') {
			this.view = new options.view;
		}
		else {
			this.view = options.view;
		}
		// bind communicator
		if(typeof options.communicator === 'function') {
			this.communicator = new options.communicator;
		}
		else {
			this.communicator = options.communicator;
		}
		
		// copy properties and methods to current object
		for(var key in options) {
			if(key === 'view') continue;
			else if(key === 'model') continue;
			else if(key === 'communicator') continue;
			else if(key === 'listen') continue;
			
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

		// bind communication listeners
		if(options.listen) {
			if(!this.communicator) {
				throw new Error('ES-MVC: listen option is only available if it has communicator.');
			}
			
			let ref = this;
			for(var key in options.listen) {
				((key) => {
					this.communicator.listen(key, function() {
						options.listen[key].apply(ref, arguments);
					});
				})(key);
			}
		}

		// if it has model, bind to view
		if(options.model) {
			this.bindModel(options.model);
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
	bindModel(model) {
		if(typeof model === 'function') {
			this.model = new model();
		}
		else {
			this.model = model;
		}
		
		this.view.bindModel(this.model);
	}
}

export default UIController;