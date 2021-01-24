# Redux-Saga

공식 홈페이지: https://redux-saga.js.org/

> `redux-saga` 는 side-effect를 관리하기 쉽고 효율적이며 테스트하기 쉽고, 오류를 더 잘 처리하는 것을 목표로 하는 라이브러리다.

- [Pulling Future Actions](PullingFutureActions.md)
- [Non Blocking Calls](NonBlockingCalls.md)

리덕스는 기본적으로 **동기**방식이기 때문에 비동기 처리가 어렵고 복잡해진다.

따라서 리덕스사가는 리덕스의 미들웨어로 들어가 액션에서 스토어 변경할 때 비동기 로직을 더 쉽게 처리할 수 있도록 해주는 역할을 한다.

## 기본 코드

```javascript
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware, { takeLatest, put } from 'redux-saga';
import helloSaga from './helloSaga';

const REQ = 'REQ';
const HIT = 'HIT';
const MISS = 'MISS';

const reducer = (state = {}, action) => {
  const { type, payload } = action;
  // REQ 타입이 없다는 것에 유의
  switch(type) {
    case HIT:
      return {
        ...state,
        loading: true,
        hit: payload
      }
    case MISS:
      return {}
  }
}

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  reducer,
  applyMiddleware(sagaMiddleware)
);
sagaMiddleware.run(helloSaga);

const action = type => store.dispatch({ type });
```

흔히 작성하는 `redux` 코드에서 `createSagaMiddleware` 가 추가된 것을 알 수 있다. 

이 함수를 호출해 사가 미들웨어를 리덕스에 미들웨어로 연결한다.

그 후 `sagaMiddleware.run(helloSaga);` 을 통해 `root` 사가를 실행하면 `helloSaga` 내부에 정의된 액션에 따라 중간에서 처리할 수 있게 된다.

```javascript
function* helloSaga() {
  // function* 는 제네러이터를 뜻한다.
  // 최초 root 호출 시 콘솔이 찍힌다.
  console.log('Hello Sagas!');
  // all 으로 가로챌 미들웨어들을 달아준다.
  yield all[watchHit(), watch2(), ...],
}

function* watchHit() {
  // takeLatest 는 가장 최근 것만 처리한다. 모든 액션에 대해서 처리하고 싶다면 takeEvery 를 사용하면 된다.
  yield takeLatest(REQ, fetchHit);
}

function* fetchHit() {
  try {
    // call 은 인자로 받은 함수를 실행시켜준다.(ex. 외부 API 호출)
    const fetchData = yield call(api.fetch);
    // put 은 액션을 스토어로 디스패치 해주는 역할을 한다.
    yield put({ type: HIT, payload: [1, 2, 3] });
  } catch(error) {
    yield put({ type: MISS });
  }
}
```

루트사가에 해당하는 `helloSaga` 에 watch 할 액션들을 달아준다. `takeLatest(REQ, fetchHit)` 은 REQ 타입의 액션이 실행되면 fetchHit 제너레이터를 실행시켜 준다.

플로우는 아래와 같다.

1. 컴포넌트에서 `REQ` 액션 실행
2. 사가 `fetchHit` 제너레이터 실행
3. 정상적으로 실행 되었으면 payload 를 담아 `HIT` 액션 디스패치를 발행
4. 리듀서에서 `HIT` 타입에 따른 스토어 갱신

컴포넌트가 액션을 디스패치(요청)하면 사가는 스토어에 들어오는 액션을 감시하다 자신의 액션이 들어오면 제너레이터를 통한 로직을 처리한다. 그후 데이터를 저장하는 액션을 발행, 리듀서는 이 액션을 받아 스토어를 갱신하게 된다.

