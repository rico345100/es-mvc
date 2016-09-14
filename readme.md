# ES-MVC - Boilerplate

![Image of ES-MVC](http://photon.modernator.me/album/rico345100@gmail.com/blog/es-mvc/logo.png)

ES-MVC is pure JavaScript MVC without any Frameworks or Libraries. It is based on ES2015 Modularization.

Please remind that this is just prototype, so anything can be changes in future.

## Usage
1. Clone repo
> git clone ...

2. Install node dependencies
> npm install

3. Install gulp globally if you didn't yet
> npm install -g gulp

4. Build resources
> gulp build

5. Run the app
> gulp serve

When you start the ES-MVC app, it automatically detects file changes and inject or refresh the page. It's based on browser-sync module, and you can modify options as much you want.

## Basic Fundamentals
ES-MVC is MVC framework, it means it has 3 fundamentals: Model, View, Controller.
Each are ES6 Classes, and called 'Basic components.' You can extend their functionalities just extends class. 

### UIBase
UIBase is basic class for all View type components. UIBase only has one property: this.el which represent single jQuery object.

```javascript
import UIBase from 'esmvc/UIBase';

const myBase = new UIBase('#my-base');
myBase.el.show();
```

### UIView
UIView is extended UIBase class that has more functionalities. UIView also has 'Event hook', which tell you after learn about controlling events.

```javascript
import UIView from 'esmvc/UIView';

const myView = new UIView('#my-view');
myView.el.show();
```

Most of time, you will use this component to manipulate actual dom element. If you need more functions to control your view, you create your custom UIView and attach the methods.

```javascript
import UIView from 'esmvc/UIView';

class MyView extends UIView {
	constructor(options) {
		super('#my-view', options);
	}
	show(cb) {
		this.el.fadeIn(300, cb);
	}
	hide(cb) {
		this.el.fadeOut(300, cb);
	}
}

const myView = new MyView();
myView.show();

```

### UIDynamicView
UIDynamicView is designed for controlling dynamic doms. This is useful when the dom elements are not a static.

```javascript
import UIDynamicView from 'esmvc/UIDynamicView';

const myView1 = new UIDynamicView('#my-view');
const myView2 = new UIDynamicView('#my-view');

myView1.appendTo($('body'));
myView2.appendTo($('body'));
```


### UITemplate
UITemplate is similar to the UIDynamicView, but difference is UIDynamicView is requires actual DOM object, but it is not.
In ES-MVC, you can require '\*.html', or '\*.tpl'.

```javascript
const myTemplate = require('template/MyTemplate.tpl');
```

In the above example, variable myTemplate has text of 'template/MyTemplate.tpl'. And then you can pass it into UITemplate constructor.

```javascript
const myView = new UITemplate(myTemplate);
```

Others are same as UIDynamicView. After initiated, UITemplate has same interface of UIDynamicView(Actually it just extended of UIDynamicView).


### UIModel
Now, let's explore model. UIModel is simple data container of single bunch of data. You can just think it is just special kind of object for saving data.
When creating UIModel, you must specify the schema, which easily expressed by JavaScrit array literal:

```javascript
import UIModel from 'esmvc/UIModel';

const myModel = new UIModel({
	schema: ["id", "name", "age"]
});

myModel.set({
	id: 1,
	name: '.modernator',
	age: 25
});

myModel.get('name');	// .modernator
```

Schema property can be a object literal, which calls "Advanced Schema.". Previous one is called "Simple Schema".

```javascript
const myModel = new UIModel({
	schema: {
		id: {
			default : 1
		},
		name: 1,
		age: 1
	}
});

myModel.get('id');	// 1
```

From now, UIModel only supports "default" option, but it will support more options later.

Like other classes, you can create your own Model. You can override default get/set method by overriding getModel and setModel method.

```javascript
import UIModel from 'esmvc/UIModel';

class MyModel extends UIModel {
	constructor(options) {
		super(options);
	}
	getModel(field) {
		console.log('Overrided get!');
		return field;
	}
	setModel(field, data) {
		console.log('Overeided set!');
		field = data;
		return;
	}
}

```

If you want to support async operation, you can create your asynchronous model easily:

```javascript
import UIModel from 'esmvc/UIModel';

class AsyncModel extends UIModel {
	constructor(options) {
		super(options);
	}
	getModel(field) {
		return new Promise((resolve, reject) => {
			// send data to server...
			setTimeout(() => {
				resolve();
			}, 1000);
		});
	}
	setModel(field, data) {
		return new Promise((resolve, reject) => {
			// send field and data via XHR to server...
			setTimeut(() => {
				resolve();
			}, 1000);
		});
	}
}

const asyncModel = new AsyncModel({
	schema: ["id", "name", "age"]
});

asyncModel.get()
.then((data) => {
	console.log(data);
});

```

### UICollection
UICollection is bunch of UIModels. That's why it has called collection. Similar to using UIModel, it requires schema option.

```javascript
import UICollection from 'esmvc/UICollection';

const myCollection = new UICollection({
	schema: ["id", "name", "age"]	// you can use both schema, simple and advanced.
});
```

Difference between UIModel and UICollection, UICollection has array of instantiated UIModel. You can get this with get method.

```javascript
let models = myCollection.get();
```

To create new model, you need to use add method.

```javascript
myCollection.add({ id: 1, name: '.modernator', age: 25 });
```

add method will returns index of created model, so if you can use it for accessing specific model with get method.

```javascript
let idx = myCollection.add({ ... });
console.log(myCollection.get(idx));
```

to remove specific model, use remove method.

```javascript
myCollection.remove(0);
```

to remove all models, use clear method.

```javascript
myCollection.clear();
```

get method of collection will return UIModel type object, so if you actually obtain data, you need to use get method again.

```javascript
let model = myCollection.get(0);
console.log(model.get('id'));
```

You can extend UICollection too:

```javascript
import UICollection from 'esmvc/UICollection';

class MyCollection extends UICollection {
	constructor(options) {
		super(options);
	}
	...
}

```

But if you want just using not plain UIModel, want to use extended your custom model, just specify model option when creating collection object.

```javascript
import UICollection from 'esmvc/UICollection';
import MyModel from 'model/MyModel';

const myCollection = new UICollection({
	model: MyModel,
	schema: { ... }
});

```


### UIController
Last thing of learning fundamentals of ES-MVC is UIController. UIController has power to control view and model, and mediate their actions.

```javascript
import UIController from 'esmvc/UIController';

const myController = new UIController({ ... });
```

UIController has three parameters: view, model, events.
view parameter must be set on create new controller object, otherwise, it throws exception. You can pass any type of view, and also you can just pass view class itself, not instantiated view object.

```javascript
import UIController from 'esmvc/UIController';
import MyView from 'view/MyView';

const myController = new UIController({
	view: MyView,
	...
});

// or
const myController = new UIController({
	view: new MyView(...),
	...
})
```

model parameter is optional, it just bind model to view automatically if it is exists. You can pass collection instead of model.

```javascript
import UIController from 'esmvc/UIController';
import MyCollection from 'collection/MyCollection';
import MyView from 'view/MyView';

const myController = new UIController({
	view: MyView,
	model: new MyCollection({ ... })		// collection requires schema, so controller can't make own
	...
});

```

Then you can access model in view's method.

```javascript
class MyView extends UIView {
	updateData() {
		const models = this.model.get();	// in this case, this.model is UICollection object.
		...
	}
}
```

Controller has unique ability to define custom properties and methods, not other classes, you can just write into parameter object.

```javascript
const myController = new UIController({
	view: MyView,
	model: new MyCollection({ ... }),
	myProperty: 1,
	myMethod: function() {
		...
	}
});
```

You can access any properties or methods inside of controller with using this keyword.

```javascript
const myController = new UIController({
	...
	myMethod: function() {
		console.log('this.myProperty: ' + this.myProperty);
	}
});
```

Also you can access view or model(collection) too.

```javascript
const myController = new UIController({
	view: MyView,
	model: new MyCollection({ ... }),
	updateView() {
		this.view.updateData();
	},
	printModel() {
		console.log(this.model.get());
	}
});
```

Third option is events, which controls "view's events". Only you need is specify query selector and event name as key, and pass event handler as value of object.

```javascript
const myController = new UIController({
	view: MyView,
	events: {
		'button click': function() {
			console.log('Button clicked!');
		}
	}
})
```

Event processing with controller is really simple. But do you remember that there is some kind of "event hook" on learning view? Let's go back to the view and figure out what is event hook.

#### Event hook
Event hook is not a big thing, just makes you create custom event to seperate your code into the controller.
Let's make custom view to understand this:

```javascript
class MyView extends UIView {
	show(cb) {
		this.hook('show');
		this.el.fadeIn(300, cb);
	}
}
```

You can see the 'this.hook' in MyView's show method. After you create hook over there, you can process that hook on the controller's events property.

```javascript
const myController = new UIController({
	view: MyView,
	events: {
		'show': function() {
			'Showing up view...'
		}
	}
});
```

Hook is really comfortable feature, make your code to more maintanable. You can anykind of hook, and also you can pass the data with hook:

```javascript
this.hook('show', { hello: 'world' });
```

```javascript
events: {
	'show': function(obj) {
		console.log(obj);	// Object { hello: 'world' }
	}
}
```

## Example - Creating simple todo list with ES-MVC