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

DOM element for using UIDynamicView must use id. Other else, this won't work well. For most case, UITemplate is more suitable.


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

Others are same as UIDynamicView. After initiated, UITemplate has same interface of UIDynamicView.
Difference between UIDynamicView and UITemplate, former requires actual dom object and cache it. And when initiate new dynamic view, just clone the dom element.
Latter one is requires HTML string, and convert this into actual dom.


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

Basically, if you try to add something to model that has different schema, it throws error.
However, if you want to make your model mode flexible, means accept non-exists field, you can set the strict option to false.

```javascript
class FlexibleUserModel extends UIModel {
	constructor(options = {}) {
		options.strict = false;
		options.schema = ["id", "name", "age"];

		super(options);
	}
}

export FlexibleUserModel;
```

Now you can add non-exist field into your 'flexible' model.

```javascript
let userModel = new FlexibleUserModel();
userModel.set({
	id: 1,
	name: '.modernator',
	age: 25,
	job: 'programmer'
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

### Class extended Controller
Like other components, you can extend controller to initialize it's own actions.

```javascript
import UIController from 'esmvc/UIController';
import MyView from 'view/MyView';
import MyCollection from 'collection/MyCollection';

class MyController extends UIController {
	constructor(options = {}) {
		options.view = MyView;
		options.model = MyCollection;
		options.events = { ... };

		super(options);
	}
	customMethod() {
		// you can access your view and model here.
		this.view.update();
		this.model.clear();
	}
}
```

But if you prefer this way, you must initiate controllers.

```javascript
// entry js
import MyController from 'controller/MyController';
new MyController();
```

If you have mutiple controller to instantiate, use instantiate method instead.

```javascript
import { instantiate } from 'esmvc';
import MyController from 'controller/MyController';
import YourController from 'controller/YourController';

instantiate([MyController, YourController]);
```


## Adavanced fundamentals
ES-MVC is MVC framework, but sometimes, your controller has too much code. For reduce this, we provide the way to seperate your codes.

### UICommunicator
UICommunicator is efficient way to seperate your controller dependencies. Getting your application complex, you will soon notice that controllers has too much code.
And you will see that controllers are includes each other to make their execute their functions.

UICommunicator is mediator, listen the controller's message and speak to the other controllers. This means that you don't need to include another controllers in some controller's code, only you need is communicate with UICommunicator.
UICommunicator requires single option, topic.

```javascript
import UICommunicator from 'esmvc/UICommunicator';

class MyCommunicator extends UICommumicator {
	constructor(options) {
		options.topic = 'my';
		super(options);
	}
}
```

You must understand that UICommunicator is just optional(but heavily recommended), it means it does not matter what Model, Controller, View it is.
Only you should care about is topic and listeners.

After you have your own communicator, most easy way to use communicator is specify into controller.

```javascript
import UIController from 'esmvc/UIController';
import MyCommunicator from 'communicator/MyCommunicator';


class MyController extends UIController {
	constructor(options = {}) {
		...
		options.communicator = MyCommunicator;
		options.listen = {
			'something-changed': function(e) {
				console.log('something-changed', e);
			}
		};
	}
}
```

You can see the two options: communicator and listen. Latter one is for listening from communicator, so if your controller doesn't need to listen(means only have to speak), you don't need to specify it.
listen parameter is really similar to events. If you don't understand this system, just think that it is just pub/sub system.

Anyway, after you have communicator, you can speak to the communicator anytime you want.

```javascript
class MyController extends UIController {
	constructor(options = {}) {
		...
		options.communicator = MyCommunicator;
		options.events = {
			'button click': function() {
				this.communicator.speak('button-pressed', 'hi');
			}
		}
	}
}
```

Message will be sent all listeners who listens 'button-pressed' and receives 'hi'.

```javascript
class YourController extends UIController {
	constructor(options) {
		...
		options.listen = {
			'button-pressed': function(e) {
				console.log(e);		// hi
			}
		};
		...
	}
}
```

Controller can has multiple communicators. For this, must use communicators, not communicator. Both can't exists in single instance.

```javascript
import MyCommunicator from 'communicator/My';
import YourCommunicator from 'communicator/Your';

class MyController extends UIController {
	constructor(options = {}) {
		options.communicators = {
			my: MyCommunicator,
			your: YourCommunicator
		};
	}
	someMethod() {
		this.communicators.my.speak('move');
		this.communicators.your.speak('stop');
	}
}
```

Also listen must be named 'listens' if you are using multiple communicators.

```javascript
import MyCommunicator from 'communicator/My';
import YourCommunicator from 'communicator/Your';

class MyController extends UIController {
	constructor(options = {}) {
		options.communicators = {
			my: MyCommunicator,
			your: YourCommunicator
		};
		options.listens = {
			my: {
				'move': function() {
					console.log('I am moving');
				},
				'stop': function() {
					console.log('I am stopping');
				}
			}
		};
	}
}
```

You can send multiple arguments via speak method.

```javascript
...
this.communicator.speak('move', 10, 10);
...
```


### UIRegistry
ES-MVC has component to save data, called 'UIModel', but sometimes you just need global data store. Like application configuration or user information, these kind of data is not suitable for using UIModel.
UIRegistry is designed for that purpose, write data directly somewhere, and fetch it anywhere you need.
You can think this is instantiated global model, but UIRegistry doesn't have schema and useful methods.
It just have: set, get, remove, clear and that's it.

To extend registry for your purpose, simply extend UIRegistry.

```javascript
import UIRegistry from 'esmvc/UIRegistry';

class MyRegistry extends UIRegistry {
	constructor(options = {}) {
		options.key = 'my';
		super(options);
	}
}

export default MyRegistry;
```

Then just include this registry whereever you need. Remember that you need to instantiate it first.

```javascript
import MyRegistry from 'registry/MyRegistry';

const myRegistry = new MyRegistry();

class MyController extends UIController {
	constructor(options = {}) {
		options.view = MyView;
		...
		super(options);
	}
	someMethod() {
		myRegistry.set('some-data', 'helloworld');
	}
}
```

```javascript
import MyRegistry from 'registry/MyRegistry';

const myRegistry = new MyRegistry();

class YourController extends UIController {
	constructor(options = {}) { ... }
	yourMethod() {
		let data = myRegistry.get('some-data');
		console.log('some-data: ' + data);
	}
}
```

Like model, you can override basic Registry operations. To do this, override 'setData', 'getData', 'removeData', 'clearData'.
This is example for using UIModel as Registry to override basic operations.

```javascript
import UIRegistry from 'esmvc/UIRegistry';
import UserModel from 'model/User';

const userModel = new UserModel();

class UserRegistry extends UIRegistry {
	constructor(options = {}) {
		options.key = 'user';
		super(options);
	}
	setData(key, value) {
		userModel.set(key, value);
	}
	getData(key) {
		return userModel.get(key);
	}
	removeData(key) {
		userModel.remove(key);
	}
	clearData() {
		userModel.clear();
	}
}

export default UserRegistry;
```


## Example - Creating simple todo list with ES-MVC

Let's make our first ES-MVC application! What we will make is simple todo list:

![ES-MVC Todo App](http://photon.modernator.me:80/album/rico345100@gmail.com/blog/es-mvc/es-mvc-todo.png)

First we do is creating html.

/src/html/index.html
```html
<html>
	<head>
		<meta charset="UTF-8">
		<title>ES-MVC Todo</title>
		<link rel="stylesheet" href="/css/app.css" />
	</head>
	<body>
		<div id="todo-wrap">
			<div id="todo">
				<div id="todo-form"></div>
				<div id="todo-list"></div>
			</div>
		</div>
		<script src="/js/index.js"></script>
	</body>
</html>
```

Important tag is div#todo-form and div#todo-list. I will replace them with this templates:

/src/html/template/todo-form.tpl
```html
<form id="todo-form">
	<label>What you gonna do?</label>
	<input type="text" />
</div>
```

/src/html/template/todo-list.tpl
```html
<ul id="todo-list"></ul>
```

/src/html/template/todo-item.tpl
```html
<li>
	<p></p>
	<button class="edit">Edit</button>
	<button class="delete">×</button>
</li>
```

I will use template to seperate HTML and use UITemplate to control them.

Next, make /src/css/app.css

```css
* {
	padding: 0;
	margin: 0;
	box-sizing: border-box;
} 
a {
	text-decoration: underline;
}
img {
	border: none;
}

#todo-wrap {
	width: 100%;
	height: 100%;
}

#todo {
	position: absolute;
	top: 50%;
	left: 50%;
	width: 400px;
	height: 500px;
	margin-top: -250px;
	margin-left: -200px;
	background-color: #7f7d7b;
	border-radius: 10px;
	padding: 32px;
}
```

HTML and CSS is now ready, so time to using JavaScript. Make entry JavaScript file:
/src/js/index.js

```javascript
import { instantiate } from 'esmvc';
import TodoFormController from 'controller/TodoForm';
import TodoListController from 'controller/TodoList';

instantiate([TodoFormController, TodoListController]);
```

As you can see, I will make two controllers: TodoFormController, TodoListController. Let's make TodoForm first. What we gonna needs are Controller, View and Model with Collection.
/src/js/view/TodoForm.js

```javascript
import $ from 'jquery';
import UITemplate from 'esmvc/UITemplate';
import TodoFormTpl from 'template/todo-form.tpl';
import 'view/TodoForm.css';

class TodoForm extends UITemplate {
	constructor(options) {
		super(TodoFormTpl, options);

		$('#todo-form').replaceWith(this.el);
		this.el.show();
	}
}

export default TodoForm;
```

/src/css/view/TodoForm.css

```css
#todo-form > * {
	display: block;
	width: 100%;
	margin-bottom: 10px;
}
#todo-form label {
	font-size: 24px;
	color: #f8a279;
	text-align: center;
}
#todo-form input {
	border: none;
	background-color: #fff;
	border-radius: 5px;
	padding: 8px 16px;
	font-size: 20px;
	color: #2b2b2b;
}
#todo-form input:focus {
	outline: none;
}
```

/src/js/model/Todo.js

```javascript
import UIModel from 'esmvc/UIModel';

class TodoModel extends UIModel {
	constructor(options = {}) {
		options.schema = ["text"];
		super(options);	
	}
}

export default TodoModel;
```

/src/js/collection/Todo.js

```javascript
import UICollection from 'esmvc/UICollection';
import TodoModel from 'model/Todo';

class TodoCollection extends UICollection {
	constructor(options = {}) {
		options.model = TodoModel;
		super(options);
	}
}

export default TodoCollection;
```

Before make controller, let's make communicator first. I will use this for sending information like 'new todo created' to TodoListController.

/src/js/communicator/Todo.js

```javascript
import UICommunicator from 'esmvc/UICommunicator';

class TodoCommunicator extends UICommunicator {
	constructor(options = {}) {
		options.topic = 'todo';
		super(options);
	}
}

export default TodoCommunicator;
```

/src/js/controller/Todo.js

```javascript
import UIController from 'esmvc/UIController';
import TodoCommunicator from 'communicator/Todo';
import TodoFormView from 'view/TodoForm';

class TodoFormController extends UIController {
	constructor(options = {}) {
		options.view = TodoFormView;
		options.communicator = TodoCommunicator;
		options.events = {
			"submit": function(ev) {
				ev.preventDefault();
				
				let text = this.view.el.find('input[type=text]');

				this.communicator.speak('added', text.val());
				text.val('');
			}
		};

		super(options);
	}
}

export default TodoFormController;
```

/src/css/view/TodoList.css

```css
#todo-list {
	margin-top: 20px;
	height: 340px;
    overflow-y: auto;
}
	#todo-list > li {
		position: relative;
		display: block;
		background-color: #ffa57a;
		padding: 16px 24px;
		border-radius: 5px;
		margin-bottom: 20px;
		min-height: 60px;
	}
		#todo-list > li > p {
			font-size: 16px;
			color: #2b2b2b;
			width: 200px;
		}
		#todo-list > li > button {
			position: absolute;
			top: 50%;
			margin-top: -16px;
			background-color: #2b2b2b;
			border: none;
			color: #fff;
			font-size: 12px;
			padding: 8px;
			cursor: pointer;
			width: 40px;
		}
			#todo-list > li > button:hover {
				background-color: #3e3e3e;
			}
		#todo-list > li > .edit {
			right: 60px;
		}
		#todo-list > li > .delete {
			right: 10px;
		}
```

Not quite complicated, just checking Form submit event, and when it is emitted, tell the communicator that data has been added.

Next is TodoList and TodoItem. To make split the code, I will divide TodoItem from TodoList.

/src/js/view/TodoList.js

```javascript
import $ from 'jquery';
import UITemplate from 'esmvc/UITemplate';
import TodoListTpl from 'template/todo-list.tpl';
import 'view/TodoList.css';

class TodoList extends UITemplate {
	constructor(options) {
		super(TodoListTpl, options);

		$('#todo-list').replaceWith(this.el);
		this.el.show();
	}
	reset() {
		this.el.empty();
	}
}

export default TodoList;
```

/src/js/view/TodoItem.js

```javascript
import UITemplate from 'esmvc/UITemplate';
import TodoItemTpl from 'template/todo-item.tpl';

class TodoItem extends UITemplate {
	constructor(options) {
		super(TodoItemTpl, options);
	}
	show() {
		this.el.show();
	}
	update() {
		this.el.find('p').text(this.model.get('text'));
	}
}

export default TodoItem;
```

/src/js/controller/TodoList.js

```javascript
import UIController from 'esmvc/UIController';
import TodoCollection from 'collection/Todo';
import TodoCommunicator from 'communicator/Todo';
import TodoListView from 'view/TodoList';
import TodoItemController from 'controller/TodoItem';
import 'view/TodoList.css';

class TodoListController extends UIController {
	constructor(options = {}) {
		options.view = TodoListView;
		options.communicator = TodoCommunicator;
		options.model = TodoCollection;
		options.listen = {
			'added': function(text) {
				this.model.add({ text: text });
				this.update();
			},
			'updated': function(info) {
				let { idx, text } = info;

				this.model.set(idx, { text: text });
				this.update();
			},
			'deleted': function(info) {
				let { idx } = info;

				this.model.remove(idx);
				this.update();
			}
		};

		super(options);
	}
	update() {
		this.view.reset();
		
		this.model.get().map((md, idx) => {
			const todoItemController = new TodoItemController();
			todoItemController.setIdx(idx);
			todoItemController.setParent(this.view.el);
			todoItemController.bindModel(md);
		});
	}
}

export default TodoListController;
```

/src/js/controller/TodoItem.js

```javascript
import UIController from 'esmvc/UIController';
import TodoCommunicator from 'communicator/Todo';
import TodoItemView from 'view/TodoItem';

class TodoItemController extends UIController {
	constructor(options = {}) {
		options.view = TodoItemView;
		options.communicator = TodoCommunicator;
		options.events = {
			'model-binded': function() {
				this.view.update();
				this.view.appendTo(this.parent);
				this.view.show();
			},
			'.edit click': function() {
				let newText = prompt('Update', this.model.get('text'));
				this.communicator.speak('updated', {
					idx: this.idx,
					text: newText
				});
			},
			'.delete click': function() {
				this.communicator.speak('deleted', {
					idx: this.idx
				});
			}
		}; 
		super(options);
	}
	setIdx(idx) {
		this.idx = idx;
	}
	setParent(el) {
		this.parent = el;
	}
}

export default TodoItemController;
```

That's it. Important part is TodoItemController. This controller is not initiated when application starts, it only initiated when it need(means collection has data).
You can run this example by

> gulp build;gulp serve