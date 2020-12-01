# You don't know Serverside Rendering

Next.js (특히,`page` 부분)를 이용하여 Serverside Rendering의 개념을 다시한번 되짚어 보았다.

그리고 더 나아가 Next.js에서 사용하는 `getStaticPaths, getStaticProps, getServerSideProps` 함수들의 차이를 이해해보자!

## Pre-rendering

Next.js는 무조건 pre-rendering을 한다.  pre-rendering을 하는 방식은 두가지가 있다.

언제 HTML을 생성하느냐(=언제 pre-rendering을 하느냐)에 따라 ***Static Generation, Server-side Rendering*** 두가지로 나눌 수 있다.

CSR(Client Side Rendering)과 반대되서 비교되는 SSR(Servier Side Rendering)이 곧 Next.js에서 이야기하는 pre-rendering 개념이라고 보면 된다.

즉, 흔히 우리가 이야기해왔던 ***서버사이드 렌더링***은 두 가지로 나눌 수 있다는 것이다.

### Static Generation

- build 타임에 HTML이 생성 됨.
- 같은 request에 대해 재사용이 가능한 애들.
- gatsby, jsp, .. 와 같은 애들

### Server-side rendering

- request가 오면 HTML이 생성 됨.
- next.js가 얘의 기능만 있다고 생각하는 경우가 많다.(=ME!!)

## Hybrid Next.js app

Next.js 에서 `Static generation`과 `Server-side rendring` 두 가지를 함께 사용할 수 있다. 👍🏻

static generation으로 생성된 페이지는 CDN에 의해서 캐싱되므로 이벤트 페이지나, 소개 페이지를 개발시 이용하면 효과적일 것이다. 그렇다면 이것을 제외한 나머지의 경우 request data에 맞게 페이지를 다르게 보여줘야 하는 경우 Server-side renderign을 채택해서 개발하면 된다.

## getStaticPaths, getStaticProps, getServerSideProps 비교

먼저, 결론부터 이야기하자면 🤔이름에서 알 수 있듯이

`getStaticPaths`와 `getStaticProps`는 ***Static generation***을 위한 함수이다. 그리고 `getServerSideProps` 은 ***Server-side rendering***을 위한 함수 이다.

getStaticPaths 함수를 이용해서 미리 정적페이지를 생성 할 수 있고,

getStaticProps를 통해서 정적 페이지를 생성하기 위해 필요한 data를 fetch 후 props에 매핑해 줄 수 있다.

getServerSideProps을 통해서는 Server-side rendering시, 페이지에 필요한 데이터를 fetch 후 props에 매핑하는 역할을 함수 내부에 작성해주면 된다.

사용자의 요청에 앞서 페이지를 미리 렌더링 할 수 있는가? = 어떤 사용자가 접속해도 똑같은 페이지 인가?를 기준으로 ***Static generation***을 위한 함수를 써야할지, ***Server-side rendering***을 위한 함수를 쓰면 될지 자-알 판단하면 될 것 같다.
