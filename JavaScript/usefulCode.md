# 의미있는 코드 및 구현체

### deepFreeze

`Object.freeze` 를 사용하면 최초 키를 동결시킬 수는 있으나 내부객체를 자동으로 동결시켜 줄 수는 없다. 이때문에 재귀적으로 순회하며 객체를 동결시켜야 한다.

```js
function deepFreeze(target) {
  if (!target || typeof target !== "object" || Object.isFrozen(target)) {
    return target;
  }

  Object.freeze(target);
  Object.entries(target).forEach(([key, value]) => deepFreeze(value));
}

const a = {
  b: "this is a.b",
  c: 123,
};

const b = {
  a,
  b: "this is b.b",
};

deepFreeze(b);
Object.isFrozen(b); // true
Object.isFrozen(b.a); // true

b.c = 123;
b.a.c = "321";

console.log(b);
```

### Scope-safe constructor

생성자 함수를 `new` 키워드로 사용하지 않고 호출하게 될 경우 `this` 바인딩이 달라진다.(`[[Constructor]]`) 따라서 `new` 연산자를 사용하지 않았을 경우 자동으로 넣어 생성자 호출시 휴먼에러를 방지한다.

```js
function Person(name) {
  // ES6
  if (!new target()) {
    // ES5
    // if (!this instanceof Person) {
    return new Person(name);
  }

  this.name = name;
  this.getName = function () {
    return `제 이름은: ${this.name} 입니다.`;
  };
}

const person1 = Person("1ilsang");
const person2 = new Person("2ilsang");

console.log(person1.getName());
console.log(person2.getName());
```

### instanceof

`instanceof` 를 구현해 보자.

`객체 instanceof 생성자 함수` 의 뜻은 우변의 생성자 함수의 `prototype` 에 바인딩된 객체가 좌변 객체의 _프로토타입 체인_ 상에 존재하는지 체크한다. 존재한다면 `true` 를 반환.

```js
function isInstanceof(instance, constructor) {
  const prototype = Object.getPrototypeOf(instance);

  if (prototype === null) return false;

  return (
    prototype === constructor.prototype || isInstanceof(prototype, constructor)
  );
}

console.log(isInstanceof(person, Person)); // true
console.log(isInstanceof(person, Object)); // true
console.log(isInstanceof(person, Array)); // false
```

### Ref

- 모던 자바스크립트 Deep-dive
- MDN
