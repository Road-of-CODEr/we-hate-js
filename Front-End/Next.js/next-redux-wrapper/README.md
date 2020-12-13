# Redux Wrapper for Next.js

[공식 문서](https://github.com/kirill-konshin/next-redux-wrapper)

`next-redux-wrapper` 모듈의 기본적인 사용법과 동작 방식을 이해한다. `redux-saga` 연동을 메인으로 설명하려고 한다.

## 왜 이 라이브러리가 필요한가요?

단순한 SPA 의 경우 모든 페이지에서 제공되는 하나의 Redux 스토어를 통해 관리하면 된다. 하지만 Next.js 의 [Static Generation](../basicFeatures/dataFetching/getStaticProps.md) 또는 [Server-Side Rendering](../basicFeatures/dataFetching/getServerSideProps.md)을 사용할 경우 서버에서 스토어 인스턴스가 필요하기 때문에 상황이 복잡해진다.(서버는 스토어가 없으므로 렌더링시 필요한 스토어 데이터가 없다!)

이 경우에 `next-redux-wrapper`를 사용해 간단히 처리할 수 있다. 서버 단계에서 자동으로 스토어 인스턴스를 생성하고 초기화를 해준다.

뿐만 아니라 `getStaticProps`, `getServerSideProps` 와 함께 `page` 단계에서 사용해 쉽게 사용할 수 있다.

이 라이브러리를 통해 Next.js 의 라이프 사이클에 관계 없이 균일하게 인터페이스를 제공해 줄 수 있다.

## 간단한 사용법(with Redux-Saga)

```javascript
// store.ts
import {createStore, AnyAction} from 'redux';
import {MakeStore, createWrapper, Context, HYDRATE} from 'next-redux-wrapper';

export interface State {
    tick: string;
}

// create your reducer
const reducer = (state: State = {tick: 'init'}, action: AnyAction) => {
    switch (action.type) {
        case HYDRATE:
            // Attention! This will overwrite client state! Real apps should use proper reconciliation.
            return {...state, ...action.payload};
        case 'TICK':
            return {...state, tick: action.payload};
        default:
            return state;
    }
};

// create a makeStore function
const makeStore: MakeStore<State> = (context: Context) => createStore(reducer);

// export an assembled wrapper
export const wrapper = createWrapper<State>(makeStore, {debug: true});
```

Redux 만 사용한다면 위와 같이 store 를 만들어 주고 원하는 페이지에서 바로 사용하면 된다.

- [Redux-Wrapper Usage with Redux Saga](https://github.com/kirill-konshin/next-redux-wrapper#usage-with-redux-saga)
- [Next with Saga example](https://github.com/vercel/next.js/tree/canary/examples/with-redux-saga)

## 동작 방식

[HOW IT WORKS](https://github.com/kirill-konshin/next-redux-wrapper#how-it-works) 가 핵심임ㅎㅎㅋ

- PHASE 1: `getXXXProps`
   1. 서버라우터 타고옴
   2. 각 props 에서 서버사이드 스토어를 생성
   3. 스토어 상태를 초기화 후 반환
- PHASE 2: `SSR`
   1. `HYDRATE` 액션을 통해 Phase1 에서 만든 스토어에 디스패치
   2. 스토어는 `_app` 이나 `page` 컴포넌트의 프로퍼티로 이동
- PHASE 3: `Client`
   1. 스토어 생성
   2. 스토어 디스패치

## 코드 단위로 이해하기


