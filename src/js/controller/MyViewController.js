import $ from 'jquery';
import UIController from 'esmvc/UIController';
import MyView from 'view/MyView';
import myModel from 'model/MyModel';

const myViewController = new UIController({
	view: MyView,
	showView(cb) {
		this.view.show(cb);
	},
	hideView(cb) {
		this.view.hide(cb);
	},
	events: {
		'#my-view-update-model click': function() {
			myModel.set('id', 1);
			myModel.set('age', 999);
			alert('Model updated!');
		},
		'#my-view-get-model click': function() {
			this.view.el.find('#my-view-text').text(JSON.stringify(myModel.get()));
		}
	}
});

export default myViewController;