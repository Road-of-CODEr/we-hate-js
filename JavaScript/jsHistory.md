# JavaScript의 역사

JavaScript는 1995년 당시 시장 점유율이 90프로이던 Netscape communications가 `브라우저에서 동작하는 것을 목표`로 [`Brendan Eich`](https://en.wikipedia.org/wiki/Brendan_Eich)가 개발한 언어이다. Brendan Eich씨가 10일간 걸려서 만든 JavaScript는 그 후 여러 변화를 거쳐 지금은 모든 브라우저의 표준 프로그래밍 언어가 되었다!

## 표준화를 위한 JavaScript의 노력

JavaScript가 출시되고 1년뒤쯤 1996년 8월에 Microsoft는 JavaScript의 파생 버전인 `JScript`를 출시해서 이를 Internet Explorer에 사용했다. 그런데 JavaScript랑 JScript가 표준화된 기준이 없고 적당히 호환되었는데, Microsoft와 Netscape communications가 서로 시장에서 점유율을 높이기 위해서 더욱 더 다른 기능들을 추가하기 시작했다... OMG

이러한 이유로 브라우저마다 어떤건 되고, 어떤건 안되는 식의 문제가 많이 발생(`크로스 브라우징 이슈`)해서 개발자들의 삶이 고달파졌다. 그래서 표준화된 기준을 마련하기 위해 1996년 11월에 Netscape communications가 [ECMA](https://en.wikipedia.org/wiki/Ecma_International) 인터네셔널에 자바스크립트의 표준화를 요청했다.

## ECMAScript 출시

- 1997년 7월에 ECMA-262라고 불리는 ECMAScript 1 sepecification이 완성되었다! 이제 JavaScript는 ECMAScript 명세를 구현한 언어로 표준화되기 시작했다.

- 이후 `1999년에 ECMAScript3`가 공개 되었고, 이후 `10년만인 2009년에 HTML5와 함께 ECMAScript5(ES5)`가 출시 되었다.

- 그리고 2015에 범용 프로그래밍 언어가 갖춰야할 기능들인 `let/const, arrow function, class, module`등을 갖춘 ECMAScript6(ES6)가 공개 되었다. 이 이후에는 매해 기능을 변경해서 발표하고 있다.

- `ESNext`란? 엄청난 변화가 있었던 ES6부터 그 이후의 버전을 모두 ESNext라고 통칭한다

## ECMAScript 각 버전별 특징 파악하기

1. ES1
   - 1997년에 출시된 ECMAScript 1
2. ES2
   - 1998년 출시
3. ES3
   - 1999년
   - 드디어 `try... catch` 및 정규 표현식 기능이 추가되었다.
   - 이 이전에는 표준화된 에러처리 방식이 없었다
4. ES5
   - 2009년에 HTML5와 함께 출시되었다.
   - JSON, strict mode와 같은 기능들이 추가되었다.
5. **ES6**
   - 2015년에 일어난 대변화
   - `let/const, arrow function, class` 도입
   - 템플릿 리터럴
   - [디스트럭처링 할당](https://poiemaweb.com/es6-destructuring)
   - 스프레드/rest 파라미터
   - 심벌
   - 프로미스
   - Map/Set
   - 이터러블
   - for ... of
   - 제너레이터
   - Proxy
   - Module import/export
6. ES8
   - 2017년
   - `async/await` 도입
7. ES9
   - 2018년
   - Object의 rest/spread
   - [async generator](https://ko.javascript.info/async-iterators-generators)
   - [for await ... of](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of)
8. ES11
   - 2020년
   - null 병합 연산자
   - 옵셔널 체이닝 연산자

### 출처

[모던 자바스크립트 DeepDive](http://www.yes24.com/Product/Goods/92742567) 2장
[What is the difference between JavaScript and ECMAScript?](https://www.freecodecamp.org/news/whats-the-difference-between-javascript-and-ecmascript-cba48c73a2b5/)
