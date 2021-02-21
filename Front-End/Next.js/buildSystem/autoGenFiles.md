# Next.js 에서 자동으로 생성해주는 파일들 살펴보기

Next.js 에서 build 단계에서 생성된 파일들의 존재 이유와 동작 방식을 알아보자.

- 자동으로 생성되는 스크립트들의 역할
- 빌드 산출물

> 해당 글은 Next.js v10.0.1 SSR production 을 기준으로 작성 되었습니다.

<img src="https://user-images.githubusercontent.com/23524849/108622475-7608ff80-747c-11eb-8553-612c690c8ad0.png" width=40% />

> next build

<img src="https://user-images.githubusercontent.com/23524849/108622419-0eeb4b00-747c-11eb-9020-198f23454fb6.png">

> next start

알아보고자 하는 것

1. `head` 에서 `preload` 로 가져오는 `main, webpack, framework, pages` script
2. `head` 에서 `prefetch` 로 가져오는 `pages/*` script
3. `body` 의 `<div id="__next">...</div>` tag
4. `body` 의 `__NEXT_DATA__` script
5. `body` 의 `_buildManifest, _ssgManifest` 
6. `build` 산출물의 `server/pages`, `static/chunks/pages` 차이점

### 1. head 에서 preload 로 가져오는 main, webpack, framework, pages 의 존재 이유

preload 는 브라우저에게 현재 페이지에서 사용될 것이 명확한 리소스들을 지정하고, 빠르게 가져오기 위해 사용된다.

Next.js 는 pages 단위의 강력한 Code splitting 기능을 지원한다. `main, webpack, framework, pages` 는 각 페이지에서 필요한 기본 뼈대들으로, preload 를 통해 우선적으로 가져올 리소스에 해당한다.

- main, webpack, framework: 런타입 웹팩과 관련된 청크 파일.
- framework: react 나 react-router-dom 등 Next.js 에서 사용되는 중복되는 프레임워크를 분리한 chunk 파일
   - [Code Ref](https://github.com/vercel/next.js/blob/v10.0.1/packages/next/build/webpack-config.ts#L463), [Webpack docs](https://webpack.js.org/plugins/split-chunks-plugin/#splitchunkscachegroups)
- `pages/_app-...`, `pages/link-...`: 컴포넌트에서 사용될 js 파일. 현재 페이지가 link 이므로 link 컴포넌트를 가져온 모습.

### 2. head 에서 prefetch 로 가져오는 pages/* 의 존재 이유

prefetch 는 이후 사용될 것으로 예상되는 리소스를 알려주는 역할. 브라우저가 사용될 리소스를 가져와 캐시에 저장한다.

Production 모드에서는 라우팅으로 갈 수 있는 페이지들을 Pre-rendering 한다.

따라서 현재의 link 페이지에서 클릭으로 이동할 수 있는 잠재적 페이지들을 prefetch 해주어 빠른 페이지 로딩을 노리고 있다.

### 3. body 의 `<div id="__next">` 생성 이유

<img src="https://user-images.githubusercontent.com/23524849/108622742-1f042a00-747e-11eb-89f1-cfef662a55a6.png" width=80% />

[_document](https://nextjs.org/docs/advanced-features/custom-document) 에서 __next 를 [명시적으로 리턴](https://github.com/vercel/next.js/blob/v10.0.1/packages/next/pages/_document.tsx#L533) 하고 있으므로 next 프로젝트는 __next 를 최상위로 가지게 된다. 따라서 마크업 개발자 분들에게 최상단 __next div 의 존재를 전파하여야 함.

_document 에서 만들어진 __next 는 이후 [렌더링 작업](https://github.com/vercel/next.js/blob/v10.0.1/packages/next/client/index.tsx#L148)에서 사용 된다.

> p.s _document 는 [서버 사이드에서만 렌더링](https://nextjs.org/docs/advanced-features/custom-document#caveats) 되므로 클라이언트 로직(ex. eventlistener)이 있으면 안된다.

### 4. body 의 NEXT_DATA script 의 생성 이유

![image](https://user-images.githubusercontent.com/23524849/108622933-617a3680-747f-11eb-893c-5910587fc7a2.png)

Next.js 는 클라이언트 사이드와 서버 사이드간 데이터 교환을 하는 객체가 존재하는데, 그것이 `__NEXT_DATA__` 이다.

SSR 이동시 서버와 클라이언트 사이의 context 를 유지시켜 주기 위해 데이터를 클라이언트에 넘겨줄 필요성이 있다. 이때 `get...Props` 를 사용하여 `__NEXT_DATA__` 객체에 데이터를 담을 수 있다.

<img src="https://user-images.githubusercontent.com/23524849/108622978-ae5e0d00-747f-11eb-9d1b-17c80117ea7a.png" width=70% />

이때, **props 와 pageProps 의 차이가 있다!** `_app` 에서 넘겨준 데이터는 props 에 들어가며 하위 페이지에서 넘겨준 데이터는 pageProps 로 들어가게 된다.

### 5. body 의 _buildManifest, _ssgManifest 생성 이유

<img src="https://user-images.githubusercontent.com/23524849/108622475-7608ff80-747c-11eb-8553-612c690c8ad0.png" width=40% />

chunk 단위로 분리된 페이지의 build 시에 맵핑을 어떻게 해줄건지 설명해주는 파일이다.

![image](https://user-images.githubusercontent.com/23524849/108623068-3fcd7f00-7480-11eb-8434-e40d699d9e97.png)

서버가 가지고 있는 `build-manifest.json` 은 빌드시 생성 되는 [모든 파일에 대한 맵핑](https://github.com/vercel/next.js/blob/v10.0.1/packages/next/build/webpack/plugins/build-manifest-plugin.ts#L218)에 해당한다. 따라서 클라이언트에게 보낼 때는 `_buildManifest.js` 로 분할해 전송하게 된다.

### 6. build 산출물의 server/pages 와 static/chunks/pages 의 차이점

- server 에는 _document 가 있지만 static(client) 에는 _document 가 존재하지 않음.
   - 당연하게도 _document 는 클라이언트에서 렌더링되지 않기 때문!
- 각 pages 마다 차이점이 있다기 보다는 SSR 로 페이지를 그려야할 데이터가 server/pages 에 존재하고 이후 클라이언트 사이드에서 렌더링 해야하는 데이터가 static/chunks/pages 에 존재하는 구조.
- 따라서 서버와 클라이언트 모두 각각의 페이지가 있어도 이상하지 않다. 서버 사이드에서 페이지를 렌더링한 이후 클라이언트 사이드에서 페이지를 다시 렌더링 한다고 볼 수 있다.
