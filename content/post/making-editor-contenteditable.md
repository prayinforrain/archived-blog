---
title: "마크다운 만들기 - contentEditable"
date: 2022-11-22T20:36:55+09:00
lastmod: 2022-11-22T20:36:55+09:00
draft: false
categories: ["moheyum"]
tags: ["moheyum"]
---

모헤윰의 핵심 기능 중 하나는 `마크다운 서식 지원`입니다. 왜 SNS에 마크다운을 끼얹을 생각을 했나 생각해보면 최초 기획부터 있다가 기능 다이어트를 한 후 살아남았기 때문인데, 아무튼 드디어 때가 왔습니다.

내부적으로 에디터를 외부 라이브러리를 사용하는게 좋지 않겠냐는 이야기가 나왔는데요, 결국 직접 구현해 보기로 했지만 그 과정에서 여러 레퍼런스를 얻을 수 있었습니다. 개인적으로 멋있다고 생각한 사이트 두 가지를 소개합니다.

https://hackmd.io/  
https://ui.toast.com/tui-editor

# 레퍼런스 살펴보기

![Untitled](/image/md_editor_1_01.png)

놀랍게도 우리가 사용하는 에디터 중 `textarea`나 `input` 태그를 사용하는 경우는 거의 없습니다. 기껏해야 깃허브의 에디터가 `textarea`로 되어 있던 기억이 나네요. `textarea`의 가장 큰 문제는 입력 칸 안에 서식을 적용할 수 없다는 점이 되겠습니다. 다시 말해, **syntax highlighting**이 불가능합니다. 제가 아는 한에서는요.

그 문제를 우리는 `div` 태그에 `contenteditable` 속성을 통해 해결할 수 있습니다. `contenteditable`은 `div`를 `textarea`처럼 사용할 수 있게 해주며, 중간에 `span`같은 태그로 부분 스타일 적용이 가능합니다.

> 💡 `contenteditable`을 적용하면 아래와 같은 메시지가 나타납니다.
>
> **A component is `contentEditable` and contains `children` managed by React. It is now your responsibility to guarantee that none of those nodes are unexpectedly modified or duplicated. This is probably not intentional.**
>
> 이는 `contenteditable`이 적용된 태그는 사용자의 입력에 따라 새 element가 늘기도 하고, 다시 줄어들기도 하기 때문에 React 엔진이 관리할 수 없으니 그로 인한 부작용은 너 알아서 해라 라고 말하는 메시지입니다. 이 element를 더 이상 React가 지켜줄 수 없다는 경고인데요, `contenteditable` 속성이 적용된 태그에 `suppressContentEditableWarning` 속성을 같이 달아주면 비활성화됩니다.

# 시작해보자

그럼 이제 간단하게 contenteditable을 만들어 보겠습니다.

```tsx
<div>
  <div>Toolbar</div>
  <div contentEditable>content</div>
  <div>
    <button type="button" onClick={submitHandler}>
      submit
    </button>
  </div>
</div>
```

![Untitled](/image/md_editor_1_02.png)
![Untitled](/image/md_editor_1_03.png)

오.. 잘 됩니다. 왜 될까요?

개발자 도구로 까보니 개행 입력을 할 때마다 `div` 태그가 새로 생성되어 그 안에 내용이 입력되고 있습니다. 이러면 `contenteditable`이 걸린 `div`를 참조하여 `innerText`, `innerHTML`중 한 쪽을 선택해서 가져다가 사용하면 될 것 같습니다.

`contenteditable`이 걸린 `div`에 css로 `display: inline-block;` 속성을 주면 개행이 `br`태그로 나눠진다고 하네요. 지금 저는 syntax highlight 기능까지 욕심을 내고 있기 때문에 부분 스타일 적용이 비교적 편해 보이는 `div`를 선택했습니다.

## ChangeEvent가 없는 Input

여기서 마주친 첫 번째 문제가 있었습니다. 위의 사진에서는 이쁘게 모든 행이 div태그에 감싸져 있었지만, 사실 모든 내용을 지우고 백스페이스를 한 번 더 누르면 첫 줄이 `contenteditable div` 자체의 innerText로 들어갈 수 있습니다. 무슨 소리냐면 아래 사진처럼 되는 것이죠.

![Untitled](/image/md_editor_1_04.png)

이것은 큰 문제입니다. 우선 첫 줄만 저런 형태로 나오면 심리적인 불편함이 있고, 두번째로 나중에 `syntax-highlight`를 구현하게 된다면 첫 줄에 한정된 버그가 쏟아져 나올 위험이 있습니다. 그래서 delete나 백스페이스 입력으로 인해 내용이 없어지면 `<div><br/></div>`로 초기화 되도록 `onChange` 리스너를 추가해야겠습니다. `<br/>`이 포함된 이유는 비어있는 `div` 태그로 초기화하면 입력할 때 그 안으로 입력이 되지 않기 때문입니다.

그런데 문제는, `contenteditable`은 `onChange`이벤트를 지원해주지 않습니다. 정확히는 애초에 `input` 태그가 아니기 때문에, 입력한 값에 대한 이벤트를 처리할 수가 없는 것이죠. 그렇기 때문에 `onKeyUp`, `onKeyDown`같은 Key 이벤트와 `contenteditable` 태그의 `innerHTML`에 접근하는 것으로 우회해서 구현하겠습니다.

```tsx
const handleKeyUp = (e: KeyboardEvent<HTMLDivElement>) => {
  if (!contentRef.current) return;
  const { key } = e;
  if (key === "Backspace" || key === "Delete") {
    if (
      contentRef.current.innerHTML === "" ||
      contentRef.current.innerHTML === "<br>"
    ) {
      contentRef.current.innerHTML = "<div><br/></div>";
    }
  }
  setContent(contentRef.current.innerText.replace(/\n\n/g, "\n"));
};
```

![Untitled](/image/md_editor_1_05.png)

잠깐의 테스트 끝에 문제가 해결되었음을 확인할 수 있었습니다.

## 커서를 찾고 제어하기

이제 다 된걸까요? 때마침 게더타운에 있던 팀원분에게 결과를 공유했더니 `\t` 캐릭터 입력이 안되는 점이 아쉽다는 피드백을 주셨습니다. 음.. 마크다운 문법 자체가 개발자 친화적인 요소인데 탭키를 지원하지 않으면 곤란하니 한번 구현해 보겠습니다. 앞에서 했던 것처럼 `onKeyDown`으로 Tab 키를 가로채서 입력을 해주면 되지 않을까요? ..어? 근데 사용자 커서 위치에 탭키를 넣는 과정을 어떻게 구현할까요?

여기서 `window.getSelection()` 함수를 사용합니다. getSelection은 사용자의 커서가 어디에 있는지를 알려주는 함수인데요, 블록 지정을 했을 때, 단일 위치에 커서가 있을 때 각각 나누어서 위치 정보를 반환해 줍니다.

![Untitled](/image/md_editor_1_06.png)

여기서 사용할 요소는 `anchorOffset`과 `focusOffset`입니다. `type`이 **Caret**일 경우 두 값은 똑같이 현재 커서 위치를 가리키며, `type`이 **Range**인, 즉 사용자가 드래그로 블록 지정을 한 경우에는 `anchorOffset`이 드래그 시작 지점, `focusOffset`이 드래그 종료 지점을 나타냅니다. 이걸 이용해서, 사용자의 커서 위치를 알아내서, 해당 위치의 node의 innerText를 제어하면 되겠습니다. 삽입 후에 `window.getSelection().collapse()`를 이용해 입력된 문자의 바로 뒤로 커서를 옮겨주면 더 좋겠네요!

```tsx
const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
  const { key } = e;
  const cursor = window.getSelection();
  if (!cursor) return;
  if (key === "Tab") {
    e.preventDefault();
    if (cursor.type === "Caret") {
      if (!cursor.anchorNode) return;
      const position = cursor.anchorOffset + 2;
      cursor.anchorNode.textContent = `${cursor.anchorNode?.textContent?.slice(
        0,
        cursor.anchorOffset
      )}\xa0\xa0${cursor.anchorNode?.textContent?.slice(cursor.anchorOffset)}`;
      window.getSelection()?.collapse(cursor.anchorNode, position);
    }
  }
};
```

`\t` 문자를 입력하도록 했더니 탭을 연달아 입력하면 한 번만 입력이 처리되는 문제가 있어 공백 두 칸으로 대체하였습니다.

![Untitled](/image/md_editor_1_07.png)

제대로 작동하는군요. 마음에 듭니다!

## 입력 데이터를 만들자

이제 마크다운을 변환하는 작업을 하는 함수에 사용자가 입력한 결과물을 넘겨주려고 합니다. 앞서 말했던 것처럼 `innerText`를 가져와서 보내면 될 것 같아요. 그런데 문제가 생겼습니다.

![Untitled](/image/md_editor_1_08.png)

위 입력 결과의 innerText는 어떤 모습일까요?

```markdown
첫줄\n\n\n셋째줄\n
```

이런.. `div` 자체가 한 줄로 입력이 되고 둘째줄 안의 `br` 태그가 개행문자를 하나 더 입력하고 있습니다. contenteditable은 빈 줄에 자동으로 `br`을 삽입하므로, 데이터를 넘기기 전에 정규표현식으로 연속된 개행문자를 하나로 합치는 작업을 거치겠습니다.

```tsx
setContent(contentRef.current.innerText.replace(/\n\n/g, "\n"));
```

음, 이제 데이터가 잘 정제되었네요! 이대로 데이터를 넘겨주면 되겠습니다.

# 서식을 어떻게 입힐까요?

![Untitled](/image/md_editor_1_09.png)

정제한 입력값을 가지고, 정규표현식을 이용해 간단하게 `#`을 이용한 헤딩 마크다운을 추가했습니다. 그런데 이렇게 모든 규칙에 대해 코드를 하나씩 집어 넣는 방식이 좋은 방식일까요? `#`을 이용한 헤딩도 있지만 아랫줄에 `-` 또는 `=`를 입력해서 헤딩을 하는 것은 어떻게 구현할까요? 만약 헤딩과 코드블럭 마크다운이 중첩되면 어떻게 처리해야 할까요? 표를 그리는 방법은요?

생각만 해도 벌써 머리가 얼큰해지네요. 흠.. 갑자기 tokenizer, lexer, parser같은 키워드가 막 떠오르는데.. 다시 차분히 공부해 볼 필요가 있겠습니다. 다음 글의 내용이 벌써 짐작이 가는군요. 지금까지 `contenteditable`과 `getSelection()`을 활용한 과정에 대해 이야기해 보았습니다.
