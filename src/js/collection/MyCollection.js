import UICollection from 'esmvc/UICollection';
import UIModel from 'esmvc/UIModel';

const myCollection = new UICollection({
	model: UIModel,
	schema: {
		id: {
			default: 0
		}
	}
});

export default myCollection;