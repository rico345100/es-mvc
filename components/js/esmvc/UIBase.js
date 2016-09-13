import $ from 'jquery';

class UIBase {
	constructor(el, options = {}) {
		this.el = $(el);
		this.el.hide();		// hide element as default
	}
}

export default UIBase;