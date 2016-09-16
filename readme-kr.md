# ES-MVC - Boilerplate

![Image of ES-MVC](http://photon.modernator.me/album/rico345100@gmail.com/blog/es-mvc/logo.png)

ES-MVC는 프레임워크나 라이브러리 없이 순수하게 자바스크립트로 개발된 자바스크립트 MVC 라이브러리로, ES2015 모듈화를 기반으로 작성됩니다.

모든 기능들은 아직 프로토타입이므로 추후에 변경될 수 있습니다.


## 사용법
1. 저장소 클론
> git clone ...

2. 노드 디펜던시 설치
> npm install

3. gulp가 전역으로 설치되어있지 않다면 설치해주세요.
> npm install -g gulp

4. 리소스들을 빌드
> gulp build

5. 애플리케이션 실행
> gulp serve

ES-MVC 앱을 실행하면 자동으로 파일 변화를 탐지하고 페이지를 새로 불러옵니다. 여기에는 browser-sync 모듈이 사용되었습니다.

## 기본 요소
ES-MVC는 MVC 프레임워크입니다. 즉 모델(Model), 뷰(View), 컨트롤러(Controller) 3가지 기본 요소를 가집니다.
각각은 ES6 클래스들이며 이들을 기본 컴포넌트라고 부릅니다. 원한다면 여러분은 손쉽게 클래스를 상속해서 기능을 확장하시면 됩니다. 

### UIBase
UIBase는 모든 뷰 타입 컴포넌트의 기초 컴포넌트입니다. 이는 this.el 하나의 속성만을 가지며 이는 하나의 jQuery 객체입니다.

```javascript
import UIBase from 'esmvc/UIBase';

const myBase = new UIBase('#my-base');
myBase.el.show();
```

### UIView
UIView는 UIBase를 상속받은 클래스로, 더 많은 기능들을 제공합니다. 특히 'Event hook'이라는 유용한 기능이 있는데 이는 이벤트 제어에 대해 공부할 떄 알아보도록 하겠습니다.

```javascript
import UIView from 'esmvc/UIView';

const myView = new UIView('#my-view');
myView.el.show();
```

대부분, 여러분은 이 컴포넌트로 실제 DOM 엘리먼트를 제어할 것 입니다. 만약 뷰에 좀 더 많은 기능이 필요하면 UIView를 확장하고 메서드를 붙이면 됩니다.

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
UIDynamicView는 동적인 DOM을 제어하기 위해 설계되었습니다. 이는 정적이지 않은 DOM 엘리먼트들을 제어할 때 유리합니다.

```javascript
import UIDynamicView from 'esmvc/UIDynamicView';

const myView1 = new UIDynamicView('#my-view');
const myView2 = new UIDynamicView('#my-view');

myView1.appendTo($('body'));
myView2.appendTo($('body'));
```


### UITemplate
UITemplate은 UIDynamicView와 유사하지만, UIDynamicView는 실제 DOM 객체를 요구하는 반면 UITemplate은 그렇지 않습니다.
ES-MVC에서, 여러분은 '\*.html'파일과 '\*.tpl'파일을 불러오실 수 있습니다.

```javascript
const myTemplate = require('template/MyTemplate.tpl');
```

위 예제는 'template/MyTemplate.tpl' 파일을 읽어온 후 UITemplate의 생성자로 전달합니다.

```javascript
const myView = new UITemplate(myTemplate);
```

그 외에는 UITemplate은 UIDynamicView와 동일합니다. 이후 동작은 UIDynamicView와 동일합니다.
UIDynamicView와 UITemplate의 차이점은 다이나믹 View는 실제 DOM 객체를 캐쉬한 후 뷰를 만들때마다 복제하지만 UITemplate은 HTML 문자열을 실제 DOM 객체로 변환한다는 점 입니다.


### UIModel
이제 모델(Model)쪽을 살펴보겠습니다. UIModel은 하나의 데이터 덩어리를 보관합니다. 단순히 이를 데이터를 저장하기 위한 특수한 객체라고 생각하세요.
UIModel 객체를 만들때는 반드시 schema를 지정해주어야 하는데, 이는 배열 리터럴로 쉽게 표현할 수 있습니다.

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

또한 schema 속성은 객체 리터럴이 될 수도 있는데 이를 "Advanced Schema"라고 하고 방금 것을 "Simple Schema"라고 부릅니다.

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

현재로써는 UIModel은 default옵션만 지원하지만 추후에 더 많인 옵션이 추가될 것 입니다.

다른 클래스들처럼, 여러분은 여러분만의 모델을 확장할 수 있습니다. get/set 메서드의 동작을 변경하려면 getModel와 setModel 메서드를 구현하세요.

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

만약 비동기 동작을 지원하고 싶은 경우도 손쉽게 확장할 수 있습니다.

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
UICollection은 UIModel의 묶음입니다. 이게 바로 Collection이라고 이름 붙은 이유입니다. 모델처럼 UICollection도 Schema 옵션을 지정해야 합니다.

```javascript
import UICollection from 'esmvc/UICollection';

const myCollection = new UICollection({
	schema: ["id", "name", "age"]	// you can use both schema, simple and advanced.
});
```

UIModel과 UICollection의 차이점은 UICollection은 실제 인스턴스화된 UIModel들을 배열로 보관한다는 점 입니다. get메서드를 사용하면 원하는 모델에 접근할 수 있습니다.

```javascript
let models = myCollection.get();
```

모델을 추가하려면 add 메서드를 사용하세요.

```javascript
myCollection.add({ id: 1, name: '.modernator', age: 25 });
```

add 메서드는 생성된 모델의 번호를 반환하므로 이를 활용하면 해당 모델에 쉽게 접근할 수 있습니다.

```javascript
let idx = myCollection.add({ ... });
console.log(myCollection.get(idx));
```

특정 모델을 삭제하려면 remove 메서드를 사용하세요.

```javascript
myCollection.remove(0);
```

모든 모델을 삭제하려면 clear 메서드를 사용하세요.

```javascript
myCollection.clear();
```

get 메서드는 UIModel형 객체를 반환하므로, 최종적으로 데이터에 접근하려면 한번 더 get 메서드를 써야합니다.

```javascript
let model = myCollection.get(0);
console.log(model.get('id'));
```

원한다면 UICollection도 확장할 수 있습니다.

```javascript
import UICollection from 'esmvc/UICollection';

class MyCollection extends UICollection {
	constructor(options) {
		super(options);
	}
	...
}

```

하지만 만약 이를 확장하지 않고, 단순히 여러분이 커스터마이징한 모델 생성자를 쓰고 싶다면 UICollection 객체를 생성할 때 model옵션에 이를 전달하면 됩니다.

```javascript
import UICollection from 'esmvc/UICollection';
import MyModel from 'model/MyModel';

const myCollection = new UICollection({
	model: MyModel,
	schema: { ... }
});

```


### UIController
ES-MVC의 마지막 기본 요소는 UIController입니다. UIController는 뷰와 모델을 통제하고 이들의 행동을 중재합니다.

```javascript
import UIController from 'esmvc/UIController';

const myController = new UIController({ ... });
```

UIController는 3개의 파라미터: view, mode, events를 가집니다.
view 파라미터는 단드시 설정되어야 하며, 그렇지 않은 경우 예외를 전달합니다. 여기에는 View 클래스를 바로 전달해도 되고 인스턴스화된 객체를 전달해도 됩니다.

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

model 파라미터는 옵션으로, 모델을 전달하며 만약 설정되있을 경우 컨트롤러가 자동으로 뷰에 연결합니다. 모델대신 컬렉션을 전달할 수도 있습니다. 

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

이 후, 해당 뷰의 메서드에서 모델에 접근할 수 있습니다.

```javascript
class MyView extends UIView {
	updateData() {
		const models = this.model.get();	// in this case, this.model is UICollection object.
		...
	}
}
```

컨트롤러는 커스텀 속성과 메서드를 정의할 수 있는 특수한 능력이 있는데, 파라미터 객체에 그냥 작성하면 알아서 메서드와 속성으로 변환됩니다.

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

컨트롤러 내부 메서드에서는 해당 컨트롤러의 모든 속성과 메서드를 this키워드를 통해 접근할 수 있습니다.

```javascript
const myController = new UIController({
	...
	myMethod: function() {
		console.log('this.myProperty: ' + this.myProperty);
	}
});
```

또한 뷰와 모델(컬렉션)도 접근할 수 있습니다.

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

세 번째 옵션인 events는 뷰의 이벤트를 제어할 수 있게 해줍니다. 간단히 쿼리 셀렉터와 이벤트 이름을 키로, 이벤트 핸들러를 값으로 지정한 객체를 전달하세요.

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

컨트롤러를 통한 이벤트 처리는 굉장히 쉽습니다. 그런데 혹시 뷰에 대해 공부할 때 이벤트 훅(Hook)에 대한 것을 나중에 알아보겠다고 한 것을 기억하시나요? 이제 이 것을 알아볼 떄가 온것 같군요.

#### 이벤트 훅
이벤트 훅은 그리 거창한건 아니고 커스텀 이벤트 같은것을 생성해서 코드를 컨트롤러에서 제어할 수 있게 해주는 장치입니다.
커스텀 뷰를 만들어서 이해해보도록 하겠습니다.

```javascript
class MyView extends UIView {
	show(cb) {
		this.hook('show');
		this.el.fadeIn(300, cb);
	}
}
```

MyView의 메서드인 show에서 this.hook이 보이실겁니다. 저렇게 훅을 설정해놓으면 컨트롤러의 events 속성에서 처리할 수 있습니다.

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

훅은 굉장히 편한 기능이며 코드를 좀 더 유지보수하기 좋게 만들어줍니다. 여러분은 원하는 대로 훅을 마음껏 쓰실 수 있고, 데이터를 전달할 수도 있습니다.

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

### 컨트롤러를 class로 확장하기
다른 컴포넌트들처럼, 컨트롤러 또한 class 키워드를 이용해 속성들을 정의할 수 있습니다.

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

하지만 이 방법을 선호하신다면 반드시 컨트롤러를 인스턴스화 시켜주셔야 합니다.

```javascript
// entry js
import MyController from 'controller/MyController';
new MyController();
```

만약 여러 개의 컨트롤러를 인스턴스화해야 한다면 instantiate 메서드를 대신 사용해보세요.

```javascript
import { instantiate } from 'esmvc';
import MyController from 'controller/MyController';
import YourController from 'controller/YourController';

instantiate([MyController, YourController]);
```


## 고급 요소
ES-MVC는 MVC 프레임워크이지만 가끔씩 컨트롤러에서 너무 많은 코드가 집중될 때가 있습니다. 이를 줄이기 위해 ES-MVC는 여러 기능들을 제공합니다.

### UICommunicator
UICommunicator는 컨트롤러들의 의존성을 줄이는 가장 효율적인 방법입니다. 여러분의 애플리케이션이 복잡해지면 여러분은 곧 컨트롤러에 너무 많은 코드가 몰리는걸 보실 수 있으실 겁니다.
그리고 이 이유가 각각의 컨트롤러들의 기능을 사용하기 위해 이들을 서로 호출하기 때문이라는 것도 발견하게 될 것입니다.

UICommunicator는 중재자로써, 컨트롤러간에 메시지를 듣고 다른 컨트롤러에게 전달해줍니다. 이는 여러분이 다른 컨트롤러의 기능들을 쓰기 위해 어떤 컨트롤러의 코드에 다른 컨트롤러를 불러오는 것을 더 이상 하지 않아도 된다는 뜻이죠.
UICommunicator는 하나의 옵션, 토픽(Topic)만을 전달받습니다.

```javascript
import UICommunicator from 'esmvc/UICommunicator';

class MyCommunicator extends UICommumicator {
	constructor(options) {
		options.topic = 'my';
		super(options);
	}
}
```

UICommunicator는 단지 옵션이라는 것만을 이해하셔야 합니다(사용하는걸 강하게 권장하지만요). 이는 이 기능은 MVC랑 아무런 연관도 없다는 뜻 입니다.
여러분이 오직 신경써야 할 것은 토픽과 리스너들 뿐입니다.

여러분의 커뮤니케이터가 준비되었다면 커뮤니케이터를 활용하는 가장 쉬운 방법은 컨트롤러에 이를 할당하는 것 입니다.

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

두 개의 옵션 communicator과 listen이 보이실 것 입니다. 후자는 커뮤니케이터가 전달하는 정보를 듣기 위한 것이기 때문에 여러분의 컨트롤러가 일방적으로 말하기(speak)만 하는 경우는 필요없습니다.
listen 파라미터는 이벤트와 유사한데, 이 시스템이 이해가지 않으시면 그냥 구독/발행 구조라고 이해하셔도 됩니다.

어쨌든, 커뮤니케이터가 있으니 이제 여러분은 말하고 싶은게 있으면 뭐든 커뮤니케이터한테 말하면 됩니다.

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

'button-pressed'를 듣고 있는 모든 청취자들은 hi라는 값을 전달받을 것 입니다.

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


### UIRegistry
ES-MVC는 데이터를 저장하기 위한 'UIModel'이라는 컴포넌트가 있습니다. 하지만 가끔씩 여러분은 전역 저장소가 필요할 것 입니다. 예를 들면 애플리케이션의 설정이나 사용자 정보같은 것들이 있겠죠. 이러한 데이터는 UIModel로 다루기에 적합하지 않습니다.
UIRegistry가 바로 그러한 목적을 위해 설계되었고, 이는 어디에서나 데이터를 쓰고 어디에서나 불러올 수 있습니다.
이를 인스턴스화된 전역 모델 정도로 생각하셔도 되지만 UIRegistry는 스키마도 없고 유용한 메서드도 없습니다.
이는 단지 set, get, remove, clear 메서드 밖에 없습니다.

여러분만의 레지스트리를 만들고 싶다면 UIRegistry를 확장해도 됩니다.

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

그리고 레지스트리가 필요한 곳에서 불러오면 끝입니다. 기억해야 할 점은 사용하기 전에 인스턴스화를 해야한다는 점이죠.

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


## 예제 - 간단한 할일 목록을 ES-MVC로 만들기

이제 첫 ES-MVC 앱을 만들어봅시다! 우리가 할것은 간단한 할일 목록입니다.

![ES-MVC Todo App](http://photon.modernator.me:80/album/rico345100@gmail.com/blog/es-mvc/es-mvc-todo.png)

먼저 HTML 파일을 만듭니다.

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

중요한 부분은 div#todo-form과 #todo-list이며, 이들은 나중에 다른 템플릿으로 교체될 것 입니다.

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

이 템플릿들을 이용해 HTML 코드를 분리하였습니다. 이들은 나중에 UITemplate으로 제어할 것 입니다.
다음으로, /src/css/app.css 스타일을 만듭니다.

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

HTML과 CSS가 준비되었으니, 자바스크립트를 사용할 차례입니다. 먼저 엔트리 파일을 작성합니다.
/src/js/index.js

```javascript
import { instantiate } from 'esmvc';
import TodoFormController from 'controller/TodoForm';
import TodoListController from 'controller/TodoList';

instantiate([TodoFormController, TodoListController]);
```

코드를 보면 알 수 있겠지만, TodoFormController와 TodoListController를 만들 것 입니다. 먼저 TodoForm를 먼저 만들어보겠습니다. 필요한 것은 컨트롤러, 뷰, 그리고 모델과 컬렉션입니다.
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

컨트롤러를 만들기 전에 커뮤니케이터를 먼저 만들도록 합시다. 이 커뮤니케이터는 나중에 '새로운 할일이 추가됨'과 같은 정보를 TodoListController로 보낼 때 사용될 것 입니다.

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

별로 복잡한건 없고, Form submit 이벤트가 발생하면 커뮤니케이터에게 데이터가 추가됨만을 알려줄 뿐 입니다.
다음은 TodoList와 TodoItem이네요. 코드를 분리하기 위해서 TodoItem과 TodoList로 분리했습니다.

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

이게 전부입니다. 중요한 부분은 TodoItemController인데, 이 컨트롤러는 앱 시작시 인스턴스화 되지 않고 필요한 경우에만 인스턴스화 됩니다(이는 컬렉션에 데이터가 있을때를 말합니다).
예제를 실행하려면 아래 명령어를 치면 됩니다.

> gulp build;gulp serve