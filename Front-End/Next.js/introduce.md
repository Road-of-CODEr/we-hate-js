# NextJS 가 뭔가요?

TL;DR!
- Server Side Rendering
  - 화면이 깜빡이지 않아요.
- Static Exporting
- CSS-in-JS
  - Stylesheet 로부터 자유로워요
- Zero Setup
  - 설치 후 바로 컴포넌트만 만들면 돼요.
- Fully Extensible
- Ready for Production
  
[공식 문서](https://nextjs.org/docs/getting-started)의 내용이 많이 압축되어 있습니다.

Next.js 는 공식 홈페이지에서도 언급하듯 **프로덕션 환경을 위한 리액트 프레임워크**이다.

즉 여타 다른 프레임워크 처럼 *복잡한 초기 설정* 혹은 *기초적이고 반복적인 작업*을 숨기고 바로 개발에 몰두할 수 있도록 하는 것에 초점을 두었다.

## Next.js 의 강점

### 1. 직관적이고 간편한 세팅

[Next.js 의 기본 구조](./basicStructure.md)를 보면 디렉토리가 매우 직관적으로 구성되어 있는 것을 알 수 있으며 *Zero Setup* 이라고 말하는 것 처럼 아무런 환경 설정을 하지 않아도 간단한 페이지는 바로 작업할 수 있다.
   
### 2. Static Generation 과 Server Side Rendering

![Static generation](https://nextjs.org/static/images/learn/data-fetching/static-generation.png)

   - Static Generation은 빌드 시간에 HTML을 생성하는 사전 렌더링 방법이다.(이때 필요한 데이터를 사전 요청 함)
   - pre-fetching
   - serverless
   - json-data

![Server Side Rendering](https://nextjs.org/static/images/learn/data-fetching/server-side-rendering.png)

   - Server Side Rendering 은 각 요청에 따라 HTML을 생성하는 렌더링 방법이다.

### 3. Custom Server

```javascript
// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname === '/a') {
      app.render(req, res, '/a', query)
    } else if (pathname === '/b') {
      app.render(req, res, '/b', query)
    } else {
      handle(req, res, parsedUrl)
    }
  }).listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
```

Next.js 에 서버를 자유롭게 구성하여 원하는 방식으로 만들어 줄 수 있다.(Koa, Express 등)

[공식 예제](https://github.com/vercel/next.js/tree/canary/examples/custom-server-express)가 잘 되어 있어 초기 뼈대에 참고하기도 좋다.