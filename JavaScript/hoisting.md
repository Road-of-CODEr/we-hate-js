# Hoisting

## JavaScript의 변수가 선언되는 단계

JavaScript에서는 `var, let, const` 키워드를 통해서 변수를 선언한다. JavaScript는 변수 선언을 아래의 2단계를 거친다.

1. `선언 단계`: 변수 이름(식별자)를 실행 컨텍스트에 등록한다. 이를 통해 JavaScript Engine에 변수의 존재를 알린다.
2. `초기화 단계`: 값을 저장하기 위해 메모리 공간을 확보하고 암묵적으로 `undefined`를 할당해 초기화한다.
   - 이건 C 같은 언어에서는 변수를 선언한 후 초기화를 개발자가 직접 하지 않고 해당 변수의 값을 읽으면 쓰레기 값이 읽히는데, JavaScript는 `undefined`로 초기화해서, 이런 위험을 줄인다.

## Hoisting이란?

JavaScript에서는 이상하게도 아래와 같은 코드가 동작을 한다.

```javascript
console.log(score); // (1) undefined가 출력
var score; // (2) 변수 선언문
```

C와 같은 언어에서는 상상도 할 수 없는 일들이 일어나버렸다. 선언도 하기전에 변수를 사용했는데 `에러를 내지 않고, 그저 undefined만 출력한다`. 이건 **변수 선언이 소스코드가 실행될 때 일어나는 것이 아니라(런타임), 그전에 실행되기 때문이다.** JavaScript Engine은 소스코드를 실제로 실행하기 전에 `평가 과정`이라는 것을 가지는데, 이때 `변수 선언문, 함수 선언문 등의 모든 선언문`을 먼저 실행한다. 그래서 실제로 코드의 어디에서 변수가 선언되던지간에 항상 다른 코드보다 먼저 실행되는 것이다.

위의 코드를 보면 변수 선언문인 (2) 의 경우 코드가 실행되기 전에 실행되어, 코드가 실제로 실행되는 시점에 (1)에서 출력을 하면 `변수의 선언이 이미 완료된 후`라 `undefined`가 출력이 된다. 이를 쉽게 표현해서 `JavaScript Engine은 선언 문을 코드의 선두로 끌어올린다`라고도 표현할 수 있는데, 이러한 JavaScript 고유의 특징을 Hoisting이라고 한다.

## Hoisting 예시 살펴보기

```javascript
console.log(score); // (1)
var score = 80; // (2)
console.log(score); // (3)
```

위와 같은 코드가 있다면 어떻게 동작할까? 이때 `var score=80` 은 변수의 선언과 값의 할당이 하나의 문으로 단축해서 표현되어 있지만, 변수 선언과 값의 할당이 따로 이루어진것처럼 동작한다.

```javascript
console.log(score); // (1)
var score; // (2)
score = 80; // (3)
console.log(score); // (4)
```

즉, 위와 똑같이 동작한다. 이 (2)번 줄은 JavaScript Engine에 의해 Hoisting되고, 실제 값이 할당되는 (3) 은 원래의 소스코드가 실행되는 시점에 실행된다(런타임). 그래서 `(1) 은 undefined, (2) 는 80`을 출력한다.

## Temporal Dead Zone

- case1: let을 사용한 경우

```javascript
console.log(score); // (1)
let score; // (2)
score = 80; // (3)
console.log(score); // (4)
```

- case2: const를 사용한 경우

```javascript
console.log(score); // (1)
const score = 80; // (3)
console.log(score); // (4)
```

case1과 case2 모두 `ReferenceError: score is not defined` 에러를 발생 시킨다. 이를 보고 그럼 `const, let`은 hoisting이 되지 않는가 생각할 수 있다. 하지만 JavaScript는 `var, let, const` 등 모든 선언문은 호이스팅을 한다. 하지만 `const, let`와 `var` 가 다르게 동작하는 이유는 `초기화 단계`때문이다. `var`의 경우 호이스팅 될때 `undefined`로 초기화까지 완료된다. 하지만 `const, let`의 경우 **호이스팅 단계에서 초기화가 일어나지 않는다.** 이 키워드들은 런타임에 값이 평가가 될때 초기화가 된다. 그래서 이 평가가 일어나기 이전을 `temporal dead zone`이라고 부른고, 이때 해당 score 변수/상수에 접근하면 에러가 발생한다.

즉, 결론적으로 `let, const`도 호이스팅을 한다.

### 출처

[모던 자바스크립트 DeepDive](http://www.yes24.com/Product/Goods/92742567) 4장

[Are variables declared with let or const hoisted?](https://stackoverflow.com/questions/31219420/are-variables-declared-with-let-or-const-hoisted)
