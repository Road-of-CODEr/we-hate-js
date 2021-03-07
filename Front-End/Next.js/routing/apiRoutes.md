# API Routes

- https://nextjs.org/docs/api-routes/introduction

API 라우터는 우리의 Next.js 에 API 를 제공할 수 있도록 해준다.

어떤 파일이든 `pages/api` 안에 넣으면 `/api/*` 로 매핑되며 페이지가 아닌 API 엔드페인트로 제공된다. **오직 서버사이드에서만 번들**되기 때문에 클라이언트 사이즈 번들 사이즈에 영향을 주지 않는다.

만약 아래와 같은 `pages/api/users.js` API 라우터를 타면 `json` 값이 `200` 코드와 함께 리턴된다.

```js
export default function handler(req, res) {
  res.status(200).json({ name: '1ilsang' });
}
```

API 라우터가 작동하기 위해서는 default 함수(request handler 라 불리는)를 export 해야한다. 각각은 아래와 같은 파라미터를 가진다.

- `req`: [http.incomingMessage](https://nodejs.org/api/http.html#http_class_http_incomingmessage) 인스턴스이다. 미들웨어로 적용하고 싶다면 [Api-middlewares](https://nextjs.org/docs/api-routes/api-middlewares)를 살펴보라. 
- `res`: [http.ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse) 인스턴스이다. [Response helper 함수](https://nextjs.org/docs/api-routes/response-helpers) 를 살펴보면 더 좋다.

서로 다른 HTTP 메서드를 API 라우터에서 다루기 위해 `req.method` 를 request handler 안에서 사용할 수 있다.

```js
export default function handler(req, res) {
  if(req.method === 'POST') {
    // POST request 처리
  } else {
    // 어떤 것이든 다른 HTTP method
  }
}
```

## Use cases

새로운 프로젝트인 경우, API 라우터를 사용해 전체 API 를 빌드할 수 있다. 만약 API 가 이미 존재한다면, API 라우터로 API 를 호출할 필요는 없다. API 라우터의 다른 사례는 다음과 같다.

- 외부 URL 을 마스킹 할 수 있다.(https://domain.com/secret-url -> /api/secret)
- 서버의 환경변수를 사용해 외부 서비스에 안정적으로 접근할 수 있다.


## 주의사항

- API 라우터는 [CORS 헤더를 지정하지 않는다](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS). 이는 기본적으로 오직 `same-origin` 만 있음을 뜻한다. 동작을 수정하고 싶다면 [CORS 미들웨어](https://nextjs.org/docs/api-routes/api-middlewares#connectexpress-middleware-support) 를 request handler 에 래핑하면 된다.
- API 라우터는 `next export` 에서 사용할 수 없다.

