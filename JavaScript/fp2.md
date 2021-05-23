---
layout: post
title: "함수형 프로그래밍 - 2"
comments: true
description: ""
keywords: ""
---

## index
- 함수 합성
- 커링
- Functor
  - Maybe
  - Either 




## Composition (Currying)

```js
// 제곱 계산을 합니다.
const pow = (num1, num2) => {
  return Math.pow(num1, num2);
}

// 숫자를 음수로 만듭니다.
const negate = (num) => {
  return num * -1;
}

// 숫자에 더하기 1을 합니다.
const inc = (num) => {
  return num + 1;
}
```

위 함수를 기반으로 절차지향 스타일로 작성할 경우 아래와 같다.
```js
const powered = pow(2, 4);
const negated = negate(powered);
const result = inc(negated);

console.log(result); // -15
```

할당한 변수들은 한번만 사용하기 때문에 변수로 할당할 필요가 없기 때문에
한줄로 축약할 수 있다.

```js
inc(negate(pow(2, 4))); // -15
```

가독성이 좋지 않지만, 이러한 함수를 함수 컴포지션이라고 한다.

그리고 자세히 보면 수학시간에 배운 합성 함수가 생각 날 수 있다
*(h ・ g ・ f)(x) = h( g( f( x ) ) )*


### 조금 더 읽기 편한 함수 컴포지션(compose)

읽기 힘든 코드를 보기 좋게 바꾸어줄 함수를 하나 생성
```js
const compose = (...fns) => {  // ..., fn3, fn2, fn1
  return (...args) => {
    return fns.reduceRight(
      (res, fn) => [fn.call(null, ...res)], // 입력 받은 fns 를 오른쪽부터 실행
      args // 초기값으로 받은 파라미터
    )[0];
  }
};
```

compose 함수는
1. 실행할 함수 목록을 넘겨주면 새로운 함수를 반환
2. 새로 반환 받은 함수에 초깃값을 파라미터로 넘긴다
3. 초깃값을 가지고 실행할 함수 목록을 역순으로 순차적으로 실행해서 최종 결과를 반환


```js
const mySpecialFunc1 = compose(
  (num) => inc(num),
  (num) => negate(num),
  (num1, num2) => pow(num1, num2)
);

mySpecialFunc1(2, 4);
```

compose 함수를 사용한다면 더 읽기 쉬운 코드를 작성할 수 있다.


### Pointfree style로 살짝 더 보기 좋은 함수 컴포지션

`(num) => inc(num)` 형태는 왜 써줘야할까? 일종이 코드 중복 아닐까?

그리고 inc 함수는 num이라는 숫자 하나를 받는 함수이다.
익명 함수 `(num) => inc(num)` 또한 num이라는 인자를 받는 함수다.

이 익명 함수는 num을 가지고 그대로 inc함수를 실행한다.

결국 익명함수는 inc와 같다고 생각할 수 있다!!!! 

다시 생각해보면 위 코드는 아래와 같이 표현할 수 있다.

```js
const mySpecialFunc2 = compose(inc, negate, pow);
mySpecialFunc2(2, 4);
```

결과는 같지만 달라진점은 익명함수를 제거 하고 원래 실행하고자 했던 함수들을
그대로 넘겨준것이다. 

그리고 이런 코드 스타일을 `Pointfree Style`이라고 한다.

함수를 사용할 때 파라미터를 이용해 호출하지 않고 함수 자체를 이용하는 방식을

`Pointfree Style`이라고 한다.



### Compose의 순서를 반대로?

위에 있는 compose 함수는 너무나도 완벽하지만 한가지 단점을 가지고 있다.

오른쪽에서 왼쪽으로 함수를 실행하기 때문에 읽을때 불편하다.

함수의 실행을 왼쪽부터 실행시키기 위해 `pipe`라는 함수를 만들어 보자

```js
const pipe = (...fns) => { 
  return (...args) => {
    return fns.reverse().reduceRight( // 입력 받은 fns의 순서를 뒤집는다
      (res, fn) => [fn.call(null, ...res)], // 순서가 뒤집어진 fns 를 오른쪽부터 실행
      args // 초기값으로 받은 파라미터
    )[0];
  }
};
```

```js
const mySpecialFunc3 = pipe(pow, negate, inc)

mySpecialFunc3(2, 4); // -15
```

`pipe`를 사용한 결과는 `compose`를 사용한 결과와 같다.
그리고 왼쪽부터 읽을 수 있어 읽기 더 편하다.


### 커링: 파라미터를 모두 채우지 않는 한 함수로 남아있겠다.

person 객채에 아래 조건을 만족하는 결과를 만들고 싶다고 가정한다.

1. age는 삭제
2. work 라는 키를 job으로 변경

```js
const person = {
    name: 'nakata',
    age: 10,
    work: 'developer'
}
```

키를 삭제할 dissoc 함수를 만들고 키 이름을 변경할 rename 함수를 만든다.

```js
const dissoc = (dissocKey, obj) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (key === dissocKey) return acc;
      acc[key] = obj[key];
      return acc;
    },
    {}
  )
}


const rename = (keysMap, obj) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[keysMap[key] || key] = obj[key];
      return acc;
    },
    {}
  );
};
```

그리고 위에서 만든 pipe 함수를 이용해 결과를 구현해 본다.

```js
pipe(
  person => dissoc('age', person),
  person => rename({work: 'job'}, person)
)(person); // { name: 'nakta', job: 'developer' }

```

age 값을 지우고 work라는 키를 job으로 변경했다, 그런데 `dissoc`, `rename` 함수의 인자로
파라미터 두 개를 받기 때문에 익명함수를 써야만 함수를 호출할 수 있다.
그래서 인지 기분이 조금 언짢아진다


### 커링을 이용하자

커링을 사용하면 해결이 가능하다.

`파라미터를 모두 채우지 않는 한 함수로 남아있겠다` 라는 부제를 다시 보자

`dissoc` 함수는 두 개의 파라미터를 받아서 실행하는 함수이다. 커링을 이용한다면

`dissoc('age')` 처럼 파라미터를 하나만 넘겨서 실행 가능하다. 이 때 반환값은 두 번째 파라미터를 받는
새로운 함수이다. 즉, 파라미터를 부족하게 채울 경우 그 나머지 파라미터를 받을 수 있는 함수를 반환한다.


```js
const dissocAge = dissoc('age'); // (obj) => { obj 에서 'age' 키를 지워서 반환해 }
dissocAge(person); // { name: 'nakta', work: 'developer' }
```

위와 같은 형태의 코드가 작동할 수 있도록 커링을 적용해 보자.

```js
const dissocC = (dissocKey) => (obj) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (key === dissocKey) return acc;
      acc[key] = obj[key];
      return acc;
    },
    {}
  )
};

const renameC = (keysMap) => (obj) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[keysMap[key] || key] = obj[key];
      return acc;
    },
    {}
  );
};
```


기존의 코드와 다른점은 파라미터를 한번에 두 개 받는게 아닌
파라미터를 하나를 받고 또 파라미터 하나를 받는 함수를 리턴할 수 있도록 바꾸었다.

변경된 함수와 pipe를 사용해 보면 조금 더 깔끔한 코드를 작성할 수 있다.

```js
pipe(
  dissocC('age'),
  renameC({ work: 'job' })
)(person); // { name: 'nakta', job: 'developer' }
```


커링이 필요할때 매번 파라미터를 분리해서 함수를 반환하는 코드를 작성할 수 없다.
따라서 `curry`함수를 만들어 보자. (내부 구현은 그냥 읽어보기만 하자)

```js
const curry = (fn) => {
  const arity = fn.length;
  
  return function _curry(...args) {
    if (args.length < arity) {
      return _curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}
```

`dissoc`, `rename` 함수에 `curry` 함수를 감싸주기만 하면 적용할 수 있다.

```js
const dissoc = curry((dissocKey, obj) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      if (key === dissocKey) return acc;
      acc[key] = obj[key];
      return acc;
    },
    {}
  )
});


const rename = curry((keysMap, obj) => {
  return Object.keys(obj).reduce(
    (acc, key) => {
      acc[keysMap[key] || key] = obj[key];
      return acc;
    },
    {}
  );
});
```


## Functor

프로그래밍에서는 본질적인 데이터 복잡성 때문에 논리적 정확성이 떨어질ㄷ 때가 잇다. 데이터 추상화는 데이터의 단순함을 표현하는데 도움이 된다.

이를 위해 'Container(또는 흔히 Box 라고 칭함)' 를 만드는 방법이 있다. 

'Box'는 오직 데이터만 가지고 있으며, 그 외에 다른 책임을 가지지 않는다. 

즉, OOP 처럼 'Box' 에 프로퍼티나 상태를 변경하는 메소드를 제공하지 않는다.

변수를 가져오고 Box 안으로 값을 넣는다. 그리고 Box 는 함수형 로직을 통과시키는 동안 변수를 안전하게 지키며 필요할 때 즉시적으로 변수를 가져올 수 있다. 따라서 Box 는 아래의 두 가지 책임이 있다는 것을 알 수 있다.

1. 스스로 내부에 변수를 저장하고 있다.
2. 오직 우리가 필요로 할 때 변수를 되돌려 준다

또한 절대 Box 내부의 값은 변경되지 않는다.


### 상자에 값을 넣어보자

상자에 값을 넣기 전에 상자를 만들어 보자

```js
class Box {

}
```

class를 이용해서 간단하게 Box를 만들었다. 이제 값을 넣어보자

```js
class Box {
    constructor(value) {
        this.$value = value;
    }
    static of (value) {
        return new Box(value);
    }
}

const box1 = new Box('fp1') // Box('fp1')
const box2 = Box.of('fp2') // Box('fp2')
const box3 = Box.of(Box.of('fp3')) // Box(Box('fp3'))
```

Box 클래스는 new 키워드를 통해 인스턴스를 만들 수 있고, of 메소드를 이용할 수도 있다.

```js
pipe(
  dissoc('age'),
  rename({ work: 'job' })
)(person); // { name: 'nakta', job: 'developer' }
```

위 코드의 결과를 Box에 넣고 싶을 경우 new 키워드를 사용하게 된다면

```js
pipe(
  dissoc('age'),
  rename({ work: 'job' }),
  (value) => new Box(value)
)(person); // Box({ name: 'nakta', job: 'developer' })
```

이렇게 익명함수를 통해 생성해줘야 하지만 of 메소드를 통한다면 Pointfree style로 가능하다

```js
pipe(
  dissoc('age'),
  rename({ work: 'job' }),
  Box.of
)(person); // Box({ name: 'nakta', job: 'developer' })
```

### 상자 안에 있는 값을 바꾸려면?

상자에 값을 넣은 뒤에는 값을 변경해야 한다. 
값을 직접 바꿔보자

```js
const books = [
  { id: 'book1', title: 'coding with javascript' },
  { id: 'book2', title: 'speaking javaScript' },
];

// 첫 글자를 대문자로 바꿔줍니다.
const startCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// 객체에서 propName에 해당하는 값을 반환합니다.
const prop = curry((propName, obj) => {
  return obj[propName];
});

const findBookById = (id, books) => {
  return books.find((book) => book.id === id);
};

const getUpperBookTitleById = (id, books) => {
  return pipe(
    Box.of, // Box(books)
    (box) => findBookById(id, box.$value),
    prop('title'),
    startCase
  )(books)
};


getUpperBookTitleById('book1', books); // "Coding with javascript"
getUpperBookTitleById('book2', books); // "Speaking javaScript"
```

Box.of 메소드를 사용해 books를 상자 안에 넣고, 안에 넣은 books를 사용하기 위해 box.$value를 통해
books에 접근한다. prop 함수를 이용해 title 값을 가져오고, 최종적으로 startCase 함수를 이용해
첫 글자를 대문자로 바꾼다.


### 상자를 유지해서 값 바꿔주기 (함수자)


상자에서 값을 넣고 다시 빼서 쓸거면 뭐하러 상자에 넣을까? 상자에 값을 넣은 행동이 의미 있게

상자 안에 값을 유지한 상태로 바꿔보자. 상자에 특별한 메소드를 추가한다


```js
class Box {
  constructor(value) {
    this.$value = value;
  }
  
  static of (value) {
    return new Box(value);
  }
  
  map(fn) {
    return new Box(fn(this.$value));
  }
}
```


Box 클래스에 추가한 map 메소드는 파라미터를 함수로 넘겨주고 있다. 그리고 다시 Box 로 감싸서 반환한다.
즉, `상자 안에 값이 있고 이 값에 함수를 적용해서 새로운 상자를 반환한다`


```js
const addFive = (num) => {
  return num + 5;
}

// 첫 글자를 대문자로 바꿔줍니다.
const startCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

Box.of(1).map(addFive); // Box(6)
Box.of(1).map(addFive).map(addFive); // Box(11)
Box.of('hello, FP').map(startCase); // Box('Hello, FP')
```


Box에 값을 넣고 map 메소드를 이용하면 새로운 Box 인스턴스를 반환하지만 결과적으로는
값을 변경할 수 있게 된다 (immutable)

같은 타입을 반환하는 map 메소드를 구현한 객체 즉 Funtor를 알아 보았다.

Box는 map 메소드를 구현하고, map의 결과는 다시 Box를 반환하는 하는 특성으로
Box는 Functor 라고 부를 수 있게 되었다.

> 동일한 개념으로 JS에 Array도 함수자이다


```js
const books = [
  { id: 'book1', title: 'coding with javascript' },
  { id: 'book2', title: 'speaking javaScript' },
];

// 첫 글자를 대문자로 바꿔줍니다.
const startCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// 객체에서 propName에 해당하는 값을 반환합니다.
const propC = curry((propName, obj) => {
  return obj[propName];
});

const findBookByIdC = curry((id, books) => {
  return books.find((id) => book.id === id);
});

// 함수자에 map 메소드를 실행할 helper 함수
const map = curry((fn, functor) => {
  return functor.map(fn);
});

const getUpperBookTitleById2 = (id, books) => {
  return pipe(
    Box.of, // Box(books)
    map(findBookByIdC(id)), // Box(book)
    map(propC('title')), // Box('book title');
    map(startCase) // Box('Book title');
  )(books)
};

getUpperBookTitleById2('book1', books); // Box("Coding with javascript")
getUpperBookTitleById2('book2', books); // Box("Speaking javaScript")
```

Box에 있는 $value에 직접 접근하는 대신 map 메소드를 이용해 최종적으로 원하는 결과를 가져왔다.

근데 왜 이 함수자를 쓸까? 굳이 값을 상자 안에 넣어야 하는 진짜 이유가 있을까?

### 예외 처리를 위한 함수자

함수 합성을 이용하다보면 문제가 있다. 바로 예외처리가 힘들다는 점인데, 아래 코드를 보자

```js
getUpperBookTitleById2('book1', books); // Box("Coding with javascript")
getUpperBookTitleById2('book2', books); // Box("Speaking javaScript")
getUpperBookTitleById2('book3', books); // Cannot read property 'title' of undefined
```

book3 을 찾으려는 경우에는 에러가 발생하게 된다. 에러를 막기 위해서는 함수에서 예외처리를 해줘야 한다.

먼저 prop 함수에서 null 체크를 해보자
```js
const prop = curry((propName, obj) => {
  return obj && obj[propName];
});
```

수정을 하면 prop 함수에서는 에러가 발생하지 않지만, startCase 함수에서 또 에러가 발생하게 된다.

함수 중첩이 여러개 되어있다면 모든 함수들에 예외를 추가해줘야하는 번거로움이 생기고 코드도 복잡해지게 된다.

### Maybe

이런 상황을 해결하기위해 Maybe라는 함수자를 사용하면 된다.

```js
class Maybe {
  constructor(value) {
    this.$value = value;
  }
  
  static of(value) {
    return new Maybe(value);
  }
  
  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }
  
  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }
  
  toString() {
    return this.isNothing ? 'Nothing' : `Just(${this.$value})`
  }
}
```

Maybe는 두 가지 상태를 가진다. Nothing 과 Just 

Nothing 은 $value가 null이거나 undefined인 경우이다.
Just는 Nothing과 반대로 값을 가진 경우이다.

Box의 map과 조금 다른점이 있는데 Nothing 상태일때는 fn 함수를 적용하지않고 Nothing 상태의 Maybe를 반환한다.

Just 상태일 때만 fn 함수를 적용해 반환한다.

```js
const getUpperBookTitleById3 = (id, books) => {
  return pipe(
    Maybe.of, // Just(books)
    map(findBookByIdC(id)), // undefined -> Nothing
    map(propC('title')),
    map(startCase)
  )(books)
};

getUpperBookTitleById3('book1', books); // Just("Coding with javascript")
getUpperBookTitleById3('book2', books); // Just("Speaking javaScript")
getUpperBookTitleById3('book3', books); // Nothing
```


Box를 Maybe로 하나만 변경했는데 에러 없이 결과만 Nothing 상태의 Maybe가 나왔다.

Maybe를 이용하면 $value 값이 null 또는 undefined가 되는 순간 뒤에 모든 함수를 무시하게 된다.

이런 패턴을 Railway Oriented Programming 이라고 한다.


### 값 꺼내기

상자 안에 값을 넣어 처리했기 때문에 마지막에는 값을 꺼내서 사용해야 한다.

$value에 접근해서 값을 꺼내도 상관없지만, Nothing 상태인 경우 default 값을 반환하는 함수를 만들어 보자.

```js
const getOrElse = curry((defaultValue, fn, maybe) => {
  return maybe.isNothing ? defaultValue : fn(maybe.$value);
});

const getUpperBookTitleById4 = (id, books) => {
  return pipe(
    Maybe.of,
    map(findBookByIdC(id)),
    map(propC('title')),
    getOrElse(`${id} Not Found`, startCase)
  )(books)
};

getUpperBookTitleById4('book1', books); // "Coding with javascript"
getUpperBookTitleById4('book2', books); // "Speaking javaScript"
getUpperBookTitleById4('book3', books); // "book3 Not Found"
```


### Maybe의 한계 

map을 이용해서 함수 합성을 할때 Nothing이 되는 순간 그 뒤로 실행해야할 map들을 모두 무시할 수 있었기 때문에,
에러 처리를 편리하게 할 수 있었다.

그리고 마지막엔 Maybe 의 값을 default로 지정하거나 조회할 수 있었다.

하지만 마지막에 Nothing시에 기본값을 반환하는게 아니라 특별한 처리를 하고 싶다면 어떻게 해야할까?

저자명이 Axel인 경우 console.log로 아니면 console.err 로 로그를 출력해보자


```js
const booksWithAuthor = [
  { id: 'book1', title: 'coding with javascript', author: 'Chris Minnick, Eva Holland' },
  { id: 'book2', title: 'speaking javaScript', author: 'Axel Rauschmayer' },
];

const validateBookAuthor = (book) => {
  return book.author.indexOf('Axel') > -1 ? Maybe.of(book) : Maybe.of(null);
}
```

validateBookAuthor 함수를 통해 저자가 Axel이 아니면 Nothing을 반환한다.

```js
const logByMaybeStatus = (maybeAxelBook) => {
  if (maybeAxelBook.isNothing) {
    // console.error로 책 저자 로그
  } else {
    // console.log로 책 저자 로그
    console.log(maybeAxelBook.$value.author);
  }
}

const logBookAuthor = (bookId, books) => {
  return pipe(
    findBookByIdC(bookId),
    validateBookAuthor,
    logByMaybeStatus
  )(books)
};

logBookAuthor('book1', booksWithAuthor); // Nothing
logBookAuthor('book2', booksWithAuthor); // Just({ id: 'book2', title: 'speaking javaScript', author: 'Axel Rauschmayer' })
```

다음으로 저자명을 로그로 출력한다. Just인 경우에만 출력한다.
Nothing 인 경우에는 에러로그를 출력해야하는데 $value 값이 undefined이거나 null 이다.



### Either : Maybe의 상위호환
Maybe는 에러 상황에 기본 값만 지정하는게 최선이다. Nothing 상태일때도 참조할만한 값을 갖고있다면 해결할 수 있다. 

그렇다면 Just와 같이 값을 출력하기만 하면 된다.

이런 상황에서 에러 처리시에 참조할 값을 들고 있는 함수자가 바로 Either 이다.

Either는 총 3개의 클래스를 구현한다.



```js
class Either {
  constructor(value){
    this.$value = value;
  }

  static right(value) {
    return new Right(value)
  }

  static left(value) {
    return new Left(value);
  }
}

class Right extends Either {
  get isRight() {
    return true;
  }

  get isLeft() {
    return false
  }

  map(fn) {
    return new Right(fn(this.$value));
  }
}

class Left extends Either {
  get isRight() {
    return false;
  }

  get isLeft() {
    return true;
  }

  map(fn) {
    return this;
  }
}
```

Maybe의 상태가 Nothing, Just 인것 처럼 Either의 상태는 Left, Right이다.

Left인 경우에 Nothing이 매치되고, Right인 경우에 Just가 매치 된다.


Left, Right 클래스의 구현 차이점은 map 메소드이다.

Right의 map은 파라미터로 받은 함수를 값에 적용하고 다시 Right 인스턴스를 반환하고 있다. 즉, 함수자다

Left의 map은 파라미터로 받은 함수를 실행하지 않는다.

```js
const concat = curry((str1, str2) => {
  return `${str1}${str2}`
})

Either.right('Star').map(concat('Super')); // Right('SuperStart')
Either.left('Star').map(concat('Super')); // Left('Star')

Either.right({name: 'Nakta', job: 'Developer'}).map(propC('name')); // 'Nakta'
Either.left({name: 'Nakta', job: 'Developer'}).map(propC('name')); // {name: 'Nakta', job: 'Developer'}
```


Maybe로 해결하기 어려웠던 부분을 다시 보면 Nothing일때 데이터가 없어서 저자명을 알 수 없었다.

Maybe로 구현한 부분을 Either로 변경해보자. 


```js
const validateBookAuthor2 = (book) => {
  return book.author.indexOf('Axel') === -1 
    ? Either.left(book) 
    : Either.right(book);
}

const logByEitherStatus2 = (eitherBook) => {
  return eitherBook.isLeft 
    ? console.error(`Author: ${eitherBook.$value.author}`) 
    : console.log(`Author: ${eitherBook.$value.author}`)
}

const logBookAuthor2 = (bookId, books) => {
  return pipe(
    findBookByIdC(bookId),
    validateBookAuthor2,
    logByEitherStatus2
  )(books)
};
logBookAuthor2('book1', booksWithAuthor);
logBookAuthor2('book2', booksWithAuthor); 
```

Either를 이용해 Maybe로 해결하기 어려웠던 상황을 해결해 보았다.

마지막으로 Either의 값을 추출하는 함수를 만들어 보자

```js
const either = curry((l, r, e) => {
  return e.isLeft ? l(e.$value) : r(e.$value);
});

const logBookAuthor = (book) => {
  console.log(`Author: ${book.author}`)
};

const logErrorBookAuthor = (book) => {
  console.error(`Author: ${book.author}`);
};

const validateBookAuthor3 = (book) => {
  return book.author.indexOf('Axel') === -1 
    ? Either.left(book) 
    : Either.right(book);
}

const logBookAuthor3 = (bookId, books) => {
  return pipe(
    findBookByIdC(bookId),
    validateBookAuthor3,
    either(logErrorBookAuthor, logBookAuthor)
  )(books)
};
```



## 번외 lodash 와 ramda

지금까지 함수자를 이용해서 함수 합성을 해왔다. 각 함수자는 map을 구현했기 때문에 우리가 직접 구현한 map 함수를 이용해 함수 합성이 가능했다.

```js
const map = curry((fn, functor) => {
  return functor.map(fn);
});

const add = curry((num, value) => {
  return value + num;
});

pipe(
  Maybe.of,
  map(add(2))
  log('result')
)(42); // result Maybe(44)
```

위 코드는 우리가 의도했던 결과인 Maybe(44)가 출력된다.

ramda와 loadsh는 어떤 결과를 나타낼까?


### ramda

ramda에서 제공되는 함수는 모두 커링된 상태이다. 즉, 바로 함수 조합에 사용이 가능하다.

```js
import add from 'ramda/es/add';
import curry from 'ramda/es/curry';
import map from 'ramda/es/map';
import pipe from 'ramda/es/pipe';


const log = curry((label, value) => {
  console.log(label, value);
});

pipe(
  Maybe.of,
  ramdaMap(add(2)),
  log('Ramda map + 2: ')
)(42); // Ramda map + 2: Just(44)
```

Just(44)를 반환한다.

### lodash
lodash 또한 모두 커링된 상태로 함수를 제공한다.


```js
import add from 'lodash/fp/add';
import curry from 'lodash/fp/curry';
import map from 'lodash/fp/map';
import pipe from 'lodash/fp/pipe';

const log = curry((label, value) => {
  console.log(label, value);
});

pipe(
  Maybe.of,
  map(add(2)),
  log('Lodash map + 2: ')
)(42) // Lodash map + 2: [44]
```

하지만 Maybe가 벗겨진채 [44]가 나온다.
lodash는 함수자의 map 메소드를 지원해주지 않는다.

또한 lodash는 메소드 체이닝시 lodash wrapper로 감싸져서 lodash 함수만 사용해야하는 번거로움이 있다.














---

출처 https://velog.io/@nakta/FP-in-JS-%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8%EB%A1%9C-%EC%A0%91%ED%95%B4%EB%B3%B4%EB%8A%94-%ED%95%A8%EC%88%98%ED%98%95-%ED%94%84%EB%A1%9C%EA%B7%B8%EB%9E%98%EB%B0%8D-%ED%95%A8%EC%88%98%EC%9E%90Functor