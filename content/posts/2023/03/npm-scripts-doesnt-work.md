---
title: "VSCode의 NPM Scripts가 작동하지 않는 사람"
date: 2023-03-29T15:17:00+09:00
lastmod: 2023-03-29T15:17:00+09:00
draft: false
categories: ["ide"]
tags: ["npm", "vscode", "macOS", "nvm"]
thumbnail: "/images/posts/2023/03/npm-scripts-doesnt-work/02.png"
---

{{< figure src="/images/posts/2023/03/npm-scripts-doesnt-work/01.jpeg" alt="image" caption="늦잠자고 갓생사는 척 하는 삶이란..." >}}

맥북과 친해지기 시작한지 2달이 되었다. 윈도우 노트북을 사용하다가 갈아 탄 이유는, _맥에서 되는 것이 윈도우에서 되고, 윈도우에서 되는 것은 맥에서 안되는_ 문제를 너무 많이 겪었기 때문이다. 주변의 맥 유저에게 계속해서 테스트를 요청하기도 눈치보이고, 언젠가는 마주해야겠다고 생각했던 녀석이기 때문에 과감한 투자를 했다. 그 과정에서 내가 윈도우에 지나치게 강결합(?) 되어 있다는 것을 깨달았고, 지금은 맥도 윈도우도 못 쓰는 그 어딘가의 지점에 있다.

그리고 최근에는 프로젝트를 하고 있다. 부스트캠프에서 만난 사람들과 스터디를 하다가, 디자인 시스템을 만들어 보자는 이야기가 나와서 다같이 티스푼 공사 중이다. 이 것에 대해서도 글을 써야 하는데 오늘 포스팅할 내용은 이 것도 아니다. 회고를 안 쓰니 이야기가 많이 밀려 횡설수설 하는구나..

아무튼... 프로젝트 환경 설정을 하면서 겪었던 문제를 기록하고자 한다.

# NPM Scripts가 안 된다

![NPM Scripts](/images/posts/2023/03/npm-scripts-doesnt-work/02.png)

VSCode는 레포지토리를 열었을 때 `package.json` 파일을 파싱하여 실행할 수 있는 스크립트들을 하단에 보여준다. 이게 원래는 익스텐션의 기능이었다가, 언젠가 익스텐션이 deprecated가 되고 기본 기능이 된 모양이다. 아무튼 저걸 사용하면 굳이 터미널을 열어서 명령어를 투닥투닥 입력하지 않아도 알아서 새 터미널을 열어서 명령어를 실행해 준다. 특히 FE와 BE를 같이 실행할 때 너무너무 편하다.

그런데 맥북에서 요놈이 실행이 안된다.

![Error message](/images/posts/2023/03/npm-scripts-doesnt-work/03.png)

다른 프로젝트도 안 된다. 이 프로젝트는 더더욱 안된다. 원래 그렇게 인식하지 못하고 사용하던 기능인데, 안 된다고 생각하니 갑자기 뭔가 족쇄를 찬 기분이고.. 어쩌고 저쩌고..  
아무튼 메시지를 읽어 보고 처음에는 프로젝트가 yarn 1.22.19 버전을 사용하는데 내 글로벌에 yarn berry만 설치되어 있어서 그런가 하고 기본 버전을 바꿀 방법을 찾아 다녔다. 물론 정답이 아니었다.

# 해결 과정

나는 처음에 node와 yarn을 설치할 때, `~/.zshrc` 파일에 아래와 같이 설정을 넣었었다. 그 때는 하도 깔아야 하는 것이 많다보니 이것저것 찾아서 묻지도 따지지도 않고 마구 따라했었는데,

```zsh
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && . "/usr/local/opt/nvm/nvm.sh"  # This loads nvm
[ -s "/usr/local/opt/nvm/etc/bash_completion.d/nvm" ] && . "/usr/local/opt/nvm/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
```

`NVM_DIR`라는 변수를 정의해 놓고 사용하지 않고 있었다. 왜일까? 싶어 아래와 같이 변경했더니 해결되었다.

```zsh
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

음... 그 외에도 `~/.zshenv` 내용을 `source ~/.zshrc`로 변경해서 zshrc 파일의 내용을 참조하도록 수정했다.

그런데 저 설정 파일은 대체 어디서 작성된 것일까? [nvm의 공식 문서](https://github.com/nvm-sh/nvm/commit/e10705b896ee417e03512403df82e22d7a9b25ca)에도 `$NVM_DIR`를 참조하도록 쓰여 있었고, 저 코드가 처음 나온 커밋을 찾아 보니 [역시 처음부터 NVM_DIR를 사용하게 되어 있었다.](https://github.com/nvm-sh/nvm/commit/e10705b896ee417e03512403df82e22d7a9b25ca)

![Finding origin](/images/posts/2023/03/npm-scripts-doesnt-work/04.png)  
기원을 찾고 싶었으나 검색되는 가장 오래된 결과는 어느 gist에 저장된 bash_profile 코드였다. 내가 쉘에 대해 깊이 알고 있지 않아서 더 이상 깊이 원인을 찾으려면 많은 시간이 필요해 보인다. 2달만에 되찾은 NPM Scripts 메뉴에 무척 기분이 좋다.

# Refs.

[VSCODE build error `The terminal process "/bin/zsh '-c', ... - stack overflow](https://stackoverflow.com/questions/63502253/vscode-build-error-the-terminal-process-bin-zsh-c-yarn-run-watch-extensi)  
[zsh: command not found: nvm 오류해결법](https://velog.io/@palette/zsh-command-not-found-nvm-%EC%98%A4%EB%A5%98%ED%95%B4%EA%B2%B0%EB%B2%95)
