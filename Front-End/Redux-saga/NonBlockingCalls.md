# Non-blocking calls

[원본](https://redux-saga.js.org/docs/advanced/NonBlockingCalls.html)

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

위와 같은 `loginFlow` 가 있다고 하자. 인증에 성공하면 토큰을 반환하고 로그아웃하면 토큰을 삭제한다.

이전 내용 복습
1. `take` 는 store 에서 특정 작업을 기다릴 수 있습니다.
2. `call` effect 를 사용하여 비동기 호출을 할 수 있습니다.
3. `put` effect 는 작업을 store 에 전달할 수 있습니다.

## 첫 번째 시도

```javascript
import { take, call, put } from 'redux-saga/effects'
import Api from '...'

function* authorize(user, password) {
  try {
    const token = yield call(Api.authorize, user, password)
    yield put({type: 'LOGIN_SUCCESS', token})
    return token
  } catch(error) {
    yield put({type: 'LOGIN_ERROR', error})
  }
}

function* loginFlow() {
  while (true) {
    const { user, password } = yield take('LOGIN_REQUEST')
    const token = yield call(authorize, user, password)
    if (token) {
      yield call(Api.storeItem, { token })
      yield take('LOGOUT')
      yield call(Api.clearItem, 'token')
    }
  }
}
```

> 위 코드는 미묘한 문제가 있다.

`authorize` 는 API 호출을 수행하고 store 에 밀어준다.

`loginFlow` 은 내부의 전체 흐름을 `while(true)` 로 묶어 처리하고 있다. 

1. `take` 함수를 통해 로그인 요청이 올때까지 대기하다 그 후 `call` 함수를 통해 인증을 요청한다.
2. 정상적으로 토큰이 있다면 LOGOUT 요청이 올때까지 기다리고, 요청이 오게 되면 clearItem 을 콜한다.

여기서 `call` 은 **Promise 를 반환하는 함수가 아니다**.

### 위의 접근 방식에는 여전히 미묘한 문제가 있다.

```javascript
function* loginFlow() {
  while (true) {
    // ...
    try {
      const token = yield call(authorize, user, password)
      // ...
    }
    // ...
  }
}
```

위의 코드에서 `call` 은 blocking 이기 때문에 문제가 생긴다. Generator 호출이 종료 될 대까지 다른 것을 수행할 수 없다.

만약 authorize 호출 단계에서 에러가 발생할 경우 LOGOUT `take` 로직까지 갈 수 없게 된다.

따라서 LOGOUT 을 놓치지 않으려면 `call` 이 아닌 `fork` 를 해야한다.

```javascript
import { fork, call, take, put } from 'redux-saga/effects'

function* loginFlow() {
  while (true) {
    ...
    try {
      // non-blocking call, what's the returned value here ?
      const ?? = yield fork(authorize, user, password)
      ...
    }
    ...
  }
}
```

`fork` 작업은 백그라운드에서 시작되기 때문에 결과를 얻을 수 없다! 따라서 `authorize` 의 토큰 저장 로직을 변경해야한다.

```javascript
import { fork, call, take, put } from 'redux-saga/effects'
import Api from '...'

function* authorize(user, password) {
  try {
    const token = yield call(Api.authorize, user, password)
    yield put({type: 'LOGIN_SUCCESS', token})
    yield call(Api.storeItem, {token})
  } catch(error) {
    yield put({type: 'LOGIN_ERROR', error})
  }
}

function* loginFlow() {
  while (true) {
    const { user, password } = yield take('LOGIN_REQUEST')
    yield fork(authorize, user, password)
    yield take(['LOGOUT', 'LOGIN_ERROR'])
    yield call(Api.clearItem, 'token')
  }
}
```

`yield take(['LOGOUT', 'LOGIN_ERROR'])` 작업을 통해 로그인 에러와 로그아웃 작업을 기다리게 된다.

하지만 위의 코드에서도 문제점은 있다. LOGIN_REQUEST의 결과 와 관련 없이 LOGOUT 디스패치가 오면 LOGIN_REQUEST 작업을 취소해야한다. 위의 코드에서는 취소할 방법이 없다!

그러므로 [Task Object](https://redux-saga.js.org/docs/api/index.html#task)와 [cancel](https://redux-saga.js.org/docs/api/index.html#canceltask) 을 사용한다.

```javascript
import { take, put, call, fork, cancel } from 'redux-saga/effects'

// ...
function* loginFlow() {
  while (true) {
    const {user, password} = yield take('LOGIN_REQUEST')
    // fork return a Task object
    const task = yield fork(authorize, user, password)
    const action = yield take(['LOGOUT', 'LOGIN_ERROR'])
    if (action.type === 'LOGOUT') {
      yield cancel(task)
    }
    yield call(Api.clearItem, 'token')
  }
}
```

만약 LOGOUT 작업이 들어오게 되면 LOGIN_REQUEST 를 `cancel` 하는 모습을 볼 수 있다. 이때 `authorize` 작업이 cancel 을 통해 정상적으로 마무리 되었는지, 마무리 된 이후 작업을 해야한다면 finally 를 사용하면 된다.

```javascript
import { take, call, put, cancelled } from 'redux-saga/effects'
import Api from '...'

function* authorize(user, password) {
  try {
    const token = yield call(Api.authorize, user, password)
    yield put({type: 'LOGIN_SUCCESS', token})
    yield call(Api.storeItem, {token})
    return token
  } catch(error) {
    yield put({type: 'LOGIN_ERROR', error})
  } finally {
    if (yield cancelled()) {
      // ... put special cancellation handling code here
    }
  }
}
```

`cancelled` 작업을 통해 마무리 작업을 해줄 수 있다.(store 에 값을 초기화 한다거나 UI 로직을 위한 값을 넣어주는 등)

단순한 API call 작업도 생각외로 고려해야할 점이 많았다.

어렵당...
