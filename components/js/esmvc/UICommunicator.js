const topics = {};

function hasTopic(topic) {
	return typeof topics[topic] !== 'undefined';
}

// class UICommunicator: Intermidiate controllers actions
class UICommunicator {
	constructor(options = {}) {
		if(!options.topic) {
			throw new Error('ES-MVC: UICommunicator must has topic.');
		}
		
		if(!hasTopic(options.topic)) {
			topics[options.topic] = {};
		}

		this.topic = options.topic;
	}
	normalizeTopic(key) {
		if(!topics[this.topic][key]) {
			topics[this.topic][key] = [];
		}
	}
	listen(key, fn) {
		this.normalizeTopic(key);
		return (topics[this.topic][key].push(fn)) - 1;
	}
	speak(key, value) {
		this.normalizeTopic(key);

		let listeners = topics[this.topic][key];
		
		for(var i = 0; i < listeners.length; i++) {
			listeners[i](value);
		}
	}
}

export default UICommunicator;