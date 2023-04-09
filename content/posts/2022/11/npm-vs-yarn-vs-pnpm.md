---
title: "npm vs yarn vs pnpm"
date: 2022-11-18T16:42:55+09:00
lastmod: 2022-11-18T16:42:55+09:00
draft: false
categories: ["moheyum", "Node.js"]
tags: ["moheyum", "yarn", "npm", "pnpm"]
---

지금까지 저는 아무 의심 없이 npm을 사용해왔습니다. 이따금씩 `node_modules` 폴더가 저를 고통스럽게 했던 시간들이 있었지만, 프로젝트 초기화에 정말 이상한 행동만 하지 않으면 `npm i` 한 줄과 커피 한 잔으로 모든게 문제 없이 동작했으니까요. 하지만 우리는 슬랙의 어떤 분을 통해, npm보다 좋은 방법이 있음을 알고 있습니다. 이번 포스트에서는 `yarn`과 `pnpm`을 체험해 보도록 하겠습니다.

# 🤷 TL;DR

- npm의 의존성 관리는 사실 매우 비효율적이다.
- 이 문제를 보완한 패키지 매니저가 yarn, pnpm이다.
- 각 패키지 매니저로의 마이그레이션은 매우 쉽다. 긍정적으로 고려해보자.

# 🎁 npm

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_01.png)

우선 npm입니다. npm에 대해 더 할 이야기는 없지만, 우선 비교를 하기 위해 기준이 될 프로젝트의 의존성을 설치하고 실행까지 진행해 보겠습니다. 이번 글에서 실험할 프로젝트는 제가 개인적으로 사용하는 React boilerplate입니다. 어떤 것들을 포함하는지는 [레포지토리의 README.md](https://github.com/prayinforrain/ReactTS_Boilerplate_v2)를 참고해 주세요.

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_02.png)

설치가 되었습니다. 이대로 `package.json`에 정의된 dev 명령어를 실행하면 리액트 서버에 접속할 수 있게 됩니다.

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_03.png)

무난하게 진행이 되었습니다.

# 🐈 Yarn

Yarn의 가장 큰 특징은, 비교적 최근에 나온 버전인 Yarn berry의 PnP 전략을 통한 파일 관리입니다. npm은 기본적으로 패키지 A, B가 C를 참조한다면 프로젝트가 C를 직접 사용하지 않는다고 해도 C를 `node_modules` 디렉토리 최상위로 호이스팅하여 최적화를 진행합니다. 하지만 이 때 A, B가 참조하는 C의 버전이 다르다면 두 버전 중 하나만이 호이스팅되며, 이후 호이스팅되지 않은 버전을 참조하는 패키지가 많아지더라도 이 구조는 변경되지 않습니다. 즉 완전한 최적화는 되지 않습니다.

반면 Yarn berry에서는 패키지의 각 버전마다 하나의 .zip 파일로 설치되고, 앞서 말한 중복 설치 문제가 발생하지 않습니다. .zip 파일로 압축되면서 얻는 용량 상의 이점도 챙길 수 있습니다. 자세한 설명은 [토스 기술 블로그](https://toss.tech/article/node-modules-and-yarn-berry)를 읽어보세요!

그럼 이제 [Yarn 공식 문서](https://yarnpkg.com/getting-started/install)의 설명을 따라서 설치를 진행해 보겠습니다. NodeJS의 `Corepack` 기능을 이용해야 하는 모양인데, 노드 버전 16.10을 기준으로 추가 조치가 필요한 것 같습니다. 저는 NodeJS v16.16.0을 사용중이므로 별도 설치 없이 corepack을 활성화하겠습니다.

```tsx
corepack enable
corepack prepare yarn@3.2.4 --activate // yarn@stable 도 가능하다고 함
yarn init -2
```

> 💡 yarn init 뒤의 `-2` 라는 플래그가 [Zero-Installs](https://yarnpkg.com/features/zero-installs)를 위한 템플릿으로 초기화해 주는 모양인데요, Yarn2 (Berry)의 가장 큰 특징 중 하나인 `node_modules`를 대체하는 PnP 패키지 관리를 사용하기 위해 해당 플래그를 사용하는 모양입니다. `-2`를 빼고 초기화해보니 `node_modules` 폴더를 사용하도록 되더라구요. Zero-Installs에 대한 내용은 [여기](https://www.zigae.com/yarn2/)에 나와 있습니다.

npm으로 했던 것처럼 boilerplate 파일을 방금 초기화한 yarn 디렉토리에 복사하고 `yarn install`을 실행합니다.

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_04.png)

뭔가 여러 단계를 거치는 듯한 메시지를 보여주다가 설치가 완료되었습니다. `.yarn/cache` 디렉토리에 패키지들이 .zip 파일로 압축되어 들어있네요.

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_05.png)

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_06.png)

음, 그런데 이 상태로 바로 서버를 실행시킬 수가 없습니다. ESLint 플러그인도 어디가 불편한지 비명을 지르고 있구요. 이유는 모르겠지만 `package.json`에는 명시되지 않은 peer-dependency 패키지들이 빠져 있어서 그런 것 같습니다. 다행히도 `package.json`에서 자동완성과 함께 버전까지 알아서 채워주어서 적당히 적어서 `yarn install`을 다시 진행했습니다. [이 문제](https://github.com/yarnpkg/yarn/issues/1503)에 대한 이슈를 발견했지만 답을 구하지 못하고 결국 직접 하나씩 설치하는 식으로 해결했습니다.

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_07.png)

# 🧊 pnpm

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_08.png)

[공식 문서](https://pnpm.io/ko/installation)를 참고하였고, yarn과 별 차이 없이 corepack을 통해 설치했습니다. 명령어만 보면서 했는데 문득 보니 공식 문서가 영어가 반, 한국어가 반으로 되어 있었네요. 위 사진은 글을 읽지 않고 무작정 명령어 실행하면서 찍은 사진인데, Powershell이 뭔가 해해킹킹이이 되되ㄴ는 기분이 들어서 올렸습니다.

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_09.png)

`pnpm install`을 실행하니, peer dependency 이슈에 대한 메시지를 띄워줍니다. yarn을 사용했을 때와 같은 문제가 있네요. [이 링크](https://stackoverflow.com/questions/70597494/pnpm-does-not-resolve-dependencies)에서 답을 찾아 `pnpm i --shamefully-hoist=true`로 설치하니 알아서 피어 의존성 패키지를 같이 설치해 줍니다.

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_10.png)

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_11.png)

# 🤨 뭐가 다를까요..?

![Untitled](/images/posts/2022/11/npm-vs-yarn-vs-pnpm/npm_vs_yarn_12.png)

사실 이 정도 테스트로 차이를 느끼기는 어렵습니다. 그래도 짧은 시간동안 각 패키지 매니저를 체험해 봤으니, 그나마 눈에 띄는 차이를 정리해보겠습니다.

- `npm`은 **독보적으로 의존성 설치가 느리고, 무거웠습니다**.
- `yarn`의 **패키지 용량이 정말 가벼웠습니다**. `pnpm`은 프로젝트가 크지 않기 때문인지, `npm`과 눈에 띄는 차이는 없었습니다.
- `pnpm`은 **peer-dependency 문제를 해결할 수 있는 플래그**를 지원해 주는 것이 좋았습니다. 사실 제가 겪은 문제가 일반적인 케이스는 아닌 것 같긴 합니다.
- 걱정이 많았던 `ESLint`는 의외로 금방 적용되었습니다. 마이그레이션 하는데는 문제가 없을 것이다, 라는 생각이 듭니다.

보안이라던지, 성능이라던지 비교를 할 수 있으면 좋겠지만, 제 실험용 프로젝트에서는 유의미한 차이를 보이지 않았습니다. 다만 `package.json`에 정의된 npm scripts를 문제없이 실행해 준다는 점이 인상 깊었습니다. javascript에서 typescript로 옮겨갈 때보다 훨씬 친절하네요.

# 📖 Refs.

[https://github.com/yarnpkg/yarn/issues/1503](https://github.com/yarnpkg/yarn/issues/1503)  
[node_modules로부터 우리를 구원해 줄 Yarn Berry](https://toss.tech/article/node-modules-and-yarn-berry)  
[pnpm does not resolve dependencies](https://stackoverflow.com/questions/70597494/pnpm-does-not-resolve-dependencies)  
[[번역] JavaScript 패키지 매니저 비교 - npm, Yarn 또는 pnpm?](https://velog.io/@dev_boku/JavaScript-%ED%8C%A8%ED%82%A4%EC%A7%80-%EB%A7%A4%EB%8B%88%EC%A0%80-%EB%B9%84%EA%B5%90-npm-Yarn-%EB%98%90%EB%8A%94-pnpm#%EC%84%B1%EB%8A%A5-%EB%B0%8F-%EB%94%94%EC%8A%A4%ED%81%AC-%EA%B3%B5%EA%B0%84-%ED%9A%A8%EC%9C%A8%EC%84%B1)  
[npm, yarn, pnpm 비교해보기](https://yceffort.kr/2022/05/npm-vs-yarn-vs-pnpm#%EA%B2%B0%EB%A1%A0)  
[설치하기 | pnpm](https://pnpm.io/ko/installation)  
[Installation](https://yarnpkg.com/getting-started/install)  
[yarn berry(yarn2) 마이그레이션 방법](https://www.zigae.com/yarn2/)  
[yarn berry로 React.js 프로젝트 시작하기 | Kasterra's Archive](https://kasterra.github.io/setting-yarn-berry/)  
그리고 부스트 컨퍼런스 테크톡에서 멋진 발표를 해 주신 **J166 이휘찬** 캠퍼님께 감사드립니다 🙇
