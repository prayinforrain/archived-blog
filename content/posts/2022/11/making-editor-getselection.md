---
title: "마크다운 만들기 - getSelection [2/3]"
date: 2022-11-24T00:53:55+09:00
lastmod: 2022-11-24T00:53:55+09:00
draft: false
categories: ["moheyum"]
tags: ["moheyum"]
---

**모헤윰**의 에디터 만들기 시리즈 모아보기  
[에디터 만들기 - ContentEditable [1/3]]({{<ref "posts/2022/11/making-editor-contenteditable">}})  
[에디터 만들기 - getSelection [2/3]]({{<ref "posts/2022/11/making-editor-getselection">}})  
[에디터 만들기 - Markdown [3/3]]({{<ref "posts/2022/12/making-editor-markdown">}})

---

아니???????? 두 번째 글이 파서가 아니였네요. 저는 사실 이 글이 2부작이길 간절히 바랬는데, 1편에서 만든 에디터에 너무 끔찍한 버그가 있어서 이에 대해 정리해 보고자 합니다. 이걸로 3시간을 씨름하고 있었지만 모헤윰의 TIL 문서가 풍성해지고 있으니 긍정적이게 생각해야겠죠?

> 💡 이 글은 Window 10, Chrome 107.0.5304.107 버전을 기준으로 작성되었습니다. 일부 환경에 따라 다르게 작동하는 부분이 있을 수 있습니다.

## 😢 첫 단추가 중요하다

![Untitled](/archived-blog/images/posts/2022/11/making-editor-getselection/md_editor_2_01.png)

지금 만든 `contenteditable div`는 치명적 문제가 있습니다. `contenteditable`이 사진처럼 첫 줄의 텍스트를 div 태그로 감싸주지 않는다고 언급한 문제가 기억 나시나요? 사실 저는 처음 글에서 첫 줄 문제가 해결된 척 이야기한 바 있죠. 특정 상황에서는 여전히 `contenteditable div`에 직접 텍스트를 입력할 수 있었지만, 솔직하게 그 때는 어차피 syntax highlighting을 지원하지 않을 거라 생각해 쉬쉬하기로 했습니다. 그런데 아니나 다를까, 붙여넣기에서 문제가 발생했습니다.

![Untitled](/archived-blog/images/posts/2022/11/making-editor-getselection/md_editor_2_02.png)

아무 입력도 되어 있지 않은 `contenteditable div`에 붙여넣기를 하면 위와 같은 오류가 납니다. 이 상태에서 다시 붙여넣기를 하면 그 때부턴 정상적으로 작동하는데, 어차피 이런 에러 쯤이야 콘솔을 열어놓고 웹서핑을 하는 개발자가 아니고서야 무시할 수 있는 수준이니 넘어갈 수 있겠지만, 결정적으로 붙여넣기 후 **커서가 붙여넣기 한 글귀의 끝으로 이동하지 않았습니다**. 아니나 다를까 탭 키에 대해서 구현했던 코드도 같은 오류가 있네요.

오늘은 이 오류의 원인과 해결 과정에 대해 기록하는 글을 써 보겠습니다.

## 🖱️ windows.getSelection()

### contenteditable의 문제

저번 글에서 공부했던 바와 같이, `contenteditable div`는 일반적인 입력 동작이 제대로 이루어지지 않습니다. 착한 사용자가 차분히 글을 입력한다고 해도 첫 줄만 `div` 태그로 감싸주지 않는다거나, 붙여넣기를 하면 대뜸 원본의 서식이 그대로 적용된 글귀가 입력되기도 합니다.

![Untitled](/archived-blog/images/posts/2022/11/making-editor-getselection/md_editor_2_03.png)

대충 이런 느낌이죠. 그 외에도 수정을 어떻게 하느냐에 따라 결과물이 묘하게 달라지기도 하는 등, 너무나 다양한 문제가 산재해 있습니다. 서론이 너무 길었네요. 그냥 `con..어쩌구`에 대해 처음 글을 쓸 때 이런 문제들이 있다고 설명할 걸 그랬어요.

아무튼 이런 불쾌한 동작들을 해결하기 위해, `keydown`, `keyup`, `paste` 등 다양한 이벤트 리스너를 바인딩해서 직접 이런 제스쳐를 구현해야만 했습니다. 그 과정에서 소개했던 것이 바로 `windows.getSelection()`이였죠.

![Untitled](/archived-blog/images/posts/2022/11/making-editor-getselection/md_editor_2_04.png)

### type Selection

우선 이 녀석이 제공해주는 `Selection` 타입 객체의 property를 보겠습니다.

| 이름         | 설명                                                       |
| ------------ | ---------------------------------------------------------- |
| anchorNode   | 선택이 시작된 지점(=드래그 시작 지점)의 노드를 참조합니다. |
| anchorOffset | 선택이 시작된 지점의 anchorNode상에서의 위치를 나타냅니다. |
| focusNode    | 선택이 끝난 지점(=드래그 종료 지점)의 노드를 참조합니다.   |
| focusOffset  | 선택이 끝난 지점의 focusNode상에서의 위치를 나타냅니다.    |
| type         | 블록 지정시 Range, 단일 커서는 Caret을 갖습니다.           |

큰 의미 없거나 정식 스펙이 아닌 경우는 제외하고 이 정도를 알고 있으면 되겠습니다. 드래그 시작과 종료 지점을 명시한 이유는 저번 글에서 언급했던 것처럼 드래그에는 방향이 있기 때문이죠. Caret의 경우에는 항상 두 프로퍼티가 같은 값을 가질 것입니다.

`Selection` 타입은 제공하는 method도 있습니다. 한번 알아보겠습니다.

| 이름                                    | 설명                                                                                                                            |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| getRangeAt(index)                       | 현재 선택된 index번째 Range 범위를 반환합니다. 다중 선택이 지원되는 브라우저가 아닌 경우 보통 index는 0이 최대입니다.           |
| addRange(range)                         | 현재 선택된 Range에 더해 range를 함께 선택합니다. 다중 선택이 지원되는 브라우저가 아닌 경우 range만이 재선택됩니다.             |
| collapse(node, offset?)                 | node의 offset 위치를 선택합니다.                                                                                                |
| containsNode(node, partialContainment?) | node가 선택 Range 안에 포함되는지 여부를 반환합니다. partialContainment가 true인 경우 일부만 포함되어 있어도 true를 반환합니다. |

훨씬 종류가 많지만 쓰이지 않을 것 같아 길게 적지 않았습니다. 그 외에 `Selection` 타입 객체는 각 프로퍼티에 대해 얕은 참조를 제공하기 때문에 같은 이름으로 참조해도 참조 시점에 따라 값이 변할 수 있다는 특성이 있겠네요. 여기서 제가 사용했던 메소드는 `collapse`였습니다. 대충 `getSelection()`으로 받은 `anchorNode`를 그대로 사용하고, `anchorOffset + 추가한 문자열 길이`로 위치를 잡는 식이죠.

### anchorNode는 node다

그런데 이 `anchorOffset`은 상황에 따라 다르게 사용해야 합니다. 이게 무슨 소리냐면, 이 녀석을 1로 지정하면 커서가 끝으로 갈 때가 있고, 두 번째 글자로 커서가 이동할 때가 있다는 말이죠.

![복사맨2.gif](/archived-blog/images/posts/2022/11/making-editor-getselection/md_editor_2_05.gif)

두 번째 글자로 커서가 가는건 이해가 가는데, 처음엔 왜 끝으로 갔던 걸까요? 그 비밀은 `getSelection`이 참조하던 `anchorNode`에 있습니다. **첫 번째 붙여넣기와 그 이후의 붙여넣기의 anchorNode가 다르기 때문**이죠. 첫 번째 붙여넣기는 `contenteditable div`를, 그 이후에는 해당 라인의 div..도 아니라 `그 div의 **텍스트 노드**`를 참조하고 있습니다.

#### 텍스트 노드를 아시나요?

위에 제가 `console.log`를 찍어본 사진에는 `anchorNode`에 `text`라고 쓰여 있었습니다. 저는 `contenteditable div`의 자식 `div`중 하나를 선택하고 있었는데 말이죠. 즉 `getSelection`은 선택중인 텍스트 노드까지 따져서 참조한다는 특징을 알 수 있습니다. 텍스트 노드라.. 딱히 어느 태그에 포함되어 있지 않으면서 애매하게 텍스트만 들어있는 바로 그 `innerText`를 텍스트 노드라고 부르는 모양입니다.

![Untitled](/archived-blog/images/posts/2022/11/making-editor-getselection/md_editor_2_06.png)

바로 요 녀석인데요, 텍스트 노드는 다른 노드와 다르게 조금 특이한 성질을 갖습니다. 다르다고 하나, 아무튼 Node 인터페이스를 상속하지만 HTML Element는 아니기 때문에 다루기가 굉장히 까다롭습니다.

- innerText가 비어있는, 즉 `‘’`인 Element는 텍스트 노드가 없습니다.
- 부모의 `childNodes`같은 프로퍼티로 접근할 수 있지만, 고정된 인덱스에 있지는 않습니다.
  - 즉 다른 형제 노드와의 순서에 따라 인덱스가 변합니다..

다시 돌아와서 `collapse`에 제공한 `offset`이 어째서 텍스트 상의 위치를 가리키지 않았느냐, 노드상에서의 **offset은 텍스트 노드를 제외하고는 자식 노드의 인덱스를 가리키기 때문**이죠. 즉 아래 과정과 같습니다.

첫 번째 복사했을 때에는 `anchorNode`가 `contenteditable div`였기 때문에, `offset = 1`에 해당하는 위치는 아래와 같습니다.

```tsx
<div contenteditable>
	<textNode>복사한 글귀입니다</textNode>
	<!-- 여기! -->
</div>
```

이렇게 커서를 이동시키고 나면, `div` 태그 안의 입력은 모두 텍스트 노드 안으로 들어가게 되므로 커서는 텍스트 노드가 끝나기 직전 위치로 자동으로 보정되게 됩니다. 표현하자면 아래처럼 되겠군요.

```tsx
<div contenteditable>
	<textNode>
		복사한 글귀입니다
		<!-- 여기! -->
	</textNode>
</div>
```

이 상태에서 한번 더 붙여넣기를 한다면 끝에 자연스럽게 붙여넣기가 되지만, 이번에 참조하는 `anchorNode`는 텍스트노드로 변경되어 offset이 가리키는 위치는 처음 원했던 바로 그 텍스트에서의 위치가 됩니다. 두 번째 붙여넣기를 완료한 후의 커서 상태는 아래와 같이 됩니다.

```tsx
<div contenteditable>
	<textNode>
		복<!-- 여기! -->사한 글귀입니다복사한 글귀입니다
	</textNode>
</div>
```

정말 끔찍하군요. offset이 노드의 타입에 따라 다르게 적용된다니! 아니 그 이전에 왜 `anchorNode`는 처음부터 텍스트노드를 잡아 주지 않는거죠?

### Node.nodeType

다행히 이 문제를 바로잡을 방법이 있었습니다. 바로 Node 인터페이스가 제공하는 `nodeType`인데요, 이 녀석이 1이면 Element, 3이면 Text 노드라고 하네요. 그 말인 즉 `anchorNode`가 1이거나 3일 때 다른 한 쪽으로 변환해서 통일해주면 되는데.. 앞에서 언급했듯 텍스트 노드는 참조하는 것 자체가 여간 어려운 일이 아닙니다. 그래서 제가 해결한 방법은 `nodeType`에 따라 offset을 다르게 사용하는 것입니다.

```tsx
const position = anchorNode.nodeType === 3 ? anchorOffset + data.length : 1;
window.getSelection()?.collapse(anchorNode, position);
```

텍스트 노드이면 정상적으로 길이를 더해서 끝자리를 잡아주고, 엘리먼트이면 1의 offset을 대입합니다. 이게 가능한 이유는 이 문제가 발생하는 케이스가 빈 칸에 최초 입력 시에만 발생하기 때문인데, 새로운 케이스가 발견되면 저 1을 무척 피곤하고 귀찮은 변수로 바꿔 주어야 겠네요.

## 🤦 오버엔지니어링의 길목에서

![고쳤맨.gif](/archived-blog/images/posts/2022/11/making-editor-getselection/md_editor_2_07.gif)

처음에는 아주 간단한 에디터를 생각했는데, 그 _간단한_ 에디터 뒤에 얼마나 깊은 심연이 있는지 몸소 두들겨 맞게 되는 요즘입니다. `input`이나 `textarea`를 썼으면 이런 긴 글을 두 개나 쓸 필요가 없었을텐데, 제가 무슨 부귀영화를 누리자고 `contenteditable`을 쓰자고 했을까요?

그럼에도 불구하고 새로운 경험을 하고 글을 쓸 수 있어서 정말 즐겁습니다. 데모 발표 시간에도 제가 즐거워해야 할텐데요, 다음 글은 드디어 마크다운을 파싱하는 과정에 대해 써볼 예정입니다. 지금 어느 난관에 부딪혀 멈춰 있는데, 여유가 된다면 아마 6주차에 리팩토링을 할 것 같네요. 화이팅!
