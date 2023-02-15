---
title: "Typescript Generic"
date: 2023-02-01T02:01:15+09:00
lastmod: 2023-02-01T02:01:15+09:00
draft: false
categories: ["Web", "TypeScript"]
tags: ["Web", "TypeScript", "Generic"]
---

타입스크립트와 리액트를 같이 사용할 때, 우리는 `useState` 훅을 아래와 같이 사용합니다.

```typescript
const [name, setName] = useState<string>("지상렬");
```

뭔진 몰라도, 저 꺽쇠 괄호를 사용해서 state가 다룰 상태의 타입을 지정할 수가 있습니다. 사실 적지 않아도 알아서 추론해 주지만, 아무튼 `name.split('')`처럼 string 타입이 제공하는 메소드나 프로퍼티도 자동완성해주고, 아주 편하게 사용할 수 있습니다. 오늘은 저 꺽쇠괄호에 대해 알아볼거에요.

# any 타입의 문제

아무튼 이번에 가져온 예제는 스택(Stack) 자료구조입니다. 그냥 대충 만들게요.

```typescript
class Stack {
  arr: any[] = [];
  push(element: any) {
    this.arr.push(element);
    return this.arr.length;
  }
  pop() {
    return this.arr.pop();
  }
}
```

```typescript
const stringStack = new Stack();
stringStack.push("크와앙");
console.log(stringStack.pop().slice());

const numberStack = new Stack();
numberStack.push(0);
console.log(numberStack.pop().slice()); // TypeError: numberStack.pop(...).slice is not a function
```

당연히 `numberStack` 부분에서 에러가 나지만, 이 문제를 **코드를 실행하기 전까진 알 수 없습니다**. `Stack`이 관리하는 것은 `any` 타입의 배열이니까요.

또 지금의 `Stack`에서는 배열에 들어가는 원소의 타입에 상관 없이 해당 **타입에 대한 메소드의 자동완성을 전혀 지원해주지 못합니다.** 왜냐하면 스택의 원소들은 `any` 타입이기 때문이죠.

이 문제들을 해결하기 위해 `numberStack`이 관리하는 값을 `number[]`처럼 타입을 지정해주면 되겠지만, 그럼 `stringStack`을 사용하기 위해 `string[]` 타입의 `Stack`을 별도로 선언해야만 합니다. 그냥 `useState`처럼 `any`여도 알아서 타입을 추론해 주면 안되는 걸까요? 알잘딱깔센 해주면 되잖아요.

위의 문제들은 `any` 타입의 사용을 지양해야 하는 이유이기도 한데요, 이를 해결하기 위해 타입스크립트에서는 **제네릭(Generic)**의 개념을 지원합니다.

# 제네릭이란?

제네릭은 다른 프로그래밍 언어(자바, C# 등)에서 사용되는 개념입니다. 자바를 위한 튜토리얼이긴 하지만, **TCPSchool**에 개념 설명이 잘 되어 있어 가져왔습니다.

> 자바에서 제네릭(generic)이란 데이터의 타입(data type)을 일반화한다(generalize)는 것을 의미합니다.
>
> 제네릭은 클래스나 메소드에서 사용할 내부 데이터 타입을 컴파일 시에 미리 지정하는 방법입니다.
>
> 이렇게 컴파일 시에 미리 타입 검사(type check)를 수행하면 다음과 같은 장점을 가집니다.
>
> 1. 클래스나 메소드 내부에서 사용되는 객체의 타입 안정성을 높일 수 있습니다.
> 2. 반환값에 대한 타입 변환 및 타입 검사에 들어가는 노력을 줄일 수 있습니다.
>
> _Java - 제네릭의 개념, TCPSchool.com_

즉 제네릭은 우리가 여러 타입에 활용할 수 있는 함수나 클래스를 사용할 때 ‘_이번에는 이런 타입을 사용할거야_’라고 알려줄 수 있는 수단인 셈입니다. 그리고 맨 앞에서 들었던 `useState` 예시에 나온 꺽쇠가 바로 제네릭입니다.

## 사용해 보자

제네릭은 다음과 같은 형태로 사용합니다.

```typescript
function 대충_함수이름<T>(arg: T) {
  // ...
}
대충_함수이름<string>("아잉"); // T = string
```

제네릭에 사용되는 타입명인 T는 아무 문자열로 대체 가능합니다. 한글로도 되고, 대소문자 상관 없지만 보통 `T`로 시작해서 알파벳 순으로 `U, V…`로 사용하는 것이 관행이에요. 이렇게 되면 새로운 타입의 인자를 사용할 때 마다 같은 함수를 다시 선언해야 할 필요도 없고, IDE의 자동완성 기능도 아주 잘 작동할 것입니다.

그럼 이를 이용해 앞서 만들었던 스택 클래스를 개선해 보겠습니다.

```typescript
class Stack<T> {
  arr: T[] = [];

  push(element: T) {
    this.arr.push(element);
    return this.arr.length;
  }
  pop() {
    return this.arr.pop();
  }
}

const stringStack = new Stack<string>();
stringStack.push("크와앙");
console.log(stringStack.pop()?.slice());
const numberStack = new Stack<number>();
numberStack.push(0);
console.log(numberStack.pop()?.slice()); // Property 'slice' does not exist on type 'number'.
```

제대로 자동완성도 지원하고, `numberStack`의 `slice` 역시 실행 전에 오류를 표시해 줍니다. 또 `Array.pop()` 함수가 `undefined`를 반환할 수 있기 때문에 오류를 뱉어 옵셔널 체이닝을 붙여 주었습니다. 이제 런타임에서 오류가 발생할 일은 없겠네요.

<aside>

💡 **useState는 왜 제네릭으로 타입을 명시하지 않아도 추론이 될까요?**  
useState는 `useState('하이룽');`처럼 타입을 명시하지 않아도 알아서 상태의 타입을 인식합니다. 그런데 방금 만든 스택 클래스는 제네릭으로 타입을 명시하지 않으면 에러를 뱉습니다. 둘의 차이는 무엇일까요?  
바로 **호출할 때 제네릭 `T`를 추론할 수 있냐의 차이**가 있습니다. `useState`를 호출할 때에는 상태의 초기값에 따라 상태의 타입을 추론합니다. 우리가 만든 스택 클래스 역시 생성자 함수를 통해 초기값을 입력받으면 똑같이 타입 명시 없어도 추론이 가능합니다.  
반대로 `useState`도 `useState()`와 같이 초기값을 호출 시 지정해주지 않으면 undefined 타입으로 인식하여 추론이 제대로 이뤄지지 않습니다.

</aside>

## 더 써 보자

제네릭은 이게 끝일까요? 다음 사례를 통해 더 고민해봅시다.

`string`과 `Array`는 `length` 공통적으로 프로퍼티를 갖습니다. 이렇게 타입은 다르지만 length 프로퍼티를 갖는 타입만을 인자로 받고 싶을 때는 어떻게 해야 할까요? 이를 위해서는 제네릭과 함께 `extends` 구문을 사용해야 합니다.

```typescript
interface hasLength {
  length: number;
}

function getLength<T extends hasLength>(stringOrArray: T) {
  return stringOrArray.length;
}

console.log(getLength([1, 2]));
console.log(getLength("12"));
console.log(getLength(1)); // Argument of type 'number' is not assignable to parameter of type 'hasLength'.
```

이런 식으로 함수를 구성하면 제네릭 타입 `T`는 `hasLength`의 특성을 갖는 타입만이 인자로 통과될 수 있습니다.

## 더… 더 써보자

조금 더 깊이 들어가 보겠습니다. length 프로퍼티를 갖는 타입의 **스택에서 마지막 요소의 길이**를 반환하는 함수를 만들어 보겠습니다.

```typescript
function getLengthOfLastElement<T extends Stack<U>, U extends hasLength>(
  stack: T
) {
  const element = stack.pop();
  if (!element) return;
  stack.push(element);
  return element.length;
}

const stringStack = new Stack<string>();
stringStack.push("크와앙");
getLengthOfLastElement(stringStack); // 3

const numberStack = new Stack<number>();
numberStack.push(1);
getLengthOfLastElement(numberStack); // TypeError
```

위와 같이 제네릭을 이용해 선언된 타입이 사용하는 제네릭 타입을 다시 참조하는 것이 가능합니다.

# Refs.

[코딩교육 티씨피스쿨](http://www.tcpschool.com/java/java_generic_concept)  
[제네릭 클래스 및 메서드](https://learn.microsoft.com/ko-kr/dotnet/csharp/fundamentals/types/generics)  
[Documentation - Generics](https://www.typescriptlang.org/ko/docs/handbook/2/generics.html)  
[제네릭 | 타입스크립트 핸드북](https://joshua1988.github.io/ts/guide/generics.html)
