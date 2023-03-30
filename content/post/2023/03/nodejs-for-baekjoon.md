---
title: "백준을 위한 node.js "
date: 2023-03-30T15:17:00+09:00
lastmod: 2023-03-30T15:17:00+09:00
draft: false
categories: ["algorithm"]
tags: ["javascript", "nodejs", "algorithm", "ps", "baekjoon"]
thumbnail: "/image/post/2023/03/nodejs-for-baekjoon/01.png"
---

## JS라도 백준이 하고싶어

![Programmers IDE](/image/post/2023/03/nodejs-for-baekjoon/01.png)

공채 시즌이다. 개인적으로 코딩 테스트를 정말정말 자신 없어했는데, 더 이상 미룰 수 없어 야금야금 공부를 시작했다.  
불편한 점이 있다면, 백준은 자바스크립트에 아주 불친절하다는 점이다. 내가 학부생 때 잘 하지도 못하는 C++로 꾸역꾸역 문제를 풀었던 이유 중 하나이기도 했다. 그 때는 아는 PS 플랫폼이 백준 뿐이니, 자바스크립트의 어쩔 수 없는 한계인가보다 했다.

그런데 프로그래머스를 맛 보고 나니 머리가 커져서 자바스크립트가 백준에게 부당한 차별을 받는(?) 기분이 들었다. 진짜로 화가 난 건 아니지만 그래도 화가 났다. 용서할 수가 없어 보일러플레이트 코드를 작성했다.

한 4~5문제 테스트해 봤는데 제대로 작동하는 것 같다.  
백준은 워낙 입력 형식도 출력 형식도 다양하기 때문에, 모든 문제에 대해 일반적으로 적용할 수 있는 코드는 아니지만.. 이 정도로 참고 쓸란다.

## Baekjoon Node.js template

```javascript
function solution(input) {
  let answer = 0;
  // Your code here ...

  return answer;
}

const fs = require("fs");
const input = fs
  .readFileSync("/dev/stdin")
  .toString()
  .trim()
  .split("\n")
  .map((l) => l.split(" "));
if (input.length === 1) {
  console.log(solution(input[0]));
} else {
  console.log(solution(input));
}
```
