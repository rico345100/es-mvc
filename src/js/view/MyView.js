import $ from 'jquery';
import UITemplate from 'esmvc/UITemplate';
import 'view/MyView.css';

const MyViewTemplate = require('template/MyView.tpl');

class MyView extends UITemplate {
	constructor(options) {
		super(MyViewTemplate, options);

		this.listEl = this.el.find('#my-view-model-list');
	}
	update() {
		// print data from binded model
		this.listEl.empty();
		this.model.get().map((md) => {
			let itemEl = $('<li></li>').text(JSON.stringify(md.data));
			this.listEl.append(itemEl);
		});
	}
	show(cb) {
		this.hook('init');
		this.el.show();
		typeof cb === 'function' && cb();
	}
	hide(cb) {
		this.el.hide();
		typeof cb === 'function' && cb();
	}
}

export default MyView;