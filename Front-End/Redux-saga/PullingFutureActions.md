# Pulling future actions

> [원문](https://redux-saga.js.org/docs/advanced/FutureActions.html)

`takeEvery` 이펙트를 사용하게 되면 각각의 액션에 대해 새로운 테스크를 만들어 작업하게 된다.

사실, `takeEvery` 는 단지 로우-레벨 끝에 있는 내부적인 헬퍼 함수와 더 강력한 API 함수를 감싼 이펙트에 불과하다.

이 장에서 우리는 `take` 에 대해서 알아본다. 이 이펙트는 감시 프로세스의 제어를 가능하게 하며 복잡한 데이터 컨트롤 플로우를 설계할 수 있게 해준다.

## A basic logger

Saga 의 간단한 예시를 살펴보자. 이 사가는 스토어로 디스패치 되는 모든 액션을 watch 하여 콘솔 로그를 보여준다.

`takeEvery('*')` 를 사용하여 우리는 액션의 타입과는 무관하게 모든 디스패치 액션을 캐치할 수 있게 된다.

```javascript
import { select, takeEvery } from 'redux-saga/effects';

function* watchAndLog() {
  yield takeEvery('*', function* logger(action) {
    const state = yield select();

    console.log('action', action);
    console.log('state after', state);
  })
}
```

이제 어떻게 `take` 이펙트를 사용해 동일 로직을 실행 시키는지 확인해보자.

```javascript
import { select, take } from 'redux-saga/effects';

function* watchAndLog() {
  while (true) {
    const action = yield take('*');
    const state = yield select();

    console.log('action', action);
    console.log('state after', state);
  }
}
```

`take` 는 이전에 본 `call`, `put` 과 비슷하다. 이는 특정한 액션을 기다리기 위해 미들웨어에 알려주는 명령 오프젝트를 생성한다. 

`call` 이펙트는 미들웨어가 Generator 의 Promise `resolve` 를 기다리게 한다. `take` 의 경우 미들웨어가 매칭되는 액션의 제너레이터가 dispatch 될 때까지 기다린다. 위의 예에서, `watchAndLog` 는 모든 액션의 디스패치를 기다리게 된다.

`while(true)` 문을 어떻게 실행시키는지 확인해보라. 제너레이터 함수라는 것을 잊지말자! 제너레이터 함수는 완료를 목표로 하는 일반 함수(run-to-completion)가 아니다. 우리가 만든 제너레이터는 한 번 박복될 때마다 액션이 일어나길 기다릴 것이다.

`take` 를 사용하는 것은 우리의 코드에 작은 영향을 준다. `takeEvery` 의 경우, 실행된 테스크가 다시 실행될 때에 대한 관리 방법이 없다. 계속해서 매칭되는 액션을 실행시킬 뿐이다. 또한 언제 감시(observation)를 멈처 주어야 할지도 관리할 수 없다.

`take` 의 경우 컨트롤의 방향이 정반대이다. 핸들러 태스크에 *pushed* 되고 있는 액션 대신 사가는 스스로 액션들을 *pulling* 한다. 이것은 Saga 가 일반 함수를 콜 하는 것 처럼 보인다. 액션이 dispatch 되었을 때 resolve 하는 것 처럼.(`action = getNextAction()`)

간단한 예로 유저의 액션을 watch 하고 그 결과에 따른 축하 메시지를 띄워보자.

```javascript
import { take, put } from 'redux-saga/effects'

function* watchFirstThreeTodosCreation() {
  for (let i = 0; i < 3; i++) {
    const action = yield take('TODO_CREATED')
  }
  yield put({type: 'SHOW_CONGRATULATION'})
}
```

이때 중요한 점은 `take` 이펙트를 통해 추적이 가능하다는 점이다. `takeEvery` 로 했다면 실행 횟수를 트래킹 할 수 없었을 것이다.

```javascript
function* loginFlow() {
  while (true) {
    yield take('LOGIN')
    // ... perform the login logic
    yield take('LOGOUT')
    // ... perform the logout logic
  }
}
```

이처럼 `take` 로 분리하게 된다면 위와 같이 작업을 나누어 직관적으로 처리해 줄 수 있다. 