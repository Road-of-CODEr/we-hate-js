# 빌드된 Next.js 프로젝트와 커스텀 서버 연결하기

```javascript
const express = require('express');
const next = require('next');
const app = next({ dev: process.env.NODE_ENV === 'production' });
const handle = app.getRequestHandler();
const PORT = 3000;

app
	.prepare() // JUST DEV mode
	.then(() => {
		const server = express();

		server.get('*', (req, res) => {
			handle(req, res); // Next.js Route HANDLER!
		});

		server.listen(PORT, (err) => {
			if (err) throw err;
			console.log('Server is running...!', PORT);
		});
	})
	.catch((e) => {
		console.error(e);
		process.exit(1);
	});
```

위의 코드는 Next.js 의 보편적인 커스텀 서버 예제이다.

이 장에서는 해당 코드에서 가장 핵심적인 `app.getRequestHandler()` 함수가 어떻게 동작하는지 알아보고 커스텀 서버가 어떻게 **"자동으로"** 빌드된 Next.js 프로젝트를 찾아가는지 알아보자.

> 해당 내용은 Next.js v10.0.1 을 기준으로 하고 있다.

## 1. getRequestHandler 살펴보기

```javascript
const handle = app.getRequestHandler();
...
  server.get('*', (req, res) => {
    handle(req, res); // Next.js Route HANDLER!
  });
```

알아두기 

1. 위의 코드에서 커스텀 서버는 모든 라우팅을 Next.js 에 위임하고 있다.
2. 이때 handle 함수는 getRequestHandler 함수의 리턴 *함수* 이다.

[getRequestHandler 함수의 구현체](https://github.com/vercel/next.js/blob/v10.0.1/packages/next/next-server/server/next-server.ts#L449)를 살펴보면 `handleRequest` 함수를 리턴하는 것을 볼 수 있다.

해당 함수의 [마지막 부분](https://github.com/vercel/next.js/blob/v10.0.1/packages/next/next-server/server/next-server.ts#L441)을 보면 `return await this.run(req, res, parsedUrl)` 을 통해 내부적인 로직이 실행([router](https://github.com/vercel/next.js/blob/v10.0.1/packages/next/next-server/server/next-server.ts#L1032), [render](https://github.com/vercel/next.js/blob/v10.0.1/packages/next/next-server/server/next-server.ts#L833) 등)되고 렌더링된 혹은 SSR 페이지를 리턴해 주는 것을 알 수 있다.

우리가 궁금한 점은 이때 router 함수에서 **어떻게** `.next` 파일을 찾아갈 수 있는지 이다.

## 2. Next-server constructor 살펴보기

```javascript
const next = require('next');
const app = next({ dev: process.env.NODE_ENV === 'production' });
```

위 질문의 답은 생성자에 있다.

`require('next')` 로 가져오는 `next-server` 의 [기본값](https://github.com/vercel/next.js/blob/v10.0.1/packages/next/next-server/server/next-server.ts#L157)이 `.` 으로 이루어져 있으며, `nextConfig` 의 `distDir` [기본 값](https://github.com/vercel/next.js/blob/v10.0.1/packages/next/next-server/server/config.ts#L16)이 `.next` 이기 때문이다.

따라서 생성자에서 router 에게 넘겨주는 `this.distDir` 값을 [만들어](https://github.com/vercel/next.js/blob/v10.0.1/packages/next/next-server/server/next-server.ts#L169) 자동으로 Next 빌드 프로젝트를 찾아갈 수 있도록 해준다.

## ++ 그렇다면 build path 를 변경하고 싶으면 어떻게 해야할까?

`next.config.js` 파일에서 `distDir` 값만 수정하면 된다. `next build` 단계에서 자동으로 해당 path 로 빌드된 파일을 밀어주고, Custom server 에서도 next.config.js 파일의 distDir 을 기준으로 바라보게 되기 때문이다.