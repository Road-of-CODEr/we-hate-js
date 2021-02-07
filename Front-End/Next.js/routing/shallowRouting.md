Shallow Routing
---

[공식 문서](https://nextjs.org/docs/routing/shallow-routing)

Shallow Routing 은 `[getServerSideProps](../basicFeatures/dataFetching/getServerSideProps.md`, `[getStaticProps](../basicFeatures/dataFetching/getStaticProps.md)`, `getInitialProps` 과 같은 데이터 fetching 메서드를 다시 실행하지 않고 URL 을 바꿔주는 라우팅이다.

Shallow 라우팅을 사용해 URL 을 업데이트 하면 `pathname`, `query` 값의 상태를 잃지 않고 [Router 객체](https://nextjs.org/docs/api-reference/next/router#router-object)를 통해 받을 수 있게 된다.

즉 불필요한 서버 연산을 최소화 하고 필요한 상태 값(pathname, query)을 라우터에 넣어서 전달하게 되는 것이다.

Shallow 라우팅을 적용하려면 아래와 같이 작성하면 된다.

```javascript
import { useEffect } from 'react'
import { useRouter } from 'next/router'

// Current URL is '/'
function Page() {
  const router = useRouter()

  useEffect(() => {
    // Always do navigations after the first render
    router.push('/?counter=10', undefined, { shallow: true });
    // OR
    // router.push(
    //   {
    //     pathname: "/users",
    //     query: { ...values, page: 1 }
    //   },
    //   undefined,
    //   { shallow: true }
    // );
  }, [])

  useEffect(() => {
    // The counter changed!
  }, [router.query.counter])
}

export default Page
```

최초 렌더링 이후 라우터는 `/?counter=10` 으로 업데이트 될 것이다. 이때 페이지는 새로 렌더링 되지 않으며 상태 라우터만 변경된다.(shallow)

```javascript
import { useRouter } from 'next/router'
import Link from 'next/link'
import { format } from 'url'

let counter = 0

export async function getServerSideProps() {
  counter++
  return { props: { initialPropsCounter: counter } }
}

export default function Index({ initialPropsCounter }) {
  const router = useRouter()
  const { pathname, query } = router

  const reload = () => {
    router.push(format({ pathname, query }))
  }
  const incrementCounter = () => {
    const currentCounter = query.counter ? parseInt(query.counter) : 0
    const href = `/?counter=${currentCounter + 1}`

    router.push(href, href, { shallow: true })
  }

  return (
    <div>
      <h2>This is the Home Page</h2>
      <Link href="/about">
        <a>About</a>
      </Link>
      <button onClick={reload}>Reload</button>
      <button onClick={incrementCounter}>Change State Counter</button>
      <p>"getServerSideProps" ran for "{initialPropsCounter}" times.</p>
      <p>Counter: "{query.counter || 0}".</p>
    </div>
  )
}
```

위의 코드로 실행하게 되면 reload 할때마다 URL 쿼리의 counter 가 늘어나지만 `get...Props` 를 타지 않기 때문에 서버의 리소스를 아낄 수 있다는 장점이 있다.

