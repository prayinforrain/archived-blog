---
title: "모헤윰 mo:heyum - 프로젝트 회고"
date: 2022-12-21T03:30:25+09:00
lastmod: 2022-12-21T03:30:25+09:00
draft: false
categories: ["moheyum"]
tags: ["moheyum"]
thumbnail: "/archived-blog/images/posts/2022/12/finishing-moheyum/moheyum_01.png"
---

> 티스토리 블로그에 작성했던 부스트캠프 팀 프로젝트의 회고 글이다. [[원본 링크]](https://prayinforrain.tistory.com/80)

{{< figure src="/archived-blog/images/posts/2022/12/finishing-moheyum/moheyum_01.png" alt="image" caption="내가 팀원들한테 이 얘길 했나 모르겠는데.. 이 페이지 좀 이쁘다. 잘만드셨다.." >}}

부스트캠프의 최종 팀 프로젝트로 나는 **모헤윰**이라는 SNS를 만들었다. 결과물은 꽤 괜찮다. [[여기]](https://youtu.be/9mVinynuUTw)에 간단한 시연 영상이 있다. 사실 팀 구인을 하던 때부터 나는 무엇을 만드는지는 크게 중요하지 않았다. 여태까지의 학습 스프린트로 이미 개발이라는 과정은 어느정도 감을 익혔고, 내가 성장함에 따라 이 과정에서 사용하는 기술만 조금씩 변화할 뿐이라고 생각했다. 따라서 내가 팀 프로젝트에서 가장 중요하게 생각했던 포인트는 협업이었다.

오랜만에 진지한 글을 써보려고 한다. 주제는 **모헤윰 협업 회고** 정도가 될 것 같다.

첫 협업이라 아쉬운 부분이 많았어서 문제점만을 적었지만 **모헤윰은 절대 실패한 프로젝트가 아니다.** 모헤윰은 유저의 가입 → 서비스 이용 → 탈퇴까지 완전한 유저 시나리오를 구현하였으며, 컨테이너화를 통한 무중단 업데이트를 통해 유지보수까지 용이하게 한 완결성을 갖춘 프로젝트이다. 물론 팔은 안으로 굽는다고 내 새끼이기 때문에 나만 그렇게 느낄 수도 있다.

## 풀스택 경험을 위한 필드 스왑

어쩌다 보니 이 아래로는 쭉 잘못한 부분만 있는데, 얘는 길기도 하고.. 장점도 적혀 있는게 조금 어색해서 접었다.

팀프로젝트에 앞서 부스트캠프 운영진 분들은 '프론트엔드, 백엔드 분야를 나눌 수는 있어도 부스트캠프는 풀스택을 기본으로 생각한다'라고 몇 번씩 강조하셨다. 나 역시 앞으로 백엔드 일을 할 지는 모르겠지만, 내가 자의적으로 백엔드 쪽의 작업을 할 것 같지는 않았기 때문에, 지금 기회가 왔을 때 최대한 경험해야 한다고 생각했다. 팀원들도 어느정도 공감한 듯 했고, 고민 끝에 우리는 매 주 프론트엔드와 백엔드에서 한 명씩을 교환하자는 이야기를 했다.

<details>
<summary>더 보기</summary>

### Pros.

#### 프론트엔드 / 백엔드가 서로를 이해하고 소통이 가능하다.

말 그대로다. 백엔드를 다녀오니 내가 얼마나 얼척 없는 이야기를 백엔드 팀원들에게 해왔는지 느낄 수 있었다. 문제는 우리 모두가 그 문제를 인지하지 못하고 있었고, 심지어 멘토님이 *백엔드가 너무 착한 것 같다*고 말씀하셨음에도 우리는 API가 보내준 결과물을 그대로 보여주기만 하면 되는 수준의 구조가 계속되었다.

#### 팀원이 분야를 가리지 않고 모든 코드에 책임이 생긴다.

모든 코드가 내 손을 거쳐 갔다는 것은, **내가 모든 코드에 일부분 책임을 갖게 됨**을 의미한다.

#### 학습 공유가 훨씬 쉬워진다.

백엔드 코드 구조가 눈에 익다 보니, 서로가 쓴 학습 정리를 읽을 때 난이도가 무척 내려갔다. 그럼에도 모든 코드를 온전히 이해할 수는 없었다.

### Cons.

#### 코드 품질 저하가 일어났다.

이는 뒤에서 언급할 다른 이유가 있기도 하지만, PR 검토가 원활히 이루어지지 않았다. 이 부분을 우려해서 안전장치를 뒀지만 바쁜 일정 속에서 그마저도 지켜지지 않았다. 코드 일관성은 물론이고 안티패턴이 곳곳에 숨어 있었다. 결국 프론트 백 양 쪽이 어마어마한 양의 리팩토링을 진행해야 했다. 일을 두 번 씩 한 셈이다. 서로가 서로에게 죄송했다..

#### '남의 영역'이라는 부담이 생긴다.(내 기준)

내가 프론트에서 백 팀원을 받았을 때에는 내가 뭐든 도와드리고 싶었다. 하지만 그 분은 놀랍게도 월요일 반나절 동안 사라졌다가 리액트 마스터가 되어 돌아오셨다. 반면에 내가 백엔드로 갔을 때에는 '내가 이걸 이렇게 짰다가 잘못 되어서 백엔드 분들이 고생하시면 어쩌지?' 하는 고민이 하루에도 몇 번씩 들었다. 결국 결과물이 좋지도 못했고 양도 많이 않았다. 조금 더 적극적으로 참여했어야 하는데, 하는 아쉬움이 남는다.

</details>

## 기획 단계에서의 문제

기획자와 디자이너의 소중함을 절실하게 느낀 시간들이었다.

### 백로그 자체를 명확하게 하지 않았다.

{{< figure src="/archived-blog/images/posts/2022/12/finishing-moheyum/moheyum_02.png" alt="image" caption="딴소린데, 이거 closed 됐는데 opened로 표시되는 버그 짜증난다" >}}

딴소린데, 이거 closed 됐는데 opened로 표시되는 버그 짜증난다
나는 소프트웨어공학 수업을 정말 재미있게 들었다. 실습이라곤 전혀 없던 우리 학교에서 유일하게 실제 결과물을 내는 프로젝트가 있었기 때문인데, 교수님이 (약간은 개발자 친화적인) 비개발자 고객 입장에서의 요구사항을 주시면 그것들을 우리끼리 백로그 문서를 작성하고, 일정을 계획하고 구현하는 식이었다. 나는 그 수업을 들으며 백로그를 어떻게 쓰면 되는지 너무 명확하게 알고 있었다.

그럼에도 불구하고 모헤윰의 백로그는 중구난방 그 자체였다. 어떤 것은 유저 입장에서 어떤 동작을 하면 무엇이 보여야 한다, 이렇게 내가 아는 것처럼 써 있기도 했지만, 어떤 것은 개발자가 구현해야 하는 함수나 모듈 단위로 있기도 했다. 그렇다보니 백로그 자체도 문제가 많았고, 이를 백엔드, 프론트엔드가 작은 단위로 나누어 이슈를 만드는 과정에서도 일관성이 없었다. **왜 내가 아는 것을 적용하지 못했을까? 그건 내가 설명할 수 있을 만큼 알고 있지 않기 때문**이라고 생각한다.

### 기획과 계획을 충분히 디테일하게 정하지 못했다.

사실 모헤윰은 비슷한 컨셉의 어떤 서비스에서, 한번 뒤집어졌다가, 그게 또 한 번 뒤집어지면서 지금의 결과물이 된 케이스다. 금요일이 기획 발표였고, 첫 전복이 수요일이었기 때문에, 세부 기획이 있기 어려운 상황이긴 했다. 그럼에도 기획이 똑바로 잡히지 않고, 팀원들이 이해한 바가 조금 씩 달라 중간중간 추가적인 토론이나 기능 변경(특히 DB 스키마)이 필요했다. 이를테면 '회원 탈퇴'를 구현하고 나니, 탈퇴한 회원은 검색이 되지 않아야 하고, 남긴 글은 보여야 하고, 등등.. 그런 시나리오를 생각해 보니 변경해야 할 부분이 너무나도 많았고 심지어 빠뜨린 경우도 있었다.

가장 큰 문제는 앞의 협업 규칙과 맞물려서 나는 다음 주에 백엔드 작업을 해야 하는데, 이번 주에 작업을 마치지 못해서 미완료 상태로 두고 가버리는, 그런 케이스가 발생하기도 했다. 이런 문제로 팀원에게 조금 날카롭게 말한 기억이 있다. 아니다, 지금 생각해 보니 날카롭게 생각만 하고 말은 안했던 것 같다. 우리 팀은 이야기 하면 다 들어줬으니까. 아무튼 이런 문제가 큰 결과로 이어지진 않아서 다행이었다.

### 용어를 명확히 정하지 않았다.

페이스북의 '담벼락'이라는 기능을 예시로 들어보자. 이름을 '담벼락'이라고 정했다면 사내의 모두가 이 기능을 '프로필 페이지' '개인 피드' 이따위 이름이 아닌 '담벼락'이라고만 불러야 한다. 이건 단순히 '보기 불편해!'의 문제가 아니라 팀의 의사소통을 원활하게 유지하기 위한 아주 중요하고 기본적인 문제라고 생각한다.

그런데 우리는 기획 단계에서 이걸 제대로 하지 않았다. _'댓글' '답글', '게시글 열람 페이지' '게시글 보기 페이지' '게시글 보는 페이지'_ 등등, 보기만 해도 한숨이 나오는 오만가지 이름들이 있었다. 이로 인해 발생한 불편함과 문제점이 정말 많았는데, 막상 쓰려니까 딱 대표적인 사례가 떠오르질 않는다. 아무튼 이걸 정했어야 하는데, 이미 나는 기획 단계에서 회의에 너무 많은 브레이크를 발생시켰기 때문에 이런 것까지 트집을 잡았다간 싸움이 났을 수도 ㅋㅋ..

## 그라운드 룰과 컨벤션 문제

당연히 작업을 시작할 때 우리가 한 일은, 그라운드 룰과 컨벤션 정립이었다. 우리 중 그 누구도 협업에 대한 경험이 없다보니, 무엇무엇을 정해야 하는가?에 대한 감각이 전혀 없는 상태였다. 그래도 나름의 커밋 규칙과 PR을 머지하는 방법 등에 대해 세워 나갔지만, 이 부분은 솔직히.. 전혀 잘한 점들이 없었다.

### 커밋의 단위 자체가 제대로 나뉘지 않았다.

{{< figure src="/archived-blog/images/posts/2022/12/finishing-moheyum/moheyum_03.png" alt="image" caption="(깊은 한숨)" >}}
우리는 모두 git의 staged 개념을 잘 알고 있었다. 그럼에도 불구하고 여러 수정이나 기능 구현을 하나의 커밋에 섞어서 올리거나, 커밋 컨벤션 자체를 지키지 않은 경우도 많았다. 나의 경우에는 프로젝트 내내 아무 생각 없이 커밋 메시지에 두 가지 이상의 작업내용을 몰아 써서 한 번에 커밋을 날려 오다가 마지막 리팩토링 기간이 문득 이 문제를 깨달았다. 우리 레포지토리의 커밋 내역을 보기 어려운 이유는 그저 **커밋이 커밋의 단위를 갖지 않기 때문**이었다.

### 이슈나 PR의 템플릿을 명확하게 정하지 않았다.

모헤윰의 이슈와 PR을 보면 3자 입장에서 보기 매우 힘들다. 우선 PR은 'dev로 올리고, merge하자' 정도만 정하고 **PR의 제목이나 내용에 대한 컨벤션이 전혀 없었다.** 그래서 제목은 깃허브가 정해주는 대로, 내용은 없는 경우도 많았다. 아차, 이걸 정했어야 하는데, 라고 느꼈을 때는 이미 늦었다. 나중에 어떤 PR을 이해하기 위해선 작업한 팀원에게 '이거 어떤 PR이었죠?' 하고 물어봐야 하는 얼탱이 없는 상황이 되어버렸다.

이슈 역시 그렇다. 앞의 백로그 문제와도 연결되지만, 하나의 백로그를 이슈화하고, 이를 위해 프론트엔드 - 백엔드가 구현할 기능들을 또 작은 이슈로 나누었다. 이 작은 이슈들이 백로그 이슈를 참조하도록 하자고 했지만 별로 직관적이진 않았고, Github Project의 사용 미숙으로 작은 이슈가 백로그에 올라가버리는 등의 문제가 있기도 했다. 다음엔 꼭 Jira, Trello라던지, 최소한 노션으로 정리하던가 하는게 좋을 것 같다.

음.. 그리고 git cz를 써 보고 싶다.

### 그나마 정한 룰도 제대로 지켜지지 않았다.

가장 큰 문제였다. 앞서 언급했듯 우리 팀은 프로젝트의 모든 코드를, 모두가 책임지는 것을 최우선으로 여겼다. 이는 내가 백엔드 코드를 읽어야 하는 문제 뿐 아니라, 내가 백엔드 작업을 하는 주간에 올라오는 프론트 PR에도 똑같이 적용되었어야 하는 문제였다. 따라서 우리는 PR을 올릴 때 리뷰어로 서로를 지정하고, approve 되어야 dev 브랜치에 머지할 수 있도록 하자고 이야기했지만 그렇지 않았다.

첫째로 시간이 너무 없었다. 첫 기획에서 여러 번 뒤집으며 기능을 거의 반 이하로 줄였지만, 그래도 시간이 너무 모자랐다. 남의 코드 보기를 최고로 좋아하는 나도 그걸 다 읽는게 너무나 버거웠고, 이러다간 주간 마일스톤을 채우기 정말 어려워 보였다.

둘째로 이런 환경에서 팀원에게 리뷰요청을 거는 것이 부담이었는지 **리뷰어가 없는 PR**이 쥐도 새도 모르게 올라왔다가, 바로 머지되어 버리는 경우가 많았다. 조금 서운하기도 했고, 리팩토링 기간에 정말 말이 안되는 코드가 있어서 '이게 어떻게 dev 브랜치로 왔지?' 하고 보면 그런 PR이었던 경우가 대부분이었다.

{{< figure src="/archived-blog/images/posts/2022/12/finishing-moheyum/moheyum_04.png" alt="image" caption="벌칙을 같이 정했어야 하는데 ㅇㅇ.." >}}
그리고 룰 얘기를 하는 김에, 후반 갈수록 팀원들이 잠 안자기 대회를 하는 것 같아 보여서 3시 이후 게더타운 커밋 PR 이슈발행 금지라는 룰을 추가했는데, 그 시점부터 3시 이후로 엄청난 커밋과 이슈가 올라오기 시작했다. 님 그러다 죽어요

### 팀원들의 prettier가 제대로 적용되지 않았다.

yarn berry를 적용하면서, 또 VS코드의 문제가 중첩되어 만들어진 결과인데, lint 없이는 사람이 죽는 줄 아는 나를 제외하고 **모든 팀원이 lint가 제대로 적용되지 않는 문제**가 있었다. 심지어 이걸 맞추려고 따로 시간을 할애하기까지 했는데, 얼마 지나지 않아 또 같은 문제가 생겼다. 대체 왜였을까? 아무튼 그래서 대부분의 PR에는(내 것을 포함해서) CI 통과가 되지 않아 lint error를 수정하는 커밋이 하나씩 더 달려 있었고, prettier가 적용되지 않은 코드를 내가 구경할 때가 되어서야 적용되어 쓸데 없는 변경이 생겨 커밋이 막 커지기도 했다.

## 작업 과정에서의 문제

여기부터는 내가 개인적으로 겪은 아쉬움들이다.

### 내가 기대받는 역할을 해내지 못했다.

나중에 팀장님이 내게 제안을 한 이유가 대충 내가 프론트엔드 전반을 잘 잡고 팀원에게 공유할 수 있을 것이라는 기대를 했다, 이런 이야기를 했지만, 나는 그렇지 못했다고 생각한다. 우선 **나는 기본이 없었고, 기본이 없다는 인지도 없었다.** 코드를 읽으며 내가 느끼는 불편함이 정말 안티패턴이어서인지, 아니면 내가 하던 방식과 달라서인지 구분하지도 못했다. 오히려 나는 '자기가 아무것도 모른다'고 한 팀원에게 배운게 더 많다. 특히 Next.js는 리액트와 비슷하면서 다른 부분들이 있는데, 나는 팀원의 학습 정리에 의존하며 이 부분들을 채워나갔다. 그 외에도 말하기도 창피한 나의 무지함이 몇 번씩 터져 나왔다. 사실 프론트엔드 코드 일관성이 무너진 책임은 대부분 내게 있다. ㅎ;;

### 의사소통이 레포지토리 밖에서 이루어졌다.

코드리뷰, 수정요청, 그 외 기타등등이 슬랙이나 게더타운으로만 이루어졌다. 이게 뭐가 문제냐면, 레포지토리만 봐서는 작업의 과정이 전혀 개연성 없게 보인다. 더욱이 이 프로젝트는 누군가에게 보여주기 위한 프로젝트이기 때문에 절대 그래서는 안됐다. PR 코멘트의 경우 레포에서 지적을 하는 것이 부정적이게 느껴져서(나의 고질병이다) 게더타운이나 슬랙으로 이야기해서 고치곤 했다. **PR에 '피드백 반영' 등의 이름을 갖는 커밋이 있으나 정작 그 PR에 달린 리뷰는 없게 되었다.** 그냥 근거가 있다면 크게 지적으로 느낄 사람도 없었을 텐데 내가 괜히 그랬다. 이건 프로젝트가 모두 끝난 후에 갑자기 든 아쉬움이다.

### 정작 내가 기록을 많이 하지 않았다.

{{< figure src="/archived-blog/images/posts/2022/12/finishing-moheyum/moheyum_05.png" alt="image" caption="많이도 했다" >}}
우리 팀의 이름은 리코더이다. 처음 기획이 그룹 교환일기 컨셉이었어서, 기록을 하는 서비스라는 점에 착안하여 '기록하는 사람들'이라는 의미로 지은 이름이다. 그래서 우리도 학습정리를 열심히 하자, 기록을 많이 남기자 라는 제안을 했다. 이건 내가 팀에 들어가기 전에 팀장님께 제시한 조건이기도 했다. 제시한 조건이라니까 뭐라도 되는 것 같아 보인다.

아무튼 결과적으로 **내가 정리한 TIL 문서 수는 꼴찌**에 가까웠다. 거의 스스로를 갈아넣는 어떤 천재분이 독보적이었고*(솔직히 이 분 학습량이 말이 안된다)*, 팀장님이 두 번째, 나는 거의 꼴찌에 가까웠다. 나름 새롭게 배운 것들은 거의 썼지만, 내가 아는 범위 내에서 해결하려는 버릇과 느린 작업속도가 원인이라고 핑계를 댄다. 이 결과를 보고 지금도 좀 무안하다. 나는 그냥 회고에 넋두리만 오지게 적었다..

### 팀의 자원을 너무 낭비했다.

우리 프로젝트의 주제를 놓고 보면 그렇게 개성있진 않지만, 굳이 꼽자면 마크다운 에디터가 있다. 내가 개인적인 욕심으로 고집한 컨셉이기도 하고, 팀원들이 이 것을 위해 나에게 많은 시간을 몰아 줬는데, 마크다운 문법을 파싱하는 부분을 만들기가 정말 어려웠다. 그냥 가볍게 정규식으로 치환하면 되겠거니 생각했지만 문법과 문법간의 포함 가능 여부가 각자 달랐고, 몇 가지 구조적 문제 때문에 완벽한 파싱을 위해서는 정말 문자열을 lexical analyze할 필요가 있었다. 이 벽에 가로막혀 포기하려다가 어떤 팀원의 격려로 어떻게든 몇 가지 눈속임을 거쳐 비슷한 모양을 만들어냈지만, **결과물만 놓고 보면 투자한 시간이 아까운 수준**이다. 여담으로 그 때 받은 격려로 진짜 울 뻔했다 ㅋㅋ..

그래도 나중에 멘토님한테 들어 보니, 애초에 완전한 파서를 만들기는 좀 힘들 것이고, 멘토님이 비슷한 일을 하셨을 때에도 우리의 결과물과 비슷한 구조로 구현하셨다고 한다. 최고는 아니어도 나름 최선의 결과를 낸 것 같다.

---

{{< figure src="/archived-blog/images/posts/2022/12/finishing-moheyum/moheyum_06.png" alt="image" caption="솔직히 글쓰는 거 재미있었음" >}}
_첫 협업이니까_ 라는 이야기는 좀 그렇다. 왜냐면 다음 협업때는 또 다음 협업의 아쉬움이 이 만큼 쌓일 것이고, 나는 '처음이니까'라는 이유를 정말 싫어하기 때문이다. 이번엔 처음이라고 치고, 다음 번에는 어떤 변명을 할 수 있을까? 그냥 이 문제들로 인해 내가 느낀 슬픔을 머릿속에 새기고 다시는 같은 실수를 반복하지 않도록 감각을 익히는 것이 중요한 것 같다. 이번에 이렇게 힘들었는데 또 같은 실수를 하면 정말 슬플 것 같다.

아쉬움만 적었지만 정작 우리의 협업은 정말 재밌었다. 새벽까지 게더타운에서 잡담을 하기도 하고, 월드컵도 보고, 테트리스를 하면서 놀기도 했다. 어설프던 시절만 기억해서 그렇지 결과물만 놓고 보면 꽤 멋있는 앱이기도 하다. 이 글은 나의 문제를 채찍질 하는 글이 아니라, 그저 내가 부스트캠프 내내 해왔던 것처럼 **'다음에는 이렇게 해야지!'** 계획을 세우는 글이다. 우리 팀은 대단하다. 우리니까 이 정도 한거야 ^^..
