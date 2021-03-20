여러 문서, 아티클 짬뽕 글입니다.. 잘못된 내용 수정, 보충 환영합니다

## **What is a Web** **Cache?**

 웹 캐시 또는 HTTP 캐시는 웹 페이지, 이미지, 기타 유형의 웹 멀티미디어 등의 웹 문서들을 임시 저장하기 위한 기술이다. 웹 캐시 시스템은 이를 통과하는 문서들의 사본을 저장하며 이후 요청들은 특정 조건을 충족하는 경우 캐시화가 가능하다 (-wiki)

## **Why do people use them?**

- To reduce latency → 시간이 적게 걸린다
- To reduce network traffic → 트래픽에 따라 비용 산정하는 경우 비용 절약할 수 있다

## **Kinds of Web Caches**

아티클에 따르면 세 가지가 있다고 한다.

- Browser Caches: 디바이스 메모리를 활용.
- Proxy Caches: client도 origin server도 아닌 shared cache의 일종. 한 사람만 사용하는 것이 아니라 많은 사용자가 사용가능. (?? cdn 이 하나의 예시..??)
- Gateway Caches: ?? 모르겠다

⚠️ **근데 캐시 사용하면 outdated, stale 한 컨텐츠 받아올 수도 있지 않나요?** ~~(그건 니가 계획을 잘 못해서..)~~ 잘 계획하면 극복할 수 있는 문제. control 잘 하면 reduce latency, reduce network traffic 할 수 있다!



## **How to Control Caches?**

HTTP Headers 를 사용한다. 4가지 방법이 있다. (`브라우저 <---> origin server` 간 요청, 응답에 대한 설명이다.)

### **Last-Modified**

- `Last-modified: Fri, 16 Mar 2007 04:00:25 GMT`
- 브라우저에서 요청 시 **응답 헤더**에 포함
- 최초 요청 이후 (2번째 요청 부터) 브라우저에서 요청 시 **요청 헤더**에 **If-Modified-Since**로 포함.
    - **If-Modified-Since** 이후 변경이 있으면 변경된 컨텐츠 응답
    - **If-Modified-Since** 이후 변경이 없으면 304 응답 → 디바이스에 캐싱된 데이터 사용

### **Etag**

- `ETag: ead145f`
- 브라우저에서 요청 시 **응답 헤더**에 포함
- 최초 요청 이후 (2번째 요청 부터) 브라우저에서 요청 시 **요청 헤더**에 **If-None-Match**로 포함.
    - **If-None-Match** 값이 다르면 변경된 컨텐츠 응답
    - **If-None-Match** 값이 같으면 304 응답 → 디바이스에 캐싱된 데이터 사용
- 서버 시간에 오류가 있어서 수정된 경우 등 시간 기반의 **Last-Modified**이 불확실한 경우가 발생할 수 있음 ****→ **Etag**는 **unique identifier**이기 때문에 시간 관련 문제가 발생하지 않음.
- Etag 생성 알고리즘은 서버마다 다름 (명세 참고: [https://tools.ietf.org/html/rfc7232#section-2.3](https://tools.ietf.org/html/rfc7232#section-2.3))

### **Expires**

- `Expires: Tue, 20 Mar 2007 04:00:25 GMT`
- 브라우저에서 요청 시 **응답 헤더**에 포함.
- 브라우저가 **Expires** 이전에는 서버에 요청하지않고 디바이스에 캐싱된 데이터 사용

### **max-age**

- `Cache-Control: max-age=31536000`
- 브라우저에서 요청 시 **응답 헤더 Cache-control**에 포함
- Expires 보다 간결 (캐싱할 second 표시)
- Expires와 max-age 둘다 헤더에 있는 경우 **max-age**를 따름 ([https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.3](https://www.w3.org/Protocols/rfc2616/rfc2616-sec14.html#sec14.9.3))
- max-age 값은 고정인데 남은 기간 어떻게 계산하고 validate 할지말지 결정하는거지? → ([https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.2.3](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.2.3))

⚠️ **Expires**, **cache-control 설정하지 않았는데도 서버요청하지 않고 메모리 캐시된 파일 사용하는 경우가 있다.. 왜죠?** Heuristic Expiration이 범인. Expires, cache-control 없더라도 **Last-Modified**를 사용해서 유효 기간 추정해버림. ([https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.2.2](https://www.w3.org/Protocols/rfc2616/rfc2616-sec13.html#sec13.2.2))

## **More About Cache-Control**

**cache-control: no-cache**

- 캐싱함(디바이스에 저장)
- 하지만 무조건 재검증을 위해 origin server로 요청 ( === `max-age=0`)
    - 변경 없으면 304 응답
    - 변경 있으면 200 컨텐츠 응답

**cache-control: no-store**

- 캐싱안함(디바이스에 저장 안함)

그외 문서 보기 [https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control](https://developer.mozilla.org/ko/docs/Web/HTTP/Headers/Cache-Control)

## 그래서 어떻게 적용하라는거죠...?

file extension 이나 path 별로 다르게 설정하자.

**Versioned URLs와 Long-lived caching**

- versioned URLs를 사용하고, max-age값을 엄청나게 크게 설정
- 해시값포함한파일이름 `style.x234dff.css`  + 엄청 큰 max-age `cache-control: max-age=31536000`

**Unversioned URLs와 Revalidation**

- index.html 같은 경우 매번 versioned URL을 사용하기 어렵기 때문에 `cache-control: no-cache` 혹은 `cache-control: no-store` + `Etag` / `Last-Modified`

## 부록: CDN이 등장한다면...?

`브라우저 <——> CDN server <——> origin server`

위와 같은 모양이 됨. CDN server는 origin server로 요청하는 client이며, 동시에 브라우저에 응답을 주는 server가 된다.

추가예정입니다..


**ref**
---
- https://web.dev/http-cache
- https://www.mnot.net/cache_docs/#BROWSER
- https://betterexplained.com/articles/how-to-optimize-your-site-with-http-caching/
