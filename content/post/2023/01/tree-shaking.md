---
title: "Tree Shaking"
date: 2023-01-25T17:17:15+09:00
lastmod: 2023-01-25T17:17:15+09:00
draft: false
categories: ["Web", "javascript"]
tags: ["Web", "javascript", "tree-shaking"]
thumbnail: "/image/tree-shaking/01.png"
---

# 용량을 절약하는 방법

![bundle_map](/image/tree-shaking/01.png)

웹페이지의 성능을 이야기하는 가장 직관적인 지표는 아마 페이지에 사용되는 **파일의 크기**일 것입니다. 파일의 크기가 무겁다면 파일을 다운받는 데 시간이 오래 걸리고, 다운로드한 파일을 읽고 렌더링 하는데도 시간이 오래 걸릴 것입니다. 따라서 번들 파일의 용량을 다이어트 하는 것은 사이트 성능에 꽤 중요한 역할을 합니다.

위 사진은 팀 프로젝트를 하던 중 `@next/bundle-analyzer` 패키지를 이용해 번들 맵을 그렸던 것입니다. 클수록 번들 용량이 크다는 뜻이니 커다란 청크 위주로 최적화를 시도하면 될 것 같습니다. 그런데 어떻게 용량을 줄일 수 있을까요? gzip을 통해 파일을 압축해서 보내는 방법도 있겠지만, 코드적으로 최적화할 수 있는 방법은 `Tree-shaking`입니다.

# 트리 쉐이킹

![tree-shaking](/image/tree-shaking/02.gif)

나무를 마구마구 흔들면 어떻게 나뭇잎이나 열매같은 것들이 조금씩 떨어지면서 나무가 점점 앙상해 질 것입니다. 트리 쉐이킹은 이와 비슷하게 **사용하지 않는 코드들이 번들에 포함되는 것들을 지워서 파일 크기를 줄이는 일**입니다. 말 그대로 **나무(파일)를 마구 흔들어서 나뭇잎(미사용 코드)을 덜어내는 개념**이죠. 어떤 과정을 통해 이루어 질까요? 아래 예제를 통해 알아보겠습니다.

![example-app](/image/tree-shaking/03.png)

[https://github.com/malchata/webpack-tree-shaking-example](https://github.com/malchata/webpack-tree-shaking-example)

## 실행해보기

우선 `npm run build`후 `npm run start`를 통해 실행해 보겠습니다. 아래와 같은 결과물이 보입니다.

![bundle size before tree shaking](/image/tree-shaking/04.png)

번들된 파일 두개를 다운받았고, 38.4KB, 21.6KB의 크기를 갖습니다. 객관적으로 가볍긴 하지만 여기서 굳이 트리 쉐이킹을 통해 용량을 더 줄여 보겠습니다.

## 필요한 것만 import하기

![analyzing scripts](/image/tree-shaking/05.png)

이 앱의 컴포넌트인 `FilterablePedalList.js`를 보면 `utils.js` 파일을 import해오는 것을 알 수 있습니다. 그런데 `utils.js` 파일은 1300여 줄이 되는 아주 긴 코드입니다. 각종 정렬과, 배열을 다루는 유틸리티 함수를 포함하고 있는데, 정작 컴포넌트에서는 `simpleSort`만을 사용하고 있습니다. 첫 13줄 아래로는 모두 사용하지 않는 함수들인데도 불러오고 있는 것이죠. 실제로 번들 파일에서도 `simpleSort` 외에 `uasort`, `uksort` 등 여러 함수들이 같이 번들링된 것을 알 수 있습니다.

따라서 import문을 아래와 같이 변경하겠습니다.

```javascript
// FilterablePedalList.js
// ...
import * as utils from "../../utils/utils"; // before
import { simpleSort } from "../../utils/utils"; // after
// ...
```

하지만 이렇게 해서는 번들 파일의 크기는 줄어들지 않습니다. 이는 Babel이 `import`문을 `require`문으로 트랜스파일링 하기 때문인데요, `CommonJS`에서 사용되는 require는 지정된 파일의 코드 전체를 가져오기 때문에 import문처럼 특정 함수만을 지정해서 가져올 수 없는 상황입니다. 따라서 `.babelrc`에서 Babel의 설정을 변경해 주어야 합니다.

```json
"presets": [
    ["env",{
      "modules": false
    }]
  ],
// ...
```

modules 옵션은 ES Modules 문법을 다른 문법으로 트랜스파일링 할 것인지에 대한 옵션입니다. 그렇다고 CommonJS 환경에서 사용이 불가능해 지는 것은 아닙니다. 왜냐면 webpack이 한번 더 트랜스파일 과정을 거치거든요!

## 결과물 확인하기

그럼 이제 앱을 다시 빌드하고 결과물을 확인해 보겠습니다.

![after tree shaking](/image/tree-shaking/06.png)

`main.js` 청크가 `21.6KB → 9KB`로 크게 줄어들었습니다. 큰 의미는 없지만 로드 시간도 줄어들었네요. 트리 쉐이킹이 어떤 과정을 거쳐 이루어 지는지 알아봤습니다. 굿..

# 궁금증들

## 특정 패키지의 트리 쉐이킹이 되지 않는 이유는?

대부분은 위의 과정을 통해 트리 쉐이킹이 가능하나, 일부 패키지에서 `import`해오는 경우에는 트리 쉐이킹이 일어나지 않습니다. 배열이나 Date 등을 다룰 때 유틸리티 함수를 제공해 주는 `lodash` 패키지가 그런 경우인데요, 패키지 자체가 CommonJS 모듈 문법으로 작성되어 있어서 그렇습니다. lodash는 이런 문제를 해결하기 위해 다양한 문법에 맞추어 작성된 빌드를 제공합니다. [[링크]](https://github.com/lodash/lodash#module-formats)

만약 이런 식으로도 지원하지 않는 라이브러리라면 [webpack-common-shake](https://github.com/indutny/webpack-common-shake)같은 플러그인을 활용해야 합니다. `webpack-common-shake`는 CommonJS의 문법으로 `module.export`를 사용한 패키지를 트리쉐이킹 해주는 플러그인인데요, README에 나와 있듯이 결국 완전한 해결책은 아닙니다.

## Babel의 `“modules”: false`란 무엇일까?

babel의 `modules` 옵션은 ES modules 문법을 다른 문법에 맞추어 트랜스파일하는 옵션인데요, `false`를 지정할 경우 트랜스파일이 이루어지지 않습니다. 그런데 앞서 말했듯이 `babel`에서 굳이 변환하지 않더라도 `webpack`이 해주는데, 이걸 굳이 `false`로 지정해야 할 이유가 있을까요?

Babel의 [documentation](https://babeljs.io/docs/en/babel-preset-env#modules)을 보면 modules 옵션은 아래와 같이 설명되어 있습니다.

> `"amd" | "umd" | "systemjs" | "commonjs" | "cjs" | "auto" | false`, defaults to `"auto"`.
>
> Enable transformation of ES module syntax to another module type. Note that `cjs` is just an alias for `commonjs`.
> _ES 모듈 문법을 다른 모듈 타입으로 트랜스파일하도록 합니다. `cjs`는 `CommonJS`를 의미합니다._
>
> Setting this to `false` will preserve ES modules. Use this only if you intend to ship native ES Modules to browsers. If you are using a bundler with Babel, the default `modules: "auto"` is always preferred.
> `*false`로 지정하면 ES 모듈의 문법을 유지합니다. 앱을 ES 모듈로만 제공하고 싶은 경우에만 사용하세요. Babel에 번들러를 추가로 사용하는 경우, `modules: “auto”`를 사용할 것을 추천합니다.\*

사실 `modules`에는 `auto`라는 값이 존재합니다. 이는 `Babel 7.x` 버전부터 생긴 `caller` 옵션을 활용하여 추가된 값인데요, `auto`로 설정할 경우 바벨은 callerData를 이용하여 ES 모듈 문법이 사용 가능한지 판단하고, 이에 맞추어 트랜스파일 할 지를 자동으로 판단합니다. 사용한 예제에서는 낮은 버전의 바벨을 사용하고 있었기 때문에 `false`를 지정했지만, 지금은 기본값이 `auto`로 되어 있어 `import` 범위만 조절하면 알아서 트리 쉐이킹이 이루어질 것으로 보입니다.

# Refs.

[Next 배포를 위한 준비(bundle-analyzer, tree shaking, gzip)](https://darrengwon.tistory.com/833)  
[웹 성능 최적화를 위한 Tree Shaking 소개](https://helloinyong.tistory.com/305)  
[Reduce JavaScript payloads with tree shaking](https://web.dev/reduce-javascript-payloads-with-tree-shaking/#go_shake_some_trees)  
[Tree Shaking | 웹팩](https://webpack.kr/guides/tree-shaking/)  
[@babel/preset-env · Babel](https://babeljs.io/docs/en/babel-preset-env#modules)  
[https://github.com/babel/babel-loader/issues/521](https://github.com/babel/babel-loader/issues/521)  
[https://github.com/babel/babel-loader/pull/660](https://github.com/babel/babel-loader/pull/660)
