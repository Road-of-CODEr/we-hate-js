# getStaticPaths

만약 동적 라우트를 사용하면서 `getStaticProps` 를 사용한다면 빌드 시점에 HTML 렌더링을 위해 정의된 `path` 가 필요하다. 이것을 위한 함수.

```javascript
export async function getStaticPaths() {
  return {
    paths: [
      { params: { ... } } // See the "paths" section below
    ],
    fallback: true or false // See the "fallback" section below
  };
}
```

페이지에서 비동기 함수 `getStaticPaths` 를 `export` 하게 되면 빌드시 다이나믹 라우팅을 정적으로 사전 렌더링 해줄 수 있게 된다.

## The `paths` key(required)

`paths` 인자에 들어오는 키값으로 어떤 경로를 사전 렌더링할지 결정한다. 만약 `pages/posts/[id].js` 라고 페이지를 만들었다면 `paths` 에서 설정해 주어야 하는 경로 키값은 `id` 가 된다.

```javascript
return {
  paths: [
    { params: { id: '1' } },
    { params: { id: '2' } }
  ],
  fallback: ...
}
```

위와 같이 해주게 되면 Next.js 는 정적 생성으로 `posts/1`, `posts/2` 페이지를 빌드 시점에 만들어 주게 된다.

**이때 `id` 와 같이 매개 변수의 값은 페이지 이름에 사용된 값과 일치해야 한다**.

- `pages/posts/[postId]/[commentId].js` 일 경우 `paths: [{params: { postId: 1, commentId: 2}}]`
- 만약 모든 경로를 처리하고 싶다면 `pages/[...slug]` 와 같이 해주면 된다. 이 경우 `params` 는 배열 형태의 `slug` 값을 포함하게 된다. 만약 `slug: ['foo', 'bar']` 라면 `/foo/bar` 경로에 해당한다는 뜻.

```javascript
// pages/com/[...slug].js
const com = ({ slug }) => {
	if (!Array.isArray(slug)) return <h1>com</h1>;

  // localhost/100/101 - 사전 렌더링으로 만들어진 페이지
  // localhost/100/101/102 - 이하는 fallback 으로 만들어 질 수 있는 페이지
  // localhost/222/7227/102 - fallback 은 밑에서 다룬다.
  // ...etc 모두 가능
	return (
		<>
			{slug.map((e, i) => (
				<h1>
					{i}: {e}
				</h1>
			))}
		</>
	);
};

export const getStaticPaths = () => {
	const paths = [{ params: { name: 'user', slug: ['100', '101'] } }];
	return {
		paths,
		fallback: true,
	};
};

export const getStaticProps = ({ params }) => {
	const { slug } = params;
	return {
		props: { slug },
	};
};

export default com;
```

- 만약 선택적으로 모든 경로를 잡아주고 싶다면 `pages/[[...slug]]` 로 표현해 줄 수 있게 된다. `slug` 에  `null`, `[]`, `undefined`, `false` 의 값을 넣어 주면 `pages/` 로 루트 처리가 된다.
   - `pages/[...slug]` 로 하게 될 경우 반드시 slug 값이 있어야 하는 것과의 차이다.

## The `fallback` key(required)

`getStaticPaths` 는 반드시 `fallback` 인자를 반환해야한다.

### `fallback: false`

만약 `fallback: false` 일 경우 `paths` 에 정의해주지 않은 다른 모든 경로는 404 page 로 떨어지게 된다. 이 기능을 통해 다른 동적 경로를 막고 원하는 경로만 정의해줄 수 있다.

만약 `paths` 에 다 일일이 정의해줄 수 없을 만큼 동적 경로가 많은데, 이 경로 이외의 동적 재생성을 원하지 않는다면 아래와 같이 처리해줄 수 있다.

```javascript
// pages/posts/[id].js
function Post({ post }) {
  // Render post...
}

export async function getStaticPaths() {
  const res = await fetch('https://.../posts')
  const posts = await res.json()

  // KEY! 각 포스트의 id 값을 뽑아내 paths 로 만들어 버렸다.
  const paths = posts.map((post) => ({
    params: { id: post.id },
  }))

  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  // 각 Path 키 값에 해당하는 데이터를 가져온다.
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  return { props: { post } }
}

export default Post
```

### `fallback: true`

만약 `fallback: true` 를 해주게 되면 `getStaticProps` 의 행동은 아래와 같이 변한다.

- 빌드 시점에 `getStaticPaths` 에서 반환되는 경로가 `getStaticProps` 에 의해 사전 렌더링 된다.
- **빌드시 생성되지 않은 경로는 404 페이지로 되지 않는다**. 대신 Next.js 는 각 경로의 페이지들에게 [`fallback` 상태](#fallback-pages) 임을 제공해 준다.
- 요청이 들어오면 `getStaticProps` 를 백그라운드 작업으로 실행해 HTML 과 JSON 파일을 **정적 생성**(서버사이드렌더링이 아님!) 한다.
- 정적 생성이 완료되면 브라우저는 정적 생성된 경로의 JSON 파일을 받게 된다. 이는 나중에 자동으로 페이지 렌더링에 필요한 props 로 사용 된다.([예시](추가 예정)) 사용자 시점에서 페이지가 fallback 상태였다가 전체 페이지로 전환 되는 것처럼 보이게 된다.(위의 `fallback 상태` 링크 설명)
- 동시에, Next.js 는 사전 렌더링 페이지 리스트에 해당 경로를 추가한다. 요청을 완료한 이후 동일한 경로로 접근하게 될 경우 정적 생성된 페이지를 받게 된다.(빌드 시점에 사전 렌더링된 다른 정적 페이지와 같아지는 것)
- `fallback: true` 로 설정하면 `next export` 를 사용할 수 없다.(동적 경로를 허가했기 때문에 정적 export 를 할 수 없는 것: 경로를 사전에 알 수가 없다.)

## Fallback Pages

페이지에서 `fallback` 상태는
- 페이지의 props 가 비어있음
- `router` 를 사용해 폴백 렌더링 상태인지 인지할 수 있다.
   - `router.isFallback` 이 `true` 인 경우.

```javascript
// pages/posts/[id].js
import { useRouter } from 'next/router'

function Post({ post }) {
  const router = useRouter()

  // fallback 처리 중일 경우 로딩처럼 사용할 수 있다.
  // 페이지가 만들어지면 false 로 값이 변경된다.
  // paths 에 없는 /post/3 와 같이 접근할 때 실행된다.
  if (router.isFallback) {
    return <div>Loading...</div>
  }

  // Render post...
}

export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }, { params: { id: '2' } }],
    fallback: true,
  }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`https://.../posts/${params.id}`)
  const post = await res.json()

  return {
    props: { post },
  }
}

export default Post
```

### 언제 `fallback: true` 를 사용하는 것이 유용한가?

만약 아주 많은 정적 페이지가 데이터에 의존해 존재할 경우 유용하다. 수많은 모든 페이지를 정적 생성하게 될 경우 빌드타임이 상당히 오래 걸리게 된다.

그러므로 유저가 최초 진입시 `fallback` 으로 생성하게 한다면, 유저가 접근하지 않는 페이지들은 생성하지 않기에 유리하며, 기존 빌드타임에서 필요한 `getStaticProps` 가 실행되기 때문에 사전 렌더링과 차이가 없다.

즉 이후의 요청에 대해선 정적 생성된 페이지가 내려갈 뿐 재생성하지 않아 성능적 이점이 크다.

이를 통해 빠른 빌드와 정적 생성의 이점을 모두 취할 수 있기 때문에 유저에게 좋은 경험을 준다.

여기서 또 한가지 중요한 점은 `fallback: true` 는 ***정적 페이지를 업데이트 하지 않는다***! 정적 생성 업데이트와 동적 경로를 모두 사용하고 싶다면 [Incremental Static Regeneration]() 를 사용하라.

### `fallback: blocking`

`fallback: blocking`은 10 버전에 새로 생긴 기능으로, 위의 예시처럼 `loading...` 과 같은 fallback 페이지를 보여주는 것이 아닌 사전 렌더링이 완료될 때까지 "기다리게" 하는 옵션이다.

blocking 상태일 때 `getStaticProps` 는 `fallback: true` 일때와 동일하게 동작한다.
- 다른 점은 유저가 요청시 "loading/fallback" 상태를 주지 않는다.

## 언제 `getStaticPaths` 를 사용해야 하는가?

동적 경로를 사전 렌더링 하고 싶을 때 사용한다.

## getStaticPaths 의 기술적 세부 사항

### `getStaticProps` 와 같이 사용

동적 라우팅 페이지에서 `getStaticProps` 를 사용할 경우 반드시 `getStaticPaths` 와 함께 써야한다.

`getStaticPaths` 를 `getServerSideProps` 와 사용할 수 없다.

### 오직 빌드 시점에만 서버에서 실행된다.

### 오직 Pages 폴더 아래에서만 가능하다.

컴포넌트에서 사용 불가능 및 컴포넌트에서 `property` 로 사용하면 안된다.

### development 모드에서는 모든 요청에 실행된다.

`next dev` 에서는 빌드타임에서만이 아니라 모든 요청에 실행된다.