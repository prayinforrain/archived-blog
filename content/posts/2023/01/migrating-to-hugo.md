---
title: "Hugo로 블로그를 옮기자"
date: 2023-01-30T19:17:55+09:00
lastmod: 2023-01-30T19:17:55+09:00
draft: false
categories: ["life"]
tags: ["hugo", "blog"]
---

알음알음 티스푼 공사로 티스토리에서 이 곳으로 블로그를 옮겼습니다. 티스토리에 있던 컨텐츠 대부분은 옮기지 않았습니다. 별 의미도 없고 너무 사적인 내용이 많았기 때문입니다. 또 티스토리만의 감성이라고 해야 하나.. 약간 그 곳에 더 맞는 포인트들이 있어서 아카이브같은 느낌으로 그냥 티스토리에 두기로 했습니다. 곳곳에 티스토리 링크가 있으니 시간을 효율적으로 버리고 싶은 분이 있다면 읽어주셔도 감사할 것 같습니다.
아무튼 옮겨야 하는 컨텐츠도 없으면서 정말 오랜 기간 삽질을 했는데, 그 과정에 대해 이야기해보려고 합니다.

## 블로그를 이전하게 된 계기

{{< figure src="/archived-blog/images/posts/2023/01/migrating-to-hugo/01.png" alt="image" caption="아직도 저 Main Page라는 글자의 의미를 모르겠습니다.." >}}
사실 저는 티스토리를 무척 잘 쓰고 있었습니다. 적당한 커스터마이징이 되면서, 어릴 때 사용하던 네이버 블로그와 거의 유사하고, 각종 분석 기능까지 알아서 제공해 주었기 때문이죠. 그런데 부스트캠프를 겪으면서 많은 것들이 달라졌습니다. 가장 큰 문제는 **마크다운**이었습니다.

사실 처음 부스트캠프를 시작할 때 각종 문서를 마크다운으로 작성해야 하는 상황이었어서 자바스크립트보다도 마크다운을 먼저 배워야 했습니다. 개인적으로는 마크다운의 첫 인상이 너무 투박하고 별로였는데.. 반년동안 지독하게 엮이고 `hackmd`나 `Notion`같은 툴에 익숙해 지면서 마크다운과 사랑에 빠지기 시작했습니다. 생각해 보니 노션도 정말 별로였는데 지금은 용케 잘 쓰고 있네요.
{{< figure src="/archived-blog/images/posts/2023/01/migrating-to-hugo/02.png" alt="image" caption="결국 제 부스트캠프는 마크다운에서 시작해서 마크다운으로 끝났습니다." >}}
하다하다 저는 마지막 팀 프로젝트 주제를 마크다운 에디터로 잡기에 이릅니다. 이유는 적당히 어려웠고, 적당히 도전적이었고, GitHub PR과 노션을 활용하면서 마크다운 뽕(?)에 취해 있었기 때문입니다. 하다 보니, 대충 써도 일관성 있는 서식으로 가독성을 보장해 주는 점도 너무 마음에 들었습니다.

여기까지 오니 문제가 있었습니다. 제가 학습정리를 위해 활용하던 노션은 마크다운 기반이었고, 그 외에 다른 툴들도 마크다운에 반쯤 걸쳐 있었는데, 네이버, 다음을 필두로 하는 한국형 블로그들은 그렇지 않았습니다. [노션으로 작성했던 TIL 문서를 티스토리로 옮기는 시도](https://prayinforrain.tistory.com/68)를 해 보았지만 초안 작성과 비슷한 만큼의 시간이 걸렸습니다. 티스토리에서도 마크다운 에디터를 지원하고 있었지만 티스토리 스스로가 일부 지원하지 않는 기능이 있음을 경고하고 있어서 마음에 들지 않았습니다. 아마 기본 에디터와의 변환이 원활하지 않음을 의미하는 문구겠지만, 그 외에도 마크다운으로 작성한 글을 미리보기 하는 과정이 너무 번거로운 문제도 있었습니다.

## Why Hugo?

그렇게 저는 주변 사람들에게 블로그 옮긴다~ 옮긴다 노래를 부르다가 결국 새해가 되어서야 이주를 준비합니다. `velog`나 `medium`같은 선택지도 있었지만 저는 기왕 하는 거 깃허브 페이지를 사용해 보자는 생각을 했습니다. 왜냐면 `prayinforrain.github.io`라는 URL이 너무 멋있었기 때문입니다. 아무튼 이를 위해 Javascript, API, Markup의 요소를 이루는 `Jamstack`이라는 패턴에 대해서 배웠고, 대충 알아보니 Jamstack 사이트 생성기의 [순위를 제공하는 사이트](https://jamstack.org/generators/)가 있었습니다. 이미 프로젝트에 사용했고, 많은.. 작업이 필요함을 알고 있는 `Next.js`를 제외하고 `Jekyll`, `Hugo`, `Gatsby` 세 가지 선택지가 눈에 띕니다. 저는 `Hugo`를 선택했고, 이유는 다음과 같습니다.

- `Jekyll`은 `GitHub Pages`에서 직접 추천하는 SSG이지만, 맞는 테마를 찾기가 어려웠습니다.
  - 다양한 사이트에, 다양한 양식으로 테마 리스트가 있었고, 이 중에서 무료이면서 제가 원하는 테마를 찾기가 너무 괴로웠습니다. 코어 부분이 `Ruby`로 작성되어 있었기 때문에, 제가 원하는 기능을 최대한 갖춘 테마를 고르는 것이 중요했습니다. 또.. 일부 테마 리스트는 사이트 자체의 관리가 되지 않아 아예 레거시인 것도 있었습니다.
- `Gatsby`는 레퍼런스를 찾기가 어려웠습니다.
  - **React로 만들어졌다**는 절대로 무시하지 못할 최고의 강점이 있었음에도 제가 만족할만한 레퍼런스를 찾지 못했습니다. 사실 Gatsby로 블로그를 만드는 한글 레퍼런스야 무척 많았지만.. 글을 쓰는 지금에 와서는 기억이 잘 나지 않는 어떤 문제에 대한 답을 찾지 못했습니다.(억까 아님)
  - 사실 최근에 [인프런의 Gatsby 강의](https://www.inflearn.com/course/gatsby-%EA%B8%B0%EC%88%A0%EB%B8%94%EB%A1%9C%EA%B7%B8)를 발견해서 공부하기 싫을 때 조금씩 읽고 있는데 충분히 마음에 들었다 생각되면 금세 여기로 옮길 지도 모르겠습니다.
- `Hugo`는 테마 목록을 [공식 사이트](https://themes.gohugo.io/)에서 제공해주고 있었습니다.
- `Gatsby`를 제외하고 나니, `Jekyll`과 `Hugo`중에서는 `Hugo`의 빌드 속도가 빠르다는 평이 많았습니다.
  - 이 것도 포스트가 몇 백 개 쌓이고 나서의 문제이지만 그냥 괜히 성능을 중시하고 싶었습니다.

대충 이 정도까지 정리하고 나서, 문서들을 쭉 읽어본 후에 Hugo를 사용중인 지인분께 이런저런 질문을 드렸습니다.

{{< figure src="/archived-blog/images/posts/2023/01/migrating-to-hugo/03.png" alt="image" caption="제가 사람 복 하나는.. 끝내줍니다." >}}

아무튼 이런 과정을 거쳐 `Hugo`로 블로그를 만들었습니다. 그 과정에 대한 내용은 나중에 또 따로 쓸 수도 있겠네요. 안 쓸 확률이 조금 더 클 것 같아요.

## 그래서 좋은가요?

{{< figure src="/archived-blog/images/posts/2023/01/migrating-to-hugo/04.png" alt="image" caption="아니 이걸 뭘 한 달 씩이나.." >}}
사실 1월 초에 레포지토리를 만들어서.. 지금은 나름 많은 부분을 고치고 어쩌고 하고 있습니다. 그렇지만 마음에 들지 않는 부분이 너무 많습니다.

### 익명 댓글이 불가능합니다.

제가 무언가의 학습 정리를 마구마구 했다고 치고, 거기에 잘못된 정보가 적혀있다고 가정합시다. 그걸 발견한 누군가는 저에게 잘못을 바로잡아주고 싶어서 댓글 창을 보지만 로그인이 필요해서 귀찮아서 그냥 지나가기로 합니다.
그런 상황이 생기면 안되니 익명 댓글 기능이 필요한데 SSG 특성상 그게 어렵습니다. 나중에 `Firebase`를 이용해서 연동할 수도 있을 것 같은데.. 나중에 제가 직접 `Next.js`로 블로그를 만들면 꼭 반영하겠습니다.

### 방대하지만 어딘가 나사빠진 테마

제가 쓰고 있는 [Jane](https://github.com/xianmin/hugo-theme-jane)이라는 테마는 기본이 꽤 충실합니다. 레이아웃의 변경을 거의 거치지 않고 사용 중인데, 이 녀석의 Quick Start 문서를 따라하니 빌드된 결과물 파일이 ignore되지 않는다던가, 페이지네이션을 위한 버튼들의 정렬이나 크기가 제각각이라던가, 이해 불가능한 일부 폴더 구조라던가.. 잔수정을 정말정말 많이 했습니다.

### TOC의 문제

{{< figure src="/archived-blog/images/posts/2023/01/migrating-to-hugo/05.png" alt="image" caption="왜 특정 depth만 파랗게 칠하는지.." >}}
스크롤을 내리면 우측에 Floating TOC(Table of Contents)가 표시되는데, 이 녀석이 문제가 많습니다. 생긴 것도 조금 문제고, `h2` 내지는 `h3` 태그만 파싱하는 모양입니다. `h1`도 안되고, 더 깊어도 목차에 나오지 않습니다. `h1`은 찾아보니 Hugo 엔진이 고의적으로 그렇게 구현한 모양인데, 더 깊이는 왜 안되는지 잘 모르겠습니다. 꼭 넣고 싶은 기능이었는데 너무 못생기고 작동방식이 별로여서 눈물을 머금고 하루의 수정사항을 모두 날렸습니다.

<aside>

(23/03/19 수정) 이 부분은 해결되었습니다. [Hugo v0.60.0](https://github.com/gohugoio/hugo/releases/tag/v0.60.0)에 이 부분을 커스터마이징할 수 있는 옵션들을 제공하고 있다고 하네요. 덕분에 지금과 같은 멋★진 TOC를 만들 수 있었습니다.  
![untitled](/archived-blog/images/posts/2023/01/migrating-to-hugo/07.png)

</aside>

## 앞으로의 계획

{{< figure src="/archived-blog/images/posts/2023/01/migrating-to-hugo/06.png" alt="image" caption="음흉한 야망이 담긴 요구사항 리스트" >}}
우선은 지금까지 수정한 테마가 아깝기도 하고, 엄청 흉악한 수준의 못생김은 아니기 때문에, 일단 이대로 사용하기로 했습니다. 그렇지만 다음 블로그로 갈아탈 준비가 되면 주저하지 않을 것 같습니다. Gatsby를 쓸 것인지는 잘 모르겠고, 언젠가 직접 블로그 엔진을 만들어 볼 생각은 있습니다. 앞서 말한 익명 댓글 문제를 해결하기 위해서라두요. 그러려면 엄청 공부를 많이 해야 할 것 같네요.. 주변 분들에겐 5년 계획이라고 말했는데 좀 더 길게 부를 걸 그랬습니다.

## Refs.

[Site Generators - A List of Static Site Generators for Jamstack Sites](https://jamstack.org/generators/)  
[휴고 블로그 만들기](https://wcho21.github.io/2022/08/30/how-to-create-a-hugo-blog/)  
[React 기반 Gatsby로 기술 블로그 개발하기](https://www.inflearn.com/course/gatsby-%EA%B8%B0%EC%88%A0%EB%B8%94%EB%A1%9C%EA%B7%B8)  
그리고.. 저의 뜬금없고 깐깐한 질문에 친절하게 답해주신 `@wcho21`님, 언제나 블로그에 있어서 프로 마인드이신 `@kasterra`님께 감사 인사 드립니다.
