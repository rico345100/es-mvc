import $ from 'jquery';
import UIView from 'esmvc/UIView';

const viewCache = {};

class UIDynamicView extends UIView {
	constructor(el, options = {}) {
		super(el, options);

		// save to the cache and remove from parent tree
		if(!viewCache[el]) {
			viewCache[el] = this.el;

			// remove id attribute and from the dom tree
			this.el.remove();
		}

		this.el = viewCache[el].clone();

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

export default UIDynamicView;