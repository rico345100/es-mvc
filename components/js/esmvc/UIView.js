import $ from 'jquery';
import UIBase from 'esmvc/UIBase';

// class UIView
// void hook(string evName, object args): Trigger custom event to pass View event to controller
class UIView extends UIBase {
	constructor(el, options = {}) {
		super(el, options);
	}
	hook(evName, args = {}) {
		this.el.trigger(evName, args);
	}
	bindModel(model) {
		this.model = model;
	}
}

export default UIView;