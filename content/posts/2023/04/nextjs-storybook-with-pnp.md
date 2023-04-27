---
title: "Next.js Storybook에 Yarn PnP 적용하기"
date: 2023-04-27T15:32:50+09:00
draft: false
categories: []
tags: ["storybook", "yarn", "pnp", "nextjs"]
---

# Storybook을 쓰려고 했는데

최근 Storybook을 사용할 일이 무척 많았다. 언젠가는 포스팅을 해야 할 CDS 프로젝트부터 [넘블 챌린지]({{<ref "posts/2023/04/numble-talk">}})도 있었고... 처음엔 너무 낯설었지만 공통된 컴포넌트들을 미리 설계해 두고 재사용하는 것이 좀 더 깔끔한 설계가 되는 것 같아 매력을 느꼈다.

그런데 문제는 내 작업 환경에 있었다. 꽤 연식이 된 윈도우 데스크탑에 수십가지 개발 환경을 섞어 놓고, 요새는 게임에도 못 쓰는 처참한 성능의 HDD에 레포를 두고 쓰니 종속성 패키지 설치도 커피 한 잔 타와야 하는 시간이 걸리니 Yarn Berry의 사용이 반필수가 되어버렸다. 넘블 챌린지 때 Yarn Berry를 사용하고 싶었지만 애석하게도 수 많은 문제에 시달려 포기했는데, 여유가 생긴 지금 마음을 다잡고 다시 시도해 보기로 했다.

> Yarn Berry의 가장 큰 변화는 Plug n Play 방식의 패키지 관리 방식을 지원한다는 점이지, `Yarn Berry = PnP`인 것은 아니다. Yarn Berry도 nodeLinker 옵션을 `node-modules`로 지정한다면 node*modules 디렉토리를 사용할 수 있기 때문에, 아래부터는 \_Berry* 대신 _PnP_ 라는 표현을 사용하였다.

# 그럼 쓰세요

## create-next-app으로 프로젝트 준비

우선 Next.js 앱을 생성하고, Yarn PnP로 패키지 매니저를 변경해 보자.

```zsh
yarn create next-app
yarn set version berry # yarn pnp로 패키지 매니저 변경
```

PnP를 사용하기 위해 yarn의 설정을 변경해 주어야 한다.

```zsh
# .yarnrc.yml
nodeLinker: pnp

# terminal
yarn plugin import typescript # @types 패키지를 자동으로 설치해 주는 플러그인
yarn # 자동으로 node_modules가 삭제되고 패키지가 다시 설치된다.
yarn dlx @yarnpkg/sdks vscode # VSCode에서 Repository의 Typescript를 사용하기 위한 명령어
```

기본적인 환경 설정이 완료되었다.

## Storybook 설치하기

### Initialize

[Storybook 공식 문서](https://storybook.js.org/docs/react/migration-guide#automatic-upgrade)를 따라서 설치해 보겠다.

```zsh
yarn dlx storybook@latest init
```

설치는 제대로 되었지만, `yarn storybook`을 실행해 보면 오류가 난다. 이는 Yarn Berry의 엄격 모드(Strict mode)에서는 명시적으로 나열되지 않은 종속성을 자동으로 설치하지 않기 때문이다.  
무슨 말일까? 대충 내 프로젝트에서 A 패키지를 설치하면, A 패키지에서 사용하는 B 패키지가 함께 설치되지 않을 수 있다는 뜻이다. 정확히 어떤 기준인지는 파악하지 못했지만 이 문제로 인해 babel을 포함한 일부 패키지들이 설치되지 않는다. 아마 React 앱의 경우 대부분 babel + webpack을 사용하고 있을테고 Storybook은 여기 달려있는 babel을 같이 사용하려고 하는 게 아닐까..(추상적인 생각)

이를 해결하기 위해서는 무한 리트를 하면서 요구하는 종속성을 하나씩 설치하거나, `.yarnrc.yml` 파일에 아래와 같은 설정을 추가하여 엄격 모드를 해제하여 해결할 수 있다.

```zsh
# .yarnrc.yml
pnpMode: loose

# 다시 종속성 패키지 설치
yarn
```

그리고 어째서인지 느슨한 모드로 재설치를 해도 오류를 일으키는 `styled-jsx`와 `@babel/core`를 설치해 주겠다.

```zsh
yarn add -D @babel/core styled-jsx
```

### Webpack의 설정을 고치기

다시 실행해 보면 스토리북 화면이 나타난다. 하지만 무언가의 오류가 표시되며 스토리북 dev server가 꺼져 버린다.

![css loader error](/images/posts/2023/04/nextjs-storybook-with-pnp/02.png)

`@storybook/nextjs`의 번들러인 webpack에서 css-loader와 기타등등 플러그인을 불러오면서 오류가 생기는 모양이다. 특이하게도 이 오류는 PnP 환경에서만 발생하는 오류인데, 대충 이 빌더에서 [webpack의 css-loader 관련 설정을 만드는 부분](https://github.com/storybookjs/storybook/blob/next/code/frameworks/nextjs/src/css/webpack.ts#L71)을 살펴보면 이런 추측을 할 수 있다.

1. `configureCss` 함수에서 `options.url`을 포함한 기타등등을 담은 설정 객체를 만든다.
2. 이 과정에서 `getImportAndUrlCssLoaderOptions`함수를 거쳐 `getUrlResolver` 함수가 호출된다.
3. `getUrlResolver`는 NextConfig 객체의 experimental property를 참조한다. experimental은 아래와 같은 타입을 갖는다.

```ts
interface ExperimentalConfig {
  // ...
  urlImports?: NonNullable<webpack.Configuration["experiments"]>["buildHttp"];
  // ...
}
```

4. 이 경로를 이용해 css 파일의 위치를 특정하고 번들링한다.

대충 이 과정을 거치는 것으로 보이는데(확실하지 않음), 이 부분이 실험적 기능이다 보니 가상 경로를 참조하는 PnP 환경에서 제대로 작동하지 않을 확률이 가장 높아 보인다.
또는 Webpack의 버전이 v6인지 확인하기 위해 사용되는 [`scopedResolve` 함수](https://github.com/storybookjs/storybook/blob/next/code/frameworks/nextjs/src/utils.ts#L96)가 제대로 작동하지 않아서 객체가 이전 버전의 형식으로 생성되었을 수도 있겠다.

그래서 이걸 어떻게 고쳤냐면.. storybook의 `preset-scss` addon으로 이 부분의 설정을 덮어 씌워서 해결했다. 사실 이런 용도로 쓰는 게 아닐거라 생각하는데.. webpack 설정을 override해서 해결하는 것보다 이 쪽이 훨씬 더 비용이 저렴하다 생각했다. 만약 직접 해결하고자 한다면 [Storybook의 Webpack 설정 문서](https://storybook.js.org/docs/react/builders/webpack)를 참고하여 설정을 할 수 있다.

```zsh
yarn add --dev @storybook/preset-scss css-loader
```

```typescript
// .storybook/main.ts

// ...
addons: [
  // ...
  "@storybook/preset-scss",
];
// ...
```

![storybook launched](/images/posts/2023/04/nextjs-storybook-with-pnp/03.png)  
이제 정상적으로 스토리북이 실행될 것이다.

### main.ts의 타입 오류

![framework name type error](/images/posts/2023/04/nextjs-storybook-with-pnp/01.png)

처음 init 했을 때부터 계속 거슬렸는데, `@storybook/nextjs` 템플릿이 `.storybook/main.ts` 파일을 생성할 때 프레임워크명을 절대경로를 포함해서 생성하면서 타입 오류가 나는 문제가 있다. 모순적이게도 `@storybook/nextjs`의 `StorybookConfig` 객체 타입은 이 부분에 무조건 `@storybook/nextjs`라는 문자열만을 허용하고 있다. 물론 그냥 실행이 되긴 하는데, 계속 붉은 줄이 그어져 있으면 몹시 곤란하니 이것도 바꿔 주겠다.

```typescript
// main.ts
// ...
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
// ...
```

## 하지만 node_modules가 생기잖아요

![node_modules folder](/images/posts/2023/04/nextjs-storybook-with-pnp/04.png)

storybook 뿐 아니라 여러 패키지에서 발생하는 일인데, PnP모드에서도 스토리북을 실행하면 node_modules 디렉토리가 생성되는 것을 볼 수 있다. 이 안에는 대충... 스토리북 dev 서버 실행에 필요한 임시 파일들이 저장되어 있다. 나를 포함해서 많은 Yarn PnP 사용자들이 이 현상에 대해 불편함(?)을 겪고 있는데, Storybook의 기여자가 [이슈 댓글](https://github.com/storybookjs/storybook/issues/11113#issuecomment-642851848)에서 다음과 같은 근거를 이야기해 주었다.

- `node_modules/.cache/package-name`에 임시 파일을 저장하는 것은 여러 라이브러리에서 사용하고 있는 패턴이다.
- `node_modules`는 모든 Javascript/Typescript 프로젝트에서 `.gitignore`로 무시되고 있다.
- `node_modules`에는 보통 언제든 _지울 수 있는_ 파일들이 들어가 있고, 문제 발생 시 이를 해결하기 위해 자주 삭제된다.
- 현재 시점에서 NPM, Yarn(PnP 사용 여부에 관계 없이) 모두에서 제대로 작동하고 있다.

따라서 이 것이 문제가 되는 _버그_ 는 아니고, **기대된 동작(Expected Behavior)** 으로 생각할 수 있다는 듯 하다. 댓글에 보면 Yarn 레포지토리 이슈에 이 캐시 파일들을 제거하기 위한 내용이 올라와 있는데, 3년이 지난 지금까지 참조 또는 갱신되지 않는 것으로 보아 급한 문제가 아니어서 잠정 보류된 모양이다. 좀 해 주면 좋을텐데..쩝..

# 내가 이겼다 스토리북아

앞서 말한 내 상황 때문에 나는 주변에 꽤나 Yarn berry 처돌이(?)로 퍼져 있는데 정작 프로젝트 할 때에는 한정된 시간 안에서 더 이상 지체할 수가 없어 node_modules를 사용해야 하는 것이 너무 아쉬웠다. 이미 프로젝트가 모두 정리된 후지만 그래도 지금에 와서나마 문제를 해결할 수 있어서 그래도 다행이다.

하나 속상한 에피소드가 있는데.. [내가 처음에 봤던 instruction](https://storybook.js.org/recipes/next)에서 `npx` 커맨드만을 이야기하고 있고, 나는 `npx`가 npm과 yarn 중 상황에 맞는 패키지 매니저를 알아서 선택해 준다고 알고 있었기 때문에 의심 없이 사용했다가 에러를 하나 더 만나 조금 더 고생했다.  
그러다가 바로 얼마 전에 [공식 문서에서 누락된 부분이 수정된 PR](https://github.com/storybookjs/storybook/issues/21895)을 발견했는데.. 스토리북 초기화는 `yarn dlx storybook` 명령어를 사용해야 하는 모양이다. npx로 해도 해결 과정에 큰 차이는 없지만 아이고 속터져

# Refs.

- [Yarn PnP 의존성 에러 해결기 | 햣 블로그](https://woong-jae.com/projects/220711-pnp-dependency-error)
- [Integrate Next.js and Storybook | Storybook](https://storybook.js.org/recipes/next)
- [Install Addons | Storybook](https://storybook.js.org/docs/react/addons/install-addons#using-preset-addons)
- [Webpack | Storybook](https://storybook.js.org/docs/react/builders/webpack)
- [[Bug]: `storybook init` (v7) fails with Yarn PnP · Issue #21895 · storybookjs/storybook · GitHub](https://github.com/storybookjs/storybook/issues/21895)
- ['yarn start-storybook' creates node_modules/.cache in Yarn 2 PnP project · Issue #11113 · storybookjs/storybook · GitHub](https://github.com/storybookjs/storybook/issues/11113)
