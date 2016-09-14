import $ from 'jquery';
import UIDynamicView from 'esmvc/UIDynamicView';

let uid = 0;
function getUid() {
	return uid++;
}

class UITemplate extends UIDynamicView {
	constructor(tpl, options) {
		if(!tpl) throw new Error('ES-MVC: UITemplate requires HTML Template string.');

		// create temp dom
		const tempDom = document.createElement('div');
		let tempDomEl = $(tempDom);
		
		// convert to actual html elements
		let tempId = 'es-mvc-ui-template-id-' + getUid();
		tempDomEl.attr('id', tempId).html(tpl);

		let el = tempDomEl.children();

		// detach this.el from tempDom
		// this will collected automatically by GC
		tempDomEl.remove();

		// now you have element, you can now make your own views.
		super(el, options);
	}
}

export default UITemplate;