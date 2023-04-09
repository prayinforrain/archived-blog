---
title: "CSS의 크기 단위"
date: 2023-01-13T23:39:15+09:00
lastmod: 2023-01-13T23:39:15+09:00
draft: false
categories: ["Web", "CSS"]
tags: ["CSS", "Web"]
---

# CSS의 크기 단위

![Untitled](/images/posts/2023/01/size-units-in-css/01.png)

CSS에는 다양한 단위가 존재합니다. 우리가 잘 아는 `px`와 `%`부터, `em`, `rem`, `pt`, `vh`, `vw` 등등 다양한 단위가 존재하는데요, 이 크기 단위들을 언제 어떻게 사용하면 좋을지에 대해 정리해 보았습니다.

# 상대 단위와 절대 단위

`px`과 `%`를 먼저 비교해 보면, `px`은 우리가 알고 있는 컴퓨터 화면의 1픽셀을 의미합니다. 이는 어느 화면에서나 같은 크기를 나타내므로 **절대 단위**에 해당합니다. 반면 `%`는 보통 부모 element의 크기를 상속받아 그의 정해진 비율만큼을 나타냅니다. 즉 `width: 10px;`인 부모를 가진 element에 `width: 50%;`를 주면 5px이 되겠죠. 이렇게 상황에 따라서 다른 값을 갖는 단위를 **상대 단위**라고 부릅니다.

## 절대 단위

절대 단위는 인치에 해당하는 `in`을 기준으로 MDN에 정의되어 있으며, 편의상 웹에서 가장 자주 사용하는 단위인 `px`을 기준으로 다시 계산하였습니다.

| 단위                      | 이름           | 크기                           |
| ------------------------- | -------------- | ------------------------------ |
| in                        | 인치           | 1in = 2.54cm = 96px            |
| px                        | 픽셀           | 96px = 1in                     |
| pt                        | 포인트         | 3pt = 4px                      |
| 1pt = 1.33px              |
| cm                        | 센티미터       | 1cm = 96px/2.54 = 37.795…px    |
| mm                        | 밀리미터       | 1mm = 96px/25.4 = 3.7795…px    |
| Q                         | 1/4 mm(quater) | 1Q = 96px/25.4/4 = 0.94488..px |
| pc                        | Picas          |
| (파이카 라고 부르는 단위) | 1pc = 16px     |

## 상대 단위

상대 단위는 부모 요소나 viewport 크기 등에 비례한 길이를 나타내는 단위로, 화면 크기에 맞추어 각 요소가 비율을 맞추어 공간을 차지하도록 조절할 수 있는 유용한 단위입니다.

| 단위 | 설명                                                                           |
| ---- | ------------------------------------------------------------------------------ |
| em   | 요소의 글꼴 크기                                                               |
| ex   | 요소 글꼴의 x-height(대충 소문자가 차지하는 높이)                              |
| ch   | 요소 글꼴의 glyph “0”의 사전 길이(너비); 즉 요소의 글꼴에서 0이 차지하는 width |
| rem  | 루트 요소의 글꼴 크기                                                          |
| lh   | 요소의 라인 높이                                                               |
| vw   | viewport width의 퍼센트 비율                                                   |
| vh   | viewport height의 퍼센트 비율                                                  |
| vmax | vw, vh 중 큰 쪽                                                                |
| vmin | vw, vh 중 작은 쪽                                                              |

`em`, `rem`, `vw`, `vh`는 자주 사용되는 단위이니 감각을 익혀 두는 것이 좋아 보입니다.

### `em`과 `rem`

`em`은 현재 요소의 글꼴 크기를 참조한다. 즉 현재 요소의 글꼴 크기가 `10px`인 요소의 `1em`은 `10px`이 됩니다. 이를 이용해 `h`나 `em`태그같은 강조 태그의 글꼴 크기를 상대적으로 조절할 수 있습니다.

`rem`은 문서의 최상위 노드의 `font-size` 값을 참조합니다. 그 외에는 `em`과 같은 식으로 동작합니다. HTML 문서에서의 최상위 노드는 `<html>` 태그이므로 이 요소의 `font-size` 값이 되겠습니다.

# 궁금증들

## 1*cm*는 정말 1 *센티미터*일까?

모니터에는 해상도 말고도 PPI*(Pixel per Inch)*라는 스펙이 있습니다. 이 스펙에 따라, 1px을 실제 길이로 치환하면 디스플레이의 DPI에 따라 다른 실제 길이를 가질 수 있게 됩니다. 그럼 1cm 역시 상대 단위인 것이 아닐까요? 실험을 위해 `height: 6.8cm;`를 준 div에 지폐를 갖다 대 보았습니다. 참고로 우리나라 모든 지폐의 높이는 *6.8cm*입니다.

![Untitled](/images/posts/2023/01/size-units-in-css/02.png)

24” FHD 모니터와 15” FHD 모니터에서 실험해 보았습니다. 24”에서는 정확하게 지폐의 크기와 일치했지만 15”에서는 한참 작음을 확인할 수 있었습니다. 즉 **1cm가 정확히 1센티미터를 의미하지는 않음**을 의미합니다. 그럼 `cm`라는 단위는 왜 존재하는 것일까? 답은 [이 링크](https://www.w3.org/Style/Examples/007/units.en.html#units)에서 찾을 수 있었습니다.

<aside>

The so-called *absolute* units (**`cm`**, **`mm`**, **`in`**, **`pt`** and **`pc`**) mean the same in CSS as everywhere else, *but only if your output device has a high enough resolution.* On a laser printer, 1cm should be exactly 1 centimeter. But on low-resolution devices, such as computer screens, CSS doesn't require that. And indeed, the result tends to be different from one device to another and from one CSS implementation to another. It's better to reserve these units for high-resolution devices and in particular for printed output. On computer screens and handheld devices, you'll probably not get what you expect.

---

In the past, CSS required that implementations display absolute units correctly even on computer screens. But as the number of incorrect implementations outnumbered correct ones and the situation didn't seem to improve, CSS abandoned that requirement in 2011. Currently, absolute units must work correctly only on printed output and on high-resolution devices.

CSS doesn't define what “high resolution” means. But as low-end printers nowadays start at 300 dpi and high-end screens are at 200 dpi, the cut-off is probably somewhere in between.

</aside>

요약하자면 현재는 인쇄물과 같이 높은 해상도에서는 cm, in같은 단위가 정확한 실제 길이를 갖도록 출력되지만, 디스플레이와 같이 상대적으로 **낮은 해상도의 출력에서는 이것이 보장되지 않는다**는 내용입니다. 과거에는 디스플레이에서도 이 부분이 보장되도록 요구되었지만 2011년에 이런 요구사항이 삭제되었다고 합니다.

따라서 이런 실제 길이 단위는 인쇄를 목적으로 작성되는 문서에서만 사용하고, 디스플레이에 출력하기 위한 목적의 페이지가 사용하는 절대 단위는 `px`만 사용할 것을 권장하고 있습니다. `pt` 역시 스프레드시트나 워드에서 사용하는 단위로 실제 길이 단위에 기반하므로 인쇄물에 적합한 단위입니다.

## `em`과 `%`의 차이는 무엇일까?

아래 예제에서 두 child 요소들은 모두 같은 글자 크기를 갖습니다.

```jsx
// html
<div id="parent">
  parent
  <p id="child1">Hello World!</p>
  <p id="child2">Hello World!</p>
</div>

// css
#child1 {
  font-size: 1.5em;
}
#child2 {
  font-size: 150%;
}
```

기본적으로 `font-size`는 부모 요소의 값을 상속받으므로, 현재 요소의 `font-size`를 참조하는 `em`이나, 부모 요소의 값을 참조하는 `%`나 같은 기준 값을 갖는 것이죠. 즉 두 요소는 대부분의 경우 같은 결과값을 갖습니다. 그럼 이 둘의 차이는 무엇일까요?

가장 큰 차이는, `em`은 항상 `font-size`를 참조한다는 것입니다. 모든 단위는 모든 요소에 적용할 수 있습니다. 만약 `width`나 `height`같은 요소에 `em`을 사용하더라도, `em`은 항상 `font-size`를 기준으로 값을 계산합니다. 반면 `%`는 부모 요소의 해당 property 값을 참조하기 때문에, `width`에 `%`를 사용하면 언제나 부모 요소의 `width`에 대한 비율을 나타냅니다.

# Refs.

[CSS 값 과 단위 - Web 개발 학습하기 | MDN](https://developer.mozilla.org/ko/docs/Learn/CSS/Building_blocks/Values_and_units)

[CSS: em, px, pt, cm, in...](https://www.w3.org/Style/Examples/007/units.en.html#units)

[Why em instead of px?](https://stackoverflow.com/questions/609517/why-em-instead-of-px)

[When to use ems instead of percentage in CSS?](https://stackoverflow.com/questions/16990608/when-to-use-ems-instead-of-percentage-in-css)
