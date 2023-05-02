---
title: "넘블 OpenAI 단톡방 챌린지 - 프로젝트 회고"
date: 2023-04-23T04:05:58+09:00
draft: false
tags: ["project", "numble"]
categories: ["life"]
---

# 시작하게 된 계기

![ui design](/images/posts/2023/04/numble-talk/01.png)

3월에 정말 많은 일들이 있었다. 아직 뭔가 성과라고 내세울 결과물이 없긴 하지만 그래도 무의미하진 않았다(?)고 주장할 수 있는 그런 시간이었다. 점점 일이 정리가 되고 여유가 생기면서 번아웃이 온 사람처럼 푹 늘어지는 느낌이 있었는데, 그 와중에 누가 넘블을 소개해 주셨다.

대충.. 프로젝트 주제와 요구사항을 주고 구현을 해 보는? 프로세스의 활동으로 이해했다. 기간이 짧아 확 몰입하기 좋겠다는 생각을 해서 한 번 맛만 보기로 했다. OpenAI API를 활용해 보는 프로젝트라는 점이 관심을 끌기도 했다. 요새 챗쌤한테 이런저런 도움도 받았고 관련 아티클도 많이 보이고..

# 맛을 보자

## 스토리북을 쓰자

핵심 기능 외에도 storybook의 작성이 요구되었다. 다행히도 storybook은 지금 하고 있는 프로젝트에서 사용 경험이 있어서 비교적 가벼운 마음으로 접근할 수 있겠다 생각했는데.. storybook 설치부터 큰 문제가 있었다. 우선 프로젝트에서 요구하는 것이 Next.js였고, 내 개인적인 선호로 Yarn berry(PnP)를 사용하여 구성하려고 했었는데, Next.js 프로젝트에서 storybook을 사용하려면 특정 builder add-on을 사용해야 했고, 대충 이 근처 지점에서 오류가 발생해서 실행이 불가능했다. 내가 대충 짐작한 요인은 이랬다.

- 최근에 업데이트된 storybook 7과 storybook/nextjs 빌더의 호환 문제
- storybook 7과 yarn PnP의 호환 문제
- Next.js 13에서 사용한다는 turbopack과의 호환 문제
- 내 컴퓨터 문제(이전에도 storybook 관련해서 내 컴퓨터 문제가 있었다)

꽤 많은 레퍼런스를 찾아다니며 해결을 시도했지만 결국 Yarn PnP를 포기하는 것으로 해결되었다. PnP를 쓰지 않으면 지금 데스크탑이 꽤 느린 상태여서 조금 속상한 부분이 있었다. 이 내용은 나중에 정리가 된다면 다른 글로 정리하고 싶다.

<aside>

[Next.js Storybook에 Yarn PnP 적용하기]({{<ref "posts/2023/04/nextjs-storybook-with-pnp">}})

</aside>

## OpenAI와 친해지자

![결과물 사진](/images/posts/2023/04/numble-talk/02.png)

챗썜을 제대로 모시기 위해서는 [API 문서](https://platform.openai.com/docs/api-reference)를 읽어야 했다. 내가 직접 맨땅에서 문서를 정독하며 무언가 시작해 본 경험이 있던가? 아무튼 가뜩이나 미지의 영역인데 영어로 써있다는 점이 큰 걸림돌이 되었다.

다행히 내가 읽어야 하는 부분이 명확했고, 먼저 문서를 읽어 보신 선발대(?) 팀원 분들의 후기를 통해 꽤 괜찮은 지점에서 시작할 수 있었다. 걱정했던 것보다 금방 ChatGPT를 쓰는 느낌처럼 대화를 주고 받을 수 있었다.  
문제는 단순히 1:1 대화만 하는 챗쌤을 어떻게 1:N, 그리고 ai끼리도 대화를 할 수 있도록 구현을 할까 하는 문제였다. 이런저런 고민을 하다가 [OpenAI 커뮤니티 글](https://community.openai.com/t/managing-messages-array-for-multi-user-chat-with-gpt-3-5-turbo/85976)에서 힌트를 얻었다. 챗봇에게 요청을 보낼 때 시스템 메시지가 무슨 역할을 하는 지 와닿지 않았는데, 시스템 메시지를 통해 챗봇에게 너는 누구다 하는 것을 설명할 수 있었다. 이 메시지를 통해 내가 원하는 답을 얻어내면 될 것이라 생각했다.

```
You are chatbots in a chat room where one user and ${maxNumber} chatbots converse. Each message is in the format of number: content, where 0 represents the user's message and 1 to n represents the messages of the nth chatbot. You are responsible for assuming the role of all 1 to ${maxNumber} chatbots and participating actively in the conversation. Each chatbot can speak all at once, only a few at a time, or one chatbot can speak multiple times. Please format your response in number: content format, with each message separated by two line breaks.

// 한글
당신은 유저 한 명과 ${maxNumber}개의 챗봇이 대화하는 채팅방의 챗봇입니다. 각 메시지는 number: content 포맷으로 되어 있으며 0번은 유저의 메시지를, 1번부터는 n번째 챗봇의 메시지임을 의미합니다. 당신은 1 ~ ${maxNumber}번 챗봇의 역할을 모두 맡아 대화합니다. 모든 챗봇이 말을 하거나, 일부만 할 수도 있으며, 한 챗봇이 여러 마디를 할 수도 있습니다. 응답 역시 number: content 포맷으로, 각 메시지는 두 번의 줄바꿈으로 구분하여 작성해 주세요.
```

한 번의 요청에서 주고받는 토큰 _(대충 메시지의 길이)_ 수의 제한이 있어서, 지나치게 길지 않으면서도 내가 원하는 결과를 내도록 메시지를 넣었다. 학부생 때 [OpenAI Gym](https://www.gymlibrary.dev/)을 해 본 경험이 조금 오버랩되면서 느낌이 묘했다. 얘야 이건 이렇게 답해야 한단다..  
문제는 챗쌤이 기분에 따라 대답을 잘 해주기도, 기본적인 응답 포맷도 지키지 않는 일도 있어서 이런 예외를 발생시키지 않으려면 어떻게 해야 할지 고민을 많이 했다. 내가 시스템 메시지로 요구하는 내용 자체가 중의적으로 해석될 소지가 있는 것이 문제라고 생각해서 이것저것 바꾸면서 조절했다. 결과적으로는 항상 좋은 결과를 보여주진 않지만 적어도 메시지 포맷은 지켜서 이야기하도록 만드는데는 성공했다.

그리고 API 요청을 보낼 때.. 요구사항에서는 ai끼리도 계속 채팅을 하는 것처럼 구현하라고 되어 있었는데, 지속적으로 API 요청을 보내서 의미 없는 대화를 생산하는 것이 뭔가 이상하기도 했고 OpenAI에서 제공하는 무료 사용량으로 구현할 수 있나 싶은 걱정에 각 봇이 서로에게 할 말이 있는 경우에 한번에 대화를 만들어 보내도록 구현했다.

## 좋은 팀!

![bug issue](/images/posts/2023/04/numble-talk/03.png)

과정을 혼자보다는 여럿이서 겪으면 더 얻는 게 있을 거란 생각에 팀에도 참여했다. 나와 비슷한 신입 분들이셨고, 정말 운 좋게도 서로 성격이 잘 맞아서 즐겁게 스크럼을 할 수 있었다. 다른 프로젝트와 겹치면서 막바지에 거의 해커톤 마인드(?)로 하다가 어떻게 스크럼 때 1차 배포까지 마치고 결과물을 보여드렸는데, 한 분이 버그까지 발견해 주기도 했다. 재밌는 경험이었다 ㅋㅋ..  
너무 활기차고 적극적으로 함께 해 주셔서 너무 감사드려요!

# 마치며

생각보다 일정이 빡빡했고, 걱정보다는 할 만 했던 챌린지였다. 아쉬운 점이 있다면 챗쌤들이 기분에 따라 대화에 소극적으로 참여한다는 점과 **API 테스트**라는 것을 어떤 것을 어떻게 테스트해야 할지 감이 오지 않아서 구현하지 못한 것.. 어떻게 했어야 할까? 나중에 모범 사례라고 해야 하나.. 잘 하신 분들의 프로젝트가 공개된다면 한 번 보고 싶다.

[넘블톡 레포지토리](https://github.com/prayinforrain/numble-talk)  
[넘블톡 배포 링크](https://numble-talk.vercel.app/)
