# Class

> 이 내용은 모던 JS-Deep-dive 내용을 참고하였습니다.

자바스크립트는 **프로토 타입 객체지향 언어**이다. 프로토타입 언어는 클래스가 필요 없는 프로그래밍 언어다.

따라서 클래스 없이도 생성자 함수와 프로토타입을 통해 객체지향 언어의 상속을 구현할 수 있다. 하지만 ES6 에서 `class` 가 생기며 자바와 같은 클래스 기반 객체지향 프로그래밍 언어와 매우 흡사한 객체 생성을 할 수 있게 되었다.

자바스크립트에서 클래스는 흔히 Syntactic sugar(문법적 설탕)이라고 불린다. 그 이유는 앞서 이야기 했듯 생성자 함수와 프로토타입으로 구현할 수 있지만, 더 짧고 쉽게 사용하기 위해 class 가 추가되었다는 이유 때문이다.

이 내용은 반은 맞고 반은 틀렸다. 클래스와 생성자 함수는 모두 프로토타입 기반의 인스턴스를 생성하지만 정확히 동일하게 동작하지는 않는다.

**클래스는 생성자 함수보다 엄격하며 생성자 함수에서 제공하지 않는 기능도 제공한다**.

1. 클래스를 `new` 연산자 없이 호출하면 에러가 발생한다. 하지만 생성자 함수는 `new` 연산 없이 호출가능(일반 함수로 호출된다)
2. 클래스는 상속을 지원하는 `extends`, `super` 키워드를 제공한다.
3. 클래스는 호이스팅이 발생하지 않는 것 처럼 동작한다.(호이스팅은 일어난다)
4. 클래스 내부의 모든 코드에는 암묵적으로 `strict mode` 가 지정되며 **해제할 수 없다**.
5. 클래스는 `constructor`, 프로토타입 메서드, 정적 메서드 모두 `[[Enumerable]]` 값이 `false` 이다.(열거되지 않는다)
6. 클래스는 함수로 평가된다.

클래스에서 정의한 메서드의 특징

1. `function` 키워드를 생략한 축약 표현을 사용한다.
2. 객체 리터럴과는 다르게 콤마를 사용할 필요 없다.
3. 암묵적 `strict mode` 가 실행된다.
4. `for...in` 혹은 `Object.key` 메서드 등으로 열거할 수 없다.
5. 내부 메서드 `[[Constructor]]` 를 갖지 않는 `non-constructor` 이다. 따라서 `new` 연산자를 사용할 수 없다.

```js
const Person = "";
{
  console.log(Person); // ReferenceError: ...
  // 만약 호이스팅이 일어나지 않는다면 '' 가 출력되어야 한다! TDZ 에 빠짐.
  class Person {}

  console.log(typeof Person); // function
}

class Base {
  constructor(name) {
    this.name = name;
  }

  static fn() {
    return `${this.name} is static function constructor fn`;
  }

  fn() {
    return `${this.name} is prototype fn`;
  }
}

console.log(Base.fn()); // Base is static function constructor fn;

const a = new Base("1ilsang");
console.log(a.fn()); // 1ilsang is prototype fn;
```

### Ref

- 모든 자바스크립트 Deep-dive 25장. 클래스
