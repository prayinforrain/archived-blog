---
title: "CSS의 display 속성"
date: 2023-01-16T16:38:15+09:00
lastmod: 2023-01-16T16:38:15+09:00
draft: false
categories: ["Web", "CSS"]
tags: ["CSS", "Web"]
---

CSS의 `display` 속성은 HTML element가 block인지, inline인지, 그리고 자식 element들을 어떤 식으로 표시할지를 정하는 속성입니다. 다시 말해 요소 자체가 형제 요소와 배치되는 방법과, 자식 요소를 배치하는 방법을 함께 정의하기 때문에 ‘**안쪽**’과 ‘**바깥쪽**’으로 속성을 나눌 수 있습니다.

# display:

## 바깥쪽

![Untitled](/image/css-display/01.png)

- `block`
  - 한 줄에는 한 요소만 올 수 있게 하는 속성입니다.
- `inline`
  - 요소가 한 줄에 여러 개 표시 될 수 있음을 의미합니다. 만약 `inline`이 적용된 요소의 전후에 `inline` 요소를 표시할 공간이 있다면 한 줄에 표시됩니다.

사진의 div들은 각각 `inline`, `block` 속성을 지정하였습니다. 보이는 것과 같이 `block` 속성의 요소는 한 줄에 하나만 존재할 수 있으며, `inline` 속성은 충분한 공간이 있으면 한 줄에 표시됩니다. `span`과 `p`태그의 차이와 비슷합니다.

또 `inline`의 경우에는 크기가 항상 포함하는 내용의 크기만큼만을 갖기 때문에, 따로 `width`나 `height`를 지정해도 제어가 불가능합니다. 예제의 `inline div`는 `width: 500%;`를 지정한 상태이지만 포함한 텍스트의 크기만큼만을 가집니다. 크기를 조절할 수 있으면서 inline 속성의 특성을 갖도록 하는 `inline-block` 속성이 존재했으나, 이는 현재 레거시로 분류되어 `inline flow-root`로 대체할 수 있다고 합니다.

## 안쪽

요소가 포함하는 자식 요소들의 배치 방법을 정하는 속성입니다. 이 외에도 실험적 기능으로 `flow`, `ruby`가 존재합니다.

- `flow-root`
  - 외부에 `block`, 내부에 `float`이 적용된 것과 같이 동작합니다.
- `table`
  - `<table>` 태그의 내부인 것처럼 동작합니다.
- `flex`
  - Flexbox model에 따라서 `block` 요소처럼 동작합니다. 단방향 레이아웃에 적합합니다.  
    [CSS Flexible Box Layout - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Flexible_Box_Layout)
- `grid`
  - Grid layout을 형성합니다.  
    [Basic concepts of grid layout - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/ko/docs/Web/CSS/CSS_Grid_Layout/Basic_concepts_of_grid_layout)

# 궁금증들

## inline-block은 왜 레거시가 되었을까?

앞에서 언급했던 바와 같이 `inline-block`은 `inline flow-root`로 대체되어 레거시로 분류되었습니다. 그렇지만 `inline flow-root`라는 속성은 굉장히 생소합니다. 왜 이런 식으로 변경되었을까요?

`CSS2`까지의 스펙에서는 `display`에 두 개 이상의 값을 지정할 수 없었습니다. 그래서 바깥쪽에 `inline`, 안쪽에 `flex`를 지정하기 위해서 `inline-flex`같은 값을 따로 정해 두고 사용해야 했는데요, `inline-block` 역시 그런 케이스입니다. 그러다가 `CSS3`이 나오면서 `display`에 두 개 이상의 값을 지정할 수 있게 되면서 이런 값들이 사라진 것이죠.

그렇다고 해서 이제 **inline-block을 사용하지 않는 것이 좋은 것은 아니**라고 합니다. MDN에서는 `display`에 여러 개의 값을 지정하는 `CSS3`의 스펙에 대해 아래와 같은 언급을 추가하고 있습니다.

> The Level 3 specification details two values for the `display` property — enabling the specification of the outer and inner display type explicitly — but this is not yet well-supported by browsers.

즉, 아직 모든 브라우저에서 완전히 호환되고 있지 않기 때문에 **deprecated가 아닌 legacy**로 분류된 것이라고 할 수 있겠네요.

## `visibility: hidden;`과 `display: none;`의 차이는?

`visibility: hidden;`과 `display: none;`은 둘 다 사용자의 브라우저에서 요소를 보이지 않게 하는 방법입니다. 같은 동작을 하는 속성이 두 개 씩이나 필요할까요? 둘의 차이점은 크게 두 가지가 있습니다.

- `visibility: hidden;`은 요소가 차지하는 공간은 보존된다.
  - display: none;은 아예 페이지 내에서 요소가 없는 것처럼 간주합니다. 따라서 레이아웃을 구성할 때에도 해당 요소는 고려하지 않는데요, 반면 `visibility: hidden`은 해당 요소가 차지하는 공간은 그대로 둔 채 레이아웃을 구성하므로, 해당 부분은 빈 공간으로 남게 됩니다.
- `innerText`로 접근했을 때의 차이  
  ![Untitled](/image/css-display/02.png)
  - `innerText`로 텍스트를 가져오면 위 사진과 같이 차이가 있습니다. 첫 번째는 일반적인(보이는) 상태에서, 두 번째는 `display: none;`, 세 번째는 `visibility: hidden;`을 적용한 상태입니다. 반면 `innerHTML`은 셋 다 같은 결과를 냅니다.

두 방법 외에도 브라우저에서 요소를 숨기는 방법은 여러 가지가 있는데요, 관심이 있으신 분은 접근성 문제도 엮여 있기 때문에 [[이 포스트]](https://mulder21c.github.io/2019/03/22/screen-hide-text/)를 참고해 보시길 추천합니다.

# Refs.

[display - CSS: Cascading Style Sheets | MDN](https://developer.mozilla.org/ko/docs/Web/CSS/display)

[CSS Display Module Level 3](https://www.w3.org/TR/css-display-3/)

[접근 가능한 숨김 텍스트](https://mulder21c.github.io/2019/03/22/screen-hide-text/)
