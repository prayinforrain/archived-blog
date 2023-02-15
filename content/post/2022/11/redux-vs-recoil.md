---
title: "Redux vs Recoil"
date: 2022-11-18T16:42:55+09:00
lastmod: 2022-11-18T16:42:55+09:00
draft: false
categories: ["moheyum", "React"]
tags: ["moheyum", "recoil", "redux"]
---

# 🤷 TL;DR

- Redux는 안정적이지만, 선언과 사용이 복잡하다.
- Recoil은 사용이 매우 쉽지만 정식 버전이 없다.
- 프로젝트 규모에 따라 마음에 드는 라이브러리를 선택하자

# 🚪 서론

우리는 React를 사용할 때 보통 `useState`를 통해 상태를 관리합니다. `useState`는 정말 섹시하지만, 한 가지 너무 큰 단점이 있습니다. 바로 컴포넌트끼리 데이터를 주고받는 데 사용하기가 힘들다는 점입니다. 그 일을 하기 위해 등장한 것이 바로 **상태 관리 라이브러리**입니다. 상태 관리 라이브러리의 필요성에 대해 공감하지 못하는 분들을 위해 짧은 토막글을 마련해 보았습니다.

## ✅ 상태 관리 라이브러리는 왜 사용하나요?

유저가 로그인해 있는 정보를 담은 state가 있다고 가정하면 Root 컴포넌트를 아래와 같이 작성할 수 있습니다.

```jsx
export default function App() {
  const [userInfo, setUserInfo] = useState("not logged in");
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}
```

여기까진 그렇게 어렵지 않네요. 단순히 로그인 페이지에 setState 함수를 빌려줘서 userInfo를 갱신할 수 있게 하면 되니까요.

하지만 로그인 페이지가 여러 컴포넌트로 분리된다면 어떨까요? 이를테면, 로그인 화면에서 내 서비스에 대한 광고 카피와 짧은 영상같은 미디어를 첨부한 **아주** **이쁜** **로그인 페이지**를 만들고 싶습니다. 그럼 관심사 분리를 위해 실제 로그인의 기능을 하는 부분을 별도의 하위 컴포넌트로 분리해야 할 것 같습니다.

```jsx
export default function Login({
  setUserInfo,
}: {
  setUserInfo: React.Dispatch<React.SetStateAction<string>>,
}) {
  return (
    <div>
      <div>우리 서비스 리얼굿 당장바로지금 로그인 끼얏호우~!~!</div>
      <LoginForm setUserInfo={setUserInfo} />
    </div>
  );
}
```

받은 `setUserInfo`를 `LoginForm` 컴포넌트에 한번 더 내려주었습니다. 음.. 아직까지는 참을 만 하네요. 하지만 더 큰 문제가 기다리고 있습니다. 이제 로그인한 정보를 **모든 컴포넌트에서 사용한다고 하면** 어떻게 될까요? 모든 라우터에 대해 루트 컴포넌트가 가진 `userInfo`를 전달해 주겠습니다.

```jsx
export default function App() {
  const [userInfo, setUserInfo] = useState("not logged in");
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />
          <Route path="/service1" element={<Service1 userInfo={userInfo} />} />
          <Route path="/service2" element={<Service2 userInfo={userInfo} />} />
          <Route path="/service3" element={<Service3 userInfo={userInfo} />} />
          <Route path="/service4" element={<Service4 userInfo={userInfo} />} />
          <Route path="/service5" element={<Service5 userInfo={userInfo} />} />
          <Route path="/service6" element={<Service6 userInfo={userInfo} />} />
          <Route path="/service7" element={<Service7 userInfo={userInfo} />} />
          <Route path="/service8" element={<Service8 userInfo={userInfo} />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}
```

라우터니까 이정도 더러움은 괜찮을 것 같다구요? 그렇다면 **여러 컴포넌트에서 필요로 하는 정보가 로그인 정보만이 아니라면**요? **`newInfo`를 불특정 다수의 컴포넌트가 참조한다면**요?

```jsx
export default function App() {
  const [userInfo, setUserInfo] = useState("not logged in");
  const [newInfo, setNewInfo] = useState(0);
  return (
    <React.StrictMode>
      <Router>
        <Routes>
          <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />
          <Route path="/service1" element={<Service1 userInfo={userInfo} />} />
          <Route
            path="/service2"
            element={<Service2 userInfo={userInfo} newInfo={newInfo} />}
          />
          <Route path="/service3" element={<Service3 userInfo={userInfo} />} />
          <Route path="/service4" element={<Service4 userInfo={userInfo} />} />
          <Route
            path="/service5"
            element={<Service5 userInfo={userInfo} newInfo={newInfo} />}
          />
          <Route path="/service6" element={<Service6 userInfo={userInfo} />} />
          <Route
            path="/service7"
            element={<Service7 userInfo={userInfo} newInfo={newInfo} />}
          />
          <Route path="/service8" element={<Service8 userInfo={userInfo} />} />
        </Routes>
      </Router>
    </React.StrictMode>
  );
}
```

아직도 버틸 만 하신가요? 그럼 마지막으로 `**Service3`의 하위 컴포넌트인 `ChildComponent1`에서 변경한 데이터 값을 `Service1`의 하위 컴포넌트인 `ChildComponent2`로 전달해 주려면 어떻게 해야 할까요?\*\*

그래서 우리 팀은 상태 관리 라이브러리를 어떤 것을 사용할지 고민했습니다. 당장 회의에서 거론되었던 라이브러리는 Redux, Recoil, Context API, Mobx 정도가 있는데요, 오늘은 그 중에 Redux와 Recoil에 대해 가볍게 알아보고 비교해 보는 시간을 가졌습니다. 이 글에서는 작동 원리보다는 사용상의 장단점을 중심으로 정리해보겠습니다.

# 🏬 Redux

## Redux에 대해.araboja

![Untitled](/image/redux_vs_recoil_01.png)

Redux는 상태 관리 라이브러리 중에서도 가장 대중적인 친구입니다. 아마 recoil처럼 리액트에 종속적이지도 않고, mobx보다 오래되었기 때문이 아닐까요? 아무튼 npm trends에서 확인할 수 있는 것처럼 압도적인 커뮤니티 크기를 자랑합니다. 레퍼런스가 무척 많고, 음.. 레퍼런스가 무척 많습니다. 한글로 검색해도 당장 이 글을 쓸 이유가 있나 싶을 정도로 지나치게 많은 정리글이 나오네요.

![Untitled](/image/redux_vs_recoil_02.png)

Redux는 Flux 아키텍쳐를 개선한 구조로 상태를 관리합니다. **1) 읽기 전용인 상태를 2) 하나의 store가 3) 순수함수를 이용해 갱신한다**는 세 가지 메인 컨셉이 있다고 하네요. 더 자세한 설명은 [위 사진의 출처 링크](https://labs.tadigital.com/index.php/2020/04/20/getting-started-with-redux/)에 잘 설명이 되어 있습니다.

## 사용해 봅시다

```powershell
npm i redux react-redux @reduxjs/toolkit
```

우선 세 가지 패키지를 설치하겠습니다. `@reduxjs/toolkit` 이라는 패키지는 redux를 조금 더 편하게 사용할 수 있도록 도와주는 도구인데요, 개인적으로 RTK 없이 리덕스를 처음 시작하기가 굉장히 어려웠기 때문에 사용하는 쪽으로 길을 틀었습니다.

```tsx
// count.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CounterState {
  // State의 interface 선언
  value: number;
  amount: number;
}

const initialState: CounterState = {
  // 초기값 선언
  value: 0,
  amount: 1,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    increase: (state) => {
      state.value += state.amount;
    },
    decrease: (state) => {
      state.value -= state.amount;
    },
    init: (state, action: PayloadAction<number>) => {
      // value값을 직접 설정하는 action
      state.value = action.payload;
    },
  },
});

export const { increase, decrease, init } = counterSlice.actions;

export default counterSlice.reducer;
```

전역 상태마다 위와 같이 reducer를 선언해주면 됩니다. 대부분의 경우에는 `init` action처럼 `setState`의 역할을 하는 녀석만 선언해 주면 문제 없이 사용할 수 있을 것으로 보이네요. 그럼에도 여러 개의 action을 선언할 수 있다는 부분은 매력적으로 보입니다. 만약 전역 상태가 Object처럼 복잡한 타입으로 되어 있다면 관리하는 로직을 action에 선언해 두고 재사용하면 되니까요.

> 💡 **ESLint airbnb rule과의 충돌**

createSlice로 리듀서를 만들다 보면 아래 사진과 같이 패러미터로 들어온 state가 가진 값을 조작해선 안된다는 경고 메시지를 마주치게 됩니다. airbnb 룰에 포함되어 있는 규칙인데, [redux-toolkit Issue #521](https://github.com/reduxjs/redux-toolkit/issues/521)에서 이에 대한 설명을 확인할 수 있었습니다. 여기 사람들은 airbnb 룰을 그닥 좋아하지 않는군요!

> ![Untitled](/image/redux_vs_recoil_03.png)
>
> 해당 Rule을 비활성화 하는 것 외에 약간의 예외 처리를 해주는 방법도 있는데요, [이 링크](https://stackoverflow.com/questions/61570021/typescript-and-redux-tool-kit-createslice-assignment-to-property-of-function)를 참고하시면 되겠습니다.

```tsx
// store.ts
import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "./count";

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

만든 reducer들을 관리하는 `store`를 선언합니다. 흔히 알고 계시는 store의 개념과 같으며, 전역 상태가 더 필요할 때 마다 만든 reducer들을 `configureStore` 안에 추가해주면 되겠습니다. 사용할 전역 상태 수만큼 import해서 사용한다는 생각으로 작성하면 될 것 같습니다.

```tsx
// App.tsx
import React, { useState } from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.scss";
import Login from "./Login";
import { store } from "./redux/store";
import Test from "./Test";

export default function App() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <Router>
          <Routes>
            <Route path="/" element={<Test />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </Provider>
    </React.StrictMode>
  );
}
```

이제 만든 store를 `Provider`를 통해 연결해 줍니다. `Router`와 비슷하게 사용할 수 있는데, `Provider`로 묶여 있는 컴포넌트들은 모두 store의 상태들을 참조하고 사용할 수 있게 됩니다. 상태를 사용할 수 있는 scope를 지정하는 느낌으로 이해하면 되겠네요.

```tsx
// Test.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { decrease, increase, init } from './redux/count';
import { RootState } from './redux/store';

export default function Test() {
  const count = useSelector((state: RootState) => state.counter.value);
  const dispatch = useDispatch();
	return (
	...
	<button type="button"
	onClick={() => {
		dispatch(decrease());
	}}
	>-</button>
	...
	);
}
```

실제 사용은 위와 같이 합니다. 참조할 상태는 `useSelector`로, action은 `useDispatch`를 이용해 발생시킵니다. 개인적으로는 action 메소드를 import해왔는데 그걸 바로 사용하지 못하고 `useDispatch`를 통해 사용해야 한다는 점이 조금 이상하게 느껴졌습니다. 또 타입 오류가 있었는데, 이를 위해 `RootState`라는 반환 타입을 선언해서 사용해야 합니다. `store.ts` 코드에 보이는 것처럼 아무데나 사용해도 될 만큼 추상화가 되어있는 타입인데 기본으로 지원해주지 않는 것은 조금 아쉽습니다.

![리덕스.gif](/image/redux_vs_recoil_04.gif)

아주 무쌩긴 컴포넌트를 통해 제대로 작동함을 확인할 수 있었습니다.

## 그래서 Redux 쓰나요?

### 장점

- 레퍼런스가 매우 많습니다.
- 글에는 언급하지 않았지만 Redux Devtools를 통해 디버깅을 지원해 준다고 합니다.
- (Recoil과 비교해서) 안정적이고, 믿을 수 있습니다. 저만 잘 사용한다면요.

### 단점

- reducer, store, type 등등 상태 하나를 추가하기 위한 코드가 정말 깁니다.
- 레퍼런스가 **너무** 많습니다.
- 위의 두 문제점으로 인해 진입장벽이 굉장히 높았습니다.

Redux에 대한 첫 인상은 굉장히 불친절했습니다. 커뮤니티가 큰 것은 좋은데, 진짜 너무 대박 크다보니 레퍼런스들이 서로 반대 방향으로 저를 이끄는 경우가 꽤 많았습니다. 실제로 저도 대학교 프로젝트를 하면서 이런 점 때문에 Redux를 포기하고 props를 마구 내렸다 올렸다 하는 원시적인 방법을 선택하기도 했구요.

그럼에도 불구하고 Redux를 사용할 줄 아는 것은 중요합니다. 커뮤니티가 크니까요. 기회가 될 때마다 상태 관리 라이브러리에 대한 질문을 해 보면, 큰 프로젝트에서는 아직 Redux를 사용하는 경우가 많다는 답변을 듣곤 합니다. 또 주변의 Redux맨들에게 물어보면 몇 번 겪어보면 금방 익숙해진다고 하니, 첫 고비를 넘기고 나면 잘 사용할 수 있지 않을까.. 그런 기대를 해 봅니다.

# 🔋 Recoil

## 리-하(리코일 하이라는 뜻)

이번엔 Recoil을 체험해 볼 차례입니다. Recoil로 말할 것 같으면 리액트를 만든 페이스북이 직접 공개한 상태 관리 라이브러리입니다.

우리 모두가 React가 자바스크립트로 동작한다는 것을 알고 있지만, 리액트와 자바스크립트가 조금 다른 세계처럼 느껴지는 분들이 있을 것입니다. 이를테면, React를 위해 만들어진 패키지는 React에서 사용하고, VanilaJS를 위해 만들어진 패키지는 VanilaJS에서밖에 쓸 수 없는 것처럼 생각하는 분들이 있죠.

![Untitled](/image/redux_vs_recoil_05.png)

이런 거리감때문에 많은 라이브러리에서 직접 **‘React스러운’** 방식으로 사용할 수 있도록 지원하기도 합니다. 위 사진은 저번 프로젝트에서 사용했던 캔버스 라이브러리 `konva`의 리액트 버전, `react-konva` 코드 일부입니다.

제가 이 이야기를 왜 하는 것일까요? `Recoil`은, 오직 **React만을 위해 만들어진 React 상태 관리 라이브러리**이기 때문입니다. 이 점을 가장 큰 특징으로 말씀드릴 수 있겠네요. 그 외에도 atom 구조를 통해서 상태를 관리 어쩌구.. 하는 작동 방식에 대한 내용이 있습니다. 이 글에서 하지 않기로 한 이야기네요.

## 사용해 봅시다

```tsx
npm i recoil
```

설치해 줍니다. redux와 비교했을 때 별다른 설치를 요구하지 않긴 한데, 흠.. 별 생각은 들지 않습니다.

```tsx
// atom.ts
import { atom } from "recoil";

const counterState = atom({
  key: "count",
  default: 0,
});

export default counterState;
```

redux의 reducer와 비슷한 역할을 하는 `atom`을 선언해 줍니다. reducer는 초기 값과 action까지 모두 정의했지만, `atom`은 `key`와 `default value`만 지정해서 export해주면 됩니다.

```tsx
// App.tsx
...
export default function App() {
  return (
    <React.StrictMode>
      <RecoilRoot>
        <Router>
          <Routes>
            <Route path="/" element={<Test />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </RecoilRoot>
    </React.StrictMode>
  );
}
```

redux의 Provider처럼 역시 `RecoilRoot`를 통해 atom을 사용할 영역을 묶어 줍니다. 별다른 store를 지정하지 않도록 되어 있는데, 각각의 `RecoilRoot`는 모든 atom을 사용할 수 있는 모양입니다. 하지만 여러 `RecoilRoot`는 서로 atom 값을 공유하지 않기 때문에, 여러 개를 사용하는 경우 해당 컴포넌트가 어느 영역에 있는지를 잘 체크할 필요가 있겠네요. 꼭 멀티버스..같습니다.

```tsx
// TestRecoil.tsx
import React from 'react';
import { useRecoilState } from 'recoil';
import counterState from './recoil/atom';

export default function Test() {
  const [count, setCount] = useRecoilState(counterState);
	return (
	...
	<button type="button"
	onClick={() => {
		setCount(count - 1);
	}}
	>-</button>
	...
	);
}
```

Recoil은 `useState` 훅과 같은 사용법을 갖습니다. import만 잘 해줬다면, `useRecoilState`를 통해 atom을 사용하겠다 선언하고 바로 사용할 수 있습니다. Recoil의 강점이 드러나는 부분이네요. 참조만 하는 경우에는 `useRecoilValue`, 할당만 하는 경우에는 `useSetRecoilState` 를 통해 한 쪽만 사용할 수도 있습니다.

![리코일.gif](/image/redux_vs_recoil_06.gif)

결과물은 Redux와 똑같이 동작합니다.

## 그래서 Recoil 쓰나요?

### 장점

- React스러움
- atom의 선언이 간단하다

### 단점

- 아직 실험적 기능(experimental feature)이다
- 메모리 누수 문제
- React에 종속적이다.

그렇습니다. 요약만 봐도 느껴지지만 Recoil은 그렇게 **안정적인 라이브러리가 아닙니다.** 우선 레포지토리 자체가 facebookexperimental에 있고, [issue에 검색](https://github.com/facebookexperimental/Recoil/issues?q=is%3Aissue+is%3Aopen+memory)해보면 메모리 누수에 대한 레포트가 꽤 많습니다. 이런 문제 때문에 Recoil은 아직까지도 ‘리액트스럽다’는 압도적인 강점을 가지고도 그렇게 좋은 성적을 내지 못하고 있습니다. 실제 서비스를 구현하는데 ‘실험적 기능’에 상태 관리를 믿고 맡길 수 있을까요? React를 위한 라이브러리이다 보니 React 생태계에서 벗어난다면 또 다른 라이브러리를 공부해야 한다는 점도 문제가 될 것 같네요. 메모리 누수 문제에 대해 더 자세히 알고 싶으시면 [이 링크](https://medium.com/@altoo/recoil%EC%9D%98-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EB%88%84%EC%88%98-%EB%AC%B8%EC%A0%9C-fb709973acf2)를 참고하세요.

하지만 Recoil은 분명 매력적입니다. 특히 React를 통해 구현한다면 Recoil의 매력을 뿌리치기란 쉽지 않습니다. 왜냐면 Recoil은 **React스러우니까요.** useState를 쓰는 것과 완전 똑같이 전역 상태를 관리한다니, 이 특성 하나만으로도 선택할 이유는 충분해 보입니다.

# ❓ 그래서 뭐 쓰나요?

![Untitled](/image/redux_vs_recoil_07.png)

Redux와 Recoil에 대해 알아봤습니다. 사실 우리 프로젝트에 적용할 라이브러리를 선택하기 위해 공부했는데, 공부하고 나니 더 복잡해지네요. 하지만 어느 한 쪽이 ‘좋다’고 결론지을 수 있는 문제는 아니고 팥붕을 먹을지 슈붕을 먹을지, 그 날의 기분에 따라 달라지는 그런 선택일 것 같습니다. 참고로 저는 팥을 싫어합니다.

앞으로의 프로젝트에서 제가 라이브러리를 고른다면 어떤 기준으로 정할 수 있을까요? 저는 프로젝트의 규모를 기준으로 결정할 것 같습니다. 사실 Redux는 안정적이지만 토이 프로젝트에 적용하기에는 너무 많은 밑작업을 필요로 하거든요. 반면 커다란 프로젝트를 해야 한다면 Redux를 사용해야 할 날이 올 수도 있겠죠. 덧붙이자면 컴퍼니데이 때 어떤 기업에서는 Redux와 Recoil을 함께 사용한다는 답변을 주시기도 했습니다.

# 📖 Refs.

[TypeScript and redux tool kit , createSlice: Assignment to property of function parameter 'state'](https://stackoverflow.com/questions/61570021/typescript-and-redux-tool-kit-createslice-assignment-to-property-of-function)  
[Getting Started with Redux](https://labs.tadigital.com/index.php/2020/04/20/getting-started-with-redux/)  
[매개변수 재할당을 지양하자(no-param-reassign)](https://mong-blog.tistory.com/entry/%EB%A7%A4%EA%B0%9C%EB%B3%80%EC%88%98-%EC%9E%AC%ED%95%A0%EB%8B%B9%EC%9D%84-%EC%A7%80%EC%96%91%ED%95%98%EC%9E%90no-param-reassign)  
[Redux Toolkit with Typescript: How to Get Started](https://bluelight.co/blog/redux-toolkit-with-typescript)  
[RecoilRoot | Recoil](https://recoiljs.org/docs/api-reference/core/RecoilRoot/)  
[React스러운 상태관리 라이브러리, Recoil을 알아보자](https://leego.tistory.com/entry/React-%EC%83%81%ED%83%9C%EA%B4%80%EB%A6%AC%EC%9D%98-%EB%AF%B8%EB%9E%98-Recoil%EC%9D%84-%EC%95%8C%EC%95%84%EB%B3%B4%EC%9E%90)  
[Recoil의 메모리 누수 문제](https://medium.com/@altoo/recoil%EC%9D%98-%EB%A9%94%EB%AA%A8%EB%A6%AC-%EB%88%84%EC%88%98-%EB%AC%B8%EC%A0%9C-fb709973acf2)  
그리고 부스트캠프 컨퍼런스를 통해 Recoil에 대해 설명해 주신 **J039 김성은** 캠퍼님께 감사의 인사를 올립니다. 🙇
