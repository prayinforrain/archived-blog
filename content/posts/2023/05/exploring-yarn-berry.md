---
title: "얀 베리 탐험하기"
date: 2023-05-30T02:27:49+09:00
summary: ""
draft: false
categories: ["Node.js"]
tags: ["yarn"]
---

## 내 레포의 위험한 녀석

![cds issue](/images/posts/2023/05/exploring-yarn-berry/01.png)

최근 [차가운 디자인 시스템(CDS)](https://github.com/c-h-w-h/cds)의 패키지 매니저를 **Yarn berry**로 마이그레이션 하는 작업을 하고 있다. 이유는 후술할 `node_modules` 자체의 단점도 있고, 내 데스크탑이 HDD를 사용하기 때문에 `node_modules`의 수십만 개의 파일들을 다루는 것이 너무 느려서 강력 추천했다.

하지만 사실 나는 PnP가 어떻게 패키지들을 resolve하는지 전혀 모른다. 그저 어떻게 해야 오류 없이 쓸 수 있는지만 열심히 고민했는데, 팀원들에게 설명할 때 마다 막연히 얀베리가 잘못했겠죠~ 하는 스스로에게 자괴감을 느껴 이 기회에 한 번 Yarn PnP를 똑바로 마주해 보기로 했다.

## 우리가 아는 node_modules

### 패키지를 찾아서 헤매기

Node.js에는 사실 패키지의 개념이 명시적으로 정의되어 있지 않았다. 따라서 다른 모듈을 사용할 때에 Node.js는 패키지가 아닌 파일 단위로 모듈을 찾아서 resolve하고 있었다.

기존 npm의 경우에는 패키지의 node_modules, npm이 설치된 디렉토리의 전역 폴더 등등 여러 곳을 차례로 패키지를 찾아 나갔다.

```bash
$ node
> require.resolve.paths('react-dom')
[
  'E:\\workspace\\repl\\node_modules',
  'E:\\workspace\\node_modules',
  'E:\\workspace\\node_modules',
  'E:\\node_modules',
  'C:\\Users\\dldnw\\.node_modules',
  'C:\\Users\\dldnw\\.node_libraries',
  'C:\\Program Files\\nodejs\\lib\\node',
  'C:\\Users\\dldnw\\.node_modules',
  'C:\\Users\\dldnw\\.node_libraries',
  'C:\\Program Files\\nodejs\\lib\\node'
]
> require.resolve('react-dom')
'E:\\workspace\\node_modules\\react-dom\\index.js'
```

이는 비효율적이다. `node_modules` 디렉토리는 가벼운 프로젝트에서도 만 개 단위의 파일들이 있어 탐색 속도가 느리고, `node_modules` 디렉토리 말고도 레포지토리의 상위 경로 등 탐색 범위가 매우 넓기 때문에 환경 의존적인 프로젝트가 될 수도 있다. 특히 이 과정은 런타임에서도 수시로 진행되어 매우 큰 성능 문제를 야기한다.

### 유령 의존성

효율이야 어떻게 됐든 이런 식으로 패키지를 resolve한다고 치자. 그런데 문제가 또 있다.

![dependency hoisting](/images/posts/2023/05/exploring-yarn-berry/02.png)

_출처: [node_modules로부터 우리를 구원해 줄 Yarn Berry - 토스 기술블로그](https://toss.tech/article/node-modules-and-yarn-berry)_

위 사진에서 package-1은 A, C, D 패키지를 사용한다. 이 중 A와 C는 B(1.0)를 직, 간접적으로 의존하고 있기 때문에 결과적으로 B(1.0) 패키지도 필요한 상황이고, 결과적으로는 중복 파일을 줄여 용량을 절약하기 위해 B(1.0)을 호이스팅하여 `node_modules`에는 package-1이 요구하지 않은 B(1.0)이 추가로 설치된다.

이 후 Node는 package.json을 **체크하지 않고** node_modules 디렉토리에 있는 파일들을 기준으로 모듈을 resolve한다. 이렇게 되면 쥐도새도 모르게 package-1에서는 요구하지 않았던 B(1.0)의 모듈을 슬쩍 사용할 수 있게 된다. 분명 문제가 있다.

## Yarn berry

Yarn berry에서 나온 PnP 방식은 이런 문제들을 해결한다. **Yarn PnP**는 `package.json`을 기반으로 명시적인 의존성 트리를 생성하고, 모듈을 resolve하는 과정을 이 트리를 기반으로 처리하여 유령 의존성 문제를 해결하면서, 각각의 패키지를 하나의 `.zip` 압축 파일로 저장하기 때문에 파일 개수와 용량 측면에서 획기적인 절약을 이루어낸다.

### 작동 방식

yarn pnp가 생성하는 `.pnp.cjs` 파일에는 `readFileSync`같은 fs 모듈의 메서드가 구현되어 있고, 이 메서드들은 `.yarn/cache` 디렉토리의 zip 파일들을 참조할 수 있도록 연결한다.

```jsx
class NodeFS extends BasePortableFakeFS {
  // ...
  readFileSync(p, encoding) {
    const fsNativePath = typeof p === `string` ? npath.fromPortablePath(p) : p;
    return this.realFs.readFileSync(fsNativePath, encoding);
  }
  // ...
}
```

patchFs 메소드를 통해 기존 fs 모듈을 사용하는 코드들을 가로챈다. 이를 통해 .zip 파일 내부를 실제 디렉토리처럼 읽어올 수 있다.

<aside>

💡 **아래 내용은 명확하게 정리되어 있지 않습니다!**  
이게 뭔지 좀 더 깔끔하게 다듬을 필요가 있어 보여요. 읽는 분들 화이팅~

</aside>

이제 `pnpApi`를 사용해서 `react-dom` 패키지를 resolve하는 과정을 따라가보자. resolve되는 과정은 [Nodejs 레포지토리의 Module.\_load](https://github.com/nodejs/node/blob/main/lib/internal/modules/cjs/loader.js#L889)과 [Node.js 명세](https://nodejs.org/api/esm.html#resolver-algorithm-specification)를 참고해서, 패키지명을 가지고 모듈을 찾는 부분만 구현하는 것으로 한다. pnpApi의 명세는 [yarn의 PnP API 페이지](https://yarnpkg.com/advanced/pnpapi)에 나와 있다.

```bash
yarn node
> let p = require('pnpapi')
```

우선, 터미널에서 `yarn node` 를 실행해서 `.pnp.cjs` 패치가 적용된 node 터미널을 연다.

```bash
> p.getAllLocators()
[
  { name: 'berry', reference: 'workspace:.' },
  { name: 'js-tokens', reference: 'npm:4.0.0' },
  { name: 'loose-envify', reference: 'npm:1.4.0' },
  { name: 'react-dom', reference: 'npm:18.2.0' },
  {
    name: 'react-dom',
    reference: 'virtual:34069774f764f6c076c76cefb79f9c00ee35c2ecc2faeec6f1f046eac9e499da19f7441a38c80f3dc82287abf91ba64b7783b2e2d997751e40d1ad563ff4f78d#npm:18.2.0'
  },
  { name: 'scheduler', reference: 'npm:0.23.0' }
]

> p.getPackageInformation(p.getAllLocators()[3])
{
  packageDependencies: Map(1) { 'react-dom' => 'npm:18.2.0' },
  packagePeers: Set(0) {},
  linkType: 'SOFT',
  discardFromLookup: false,
  packageLocation: 'E:\\workspace\\.yarn\\cache\\react-dom-npm-18.2.0-dd675bca1c-7d323310be.zip\\node_modules\\react-dom\\'
}
```

`getAllLocators`는 PnP 환경에 설치된 패키지들의 목록을 보여준다. 보면 프로젝트에 직접 의존성으로 명시된 `react-dom`만이 가상 경로를 갖는 것처럼 적혀 있다. 그리고 받은 Locator를 `getPackageInformation`에 인자로 사용해서 패키지의 정보를 확인할 수 있다. `packageLocation` 프로퍼티를 통해 패키지가 위치한 실제 경로를 다룬다.

```bash
> fs.readFileSync(p.getPackageInformation(p.getAllLocators()[3]).packageLocation + 'index.js')
<Buffer 27 75 73 65 20 73 74 72 69 63 74 27 3b 0a 0a 66 75 6e 63 74 69 6f 6e 20 63 68 65 63 6b 44 43 45 28 29 20 7b 0a 20 20 2f 2a 20 67 6c 6f 62 61 6c 20 5f ... 1313 more bytes>
```

그 이후 `.pnp.cjs`를 통해 재정의된 `fs.readFileSync`를 통해 디렉토리 내의 `index.js` 파일을 읽어올 수 있었다.

최종적으로 `react-dom`을 resolve하려면 이와 비슷한 과정을 통해 아래와 같은 경로로 연결되는 것이다.

```bash
$ yarn node
> require.resolve('react-dom')
'E:\\workspace\\.yarn\\__virtual__\\react-dom-virtual-67ee33d872\\0\\cache\\react-dom-npm-18.2.0-dd675bca1c-7d323310be.zip\\node_modules\\react-dom\\index.js'
```

### 유령 의존성 금지

반면에, 프로젝트 의존성에는 명시되지 않았으면서 `react-dom`이 의존하는 패키지가 있다. `loose-envify`와 `scheduler` 두 개가 있는데, 실제로도 `react-dom`을 설치할 경우 `.yarn/cache` 디렉토리에 두 패키지가 함께 설치되는 것을 볼 수 있다. npm의 `node_modules`도 마찬가지다.

그런데 이들은 `require.resolve()`를 통해서 찾을 수 없는데, 이는 `.pnp.cjs`상에서 **패키지의 가상 경로가 존재하지 않기 때문**이다. 참고로 `.pnp.cjs`의 내용은 아래처럼 생겼다.

```jsx
// .pnp.cjs
function $$SETUP_STATE(hydrateRuntimeState, basePath) {
  return hydrateRuntimeState(JSON.parse('{\
    // ...
    ["react-dom", [
        ["npm:18.2.0", {
          "packageLocation": "./.yarn/cache/react-dom-npm-18.2.0-dd675bca1c-7d323310be.zip/node_modules/react-dom/",
          "packageDependencies": [
            ["react-dom", "npm:18.2.0"]
          ],
          "linkType": "SOFT",
        }],
        ["virtual:34069774f764f6c076c76cefb79f9c00ee35c2ecc2faeec6f1f046eac9e499da19f7441a38c80f3dc82287abf91ba64b7783b2e2d997751e40d1ad563ff4f78d#npm:18.2.0", {
          "packageLocation": "./.yarn/__virtual__/react-dom-virtual-67ee33d872/0/cache/react-dom-npm-18.2.0-dd675bca1c-7d323310be.zip/node_modules/react-dom/",
    // ...
```

우선 비교를 위해 `react-dom`이 설치된 npm 프로젝트에서 다음 코드를 작성한다고 하자.

```jsx
// index.js
import * as envify from "loose-envify";
console.log(envify); // [Module: null prototype] { default: [Function (anonymous)] }

import("loose-envify").then((e) => {
  console.log(e); // [Module: null prototype] { default: [Function (anonymous)] }
});
```

`loose-envify`가 어떤 패키지인지는 차치하고, 아무튼 import하더라도 정상적으로 resolve되어 내용물을 확인할 수 있다.

반면 Yarn PnP에서 설치된 경우 위 코드는 에러를 발생시킨다.

`.yarn/cache` 디렉토리에는 분명 `loose-envify-npm-1.4.0-6307b…..zip` 파일이 존재한다. 근데 어째서 resolve되지 않는 것일까? 이는 **Yarn PnP에서는 외부 모듈을 `.yarn/cache`가 아닌, `/.pnp.cjs` 파일로부터 가져오기 때문**이다.

```jsx
// .pnp.cjs
function $$SETUP_STATE(hydrateRuntimeState, basePath) {
  return hydrateRuntimeState(JSON.parse('{\
    // ...
    ["react-dom", [
        ["npm:18.2.0", {
          "packageLocation": "./.yarn/cache/react-dom-npm-18.2.0-dd675bca1c-7d323310be.zip/node_modules/react-dom/",
          "packageDependencies": [
            ["react-dom", "npm:18.2.0"]
          ],
          "linkType": "SOFT",
        }],
        ["virtual:34069774f764f6c076c76cefb79f9c00ee35c2ecc2faeec6f1f046eac9e499da19f7441a38c80f3dc82287abf91ba64b7783b2e2d997751e40d1ad563ff4f78d#npm:18.2.0", {
          "packageLocation": "./.yarn/__virtual__/react-dom-virtual-67ee33d872/0/cache/react-dom-npm-18.2.0-dd675bca1c-7d323310be.zip/node_modules/react-dom/",
    // ...
```

앞에서 첨부했던 `.pnp.cjs` 파일의 일부다. 이 파일은 `package.json`을 기반으로 의존성 트리를 구성하여 갖고 있고, 물론 `react-dom` 패키지가 사용하는 `loose-envify` 역시 포함하고 있다. 하지만 프로젝트에 명시된 의존성(`react-dom`)은 다른 패키지들과 달리 `virtual:…`로 시작하는 가상 경로가 부여되어 있다. 이 가상 경로가 부여되지 않은 패키지는 resolve될 수 없다.

정확한 명칭은 **가상 로케이터**라고 부르는데, 자세한 내용은 [Yarn의 PnP Specification](https://yarnpkg.com/advanced/pnp-spec) 페이지에서 알 수 있다.

이 과정을 통해 개인적인 이해를 위해 유추한 내용을 정리하자면,

1. `package.json`을 기반으로 `.pnp.cjs`에서 의존성 트리를 구성한다.
2. 코드가 실행되면 Yarn PnP는 이를 통해 가상 `node_modules` 폴더를 구성한다.
3. `react-dom`을 부여된 가상 경로에 존재하는 것처럼 연결한다.
4. 해당 가상 경로에 `react-dom`이 참조하는 의존성 패키지들을 또 연결한다(`node_modules`처럼)
5. `loose-envify`의 경우 `react-dom`의 하위 디렉토리에 있는 셈이니 가상 경로를 따로 부여할 필요가 없다,

이렇게 `loose-envify`는 최상위 디렉토리로 hoist되지 않아 유령 의존성 문제도 발생하지 않고, 여러 번 참조될 경우 필요한 패키지들의 가상 경로에 같이 참조시키면 되므로 같은 파일을 여러 개 가질 필요도 없어진다. 최대한 이해하기 쉬우면서 틀리지 않도록 정리하려 노력했는데 제발 크게 틀린 부분이 없길 빈다.

### Peer dependency 문제

<aside>

💡 **아래 문제는 일반적이지 않습니다!**  
재현할 수 있는 npm 패키지를 찾으려고 했지만, 대부분의 경우 peer dependency로만 명시된 의존성 패키지가 존재하지 않아 일반적인 문제가 아닙니다. 참고하세요~

</aside>

**Peer dependency**란, 패키지가 다른 패키지와 상호작용함을 명시하는 종속성 필드다. 예를 들어 React 기반의 디자인 시스템은 React의 기능을 활용하지만, 패키지 자체에서 React를 포함할 필요는 없다. 이 경우 디자인 시스템에서 React를 Peer dependency로 지정하여 React의 어떤 버전이 필요함을 명시할 수 있는 것이다.

npm은 패키지를 설치할 때 peer dependency로 명시된 패키지를 같이 설치하려고 시도한다. 여태 꽤 많은 변화가 있었지만, 아무튼 npm 7.0 이후로는 설치하는 쪽으로 가닥을 잡은 모양이다. [[참고 링크]](https://github.blog/2021-02-02-npm-7-is-now-generally-available/#peer-dependencies)

반면에 Yarn PnP에서는 peer deps를 자동으로 설치하지 않는다. 예를 들어, `react`를 peer deps로 가진 `@chwh/cds` 패키지를 npm과 Yarn PnP에서 각각 설치하면 npm에는 `react`가 함께 설치되는 반면, Yarn PnP에서는 `cds`와 `cds`의 dependency의 일반 의존성 패키지(`lodash`)만이 설치된다.

단, `yarn install`을 했을 때 패키지가 요구하는 peer deps가 설치되지 않은 경우 아래와 같이 경고 메시지가 표시되며, 개발자는 이를 수동으로 설치함으로써 개발자가 직접 의존성에 대한 관리를 하도록 유도한다. 또 이러한 방식은 여러 패키지를 설치할 때의 의존성 그래프가 복잡해지는 현상을 방지한다고 한다.

```powershell
> yarn
➤ YN0002: │ berry@workspace:. doesn't provide @emotion/react (p0d53b), requested by @chwh/cds
➤ YN0002: │ berry@workspace:. doesn't provide @emotion/styled (pe7b02), requested by @chwh/cds
```

물론 예시로 든 `cds`를 사용하려면 리액트를 사용해야 하지만, 만약 peer dependency에만 명시된 패키지를 의존하면서 독립적으로 실행할 수 있을 것 **_처럼_** 보이는 패키지를 사용한다면, 수동으로 설치하지 않고서는 오류가 발생하게 될 것이다. 다만, 대부분의 경우 dependency로 명시된 패키지들 중에 peer dependency로 가지고 있는 패키지를 dependency로 갖는 식으로 의존성 트리가 채워지는 경우가 많기 때문에 자주 만나는 상황은 아니다.

## 부록

### 부록1 - yarn dlx와 pnpify

Yarn PnP 환경에서 `npx`와 같은 명령어를 사용해야 할 때가 있고, 이에 대응하는 명령어가 `yarn dlx`이다. 예를 들어 `yarn dlx storybook init`을 실행하면 `npx storybook init`을 실행한 것과 같은 결과를, Yarn의 환경에 맞게 만들어 준다. `npx` 자체가 yarn과 npm 중 알맞은 패키지 매니저로 연결해 주지만, Yarn PnP는 그 외에도 추가적인 작업을 필요로 하기 때문에 제대로 작동하지 않기도 한다. Storybook에 Yarn PnP를 적용할 때가 대표적인 예시인데.. [이 내용도 아주아주 간단하게 언급한 적이 있다.]({{<ref "posts/2023/04/nextjs-storybook-with-pnp">}}#내가-이겼다-스토리북아)

반면 Yarn에는 pnpify라는 패키지가 존재한다. 보통 `package.json`에 정의되는 명령어들은(tsc나 vite build같은..) 여전이 로컬 파일 기반으로 패키지를 resolve하려 시도하는데, 압축된 패키지들을 사용하는 PnP 환경에서 제대로 작동하지 않는다. 이 문제를 해결하기 위해 위에 나온 방식으로 **패키지를 resolve하는 로직을 교체해 주는 것**이 `pnpify`이다.

```jsx
// original
"build": "tsc -p tsconfig.publish.json && vite build --config vite.publish.config.ts"
// with pnp
"build": "yarn pnpify tsc -p tsconfig.publish.json && yarn pnpify vite build --config vite.publish.config.ts"
```

`dlx`와 `pnpify`는 둘 다 PnP 환경에 맞도록 스크립트를 실행한다는 공통점이 있다. 다만 `dlx`는 프로젝트에 명시되지 않은 패키지를 일회성으로 다운로드하여 실행하고, `pnpify`는 PnP 환경에 맞게 기존 스크립트를 변환하여 실행한다는 차이점이 있으므로 상황에 맞도록 사용하면 되겠다. 예를 들어 프로젝트 초기화를 `dlx`로 한다던가..

### 부록2 - 사실 모든 것이 PnP의 잘못은 아닙니다

`Yarn berry`에서의 storybook 세팅에서, 특정 패키지가 resolve되지 않는 문제가 있었다. 앞에서 링크한 블로그 글에서 이 것이 Yarn PnP의 resolve 기준의 잘못인 것처럼 썼는데, 사실 이게 유일한 이유는 아니었다.

cds는 `@storybook/builder-vite` 패키지의 0.4.2 버전을 사용하고 있었는데, 의존성 설치를 마치고 스토리북을 실행해 보면 아래와 같은 오류를 뱉었다.

```powershell
오후 10:13:52 [vite] Internal server error: Failed to resolve import "@storybook/preview-web" from "..\..\virtual:\@storybook\builder-vite\vite-app.js". Does the file exist?
  Plugin: vite:import-analysis
  File: /virtual:/@storybook/builder-vite/vite-app.js:1:45
  1  |  import { composeConfigs, PreviewWeb } from '@storybook/preview-web';
     |                                              ^
  2  |      import { ClientApi } from '@storybook/client-api';
  3  |      import '/virtual:/@storybook/builder-vite/setup-addons.js';
```

따라서 `@storybook/preview-web`이라는 패키지를 추가로 설치해 주어야 했고, 그 외에도 몇몇 의존성을 추가로 설치해야만 했다. 그런데.. `@storybook/preview-web`은 `@storybook/builder-vite`의 dependency에 들어가 있지 않았다.

그럼에도 이 패키지가 `@storybook/preview-web`를 요구할 수 있었던 이유는..

```jsx
// @storybook/builder-vite/dist/optimizeDeps.js
const INCLUDE_CANDIDATES = [
  // ...
  "@storybook/preview-web",
  // ...
];
```

`optimizeDeps.js`라는 파일에서 필요로 하는 외부 모듈들을 따로 적어 두고 있기 때문이었다. 아마 이 파일은 `vite`의 [디펜던시 최적화 옵션](https://vitejs-kr.github.io/config/dep-optimization-options.html)을 설정하는 파일로 보인다.

스토리북은 리액트를 CRA를 통해 초기 설정을 하듯이 통상 `npx storybook init`을 통해 초기 설정을 진행하기 때문에 `package.json`에 의존성이 제대로 명시되어 있지 않은 듯 하다. 어찌 보면 유령 의존성 현상을 이용하는 셈이다.

이게 `@storybook/builder-vite@0.4.2` 버전의 코드인데, Storybook 7의 릴리즈 이후로 builder 플러그인들이 스토리북 메인 레포지토리에 모노레포 형태로 통합되던 시기 근처로 의존성 역시 제대로 명시되었다. [[관련 커밋]](https://github.com/storybookjs/storybook/commit/f80ef5f40ab5ecaf29e83f1435809de4c724d2fc) 따라서 **지금은 해당되지 않는 이슈**이며, 빌더의 버전 역시 다른 addon과 마찬가지로 스토리북의 버전과 통일되었다.

## 마치며..

![cds issue](/images/posts/2023/05/exploring-yarn-berry/03.png)

사실 조금 뜬금없이 준비한 발표 자료인데, 가볍게만 해야지.. 하고 시작했다가 어렴풋이 예상했던 내용이 틀리고 틀리고를 반복해서 검증을 반복하다가 글이 태산으로 가버렸다. 마지막에는 내가 왜 이걸 보고 있었는지를 까먹어서 손을 놓고 다시 컨텍스트를 따라가기도 했다. 그러니까 음.. 매끄러운 글은 아닌 것 같다. 내용 없이 주제만 정하고 시작한 글이라 그런가..

이 글을 끝으로 더 이상 얀베리를 붙들고 씨름하는 일은 없었으면 좋겠지만 아마 그렇진 못할 것 같고.. 다음 프로젝트를 한다면 반드시 pnpm을 써 보고 싶다는 생각을 하고 있다. CDS를 하면서 pnpm을 사용하는 레퍼런스가 꽤 많다는 것을 알았고, Yarn에서도 [pnpm 링커를 지원](https://github.com/yarnpkg/berry/pull/3338)하고 있으니 pnpm도 그만의 장점이 있겠구나 하는 막연한 생각 중.

## Refs.

[GitHub - yarnpkg/berry: 📦🐈 Active development trunk for Yarn ⚒](https://github.com/yarnpkg/berry)  
[Plug'n'Play](https://yarnpkg.com/features/pnp)  
[(번역) 자바스크립트 Import Map에 대해 알아야 할 모든 것](https://velog.io/@superlipbalm/everything-you-need-to-know-about-javascript-import-maps)  
[package.json에 쌓여있는 개발 부채](https://yceffort.kr/2021/10/debt-of-package-json)  
[node_modules로부터 우리를 구원해 줄 Yarn Berry](https://toss.tech/article/node-modules-and-yarn-berry)  
[npm 7 is now generally available!](https://github.blog/2021-02-02-npm-7-is-now-generally-available/#peer-dependencies)  
[Next.js Storybook에 Yarn PnP 적용하기 | PrayinForRain.dev](https://prayinforrain.github.io/posts/2023/04/nextjs-storybook-with-pnp)  
[Vite](https://vitejs-kr.github.io/config/dep-optimization-options.html)  
[Yarn PnP 의존성 에러 해결기](https://woong-jae.com/projects/220711-pnp-dependency-error)  
[GitHub - nodejs/node: Node.js JavaScript runtime](https://github.com/nodejs/node)  
[Modules: ECMAScript modules | Node.js v20.2.0 Documentation](https://nodejs.org/api/esm.html#resolver-algorithm-specification)
