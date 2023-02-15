---
title: "ECMAScript"
date: 2023-01-25T16:35:01+09:00
lastmod: 2023-01-25T16:35:01+09:00
draft: false
categories: ["Web", "javascript"]
tags: ["Web", "javascript", "ECMAScript"]
thumbnail: "/image/ecmascript/01.png"
---

![untitled](/image/ecmascript/01.png)

# Ecma international

> **Ecma International** is an industry association dedicated to the standardization of information and communication systems
> _Emca International은 정보통신 시스템의 표준화를 위한 국제 표준화 기구입니다._ > [https://www.ecma-international.org/](https://www.ecma-international.org/)

Ecma International은 Ecma 사이트에서 소개하듯, 정보통신 시스템의 표준을 만들기 위한 국제 기구입니다. C#, JSON, .u3d 확장자 등 여러 방면에서의 표준안을 제시하였으며, 개발자를 위한 IEEE같은 존재로 이해하면 될 것 같습니다.(제 생각)

유럽에서 컴퓨터 시스템을 표준화하기 위해 설립되어서 **ECMA**(_European Computer Manufacturers Association_)라는 이름을 가지고 있으나 유럽국가 뿐 아니라 전세계의 표준으로 활용되기 위해 **Ecma International**로 이름을 변경하였습니다. **ECMA** 자체는 두문자어이지만 지금의 이름은 하나의 고유명사로 사용되는 셈이죠. 따라서 **Ecma**로 표기하는 것이 맞습니다.

Ecma가 정의한 표준에 대해서는 아래 링크에서 볼 수 있습니다.

[Standards - Ecma International](https://www.ecma-international.org/publications-and-standards/standards/)

# ECMAScript

ECMA스크립트란 앞에서 설명한 Ecma 인터내셔널이 정의하는 **스크립트 프로그래밍 언어**(≒인터프리터 언어) 중 하나입니다. 그리고 이 언어는 곧 자바스크립트를 가리킵니다. 즉 **ECMAScript(_ECMA-262_)에 의해 표준화된 자바스크립트의 이름**입니다.

얼마 전에 면접에서 *자바스크립트가 ECMAScript의 표준을 준수한 언어*라고 이야기했는데, 이는 틀린 표현입니다. 이를 이해하기 위해서는 자바스크립트의 역사에 대해 이해할 필요가 있습니다.

## 자바스크립트의 탄생

![untitled](/image/ecmascript/02.png)

`넷스케이프`를 아시나요? Internet Explorer가 세상을 지배하기 전에 주로 사용되었던 인터넷 브라우저입니다. 지금은 파이어폭스가 넷스케이프의 역사를 이어가고 있는데요, 당시 유료였던 넷스케이프는 무료로 마구마구 배포되는 IE에게 밀려나게 됩니다.

우리가 알고 있는 바와 같이 HTML과 CSS만으로 웹페이지를 표현하는 데에는 명확한 제한이 있습니다. 동적인 페이지를 만들 수 없다는 점이죠. 이러한 한계를 극복하기 위해 넷스케이프는 1995년, 간단한 프로그래밍 언어를 도입하기로 했고, 이 것이 **브렌던 아이크**가 개발한 자바스크립트의 전신, `모카(Mocha)`입니다. 모카의 이름은 LiveScript를 거쳐 지금의 `JavaScript`가 되었습니다. 당시 유행한 Java와 문법이 비슷하다는 점을 강조하여 마케팅 전략을 세운 것이죠.

## JScript의 등장과 자바스크립트의 파편화

그 이후 1996년에 마이크로소프트 역시 IE에서 자바스크립트를 지원하기 시작했습니다. 단순 지원 뿐 아니라 IE만의 독자적인 기능을 추가해서 비슷하지만 차이가 있는 언어를 구현했죠. 이 언어는 `JScript`라고 부르고, 가장 큰 특징으로는 윈도우에 종속적이며 악명높은 `ActiveX`를 사용할 수 있는 기반이 된다는 점이 있습니다. JavaScript와 호환이 되지 않는 것은 아니지만 그렇다고 완전하게 지원하는 것은 또 아니였습니다.

JavaScript와 JScript의 차이가 생기면서, 사용자는 환경에 따라 다른 페이지를 보게 되었습니다. **크로스 브라우징 이슈**가 생겨난 것이죠. 더군다나 마이크로소프트의 공격적인 마케팅 전략으로 인해 JScript의 점유율은 점점 높아지고 있었습니다. 파편화 문제가 점점 심화되자 모든 브라우저에서 같은 결과물을 보여주는 자바스크립트 표준이 필요해졌습니다. 이에 따라 넷스케이프는 Ecma International(당시 ECMA)에 자바스크립트 표준화를 요청하였고, 그렇게 `ECMA-262`라는 표준이 탄생했습니다.

즉, **JavaScript가 생겨나고, 파편화 현상이 일어나자 이를 표준화하기 위해 ECMAScript가 등장한 것**이라고 요약할 수 있겠습니다.

## ECMAScript 변천사

ECMAScript는 지금에 와서는 거의 매 년 새 버전이 배포되고 있습니다. 2015년까지는 ES6와 같은 네이밍을 사용했지만, 배포 주기가 연단위로 빨라지는 상황에 맞추어 ES2020과 같은 네이밍을 사용하게 되었습니다. 넘버링은 대충 `ES6 = ES2015`이후로 1년에 1씩 버전이 오른다고 알고 계시면 되겠습니다.

| 판  | 출판일      | 이름                     | 이전 판과의 차이점                                                                                                                                                                                                                      |
| --- | ----------- | ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | 1997년 6월  |                          | 초판                                                                                                                                                                                                                                    |
| 2   | 1998년 6월  |                          | ISO/IEC 16262 국제 표준과 완전히 동일한 규격을 적용하기 위한 변경.                                                                                                                                                                      |
| 3   | 1999년 12월 |                          | 강력한 정규 표현식, 향상된 문자열 처리, 새로운 제어문 , try/catch 예외 처리, 엄격한 오류 정의, 수치형 출력의 포매팅 등.                                                                                                                 |
| 4   | 버려짐      |                          | 4번째 판은 언어에 얽힌 정치적 차이로 인해 버려졌다. 이 판을 작업 가운데 일부는 5번째 판을 이루는 기본이 되고 다른 일부는 ECMA스크립트의 기본을 이루고 있다.                                                                             |
| 5   | 2009년 12월 |                          | 더 철저한 오류 검사를 제공하고 오류 경향이 있는 구조를 피하는 하부집합인 "strict mode"를 추가한다. 3번째 판의 규격에 있던 수많은 애매한 부분을 명확히 한다.                                                                             |
| 5.1 | 2011년 6월  |                          | ECMA스크립트 표준의 제 5.1판은 ISO/IEC 16262:2011 국제 표준 제3판과 함께 한다.                                                                                                                                                          |
| 6   | 2015년 6월  | ECMAScript 2015 (ES2015) | 6판에는 클래스와 모듈 같은 복잡한 응용 프로그램을 작성하기 위한 새로운 문법이 추가되었다. 하지만 이러한 문법의 의미는 5판의 strict mode와 같은 방법으로 정의된다. 이 판은 "ECMAScript Harmony" 혹은 "ES6 Harmony" 등으로 불리기도 한다. |
| 7   | 2016년 6월  | ECMAScript 2016 (ES2016) | 제곱연산자 추가, Array.prototype.includes                                                                                                                                                                                               |
| 8   | 2017년 6월  | ECMAScript 2017 (ES2017) | 함수 표현식의 인자에서 trailing commas 허용, Object values/entries 메소드, async/await 등.                                                                                                                                              |
| 9   | 2018년 6월  | ECMAScript 2018 (ES2018) | Promise.finally, Async iteration, object rest/spread property 등.                                                                                                                                                                       |
| 10  | 2019년 6월  | ECMAScript 2019 (ES2019) | Object.fromEntries, flat, flatMap, Symbol.description, optional catch 등.                                                                                                                                                               |

# 궁금증들

### CommonJS는 무엇일까?

지금까지 이야기한 자바스크립트는 모두 브라우저에서 사용하기 위한 표준이였습니다. 하지만 우리는 지금 브라우저 없이도 자바스크립트를 사용하고 있습니다. 자바스크립트를 브라우저 밖에서 사용하기 위한 논의가 계속해서 이루어졌고, 이를 위해 **자바스크립트를 모듈화**할 수 있는 표준이 제시되었습니다. 이 것이 `CommonJS`이고, 이를 이용해 만들어진 것이 `Node.js`입니다.

아.. 복잡해요 아래 글 좋은 것 같아요.. 나중에 더 찾아보고 정리할게요.. 근데 사실 이게 다라서 더 정리해야 할 내용이 있는지 모르겠어요. ES도 모듈화를 챙기기 위해 ESM이라는 표준이 있다는 것 정도?

[[ JavaScript ] ES Modules 정리하기](https://velog.io/@jjunyjjuny/ES-Modules-%EC%A0%95%EB%A6%AC%ED%95%98%EA%B8%B0)

# Refs.

[Ecma 인터내셔널 - 위키백과](https://ko.wikipedia.org/wiki/Ecma_%EC%9D%B8%ED%84%B0%EB%82%B4%EC%85%94%EB%84%90)  
[Ecma International](https://www.ecma-international.org/)  
[Introduction | PoiemaWeb](https://poiemaweb.com/js-introduction)  
[CommonJS](https://velog.io/@leobit/CommonJS)  
[ES5 to ES6+](https://ui.toast.com/fe-guide/ko_ES5-TO-ES6)  
[ECMAScript 스펙 읽는법](https://www.howdy-mj.me/javascript/how-to-read-ecmascript)
