---
layout: post
title: "함수형 프로그래밍"
comments: true
description: ""
keywords: ""
---


## index

- 순한맛
    - 함수형 프로그래밍이란?
- 보통맛
    - 지연 연산, 커링, 병렬성, 비동기
- 매운맛
    - Functor, Monad...





## What is Functional Programming

1. a programming paradigm
2. a coding style
3. a mindset

## Why Functional ?

1. More easy (what is prototype, this)
2. safer, easier to debug / maintain



## Again What is FP

- 고차 함수
- 일급 함수
- 커링
- 재귀
- 멱등성
- 순수 함수와 참조 투명성
- 불변성과 영속적 자료구조



## How...?

### Do everything with function

input -> output

```js
// Not functional
const name = "manhyuk";
const greeting = "Hi, I'm ";
console.log(gretting + name);
```



Input , output 개념으로 표현하지 않았기 때문에 functional하지 않다



```js
// Functional
function greet(name) {
  return "Hi I'm " + name;
}
greet("manhyuk");
```

input, output 으로 표현



### Pros. Avoid side effect

순수함수란 기본적으로 함수가 input만을 받아 output을 계산하는 함수를 뜻 한다.

```js
// Not pure
const name = "manhyuk";
function greet() {
  console.log("Hi I'm " + name)
}
```

`name` 변수를 input으로 받지 않고 전역 변수에서 읽어왔고 output 또한 없다



```js
// pure
function greet(name) {
  return "Hi I'm " + name;
}
```

output에 영향을 주는것은 input 뿐이다





## High Order Function

함수를 input으로 받거나 output으로 함수를 리턴하는 함

```js
function makeAdjectifier(adjective) {
    return function (string) {
        return adjective + ' ' + string;
    }
}

const coolifier = makeAdjectifier('cool');
coolifier('conference') // cool conference
```

`map, filter, reduce` 또한 고차함수의 일종이다
```js
// map
function map(f, iter) {
    const result = [];
    for (const it of iter) {
        result.push(f(it));
    }
    return result;
}
```
```js
// filter
function filter(f, iter) {
    const result = [];
    for (const it of iter) {
        if (f(it)) {
            result.push(it);
        }
    }
    return result;
}
```
```js
// reduce -> Imperative programming
const numbers = [1, 2, 3, 4, 5];
let total = 0;
for (const number of numbers) {
    total = total + number;
}
console.log(total);

// reduce -> Declarative programming
const add = (a, b) => a + b;
const reduce = (f, acc, iter) => {
    if (!iter) {
        iter = acc[Symbol.iterator]();
        acc = iter.next().value;
    }
    for (const it of iter) {
        acc = f(acc, a);
    }
    return acc;
};


reduce(add, 0, numbers);
// add(add(add(add(add(0, 1), 2), 3), 4), 5)
```
```js
// 명령형
const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9];
let total = 0
let limit = 2;
for (const number of numbers) {
    if (number % 2 === 0) {
        const temp = number * number;
        total = temp;
        if (--limit) {
            break;
        }
    }
}
console.log(total);

// 선언형
pipe(
    filter(number => number % 2),
    map(number => number * number),
    take(2)
)(numbers)
```

## Immutable

```js
const rooms = [1, 2, 3];
rooms[2] = 4;
console.log(rooms); // 1, 2, 4
```

이 코드는 rooms를 임의로 변경하기 때문에 rooms를 사용하는 다른곳에선 문제가 생길 수 있다.

```js
const rooms = [1, 2, 3]
const newRooms = rooms.map(room => {
    if (room === 3) {
        return 4;
    } else {
        return room;
    }
})
console.log(newRooms) // 1, 2, 4
```

rooms를 복사하여 새로운 newRooms라는 변수에 값을 변경했기 때문에

`rooms`를 사용하고 있는 다른 코드에서는 문제가 생기지 않게된다.


하지만 이 코드는 배열이 커지게 된다면 더 오래걸리고 더 메모리를 많이 차지하게 된다.

이를 해결하기 위해 `Persistane Data Structure` 를 사용하면 된다.

기존의 배열을 복사하기 위해 새 배열을 만드는것이 아니라

기존 배열의 요소들을 트리로 만든뒤 새로운 요소만 트리에 합쳐주면 된다. (structure sharing)

이러한 귀찮고 복잡한 과정을 `immuatable.js`를 통해 쉽게 구현이 가능하다.


### Lazy
```js
// 반복문을 사용한 일반적인 range 함수 
const range = length => {
    let i = -1;
    const result = [];
    while (++i < length) {
        result.push(i);
    }
    return result;
}
const list = range(2) // [0, 1]
reduce(add, list)
```

```js
const L = {};
L.range = function *(length) {
    let i = -1;
    while (++i < length) {
      yield i;
    } 
}
const list = L.range(2) // suspend (iterator)
// list.next()
reduce(add, list)
```
generator를 사용해 함수가 평가되기 직전까지 값이 만들어지지 않는다. (지연평가)

```js
//test
function test(name, time, f) {
    console.time(name)
    while(time--) {
        f()
    }
    console.timeEnd(name)
}

test('range', 10, () => reduce(add, range(10000))) // 500ms
test('L.range', 10, () => reduce(add, L.range(10000))) // 200ms
```




## 모나드에 대해서
1. 함수 합성 : compose(f, g)(x) = (f ∘ g)(x) = f(g(x))
2. Functor의 기본 : Array.map()에 대한 이해.

### Lifting
리프팅은 특정 타입을 다루는 함수를 특정 타입과 관련된 다른 타입을 다루는 함수로 변화시키는 방법

```js
function add10(x: number): number {
  return x + 10;
}
```
이 함수는 number에 대해서 오류없이 완벽하게 작동하는 순수함수이다.
하지만 number에 대해서만 작동하기 때문에 String 또는 List<number>에 대해서 작동하지 않는다.

```typescript
function add10ForArray(xArr: number[]): number[] {
  const resultArr: number[] = [];
  
  for (const x of xArr) {
    resultArr.push(add10(x));
  }
  
  return resultArr;
}
```
List<Number>에 대해서 작동하게 하기 위해 위와같은 함수를 추가로 만들어야한다.


만약에 String, List<String> 을 input으로 넣어도 잘 작동해야 한다면?
```js
function addA(x: string): string {
  return x + 'a';
}
```
```typescript
function addAForArray(xArr: string[]): string[] {
  const resultArr: string[] = [];
  
  for (const x of xArr) {
    resultArr.push(addA(x));
  }
  
  return resultArr;
}
```

이러한 중복코드를 줄일 수 있도록 도와주는게 리프팅이다

```typescript
function transFunctionForArray<P, R>(f: (x: P) => R): (x: P[]) => R[] {
  return (xArr: P[]): R[] => {
    const resultArr: R[] = [];
    
    for (const x of xArr) {
      resultArr.push(f(x));
    }
    
    return resultArr;
  }
}

const add10ForArray = transFunctionForArray<number, number>(add10);
const addAForArray = transFunctionForArray<string, string>(addA);
```

리프팅은 코드의 재사용성을 비약적으로 높여 주는 방법이다.
어떤 타입 A의 값을 다루는 함수가 있을 때, 이 함수를 A와 관련된 다른 타입 `F<A>` 의 값에도 적용하고 싶다면
그 타입을 지원하기 위한 코드가 들어간 새 함수를 만드는 게 일반적이다.

리프팅은 A타입의 값을 다루는 함수를 가지고 `F<A>` 타입의 값을 다루는 함수를 간단하게 정리할 수 있다.


### Functor
![functor](/images/fp/functor.jpg)

- 한 범주의 대상과 사상을 다른 범주로 대응하는 함수
- 자신을 구성하는 타입의 값을 다루는 함수를 리프팅하거나 자신에게 적용하는 방법을 제공해야 한다.
- 리프팅이 가능한 `F<T>` 꼴의 선언을 갖고, `(f: (x: A) => B) => (tx: F<A>) => F<B> 꼴 또는 (f: (x: A) => B, tx: F<A>) => F<B>` 꼴의 함수를 지원해야 한다.

가장 친숙한 예로 `map`이 functor의 일종이다.

```java
interface Functor<T> {
  <R> Functor<R> map(Function<T, R> f);
}
Int stringToInt(String string);
```


`map`은 단지 원소를 순회하는 용도가 아닌 `<T>타입`을 `<R>타입` 으로 변경해주는 기능이다.

`map`은 값을 꺼낼 수도 없고, 메소드로 값을 변경하는 용도밖에 없는데 사용하는 이유는
일반적으로 모델링할 수 없는 상황을 모델링할 수 있다.

간단하게 표현하자면
`Optional<String> -> map( stringToInt() ) -> Optional<Integer>` 로 표현할 수 있다


```js
[].map(i => i * i); 
[1].map(i => i * i);
```

```typescript
function parseBool(x: string): Maybe<boolean> {
  const isTrue = /^true$/;
  const isFalse = /^false$/;
  const caseIgnoredX = x.toLowerCase();
  
  if (isTrue.test(caseIgnoredX)) return new Just(true);
  else if (isFalse.test(caseIgnoredX)) return new Just(false);
  else return new Nothing;
}

function not(x: boolean): boolean {
  return !x;
}

parseBool('true')[map](not); // Just(false)
parseBool('false')[map](not); // Just(true)
parseBool('is not boolean')[map](not); // Nothing
```


### Monad

안전한 함수 합성을 위해 사용


~~js예제 코드가 생각안나서 java로..~~
```java
Cart cart = getCart();
if (cart != null) {
  Product product = cart.getProduct();
  if (product != null) {
    // ... ~
  }
}

// using monad
Optinal.ofNullable(getCart().ifPrenset(cart -> 
  Optinal.ofNullable(cart.getProduct().ifPresnet(product -> {
    // ...
  }))
))

// js
getCart().map(cart -> 
  cart.getProduct().map(product -> {
    // ...
  })
)
```
`Optional`도 모나드의 일종

값이 미래에 준비된다거나 지금 당장 평가할 수 없는 코드를 안전하게 사용하기 위한 방법













---

참고
1. https://overcurried.com
2. https://www.inflearn.com/course/함수형_ES6_응용편
3. https://www.youtube.com/watch?v=jI4aMyqvpfQ&ab_channel=naverd2
