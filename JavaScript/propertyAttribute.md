# Property Attribute

자바스크립트의 프로퍼티에 대해서 알아보고 객체의 속성을 다루는 방법을 알아보자.

> 해당 글은 모던 자바스크립트 딥 다이브 16 장을 요약했습니다.

자바스크립트에는 내부 슬롯(Internal slot)과 내부 메서드(Internal method)가 존재한다. 이것들은 JS 엔진의 구현 알고리즘을 설명하기 위해 ECMAScript 사양에서 사용하는 의사 프로퍼티(Pseudo property)와 의사 메서드(Pseudo method)이다.

이중 대괄호(`[[...]]`)로 감싼 이름들이 이에 해당한다. 엔진에서 동작하는 방식을 설명한 것이지 개발자가 직접 접근할 수는 없다. 단 일부 내부 슬롯/메서드에 한정해 접근 방법을 제공해 주고 있긴하다.

예를 들어 모든 객체는 `[[Prototype]]` 이라는 내부 슬롯을 갖는다. 이는 JS 엔진 내부 로직이므로 직접 접근할 수 없지만 `[[Prototype]]` 내부 슬롯은 `__proto__` 를 통해 간접적으로 접근할 수 있다.

```js
// JS-deep-dive 에제 16-01
const o = {};

// 내부 슬롯이므로 접근 불가능
o[[Prototype]]; // Error

// 단, 일부 내부 슬롯/메서드 에 한정해 간접적으로 접근할 수 있음.
o.__proto__; // Object.prototype
```

JS 엔진은 프로퍼티를 생성할 때 프로퍼티의 상태를 나타내는 프로퍼티 어트리뷰트를 기본값으로 자동 정의한다.

```js
// JS-deep-dive 예제 16-03
const person = {
  name: "Lee",
};

person.age = 20;

// 프로퍼티 어트리뷰트 정보를 제공하는 프로퍼티 디스크립터 객체를 반환한다.
Object.getOwnPropertyDescriptors(person);
/*
{
  name: { value: "Lee", writable: true, enumerable: true, configurable: true },
  age: { value: 20, writable: true, enumerable: true, configurable: true },
}
*/
```

객체의 프로퍼티 정보를 제공해주는 프로퍼티 디스크립터 객체를 살펴보면 `[[Value]]`(프로퍼티의 값), `[[Writable]]`(프로퍼티 값의 변경 가능 여부), `[[Enumerable]]`(프로퍼티의 열거 가능 여부), `[[Configurable]]`(프로퍼티 재정의 여부)가 존재하는 것을 알 수 있다.

**_해당 값을 변경해 객체의 성질을 변경시킬 수 있다._**

```js
// JS-Deep-dive 예제 16-08
const person = {};

Object.defineProperty(person, "firstName", {
  value: "Ungmo",
  writable: true,
  enumerable: true,
  configurable: false,
});

/*
person > {
  firstName: 'Ungmo',
};
*/

// [[Configurable]] 이 false 이므로 프로퍼티 변경이 불가능함.
// 따라서 delete 가 무시됨(에러 발생 하지 않음)
delete person.firstName;
```

해당 값을 사용해 완전한 불변객체를 만들어 줄 수 있다.

### Ref

- [모던 자바스크립트 Deep dive](http://www.yes24.com/Product/Goods/92742567) 16장 프로퍼티 어트리뷰트
