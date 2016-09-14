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

그 외에는 UITemplate은 UIDynamicView와 동일합니다. 이후 동작은 UIDynamicView와 동일한데 이는 UITemplate이 UIDynamicView를 상속받았기 때문입니다.


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