# CustomServer

## 커스텀 서버란?

커스텀 서버는 Next 에서 제공해주는 기본 서버가 아닌 독자적인 서버를 통해 SSR 혹은 API 작업을 한다.

`Express`, `Koa` 와 같은 서버에서 특정 Route Path 를 Next 에 연결하고 싶거나 서버 자체의 스펙을 모두 정의하 싶다면 고려해볼 수 있는 옵션이다.

[공식 문서](https://nextjs.org/docs/advanced-features/custom-server)의 내용을 보면 Next.js 의 라우터가 앱의 모든 요구사항을 수용할 수 없을 때 사용하길 권장한다.

그 이유는 커스텀 서버를 사용하게 될 경우 `Serverless` 및 `Automatic Static Optimization` 같은 기능에 제한이 있기 때문이다.

만약 SSR 으로 서버를 운영하고자 한다면 해당되지 않는다.

## 커스텀 서버 사용하기

```javascript
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const app = next({ dev: process.env.NODE_ENV !== 'production' });
const handle = app.getRequestHandler();
const PORT = 3000;

createServer((req, res) => {
  if (!req.url) return res.end();
  const parsedUrl = parse(req.url, true);
  const { pathname, query } = parsedUrl;

  if (pathname === '/a') {
    app.render(req, res, '/a', query);
  } else {
    handle(req, res);
  }
}).listen(PORT, () => {
  console.log(`> Ready on http://localhost:${PORT}`);
});
```

[공식 예제](https://github.com/vercel/next.js/tree/canary/examples/custom-server)에서는 `app.prepare()` 를 사용하지만, [실제 코드는 비어있기 때문](https://github.com/vercel/next.js/blob/canary/packages/next/next-server/server/next-server.ts#L555)에 생략해 주었다.

커스텀 서버에 요청이 오게 될 경우 `handle` 함수를 통해 `req`, `res` 객체를 넘겨 Next.js 에서 설정하게 한다.([generateRoutes](https://github.com/vercel/next.js/blob/canary/packages/next/next-server/server/next-server.ts#L581), [renderToHTML](https://github.com/vercel/next.js/blob/canary/packages/next/next-server/server/next-server.ts#L1706))

## 유의점

- 커스텀 서버와 Next 는 따로가기 때문에 `next.config` 의 `babel`, `webpack` 을 거치지 않는다.
   - 따라서 노드 버전을 맞춰주어야 한다.

## 실행

```javascript
"scripts": {
  "dev": "node server.js",
  "build": "next build",
  "start": "NODE_ENV=production node server.js"
}
```

- [JavaScript 예시](https://github.com/vercel/next.js/tree/canary/examples/custom-server)

```javascript
"scripts": {
  "dev": "nodemon",
  "build": "next build && tsc --project tsconfig.server.json",
  "start": "cross-env NODE_ENV=production node dist/index.js"
},
```

- [Typescript 예시](https://github.com/vercel/next.js/tree/canary/examples/custom-server-typescript)
   - `nodemon`은 느리므로 `ts-dev` 로 포팅하는 것을 추천한다.


