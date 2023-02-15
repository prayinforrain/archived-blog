---
title: "Emotion"
date: 2022-11-18T16:42:55+09:00
lastmod: 2022-11-18T16:42:55+09:00
draft: false
categories: ["moheyum", "React"]
tags: ["moheyum", "Emotion", "CSS-in-JS"]
---

# 🤷TL;DR

- CSS-in-JS는 프로젝트 규모가 커질수록 관리하기 어려운 CSS의 문제를 보완한다.
- emotion과 styled-components는 사용상의 차이가 거의 없으니 골라서 사용하자.
- 적절한 IDE Extension을 잘 활용하자.
- CSS-in-JS가 모든 경우에 대한 정답이 아님을 인지하자.

# 🎨CSS-in-JS

CSS-in-JS는 HTML Element의 스타일을 자바스크립트 파일을 통해서 지정하는 방식입니다. .css 파일이 하던 일을 .js 파일에게 시키는 것이죠. CSS는 CSS이고, JS는 JS입니다. 왜 굳이 둘을 합쳐야만 하는 것일까요? 이 알 수 없는 발상을 이해하려면 우선 기존 css의 단점을 살펴보겠습니다.

![Untitled](/image/emotion_01.png)

![Untitled](/image/emotion_02.png)

제가 학습 스프린트때 진행한 프로젝트 파일의 일부입니다. 사용자의 현재 위치를 표시하기 위한 컴포넌트의 스타일을 `location-bar`라는 클래스명으로 지정하고 있죠. 단순히 이 부분만 봐서는 크게 문제가 없어 보이지만, 아래와 같은 문제들이 있습니다.

- `location-bar` 라는 클래스명은 추상적입니다.
  즉, 사용자의 위치를 표시하기 위한 `location-bar`는 장기적으로 다양한 페이지에서, 다양한 컴포넌트에서 활용될 수 있습니다. CSS는 그 적용 범위를 지정하는 것이 상당히 제한적이기 때문에 이런 문제를 해결하려면 클래스명을 더 길고 복잡하게 정할 수 밖에 없습니다.
- css 파일은 관심사의 분리가 어렵습니다.
  당장 저 파일은 어떤 상품의 정보를 표시하기 위한 컴포넌트의 스타일만이 모여 있습니다. 상품 정보와 사용자 위치는 크게 연관이 없어보임에도 같은 페이지에 있다는 이유로 같은 파일에 있으며, 이를 수정하려면 400줄 가량 되는 파일에서 저 부분을 찾아야만 합니다.

작업할 당시에는 당연한 불편함이라 생각하고 감내해 왔지만, 프로젝트 규모가 커졌을 때를 상상해 보니 머리가 시큰해집니다. 이런 문제를 해결하기 위해 등장한 것이 **CSS-in-JS**입니다.

# 😆emotion/styled

React에서 사용하는 CSS-in-JS 라이브러리는 `styled-components`와 `emotion` 두 가지가 있습니다. 두 라이브러리는 사실 사용하는 입장에서 차이가 거의 없습니다. 어떤 레퍼런스를 보면 `emotion`만이 css props를 사용할 수 있다는 차이점을 이야기하지만, 지금 시점에서는 양쪽 다 지원하고 있습니다. 성능 역시 `emotion`이 앞선다는 분석이 있지만 `styled-components` 역시 최적화가 이루어지고 있고, 애초에 그렇게 큰 폭으로 차이가 나지 않기 때문에, 손에 잡히는 것 아무거나 사용해도 될 것 같습니다. 저는 `emotion`이 더 손에 익다는 이유로 `emotion`을 골랐습니다. **styled**라는 단어가 키보드로 잘 안 쳐 지더라구요.

```powershell
npm i @emotion/styled @emotion/babel-plugin
```

`@emotion/babel-plugin`은 babel을 사용하는 경우에만 설치 후 config파일의 plugins에 `@emotion`을 추가해 줍니다. 그러면 모든 준비가 끝납니다. 사용 예시를 확인하기 위해 예제 코드를 준비했습니다.

```tsx
export default function TestRecoil() {
  const [count, setCount] = useRecoilState(counterState);
  return (
    <div>
      <div>
        <button
          type="button"
          onClick={() => {
            setCount(count - 1);
          }}
        >
          -
        </button>
        <div>{count}</div>
        <button
          type="button"
          onClick={() => {
            setCount(count + 1);
          }}
        >
          +
        </button>
      </div>
      <button
        type="button"
        onClick={() => {
          setCount(0);
        }}
      >
        초기화
      </button>
    </div>
  );
}
```

![Untitled](/image/emotion_03.png)

아주 참을 수 없게 못생긴 컴포넌트군요. 이제 이 컴포넌트에 스타일을 지정해 주겠습니다. 해당 tsx파일에 아래와 같이 코드를 추가하였습니다. **모든 스타일 이름은 대문자로 시작**해야 하는 점 주의하세요. 왜냐면 이 녀석들이 컴포넌트의 이름으로서 취급될 예정이거든요!

```tsx
import styled from '@emotion/styled';
...
const WrapperDiv = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  background-color: #ff0000;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 30%;
  background-color: #00ff00;
`;

const ResetButton = styled.button`
  width: 50%;
`;
```

이제 기존 div와 button 태그들을 바꿔줄 시간입니다.

```tsx
return (
  <WrapperDiv>
    <ButtonContainer>
      <button
        type="button"
        onClick={() => {
          setCount(count - 1);
        }}
      >
        -
      </button>
      <div>{count}</div>
      <button
        type="button"
        onClick={() => {
          setCount(count + 1);
        }}
      >
        +
      </button>
    </ButtonContainer>
    <ResetButton
      type="button"
      onClick={() => {
        setCount(0);
      }}
    >
      초기화
    </ResetButton>
  </WrapperDiv>
);
```

![Untitled](/image/emotion_04.png)

짜잔! 스타일이 적용되었습니다. 못생긴 건 똑같지만 어쨌든 제 의도대로 못생겼네요.

# 📋emotion의 특징

기본적인 사용법을 알았으니, 알아두어야 할 점을 정리해봅시다.

![Untitled](/image/emotion_05.png)

- styled component의 이름은 대문자로 시작해야 합니다. (CamelCase)
  타입스크립트의 규칙이 원인인데, 스타일이 지정된 태그 각각이 하나의 컴포넌트로서 취급되기 때문에 카멜 케이스로 작성할 필요가 있습니다. 그 부분이 일관성 있기도 하구요.
- 스타일을 지정하는 코드를 별도의 style 파일로 분리할 수 있습니다.
  별도의 .ts 파일로 분리하고, 각각의 스타일을 export하고 import하는 것으로 사용이 가능합니다. css 파일과의 차이는 해당 컴포넌트의 스타일 정의를 IDE가 바로 찾아줄 수 있다는 점이 있습니다. VS Code 기준, Ctrl + 클릭으로 바로가기가 가능합니다!
- scss 문법을 지원합니다.
  scss의 nesting 문법을 지원합니다. backquote 안에서는 완전 scss처럼 사용하면 됩니다!
- class / id 선택자를 지양합시다!
  기본적으로 scss의 모든 선택자를 지원하지만, 클래스 명을 사용하는 것은 추천되지 않습니다. 애초에 컴포넌트 이름 자체가 하나의 선택자로서의 역할을 하니까요.
  어느 캠퍼분에게 들었던 내용인데 레퍼런스를 찾지 못하고 있습니다.

> ❓ **아니 그럼 `.selected` 처럼 사용하던 클래스의 역할은 누가 하나요?**
> emotion은 놀랍게도 CSS props를 지원합니다. 말 그대로 React Component에서 사용하는 Props를 그대로 CSS에서 참조할 수 있다는 뜻입니다.
>
> ![제목 없음-1.png](/image/emotion_06.png)
>
> 위와 같이 props를 참조하여 유동적인 스타일 지정이 가능합니다. 깔끔하죠? 스타일의 props interface에 선언되었는데 실제 사용에서 props 값을 지정해주지 않으면 빨간 줄을 그어 주기도 한답니다.

# 🔨함께 사용하면 좋은 확장

VS Code에는 emotion과 함께 사용하면 좋은 확장들이 있는데요, 짤막하게 몇 가지 소개해 보고자 합니다.

### Auto Rename Tag

![Untitled](/image/emotion_07.png)

![확장1.gif](/image/emotion_08.gif)

tsx, jsx를 포함한 파일에서 HTML 태그를 수정할 때 열린 태그와 닫는 태그를 동시에 수정해 주는 확장입니다. 특히 `div`같이 여러 번 사용되는 태그를 정확히 짝을 찾아서 자동으로 고쳐주기 때문에 스타일 적용이 매우 편해집니다.

### Highlight Matching Tag

![Untitled](/image/emotion_09.png)

![Untitled](/image/emotion_10.png)

여는 태그와 닫는 태그가 눈에 띄도록 밑줄로 강조해 줍니다. `Auto Rename Tag`와 함께 사용하기 좋습니다.

### vscode-styled-components

![Untitled](/image/emotion_11.png)

![Untitled](/image/emotion_12.png)

![Untitled](/image/emotion_13.png)

`styled.tag`를 통해 스타일을 지정하면 css 프로퍼티가 단순 문자열로 인식되어 자동완성이 지원되지 않는데요, 이 확장을 사용하면 해당 부분이 css 프로퍼티로 인식되어 css 파일을 작성하듯 사용할 수 있습니다. 무지 좋죠?

### Color Highlight

![Untitled](/image/emotion_14.png)

![Untitled](/image/emotion_15.png)

IDE 차원에서 색상의 hex code에 대한 미리보기를 지원해 줍니다. 기본적으로 미리보기를 지원해주긴 하지만 조금 더 크게 보여주는 점이 마음에 들었습니다. 스크롤을 쭉 내리다가 발견하기가 쉽거든요.

# 🤔쓰시게요?

CSS-in-JS의 개념과 그 사용법에 대해 알아보았습니다. 그런데 **CSS-in-JS는 과연 정답일까요?** 얼마 전에 슬랙에서 이에 대한 흥미로운 글을 봤습니다. [우리가 CSS-in-JS와 헤어지는 이유](https://junghan92.medium.com/%EB%B2%88%EC%97%AD-%EC%9A%B0%EB%A6%AC%EA%B0%80-css-in-js%EC%99%80-%ED%97%A4%EC%96%B4%EC%A7%80%EB%8A%94-%EC%9D%B4%EC%9C%A0-a2e726d6ace6) 라는 제목의 글인데요, Emotion의 메인 기여자 중 한 명이 이런 글을 썼다는 점에서 고민해 볼 가치는 충분할 것으로 보입니다.

성능 측면에서의 단점과 React와의 몇 가지 역시너지 문제가 있다고 하는데, 제 수준에서는 문제 상황을 체감하기도, 이해하기도 어려운 내용이지만 모든 라이브러리나 프레임워크가 그러하듯 CSS-in-JS도 그 장단점을 인지하면 상황에 따라 어느 선택이 최선인지 결정하는 데 도움이 될거라 생각합니다.

[(번역) 우리가 CSS-in-JS와 헤어지는 이유](https://junghan92.medium.com/%EB%B2%88%EC%97%AD-%EC%9A%B0%EB%A6%AC%EA%B0%80-css-in-js%EC%99%80-%ED%97%A4%EC%96%B4%EC%A7%80%EB%8A%94-%EC%9D%B4%EC%9C%A0-a2e726d6ace6)

# 📖Refs.

[https://github.com/jsjoeio/styled-components-vs-emotion](https://github.com/jsjoeio/styled-components-vs-emotion)  
[styled-components 과 emotion, 도대체 차이가 뭔가?](https://velog.io/@bepyan/styled-components-%EA%B3%BC-emotion-%EB%8F%84%EB%8C%80%EC%B2%B4-%EC%B0%A8%EC%9D%B4%EA%B0%80-%EB%AD%94%EA%B0%80#emotion%EC%9D%98-%EC%B0%A8%EB%B3%84%EC%A0%90)  
[[번역] CSS-in-JS에 관해 알아야 할 모든 것](https://d0gf00t.tistory.com/22)  
[does not exist on type 'jsx.intrinsicelements' 문제 해결](https://velog.io/@prkyw1206/does-not-exist-on-type-jsx.intrinsicelements-%EB%AC%B8%EC%A0%9C-%ED%95%B4%EA%B2%B0)  
[(번역) 우리가 CSS-in-JS와 헤어지는 이유](https://junghan92.medium.com/%EB%B2%88%EC%97%AD-%EC%9A%B0%EB%A6%AC%EA%B0%80-css-in-js%EC%99%80-%ED%97%A4%EC%96%B4%EC%A7%80%EB%8A%94-%EC%9D%B4%EC%9C%A0-a2e726d6ace6)  
페어 프로그래밍 기간동안 제가 검색 한 번 없이 emotion을 능숙하게 사용할 수 있도록 인간 레퍼런스가 되어주신 **J154 이정욱** 캠퍼님께 감사드립니다. 🙇
