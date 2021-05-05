# NPM Package 만들기

TypeScript 를 사용하는 NPM package를 개발할때 필요한 내용을 간단하게 정리해보았다. 

## ts-loader
- [docs](https://github.com/TypeStrong/ts-loader)

webpack에서 typescript 파일을 처리하도록 하기 위해서 ts-loader를 사용할 수 있다. 
ts-loader를 사용하면 tsconfig.json을 참고해서 typescript 문법을 검사 하기 때문에 tsconfig.json 파일을 반드시 생성해야한다. 

```javascript
module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
```

node_modules를 제외하고 처리하도록 설정한다. 

## types .d.ts파일 생성하기
- [docs](https://www.typescriptlang.org/docs/handbook/declaration-files/dts-from-js.html)

.d.ts 파일은 tsconfig 설정을 통해서 생성하도록 할 수 있다. 

- 예시
    ```javascript
    {
    "compilerOptions": {
        "outDir": "./lib",
        "noImplicitAny": true,
        "module": "esnext",
        "target": "es5",
        "jsx": "react",
        "allowJs": true,
        "sourceMap": true,
        "isolatedModules": true,
        "declaration": true, // declaration파일을 생성
        "moduleResolution": "node",
        "resolveJsonModule": true
    }
    }
    ```


## css-modules-typescript-loader
- [docs](https://www.npmjs.com/package/css-modules-typescript-loader)

typescript 프로젝트에서 css 파일을 번들리하기 위해서 css 파일들도 type 정보가 필요하다. 이를 처리해주기 위해서 `css-modules-typescript-loader`를 사용할 수 있다. 

```javascript
// webpack.config.js
module: {
    rules: [
    {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
    },
    {
        test: /\.css$/,
        use: [
        { loader: "style-loader" }, // to inject the result into the DOM as a style block
        { loader: "css-modules-typescript-loader" }, 
        { loader: "css-loader", options: { modules: true } },
        ],
    },
    ],
},
```

css가 번들되는 순서는 아래와 같다. 
1. ts-loader를 통해서 typescript 파일을 처리
2. css-modules-typescript-loader를 통해서 css 파일에 대한 .d.ts파일을 생성
3. css-loader가 JavaScript로 변환해서 번들되도록 함

## build output 설정

- webpack.config.js의 output 설정
    ```javascript
    output: {
            path: path.resolve("lib"),
            filename: "filename.js",
            libraryTarget: "commonjs2",
            },
    ```

번들링된 파일이 lib에 저장되도록 위와 같이 설정할 수 있다.


## package.json 파일 설정

package.json에서 아래와 같이 설정해서 lib 폴더내에 번들링된 파일을 가르키도록 설정한다. 배포할 때 lib 폴더를 포함하여, main을 통해 번들링된 파일 경로를 지정하고, types를 통해 해당 패키지의 types 정의에 대한 정보를 제공한다. 

```javascript
{
  "name": "package-name",
  "version": "0.0.x",
  "description": "something something",
  "main": "lib/filename.js",
  "types": "lib/src/filename.d.ts",
``` 

