import $ from 'jquery';
import UIView from 'esmvc/UIView';

let uid = 0;
function getUid() {
	return uid++;
}

class UITemplate extends UIView {
	constructor(tpl, options = {}) {
		if(!tpl) throw new Error('ES-MVC: UITemplate requires HTML Template string.');

		// create temp dom
		const tempDom = document.createElement('div');
		let tempDomEl = $(tempDom);
		
		// convert to actual html elements
		//let tempId = 'es-mvc-ui-template-id-' + getUid();
		tempDomEl.html(tpl);

		let el = tempDomEl.children();

		// detach this.el from tempDom
		// this will collected automatically by GC
		tempDomEl.remove();

		// now you have element, you can now make your own views.
		super(el, options);

		if(options.parent) {
			this.appendTo(options.parent.el || options.parent);
		}
	}
	appendTo(el) {
		this._parentEl = el;
		el.append(this.el);
	}
	attach() {
		this._parentEl.append(this.el);
	}
	detach() {
		this.remove();
	}
	hasParent() {
		return !!(this._parentEl);
	}
}

export default UITemplate;