# CSS Grid 알아보기

## History of Float, Flex and Grid

1. Float-based layout

> The CSS float property was originally introduced to float an image inside a column of text on the left or right (something you often see in newspapers). Web developers in the early 2000s took advantage of the fact that you could float not just images, but any element, meaning you could create the illusion of rows and columns by floating entire divs of content. But again, floats weren’t designed for this purpose, so creating this illusion was difficult to pull off in a consistent fashion. - from Modern CSS Explained for Dinosaurs

float은 신문처럼 이미지를 텍스트가 둘러쌀수 있도록 하기 위해서 등장했다. 원래 layout을 목적으로 등장한 것은 아니지만 이를 활용해서 rows, columns 이 있는 것과 같은 효과를 낼 수는 있어서 초기에 많이 사용되었던 방법이다. 하지만 float으로 layout을 설정할때는 clearfix와 같은 부자연스러운 기법을 사용했어야했다(clear: both 설정). 또한 아래 이미지와 같은 형태의 단순한 layout을 배치하는(Holy Grail이라고 불리는 layout)것이 float로 해결하려면 상당히 복잡했고, 이 후 flex가 등장했다.

<img src="https://miro.medium.com/max/1400/1*_2LrWDjxL8Q33fL6Ci4hIw.png" alt="from Modern CSS Explained for Dinosaurs">

2. Flex-based layout

> The flexbox CSS property was first proposed in 2009, but didn’t get widespread browser adoption until around 2015. Flexbox was designed to define how space is distributed across a single column or row, which makes it a better candidate for defining layout compared to using floats. This meant that after about a decade of using float-based layouts, web developers were finally able to use CSS for layout without the need for the hacks needed with floats. - from Modern CSS Explained for Dinosaurs

> It’s important to note again that flexbox was designed to space elements within a single column or row — it was not designed for an entire page layout! - from Modern CSS Explained for Dinosaurs

flex는 한 columns이나 rows를 기준으로 공간을 배치하기 위해서 만들어진 것이다. float보다는 진보한 방식이긴 하나, 여전히 한 row나 colum내에서 배치를 하기 위해서 고안된것이라는 한계가 있다. layout을 설정할 아이템들을 container로 감싸고 `display: flex` 속성을 줘서 내부 아이템들을 flex items로 만들어 layout을 변경할 수 있다. 하지만 flex또한 2차원 공간인 웹화면에서 layout을 구성하기 위해 등장한 것이 아니라는 한계가 있었다.

- 아래는 flex를 사용할때 참고할 수 있는 자료이다.
  - [how to use it](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
  - [how to use it(ko)](https://heropy.blog/2018/11/24/css-flexible-box/)

3. **Grid-based layout**

> CSS grid was first proposed in 2011 (not too long after the flexbox proposal), but took a long time to gain widespread adoption with browsers. As of early 2018, CSS grid is supported by most modern browsers (a huge improvement over even a year or two ago). - from Modern CSS Explained for Dinosaurs

> Once you get used to the grid syntax, it clearly becomes the ideal way to express layout in CSS. The only real downside to a grid-based layout is browser support, which again has improved tremendously over the past year. It’s hard to overstate the importance of CSS grid as the first real tool in CSS that was actually designed for layout. - from Modern CSS Explained for Dinosaurs

grid는 정말로 layout을 위한 장치로 2차원으로 layout을 배치할 수 있다. 하지만 이 기법이 flex를 대신하는 것은 아니고, grid와 flex를 적절이 섞어서 사용하는 것이 좋다. [can I use grid](https://caniuse.com/?search=css%20grid) 를 통해서

- 아래는 grid를 사용할때 참고할 수 있는 자료이다.
  - [how to use it](https://css-tricks.com/css-grid-one-layout-multiple-ways/)
  - [how to use it(ko)](https://heropy.blog/2019/08/17/css-grid/)

## 간단하게 grid 속성 정리

- display: grid;

  - grid를 적용할 대상에 적용. 이크기에 맞춰서 grid가 생긴다. 그리고 자식요소들은 Grid Items가 된다
  - body에 grid 속성을 줄수도 있다.

- grid-template:

  - grid-template-columns:
    - 명시적으로 열의 크기를 정한다. `grid-template-columns: 1열의 크기 2열의 크기 ...` 이다.
  - grid-template-rows:
    - 명시적으로 행의 크기를 정한다. `grid-template-rows: 1행의 크기 2행의 크기 ...`

- fr: 사용가능한 공간에 대한 비율

- repeat: 행/열의 크기 정의를 반복

- grid-template과 fr, repeat을 같이 사용하는 방법

  - column과 row를 사용가능한 공간에 대한 비율일 1fr단위로 나타내면 아래의 예시를 기준으로 6개의 칼럼과 3개의 행이 생긴다.

    ```css
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    ```

  - 반복되는 1fr단위를 repeat을 활용하면 아래와같이 간단해진다.
    ```css
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(3, 1fr);
    ```

- grid-column / grid-row

  - `grid-template-*` 이것들은 grid 적용하는 container에 적용하는 것이고 grid-column과 grid-row는 grid-item에 적용해서 위치를 지정할 수 있다.

- grid-gap

  - grid-item간의 gap을 지정할 수 있다.

# 참고한 자료

- [floats, flexbox, grid - the progression of CSS layouts](https://www.youtube.com/watch?v=R7gqJkdc5dM&ab_channel=KevinPowell)
- [Modern CSS Explained for Dinosaurs](https://medium.com/actualize-network/modern-css-explained-for-dinosaurs-5226febe3525)
- [Why CSS grid-area is the best property for laying out content](https://www.youtube.com/watch?v=duH4DLq5yoo&ab_channel=KevinPowell)
- [CSS Grid 완벽 가이드](https://heropy.blog/2019/08/17/css-grid/)
- [Build a Mosaic Portfolio Layout with CSS Grid](https://www.youtube.com/watch?v=plRcoRqLriw&list=PL4-IK0AVhVjPv5tfS82UF_iQgFp4Bl998&ab_channel=KevinPowell)
