import $ from 'jquery';
import UIView from 'esmvc/UIView';
import 'view/MyView.css';

class MyView extends UIView {
	constructor(options) {
		super('#my-view');
	}
	show(cb) {
		this.el.show();
		typeof cb === 'function' && cb();
	}
	hide(cb) {
		this.el.hide();
		typeof cb === 'function' && cb();
	}
}

export default MyView;