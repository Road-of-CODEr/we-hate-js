# 콜백 함수(Callback function)
콜백 함수란 `다른 코드의 인자로 넘겨주는 함수` 이다. 콜백 함수를 넘겨받은 코드는 적절할때 이 콜백 함수를 실행할 수 있는 **제어권**을 가진다. 

## 콜백 함수는 함수다
- 어떤 객체의 메서드를 콜밤함수로 전달하면, 함수로 동작해서 **this가 전역객체가 된다**(별다른 설정이 없는 경우)
  1. 메서드를 콜백 함수로 전달했을 때 
        ```javascript
            let obj = {
                arr: [1,2,3],
                arrFunc: function(v, i){
                    console.log(this, v, i); // 1
                }
            }
            obj.arrFunc(1, 2); // 2
            [4, 5, 6].forEach(obj.arrFunc); // 3
        ```
        - 2번째 줄을 실행하면 this가 obj 객체이므로 1번째 줄의 결과는 `obj, 1, 2` 이다. 
        - 3번째 줄을 시작하면 arrFunc와 obj 객체의 **연관이 없어지고** 함수 내부에서 this는 전역객체가 된다. 
  

  2. 객체의 메서드를 콜백함수로 전달했을때, 해당 객체를 this로 바라볼수 없게 되는 문제 해결방법
       - 별도 인자로 this를 받는 경우 해당 인자로 넘겨줌
       - bind를 활용해서 바인딩하는 방법
            ```javascript
                let obj = {
                    arr: [1,2,3],
                    arrFunc: function(v, i){
                        console.log(this, v, i); // 1
                    }
                }
                obj.arrFunc(1, 2); // 2
                [4, 5, 6].forEach(obj.arrFunc.bind(obj)); // 3
            ```
         - 3번째 줄을 시작하면 arrFunc와 obj 객체에 obj 객체를 다시 바인딩 해준다. 함수 내부에서 this는 obj객체가 된다. 


## 콜백 지옥과 비동기 제어
- 콜백 지옥이란? 
  - 콜백 함수를 익명함수로 전달하는 과정이 계속 반복되다가, 읽기가 너무 힘들어지는 현상. 콜백 지옥이 생기면 읽기도 수정하기도 힘든데, 주로 비동기 처리를 하다가 발생하는 경우가 많음
  - 콜백 헬 예시
  <img src="https://miro.medium.com/max/1400/0*bO_JSfydCKFUnJ2d.png" alt="콜백 헬">

- 동기(Synchronous)적이란? 
  - 현재 실행 중인 코드가 완료되야 다음 코드를 실행할 수 있는 것
  - 즉시 처리 가능한 코드 대부분

- 비동기(Asynchronous)적이란? 
  - 현재 실행 중인 코드가 완료되던 안되던 다음 코드로 넘어가는 것
  - ex) setTimeout처럼 설정한 시간동안 실행을 보류하는것, 마우스가 클릭할때까지 실행을 보류 하는 것, api 요청을 하고 응답이 올때까지 기다리는 경우
  

- 콜백 헬 예시 및 이를 해결하는 방법
  1. 콜백 헬 예시 코드
    ```javascript
    setTimeout(function(name){
        let coffeeList = name;
        console.log(coffeeList);

        setTimeout(function(name){
            coffeeList += ', ' + name;
            console.log(coffeeList);

            setTimeout(function(name){
                coffeeList += ', ' + name;
                console.log(coffeeList);

                setTimeout(function(name){
                    coffeeList += ', ' + name;
                    console.log(coffeeList);

                }, 200, '커피 4')  
            }, 200, '커피 3');
        }, 200, '커피 2');
    }, 200, '커피 1');
    ```
    자세히 읽어보면 뭐하는 코드인지 알겠지만, 보기도 싫은 코드. 200 ms 마다 커피1, 커피 2, 커피 3, 커피 4를 더하는 함수이다. 이제 이 코드를 좀더 가독성있게 바꿔보자

  2. 기명함수로 바꾸기(이름있는 함수)
    ```javascript
    let coffeelList = '';
    let addCoffee1 = function(name) {
        coffeeList = name;
        console.log(coffeeList);
        setTimeout(addCoffee2, 200, '커피 2');
    }
    let addCoffee2 = function(name) {
        coffeeList += ', ' + name;
        console.log(coffeeList);
        setTimeout(addCoffee3, 200, '커피 3');
    }
    let addCoffee3 = function(name) {
        coffeeList += ', ' + name;
        console.log(coffeeList);
        setTimeout(addCoffee4, 200, '커피 4');
    }
    let addCoffee4 = function(name) {
        coffeeList += ', ' + name;
        console.log(coffeeList);
    }
    setTimeout(addCoffee1, 200, '커피 1');
    ```
    가독성은 더 좋아졌지만, 한번밖에 쓰이지 않는 함수를 하나하나 다 변수에 할당하는 것은 비효율적. 또한 코드 전체를 읽어야 흐름파악을 할 수 있다는 문제가 있다. 

  3. Promise 활용하기
  - 비동기적인 작업을 동기적으로 보이게하기 위한 장치
  - ES6에서 Promise, Generator가 도입되고 이후 ES7에서 async/await가 도입됨
  - [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) 는 Promise 객체에 넘겨주는 콜백함수 내에서 resolve, reject 함수를 호출해야 then, catch 구문으로 넘어간다. 이를 통해 비동기적인 동작 내에서 resolve, reject 를 사용해 비동기 작업을 동기적으로 표현할 수 있다. 
    ```javascript
    let addCoffee = function(name){
        return function(coffeeList) { // 1
            return new Promise(function (resolve){
                setTimeout(function(){
                    let newCoffeeList = coffeeList ? (coffeeList + ', ' + name) : name;
                    console.log(newCoffeeList);
                    resolve(newCoffeeList);
                }, 200);
            })
        }
    }

    addCoffee('커피 1')() // 첫번째 promise 객체 반환
    .then(addCoffee('커피 2')) // 첫번째 promise의 return 값을 1번째 줄에 인자로 넣어준다.
    .then(addCoffee('커피 3')) // 두번째 promise의 return 값을 1번째 줄에 인자로 넣어준다.
    .then(addCoffee('커피 4')) // 첫번째 promise의 return 값을 1번째 줄에 인자로 넣어준다.
    ```

  4. Generator 활용하기 
   - [Generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Generator) 는 Iterator를 반환해주는 함수로 next를 호출해서 실행하며, yield를 만나면 해당 부분에서 실행을 멈춘다. 다음에 next를 다시 호출하면 다시 그다음 yield에서 멈춘다. **비동기 작업이 완료될때 next메서드를 호출해서 비동기 작업을 동기적으로 보이게 할 수 있다**
        ```javascript
            let addCoffee = function(coffeeList, name){
                setTimeout(function() {
                    coffeeFunc.next(coffeeList ? coffeeList + ', ' + name: name);
                }, 200)
            }
            let coffeeGenerator = function* () {
                let coffee1 = yield addCoffee('', '커피 1');
                console.log(coffee1);
                let coffee2 = yield addCoffee(coffee1, '커피 2');
                console.log(coffee2);
                let coffee3 = yield addCoffee(coffee2, '커피 3');
                console.log(coffee3);
                let coffee4 = yield addCoffee(coffee3, '커피 4');
                console.log(coffee4);
            }
            let coffeeFunc = coffeeGenerator();
            coffeeFunc.next();
        ```
    5. [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) 활용하기
    - async는 항상 promise를 반환하는 함수로 promise만 이용하는 것보다 더 쉽게 promise객체를 사용할 수 있게 해주는 도구
    ```javascript
    let addCoffee = function(name){
        return new Promise(function (resolve){
            setTimeout(function(){
                resolve(name);
            }, 200);
        })
    }

    let coffeeFunc = async function() {
        let coffeeList = '';

        let _addCoffee = async function(name) {
            coffeeList += (coffeeList ? ',': '') + await addCoffee(name);
        }

        await _addCoffee('커피1');
        console.log(coffeeList);
        await _addCoffee('커피2');
        console.log(coffeeList);
        await _addCoffee('커피3');
        console.log(coffeeList);
        await _addCoffee('커피4');
        console.log(coffeeList);
    }

    coffeeFunc();
    ```
    위처럼 async/await를 이용하면 가독성이 좋게 문제를 해결할 수 있다. 

### 출처
[코어 자바스크립트](http://www.yes24.com/Product/Goods/78586788) 4장
[콜백 헬 이미지 출처](https://medium.com/gousto-engineering-techbrunch/avoiding-callback-hell-97734e303de1)