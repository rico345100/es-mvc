import $ from 'jquery';
import UIController from 'esmvc/UIController';
import MyView from 'view/MyView';
import myModel from 'model/MyModel';
import myCollection from 'collection/MyCollection';

const myViewController = new UIController({
	view: MyView,
	model: myCollection,
	showView(cb) {
		if(!this.view.hasParent()) {
			this.view.appendTo($('body'));
		}

		this.view.attach($('body'));
		this.view.show();
	},
	hideView(cb) {
		this.view.hide(() => {
			this.view.detach();
			cb && cb();
		});
	},
	events: {
		'init': function() {
			this.model.add({ id: 1});
			this.model.add({ id: 2 });

			this.view.update();	
		},
		'#my-view-update-model click': function() {
			this.model.add({ id: 999 });
			this.view.update();
		}
	}
});

export default myViewController;