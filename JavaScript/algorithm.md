# JS 로 알고리즘 풀기

## JS 에서 알면 좋은 것들

```js
/**
 * @param {number[][]} edges
 * @return {number}
 * https://leetcode.com/contest/weekly-contest-232/problems/find-center-of-star-graph/
 */
const findCenter = (edges) => {
  const hits = edges
    .flatMap((e) => e)
    .reduce((acc, cur) => {
      acc.set(cur, (acc.get(cur) ?? 0) + 1);
      return acc;
    }, new Map());

  const [answer, ...rest] = [...hits].reduce(
    (acc, cur) => {
      const [key, value] = cur;
      const maxValue = acc[1];
      if (value > maxValue) acc = cur;
      return acc;
    },
    ["key", 0]
  );

  return answer;
};
```

`iterable` 한 객체들을 잘 변환시켜 주는 것이 좋다.

`flatMap` 으로 2차원 배열을 단순화 해줄 수 있으며 `reduce` 를 통해 loop 횟수를 줄여줄 수 있다.

`Map` 객체는 `Object.entries({OBJECT})`, `for...of` 등을 활용해 자료형을 쉽게 변환해 줄 수 있다.

배열에서 메서드를 사용할 경우 **기존 값을 변경** 하는지 알아두어야 한다. `slice` vs `splice` vs `split`

### 정규표현식을 알아두자

```js
const regExp = /[A-Z]|[a-z]|[0-9]/g;

// CASE 1. 문자열에서 만족하지 않는 값을 찾기
`123asdfe(ASDFad`.replace(regExp, ""); // '('

// CASE 2. 문자열에서 만족하는 값을 가져오기
`123asdfe(ASDFad`.match(regExp); // ['1', '2', '3', 'a', ..., 'D', 'F', 'a', 'd']; '(' 가 포함되지 않음.

// CASE 3. 해당 정규표현식이 1회 이상 연속되는 부분을 가져온다
`123asdfe(ASDFad`.match(/[a-z]+/g); // ['asdfe', 'ad']

// CASE 4. case 3 의 길이를 제한한다.
`123asdfe(ASDFad`.match(/[a-z]{1,3}/g); // ['ad']; 'asdfe' 가 포함되지 않는다. 1~3 길이만 가져오기 때문.
```

## 백준 In/Out 하기

[백준](https://www.acmicpc.net/)에서 자바스크립트로 문제를 푸는 법을 알아보자.

백준 문제들은 In/Out 부터 작성해 주어야 하기 때문에 `fs` 모듈로 직접 파일을 읽어 처리하게 된다.

Node.js 를 통해 백준 서버의 Input 파일을 읽어 `console` 로 출력하면 된다.

<img src="https://user-images.githubusercontent.com/23524849/112759113-7de43280-902c-11eb-9739-4fff1322f5cf.png" alt="input" width='30%' />

> input 예시

```js
const fs = require("fs");
const INPUT_DIST_PATH = "/dev/stdin";

const [nParam, mParam, ...params] = fs
  .readFileSync(INPUT_DIST_PATH)
  .toString()
  .split("\n");
const n = parseInt(nParam);
const m = parseInt(mParam);
const map = [];

for (let i = 0; i < n; i++) {
  const row = params[i].split(" ").map((e) => parseInt(e));
  map.push(row);
}

console.log("This is output");
```
