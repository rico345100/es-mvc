import $ from 'jquery';

// class UIController
// void setEvent(string sel, string name, function fn)
// void unsetEvent(string sel, string name, function fn)
// void destroy(): Destroy controller and deallocate all resources
class UIController {
	constructor(options = {}) {
		// validate
		// requires view
		if(!options.view) {
			throw new Error('ES-MVC: UIController must contain a view!');
		}
		// if communicator and communicators are both exists, throw exception
		else if(options.communicator && options.communicators) {
			throw new Error('ES-MVC: UIController can not have communicator and communicators option both.'); 
		}
		// communicator option is not compatible with listens
		else if(options.communicator && options.listens) {
			throw new Error('ES-MVC: communicator can only has listen parameter, not listens.');
		}
		// opposite
		else if(options.communicators && options.listen) {
			throw new Error('ES-MVC: communicators can only have listens parameter, not listen.');
		}

		// bind view
		if(typeof options.view === 'function') {
			this.view = new options.view;
		}
		else {
			this.view = options.view;
		}

		// bind communicator
		if(options.communicator) {
			this.bindCommunicator(options.communicator);
		}
		
		// bind communicators
		if(options.communicators) {
			if(typeof options.communicators === 'object') {
				this.bindCommunicators(options.communicators);
			}
			else {
				throw new Error('ES-MVC: communicators options must be an object.');
			}
		}

		// bind communication listeners
		if(options.listen) {
			if(!this.communicator) {
				throw new Error('ES-MVC: listen option is only available if it has communicator.');
			}
			
			this.bindListen(options.listen);
		}

		// bind listens
		if(options.listens) {
			if(!this.communicators) {
				throw new Error('ES-MVC: listens option is only available if it has communicators.');
			}

			this.bindListens(options.listens);
		}
		
		// copy properties and methods to current object
		for(var key in options) {
			if(key === 'view') continue;
			else if(key === 'model') continue;
			else if(key === 'communicator') continue;
			else if(key === 'communicators') continue;
			else if(key === 'listen') continue;
			else if(key === 'listens') continue;
			
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

		// if it has model, bind to view
		if(options.model) {
			this.bindModel(options.model);
		}
	}
	setEvent(sel, name, fn) {
		let self = this;

		sel.on(name, function(ev) {
			return fn.apply(self, arguments);
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
	bindCommunicator(communicator) {
		if(typeof communicator === 'undefined') {
			return;
		}
		else if(typeof communicator === 'function') {
			this.communicator = new communicator;
		}
		else {
			this.communicator = communicator;
		}
	}
	bindCommunicators(communicators) {
		this.communicators = {};

		for(let key in communicators) {
			let communicator = communicators[key];

			if(typeof communicator === 'function') {
				this.communicators[key] = new communicator;
			}
			else {
				this.communicators[key] = communicator;
			}
		}	
	}
	bindListen(listen) {
		let ref = this;

		for(var key in listen) {
			((key) => {
				this.communicator.listen(key, function() {
					listen[key].apply(ref, arguments);
				});
			})(key);
		}
	}
	bindListens(listens) {
		let ref = this;

		for(var communicator in listens) {
			((listen) => {
				for(var key in listen) {
					((key) => {
						this.communicators[communicator].listen(key, function() {
							listen[key].apply(ref, arguments);
						});
					})(key);
				}
			})(listens[communicator]);
		}
	}
}

export default UIController;