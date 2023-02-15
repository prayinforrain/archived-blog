---
title: "사이드바야 그만 깜빡여라"
date: 2022-12-06T02:11:55+09:00
lastmod: 2022-12-06T02:11:55+09:00
draft: false
categories: ["moheyum"]
tags: ["moheyum"]
---

**모헤윰**의 프론트엔드 앱은 `Next.js`로 만들어져 있습니다. 팀원 그 누구도 사용해 본 적이 없음에도 굳이 선택한 이유는 `NestJS`를 써 보니 프레임워크를 사용하는 것이 협업 환경에서 코드 일관성을 지키는 데 도움을 줄 것이라는 막연한 기대와, `SSR`을 체험해 보고 싶은 학습적인 욕심이 있었습니다. 지금 돌아보니 ‘너와 함께 하길 잘 했어!’ 하는 감상은 없네요.

기왕 SSR을 체험한다고 시작한 프로젝트인 만큼, 성능에 신경을 쓰지 않을 수 없게 되었습니다. 그러다 제가 좋아하는 어떤 팀의 노션에서 `memoization`을 통한 컴포넌트 중복 렌더링 방지에 대한 글을 읽었는데요, 이 부분이 때 마침 [Next.js 13을 적용하지 못해 포기해야만 했던](https://www.notion.so/next-js-13-app-dir-11191a66a5564a25ba882c8a835afd13) 아픈 상처를 자극하고 있어서 모헤윰에도 시도해 보기로 하였습니다.

# 🤷 TL;DR

- `useMemo`로 `memoization`하여도 context 값을 참조하면 리렌더링이 이루어진다.
- 크롬 개발자 도구나 React DevTools를 통해 리렌더링 정보를 확인할 수 있다.
- `Next.js`에서 `/pages/_app.tsx`에 들어간 컴포넌트는 리렌더링이 방지된다.

# 🤔 사이드바의 현재 상황

모헤윰은 Next.js가 요구하는 대로 pages 디렉토리에 각 페이지의 레이아웃을 컴포넌트의 조합으로 구성하고 있습니다. 아래 코드처럼요.

```tsx
// index.tsx
export default function Home() {
  return (
    <AuthGuard>
      <Frame>
        <SideBar />
        <MainSection />
      </Frame>
    </AuthGuard>
  );
}
```

하지만 이런 식의 구현은 한 가지 결함이 있습니다. 아래 구현 결과를 보면..

![befe.gif](/image/01-sidebar-blinking.gif)

바로 사이드바가 각 페이지마다 하위 컴포넌트로 삽입되어 **라우팅이 일어날 때 마다 새롭게 렌더링**이 되고 있다는 문제인데요, 어차피 똑같이 생긴 사이드바인데 몇 번이고 다시 렌더링 하게 되는 것은 비효율 적일 뿐 아니라, 움짤에서 보이듯이 순간적인 깜빡임이 계속되고 있는 상황입니다. 아직 기능이 많지 않아 렌더링 몇 번 더 한다고 억울할 문제는 아니지만 깜빡임은 조금 참기가 힘들군요.

# 📝 메모야 도와줘

무엇이 문제일까요? 일단 저는 앞에서 언급한 글이 설명한 대로 `useMemo`를 통해 사이드바를 `memoize`하면 리렌더링을 멈추지 않을까 하는 생각에 사이드바 컴포넌트를 모조리 Memo로 변경하였습니다.

그러고 보니 리렌더링이 이루어지는 지를 조금 더 정확하게 확인할 방법이 없을까요? 리액트에서 제공하는 `React Devtools`를 사용하면 렌더링이 이루어지는 컴포넌트를 표시할 수 있다고 합니다. 한번 적용해서 같이 확인해 보겠습니다.

![memo.gif](/image/02-sidebar-blinking.gif)

음.. 초록 선이 마구 그어 지는 걸 보니 렌더링도 이루어지고 있고, 실제로도 깜빡임이 발생하고 있습니다. 우리는 결국 2022년에 사이드바가 깜빡이는 웹을 만드는 개발자가 될 수 밖에 없는 걸까요? 정말 속상하군요.

그런데 제가 봤던 글에는 이런 내용이 있었습니다.

> `Context`의 값을 참조하고 있다면 `React.memo`로 컴포넌트를 `memoizaton`해도 리렌더링이 발생해요.

사이드바에서 `Recoil`을 통해 전역 변수를 참조하는 부분이 있었지만 이를 제거하고 테스트해봐도 여전히 결과는 똑같았고, 저는 결국 `Next.js 13`때 `CSS-in-JS`가 `Context API`를 사용한다는 이야기를 들었던 기억이 떠올라, 결국 우리는 또 `Emotion`때문에 하나의 희망을 포기하게 되는구나, 하고 체념을 하게 되었습니다. 이모션 요놈 하나 때문에 잃게 되는 것이 정말 많군요.

# ➡️ Next야 나는 너를 믿었어

하지만 여기서 포기하면 여태 쓴 글과 시간이 너무 아까웠습니다. 새 이슈를 처리하기엔 시간이 너무 애매했고 아쉬운 마음에 검색을 하던 중 몇 가지 글들을 발견했습니다.

> You can wrap your page component with your `Layout` component inside `_app.js`
> , it should prevent it from re-mounting.

정답은 `Next.js`가 가지고 있었군요. 모든 페이지를 렌더링 할때 사용되는 `_app.tsx`에 달아 놓은 컴포넌트는 리렌더링이 이루어지지 않는다는 내용인 것 같습니다. 이를 적용하기 위해서는 모든 페이지에 각각 달려있는 `Frame`과 `SideBar` 컴포넌트를 제거하고 `_app.tsx`로 이전하는 작업이 필요한데요, 이렇게 하면 **공통된 레이아웃을 적용하기 위해 불필요하게 반복되는 코드의 양을 줄일 수 있는 이점**까지 챙길 수 있습니다.

```tsx
// _app.tsx
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <Global styles={globalStyle} />
        <AppStyle>
          <Head>
            <title>Moheyum</title>
          </Head>
          <Component {...pageProps} />
        </AppStyle>
      </RecoilRoot>
    </ThemeProvider>
  );
}
```

바로 수정해 보겠습니다. 지금 `_app.tsx`는 위와 같은 상태입니다. 여기에 레이아웃의 영역을 제한하는 `Frame`과 오늘의 주인공인 `SideBar` 컴포넌트를 추가하되, 로그인과 회원가입 등 일부 컴포넌트에서는 사이드바가 보여서는 안됩니다. 이 부분은 `Router.pathname`으로 대조하여 예외 처리를 하도록 하겠습니다.

```tsx
// _app.tsx
const NoSideBar = ["/login", "/signup"];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  return (
    <ThemeProvider theme={theme}>
      <RecoilRoot>
        <Global styles={globalStyle} />
        <AppStyle>
          <Head>
            <title>Moheyum</title>
          </Head>
          <Frame>
            {!NoSideBar.includes(router.pathname) && <SideBar />}
            <ComponentWrapper>
              <Component {...pageProps} />
            </ComponentWrapper>
          </Frame>
        </AppStyle>
      </RecoilRoot>
    </ThemeProvider>
  );
}
```

`_app.tsx`를 수정하고, `pages` 디렉토리 안의 모든 `SideBar`를 import하는 부분을 제거했습니다. 페이지 수가 더 많아지고 나서 했으면 손목에 무리가 왔을 것 같다는 생각이 들었습니다.

> 💡 **CSS-in-JS는 React DevTools에서 렌더링 정보를 잘못 보여준다?**  
> 정확하지는 않은 정보이지만, React DevTools가 보여주는 리렌더링 정보가 실제 브라우저의 리렌더링과 다를 수 있다는 글을 봤습니다. 실제 리렌더링 상황을 보기 위해서는 크롬 개발자 도구의 `렌더링 → 페인트 플래시`를 체크해서 확인하라고 하네요.  
> 리액트 데브툴과의 차이는 리액트의 virtual render와 브라우저의 native rerender를 보여주는 차이라고 하는데, 좀 더 알아볼 필요가 있어 보입니다.  
> ![Untitled](/image/03-sidebar-blinking.png)

![aftr.gif](/image/04-sidebar-blinking.gif)

브라우저의 페인트 플래시를 체크하고 확인해 보았습니다. gif 파일을 계속 하이라이트해서 정신이 사납지만, 아무튼 우측의 메인 섹션이 계속 리렌더링 되는 동안 사이드바 만큼은 한 번의 깜빡거림 없이 깔끔하게 작동함을 확인하였습니다. 이제 좀 낫네요!

# 📖 Refs.

[re rendering conditions](https://velog.io/@gth1123/re-rendering-conditions)  
[Next js how to avoid re-rendering of common components between routed pages?](https://stackoverflow.com/questions/70531347/next-js-how-to-avoid-re-rendering-of-common-components-between-routed-pages)  
[NEXT JS - How to prevent layout get re-mounted?](https://stackoverflow.com/questions/59519286/next-js-how-to-prevent-layout-get-re-mounted)  
[How to prevent parent component from re-rendering with React (next.js) SSR two-pass rendering?](https://stackoverflow.com/questions/58987174/how-to-prevent-parent-component-from-re-rendering-with-react-next-js-ssr-two-p)  
[네?? Component를 memoization해도 리렌더링이 발생한다구요..?? 💦 (feat. context)](https://www.notion.so/Component-memoization-feat-context-a4a73e27d15343e6b518a77c0c9d92b3)
