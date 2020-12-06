# getServerSideProps

이전의 정적 생성과 달리 유저의 요청마다 페이지를 렌더링해서 내려주고 싶다면 `getServerSideProps` 를 설정하면 된다.

```javascript
export async function getServerSideProps(context) {
  return {
    props: {}, // will be passed to the page component as props
  }
}
```

`context` 파라미터에는 아래와 같은 값들이 들어가게 된다.
- `params`: 동적 라우팅에서 사용될 id 값들이나 데이터가 들어가게 된다.
- `req`: HTTP request 객체.
- `res`: HTTP response 객체.
- `query`: 요청 쿼리 스트링
- `preview`: 프리뷰 모드 여부.([`getStaticProps` 예시](https://github.com/Road-of-CODEr/we-hate-js/blob/master/Front-End/Next.js/basicFeatures/dataFetching/getStaticProps.md#example-preview-mode))
- `previewData`: `setPreviewData`에 설정한 미리보기 데이터.
- `resolvedUrl`: 요청 URL 의 `_next/data` 접두사를 제거해 원래 쿼리 값을 포함하는 URL(예: `localhost/post/123?name=1ilsang` 로 요청하면 `/post/123?name=1ilsang` 이 resolvedUrl 에 담겨온다)
- `locale`: 활성화된 locale 리턴(locale 은 설정 언어이다.)
- `locales`: 지원하는 언어 리스트(next.config 에서 설정해 줄 수 있다.)
- `defaultLocale`: 기본 언어 설정

`return` 하는 값들(props 는 반드시 있어야 한다.)
- `props`: 컴포넌트에서 사용할 직렬화된 데이터 객체
- `notFound`: 해당 경로에 없으면 404 페이지 및 상태코드를 반환할지 여부(true 면 404 페이지로 간다)

```javascript
export async function getServerSideProps(context) {
  const res = await fetch(`https://.../data`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: {}, // will be passed to the page component as props
  }
}
```

- `redirect`: 내/외부의 리소스로 리다이렉트 할 수 있는 인자. 

```javascript
export async function getServerSideProps(context) {
  const res = await fetch(`https://...`)
  const data = await res.json()

  if (!data) {
    return {
      redirect: {
        destination: '/',
        permanent: false, // statusCode 로 응답해도 된다.
        // statusCode 는 커스텀 상태 코드를 사용하는 오래된 클라이언트를 위해 적용해 줄 수 있다.
      },
    }
  }

  return {
    props: {}, // will be passed to the page component as props
  }
}
```

`getServerSideProps` 는 client-side 의 `bundle`에 포함되지 않으므로 최상위 범위의 모듈을 가져올 수 있다.

이는 **Server Side 코드를 바로 사용할 수 있다는 뜻**이다.(데이터베이스에 접근하는 등)

이때 API Route(`pages/api/...`) 를 사용한다면 `fetch` 로 가져올 수 없다. 따로 함수형태로 만들어 주어야 한다.

### example: API Route for getServerSideProps

```javascript
// pages/api/post.js
const getData = async () => Promise.resolve({ awe: 'some' });

const handler = async (req, res) => {
  const data = await getData();
  res.json({ data });
};

export const getAwesomeData = async () => {
  return await getData();
};

export default handler;
```

```javascript
// pages/post-api.js
import api, { getAwesomeData } from './api/post';

const PostApi = ({ data }) => {
  console.log('postApi Client', data);

  return (
    <>
      <div>Page: post/api/{data.awe}</div>
    </>
  );
};

export const getServerSideProps = async () => {
  // Direct fetch call will be throw Error!
  // const res = await fetch('http://localhost:3000/api/post');
  const data = await getAwesomeData();
  console.log('GET DATA!', data, data?.awe);

  return {
    props: {
      data,
    },
  };
};

export default PostApi;
```

## 언제 `getServerSideProps` 를 사용해야 할까?

요청 타임마다 반드시 데이터를 가져와야 할 경우 사용하면 좋다. Time to first byte(TTFB) 는 `getStaticProps` 보다 느릴 것이다. 모든 요청마다 서버에서 렌더링후 페이지를 내려주기 때문이다. 또한 CDN 케쉬도 할 수 없다.

페이지별 데이터가 자주 바뀌거나 유저의 요청에 따라서 결과 페이지가 달라질 경우 사용한다.

만약 데이터를 사전 렌더링 할 필요가 없다면 클라이언트 사이드 요청을 고려해도 괜찮다.

## getServerSideProps 의 기술적 세부 사항

### 오직 서버 사이드에서만 실행된다.

`getServerSideProps` 는 브라우저에서 절대 실행되지 않는다.

`getServerSideProps` 가 사용되는 경우는
- 페이지 요청을 서버로 바로 하는 경우 `getServerSideProps` 에서 렌더링 한다.
- `next/link`, `next/router` 를 통해 클라이언트 사이드에서 서버사이드렌더링 페이지로 접근할 경우 Next.js 는 API 를 서버로 보내고 `getServerSideProps` 가 실행되어 결과 값을 포함한 JSON 파일을 내려준다. 그 후 JSON 파일은 페이지에서 렌더링 된다.(`props`) 모든 작업은 Next.js 에서 자동으로 관리한다. 따라서 `getServerSideProps` 이외의 것들은 설정할 필요가 없다.

### 오직 페이지에서만 사용 가능하다.

`getServerSideProps` 는 컴포넌트 및 prototype 으로 사용할 수 없다. 오직 `pages` 밑의 page 들만 사용 가능하다.





