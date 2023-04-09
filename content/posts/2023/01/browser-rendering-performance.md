---
title: "브라우저 렌더링과 성능"
date: 2023-01-16T16:38:15+09:00
lastmod: 2023-01-16T16:38:15+09:00
draft: false
categories: ["Web"]
tags: ["Web", "browser"]
---

# 브라우저 렌더링

성능 최적화를 위해, 브라우저가 어떻게 HTML 문서를 화면에 그리는지 과정에 대해 이해할 필요가 있습니다. 브라우저 렌더링은 아래 사진과 같은 흐름으로 이루어집니다.

![Untitled](/images/posts/2023/01/browser-rendering-performance/01.png)

- 서버로부터 HTML, CSS, JavaScript 파일을 받아와 HTML → DOM, CSS → CSSOM으로 변환하고 Render Tree를 구성합니다.
- Render Tree의 노드들에 대한 위치와 크기를 계산합니다. Render Tree의 루트부터 시작하여 모든 노드에 대해 계산을 수행합니다. (Layout)
- 계산된 결과물을 기반으로 화면에 실제 노드들을 그립니다. (Paint)
- 사용자의 상호작용이나 스크립트를 통한 제어 등으로 HTML 요소의 크기나 위치의 변경이 일어나면 `Reflow`라는 과정을 수행합니다.
  - Reflow는 Render Tree 구성부터 **모든 작업을 다시 수행**합니다.
  - 만약 레이아웃 자체에는 변화가 없고, 색상이나 visibility 등의 변경만 있는 경우에는 Paint 과정만을 다시 수행합니다. (Repaint)
  - 따라서 비용이 큰 **Reflow의 발생을 최대한 줄이는 것이 중요**합니다.

<iframe width="560" height="315" src="https://www.youtube.com/embed/TZz9VHjJzMk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

이거 되게 좋은 내용인 것 같아요 CSS의 `will-change`를 통헤 불필요한 GPU 점유를 줄이는 방법도 소개하고 있네요!

# 성능을 최적화하는 방법

## DocumentFragment를 사용

앞에 정리한 내용과 같이 브라우저 성능에 가장 영향을 미치는 부분은 `Reflow` 과정입니다. 즉 Reflow의 발생을 줄이면 큰 성능 향상을 노릴 수 있는 것이다. 보통은 스크립트를 통해 요소의 레이아웃을 제어하는 코드는 한 번에 실행되지 않습니다. 즉 여러 줄에 걸쳐 레이아웃을 수정하는 경우 각 행에 대해 Reflow가 발생합니다. - _브라우저에 따라 일부 최적화가 이루어지는 경우가 있음_

따라서 모든 수정이 완료된 후에 최종 결과물에 대해서만 Reflow를 수행할 필요가 있습니다. `DocumentFragment`가 그 해결책 중 하나인데, `DocumentFragment`란 React의 버추얼 DOM과 비슷한 개념으로, DOM과 비슷하게 동작하지만 실제 HTML DOM에는 영향을 주지 않는 **Document의 가벼운 버전**입니다.

`DocumentFragment`은 렌더링 자체가 이루어지지 않기 때문에 Reflow 걱정 없이 변경이 가능합니다. 따라서 `DocumentFragment` 내부에서 레이아웃을 변경하고, 최종 결과물을 HTML DOM에 삽입하면 불필요한 Reflow 발생을 막을 수 있습니다. 아래는 간단한 사용 예시입니다.

```javascript
const documentFragment = new DocumentFragment();
// const documentFragment = document.createDocumentFragment();

const div = document.createElement("div");
// do something...

document.getElementById("parent-to-append").appendChild(documentFragment);
```

## Canvas 사용

일반적으로 **페이지 내의 요소가 많아질수록 레이아웃 계산 과정에서의 계산량이 많아집니다.** 9개의 `div`가 3\*3으로 나열되어 있다고 하면, 그 중 하나의 `div`의 크기가 변경됨에 따라 나머지 8개의 `div`도 레이아웃 재계산이 일어납니다. 크기가 고정된 부모 요소로 분리되어 있다면 그 내부의 요소들만 재계산이 일어나지만, 만약 그렇지 않은 경우 문서 전체를 다시 계산해야 할 가능성도 있습니다.

따라서 복잡한 시각 효과를 연출하거나, 많은 Element를 가진 요소들을 제어해야 하는 경우에는 `canvas`를 이용하여 렌더링하는 것이 효과적일 수 있습니다. `canvas`는 정해진 캔버스 영역 안에서만 렌더링이 일어나기 때문에 Reflow를 방지할 수 있기 때문이죠.

<aside>

💡 **DOM과 canvas의 성능 차이**

![Untitled](/images/posts/2023/01/browser-rendering-performance/02.png)

캔버스는 페인팅 영역이 정해져 있습니다.(`<canvas>` 태그의 영역이 정해져 있다) 따라서 **그 안의 요소들 끼리만 계산이 이루어지고, 그 바깥의 HTML 요소들과는 상호작용하지 않기 때문**에, 캔버스의 제어는 Reflow를 발생시키지 않습니다. 따라서 DOM에 직접 렌더링 하는 것보다 비용이 적습니다.

</aside>

# Refs.

[JavaScript 최적화: DOM 핸들링 속도 개선](https://www.nextree.co.kr/p2081/)  
[브라우저 렌더링 순서와 원리](https://velog.io/@zaman17/%EA%B8%B0%EC%88%A0%EB%A9%B4%EC%A0%91%EB%8C%80%EB%B9%84-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EB%A0%8C%EB%8D%94%EB%A7%81-%EC%88%9C%EC%84%9C%EC%99%80-%EC%9B%90%EB%A6%AC)  
[브라우저 렌더링](https://velog.io/@hoo00nn/%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EB%A0%8C%EB%8D%94%EB%A7%81)  
[주소창에 www.google.com을 입력했을 때 일어나는 과정](https://velog.io/@tnehd1998/%EC%A3%BC%EC%86%8C%EC%B0%BD%EC%97%90-www.google.com%EC%9D%84-%EC%9E%85%EB%A0%A5%ED%96%88%EC%9D%84-%EB%95%8C-%EC%9D%BC%EC%96%B4%EB%82%98%EB%8A%94-%EA%B3%BC%EC%A0%95#-%EB%B8%8C%EB%9D%BC%EC%9A%B0%EC%A0%80-%EB%A0%8C%EB%8D%94%EB%A7%81-%EA%B3%BC%EC%A0%95)  
[DocumentFragment - Web API | MDN](https://developer.mozilla.org/ko/docs/Web/API/DocumentFragment)  
[Javascript - DocumentFragment를 사용해보자 [성능 최적화]](https://7942yongdae.tistory.com/70)

<iframe width="560" height="315" src="https://www.youtube.com/embed/ZTnIxIA5KGw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>  
<iframe width="560" height="315" src="https://www.youtube.com/embed/rm756h1Pr6Y" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>  
<iframe width="560" height="315" src="https://www.youtube.com/embed/ZHxbs5WEQzE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
