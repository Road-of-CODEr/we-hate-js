# TakeEffects

`take`, `takeEvery`, `takeLatest`, `takeLeading` 의 차이를 알아보자.

## Take

`take(pattern | channel)`

`take` 는 `call`, `put` 과 비슷하다. 이는 특정한 액션을 기다리기 위해 미들웨어에 알려주는 명령 오프젝트를 생성한다.

```javascript
// take
function* watchAndLog() {
  while (true) {
    const action = yield take('*');
    const state = yield select();

    console.log('action', action);
    console.log('state after', state);
  }
}

// take[Something]
function* watchAndLog() {
  yield takeEvery('*', function* logger(action) {
    const state = yield select();

    console.log('action', action);
    console.log('state after', state);
  });
}
```

들어오는 디스패치 액션 을 가지고 처리해야하는 `take` 와 달리 다른 `take...` effect 들은 콜백으로 바로 처리하는 것을 알 수 있다.

따라서 특정 액션에 대한 처리를 바로 해주어야 한다면 `take...` 로 작성하면 조금 더 깔끔하게 코드를 작성해 줄 수 있다.

[이 글](PullingFutureActions.md)에서 용법의 차이를 느낄 수 있다.

만약 Pull 방식의 동기적 접근이 필요하다면 `take` 를 사용하고 액션 단위의 원자적 처리를 목표로 한다면 `take...` 를 사용하면 된다.

### takeEvery

`takeEvery(pattern | channel, saga, ...args)`

들어오는 모든 액션(액션이 dispatch 될 때마다)에 새로운 task 를 생성해 처리한다. **모든 액션에 task 를 fork** 하기 때문에 **동시에 호출**될 수 있으며 **실행 순서가 보장 되지 않**는다.

그러므로 **task 가 동시에 실행되어도 상관없는 로직에 적합**하다.

takeEvery 를 비롯한 이후의 `take...` 는 task 를 핸들링 할 수 없다.([ref](PullingFutureActions.md))

### takeLatest

`takeLatest(pattern | channel, saga, ...args)`

진행중이던 액션이 있다면 취소하고 마지막의 액션만 실행(fork)하게 된다. 그러므로 항상 최신의 액션이 처리되는 것을 보장하게 된다.

따라서 최신의 데이터/액션이 중요한 경우에 `takeLatest` 를 사용하면 된다.

### takeLeading

`takeLeading(pattern | channel, saga, ...args)`

**액션이 dispatch 된다면, 해당 액션이 마무리 될 때 까지 동일한 액션을 감지하지 않는다(무시한다)**.

이는 이전의 액션이 반드시 먼저 처리됨을 의미한다. 처리 순서가 중요하거나 **중복으로 호출되면 안되는 경우** 사용하는 것이 적절하다.

유저가 로그인 버튼을 눌렀다면 로딩을 띄우고 마무리 될때까지 버튼이 눌리고 싶지 않을때 적절한 effect 이다.

### Ref
- [API docs](https://redux-saga.js.org/docs/api/)
