# Next.js 에서 데이터 가져오기

이전의 [페이지 문서](pages.md)에서 사전 렌더링을 위해 데이터를 가져오는 두 가지 방법으로 **Static Generation**과 **ServerSide Rendering**이 있다고 했다.

이번 장에서는 각 렌더링에서 사용할 수 있는 함수를 알아보자.

1. [`getStaticProps`(Static Generation)](getStaticProps.md): 빌드시 데이터를 가져온다.
2. [`getStaticPaths`(Static Generation)](getStaticPaths.md): 사전 렌더링 할 **동적 경로**를 설정한다.
3. [`getServerSideProps`(Server Side Rendering)](getServerSideProps.md): 모든 요청에 데이터를 가져온다.
4. `fetch`, `useSWR`(Client Side): 클라이언트 측에서 데이터를 가져오는 방법.
