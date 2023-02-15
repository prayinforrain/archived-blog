---
title: "Firebase를 TypeScript에서 사용하기"
date: 2023-02-15T15:17:00+09:00
lastmod: 2023-02-15T15:17:00+09:00
draft: false
categories: ["TypeScript"]
tags: ["Web", "TypeScript", "Firebase"]
thumbnail: "/image/post/2023/02/firebase-with-typescript/01.png"
---

최근에 들어서 Firebase가 필요한 일이 있었다. 대학교에서 써본 경험은 있었는데, 오랜만에 만난 Firebase는 예전같지 않았다. 가장 큰 문제는 Firebase가 제공하는 데이터베이스인 Firestore는 문서를 가져와도 타입을 제대로 정의할 수 없다는 것.

{{< figure src="/image/post/2023/02/firebase-with-typescript/01.png" alt="image" caption="자동완성이 안되는 타입스크립트는.. 그.. 왜..?" >}}

물론 데이터스키마를 따로 정의하지 않기 때문에 Firebase 라이브러리가 `DocumentData` 타입을 개발자에게 맞춰줄 의무는 없지만, 적어도 `React.useState`처럼 제네릭으로 타입을 받아 어느정도 약속해 주기를 바랐다. 아니 바라는게 아니라 되어야 하는 거 아닌가..?

## 붕대 감기

우선 Firebase의 쿼리 실행 결과로 오는 `DocumentData`는 다음과 같이 정의되어 있다.

```typescript
export declare interface DocumentData {
  /** A mapping between a field and its value. */
  [field: string]: any;
}
```

즉, _아무 key-value를 갖는 오브젝트_ 정도로 보면 되겠다. `documentData.asgah`와 같이 아무 속성을 입력해봐도 `any`타입으로 인정해 주고 있다. 이는 NoSQL 데이터베이스인 Firestore의 특성 때문인데, Firestore의 데이터는 정해진 구조가 없기 때문에 타입을 보장하기가 어려운 것이다. 물론 그것을 자체적으로 지원해주면 좋겠지만.. NoSQL DB로서의 특징을 지워버리는 꼴이라 바람직하지 않다고 판단했을까? 사실 타입을 정했을 때 발생 가능한 에러가 너무 많긴 하다.

```typescript
const userDoc = await getDoc(doc(database, `users/${uid}`));
const userInfo = userDoc.data(); // userInfo: any;
```

찾아봤는데, 대부분의 경우에는 아래와 같이 타입 단언을 통해 문서의 타입을 변환할 것을 제시하고 있다.

```typescript
const userDoc = await getDoc(doc(database, `users/${uid}`));
const userInfo = userDoc.data() as UserInfo; // userInfo: UserInfo;
```

이런 식으로 간단히 `DocumentData`를 형변환할 수 있다.  
특히 `getDocs()`나 `query()`를 사용하면 코드가 조금 복잡해지기 때문에 이를 `getFirebaseDocs()`같은 유틸 함수를 구현하여 제네릭을 통해 형변환을 쉽게 할수도 있다.

```typescript
async function getFirebaseDocs<T>(db, path: string): T {
  const snapshot = await getDoc(doc(db, path));
  return snapshot.data() as T;
}
```

## 타입 단언이 옳은가?

하지만 이 상태로는 뭔가 찝찝했다. 타입 단언(Type assertion)은 TypeScript에서 권장하지 않는 수단이기 때문이다.  
타입 단언은 TypeScript가 코드가 100% 작동할 것이라는 보장을 할 수 없게 만든다. 그 책임을 개발자가 가져가는 셈이다. 쉽게 말하면, _'이 객체는 이 타입이야! 내가 보장할테니 그냥 나만 믿어!'_ 하고 TypeScript에게 보장하는 꼴이 된다.  
갑자기 남이 져주던 책임을 내가 지라고 하면 누구든 싫을 것이다. 어쨌든 타입 단언이 일종의 안티패턴처럼 여겨지기도 해서.. 다른 방법을 찾고 싶었다.

## DocumentData를 변환해보자.

사실 Firestore에는 `DocumentData`를 `T` 타입으로 변환해 주는 함수가 존재한다. `FirebaseConverter` 객체는 아래와 같은 구조를 갖는다.

```typescript
interface FirestoreDataConverter<T> {
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DocumentData>,
    options?: SnapshotOptions
  ): T;
  toFirestore(
    modelObject: WithFieldValue<T>,
    options?: SnapshotOptions
  ): DocumentData;
}
```

이런 `FirestoreDataConverter` 객체를 인자로 받아 `withConverter`를 사용하면 된다.

```typescript
const postConverter = {
  toFirestore(post: WithFieldValue<Post>): DocumentData {
    return { title: post.title, author: post.author };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): Post {
    const data = snapshot.data(options)!;
    return new Post(data.title, data.author);
  },
};

const postSnap = await firebase
  .firestore()
  .collection("posts")
  .withConverter(postConverter)
  .doc()
  .get();
const post = postSnap.data(); // typeof post === 'Post'
```

이렇게 하면 지독하게 추상적인 `DocumentData` 대신 `T` 타입을 사용할 수 있다.

### Converter를 제네릭하게 만들 수는 없을까?

여기까지 오니 한 가지 문제가 더 생겼다. 바로 내가 사용하는 모든 콜렉션에 대한 Converter를 일일이 구현해야 한다는 점이다. 이걸 제네릭을 사용해서 구현할 방법은 없을까?  
이 문제에 대한 답을 찾느라 시간을 좀 많이 썼는데, 결론만 말하자면 가능하지만, 그 만큼의 가치가 있는가에 대한 의문이 존재한다.

```typescript
function createEasyConverter<T>(): FirestoreDataConverter<T> {
  return {
    fromFirestore: (docData: DocumentData): T => docData as T,
    toFirestore: (data: T): DocumentData => data,
  };
}

// usage
const postSnap = await firebase
  .firestore()
  .collection("posts")
  .withConverter(createEasyConverter<Post>())
  .doc()
  .get();
const post = postSnap.data(); // typeof post === 'Post'
```

아주 간단하게 제네릭한 Converter를 만들었다. 그런데, 타입 단언이 존재한다. 속상한 일이 아닐 수 없다. `fromFirestore` 메서드를 타입 단언 없이 구현하려면 어떻게 해야할까?

```typescript
// ...
fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): T => {
    const data = snapshot.data();
    const result = {} as T;
    for (const key in data) {
    result[key] = data[key] as T[typeof key];
    }
    return result;
},
// ...
```

... 정말 노력했다. 노력했는데, 더 이상 타입 단언을 떼낼 수가 없다.  
생각해 보니 여태 사용했던 ORM이나 ODM에서도 아무 구조 정의 없이 데이터를 변환해 주지는 않았던 것 같다. 분명 model이든 schema든 하는 파일을 둬서 따로 정의해서 사용하도록 되어 있었다. 생각이 거기까지 미치니 데이터 구조를 클래스로 정의해서 클래스 인스턴스를 생성해 반환하도록 하면 되겠다.. 라는 결론을 얻었는데, 갑자기 의문이 들었다.

### 애초에 이 부분에서 타입 단언을 사용하는 것이 그렇게 문제일까?

공부하기 싫어서 그런게 아니라, 진짜 이런 의문이 들었다.

> Reminder: Because type assertions are removed at compile-time, there is no runtime checking associated with a type assertion. There won’t be an exception or null generated if the type assertion is wrong.  
> _출처: https://www.typescriptlang.org/docs/handbook/2/everyday-types.html_

`(docData: DocumentData): T => docData as T` 로 정의되었던 fromFirestore 함수에서, 만약에 _T_ 타입에 `name` property가 있고 *docData*에는 없다면, 반환되는 객체의 `name`은 *undefined*가 된다. 그리고 뒤의 코드에서 이를 참조하게 되면 오류가 발생할 것이다. 타입 단언의 문제는 이것이다. 코딩하는 단계에서는 TypeScript가 오류로 보지 않았음에도 실제 실행에서 오류를 일으키는 케이스.  
하지만 만약 Firestore에 접근, 제어를 수행하는 프로그램이 이 앱 하나 뿐이고, 앱 자체에서 콜렉션들의 타입을 정의하여 사용한다면 런타임 오류가 발생할까? 오히려 이 규칙만 지켜진다면 타입 단언을 사용하는 것이 더 합리적인 선택이 아닐까?

이 문제에 대한 정답은 상황에 따라 다를 것 같다. 다만 나는 아래와 같은 근거로 타입 단언을 사용하기로 했다.

- 나는 아주 가벼운 규모의 토이 프로젝트에 Firestore를 사용하고 있다.
- 같은 콜렉션 내의 모든 문서의 구조를 통일할 필요가 있다.
- 1인 개발이기 때문에 구조 변경으로 인한 휴먼 에러가 발생할 가능성이 매우 낮다.
- 구조 변경이 일어날 일이 극히 적다. _(이미 대부분 구현을 마친 상태에서 고민하기 시작했다.)_

만약 나와 상황이 다르고, 타입을 보장받아야 할 필요가 있다면, 타입별로 컨버터를 직접 만들어서 util 함수로서 사용하거나, 확장성까지 고려한다면 애초에 문서 구조를 클래스를 이용해 기본값, 필수 여부까지 정의하여 Converter를 자동으로 만들도록 구현하던가, 방법은 여러 가지가 있을 것 같다.  
다만 타입 단언을 사용한다면, 굳이 Converter까지 사용할 필요는 없을 것 같다. 어차피 변환한 결과물 끝에 `as Type`만 붙이면 그만이니 그냥 그렇게 사용하자. 음.. Converter 함수로 가리면 타입 단언을 내 눈에 띄지 않는 곳에 숨겨 죄책감이 덜하다는 장점은 있다.

## Refs.

[What is the best way to define the interface of a document in firestore?](https://stackoverflow.com/questions/65673880/what-is-the-best-way-to-define-the-interface-of-a-document-in-firestore)  
[Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)
[FirestoreDataConverter interface - Firebase JavaScript API](https://firebase.google.com/docs/reference/js/firestore_.firestoredataconverter)
