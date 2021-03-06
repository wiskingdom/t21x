const keywordMap = {
  cho: {
    n: [
      {
        target: 'HeadLine',
        patterns: [
          '\\[사진',
          '\\[찰칵',
          '부음',
          '인사\\]',
          '人事\\]',
          '단신\\]',
          '브리핑\\]',
          '\\[팔면봉\\]',
          '\\[플라자\\]',
          '한자\\]',
          '한자어\\]',
          '實用漢字',
          '실용한자',
          '영어\\]',
          '영단어\\]',
          '일어\\]',
          '중어\\]',
          '잉글리쉬\\]',
          '잉글리시\\]',
          'English\\]',
          '중국어',
          '오늘의 운세',
          '오늘의 날씨',
          '오늘의 경기',
          '\\[날씨',
          '알립니다',
          '신춘문예',
          '대진표',
          '편성표',
          '시세표',
          '등산표',
          '답사표',
          '10자\\]',
          '100자\\]',
          '신문은 ?선생님',
          '신문 ?활용 ?교육',
          '\\[NIE',
          '\\[바둑',
          '화요 ?바둑',
          '미니 ?해설',
          '바로잡습니다',
          '\\[발자취',
        ],
      },
      {
        target: 'PageType',
        patterns: ['^SN', '^ST'],
      },
      {
        target: 'NewsText',
        patterns: ['^\\[그래픽\\]'],
      },
    ],
    e: [
      {
        target: 'HeadLine',
        patterns: ['社說', '사설'],
      },
    ],
  },
  dong: {
    n: [
      {
        target: 'HeadLine',
        patterns: [
          '\\[사진',
          '포토',
          '그래픽\\]',
          'Brief\\]',
          '단신\\]',
          '브리핑\\]',
          '다이제스트',
          '간추린 뉴스',
          '인사\\]',
          '\\]인사',
          ' 인사',
          '라운지\\]',
          '부고',
          '시 읽기\\]',
          'dongA\\.com',
          '동아닷컴',
          '\\[오늘의 ',
          '\\[내일의 ',
          '신춘 ?문예',
          '소설\\]',
          '<\\?>',
          '기립니다',
          '300자',
          '100자',
          '10자',
          '주요 ?기사',
          '게시판',
          '문화가',
          '캠퍼스 ?소식',
          '학습 ?정보',
          '프로필\\]',
          '한수\\]',
          '바로잡습니다',
          '알려왔습니다',
          '알립니다',
          '풀어봅시다',
          '\\[사고\\]',
          '알림\\]',
          '신나는 공부',
          '신문과 놀자',
          '\\[영어',
          '영어\\]',
          'english\\]',
          '잉글리시\\]',
          '잉글리쉬\\]',
          '\\[주니어',
          '外$',
          '外\\)$',
        ],
      },
      {
        target: 'PageType',
        patterns: ['^카툰', '^간지', '^포토', '^만화', '^만평'],
      },
    ],
    e: [
      {
        target: 'HeadLine',
        patterns: ['社說', '사설'],
      },
    ],
  },
  joong: {
    n: [
      {
        target: 'HeadLine',
        patterns: [
          'Wide Shot',
          '초상화\\]',
          '마음 풍경',
          '만평',
          '단신\\]',
          '브리핑\\]',
          '브리핑',
          '^\\d+월 \\d+일',
          '外$',
          '外\\)$',
          '^JTBC',
          '독자 이벤트',
          '바로잡습니다',
          '인사\\]',
          '\\]인사',
          ' 인사',
          '부고',
          '\\[오늘의 ',
          '\\[내일의 ',
          '신춘 ?문예',
          '300자',
          '100자',
          '10자',
        ],
      },
      {
        target: 'NewsText',
        patterns: ['시가 있는 아침', '○.+?단 ?●'],
      },
    ],
    e: [
      {
        target: 'HeadLine',
        patterns: ['社說', '사설'],
      },
    ],
  },
  han: {
    n: [
      {
        target: 'HeadLine',
        patterns: [
          '브리핑',
          '오늘의',
          '내일의',
          '주말의',
          '킬',
          '버림',
          '불요',
          '그래프',
          '그래픽',
          '사진',
          '이미지',
          '일러스트',
          '단신',
          '인터넷 ?[톱탑]',
          '인사',
          '부고',
          '부음',
          '동정',
          '포토',
          '새책',
          '교육',
          '서문',
          '순위표',
          '주간 지표',
          '목차',
          '부제',
          '제목',
          '발제',
          '미세먼지',
          '날씨',
          '예보',
          '명단',
          '발문',
          '띠지',
          '타인의 시선',
          '렌즈 ?세상',
          '전적',
          '버릴 ?것',
          '삭제',
          '시각물',
          '알려왔습니다',
          '정정 ?보도',
          '공지',
          '기사 ?보고',
          '야근 ?보고',
          '조간 ?점검',
          '종합',
          '종합 ?중',
          '알림',
          '열쇳말',
          '본방 ?사수',
          '하이라이트',
          '인덱스',
          '지표',
          '머리말',
          '머리띠',
          '감독의 말',
        ],
      },
      {
        target: 'ByLine',
        patterns: ['사진부'],
      },
    ],
    x: [
      {
        target: 'NewsText',
        patterns: [
          '^♣H6s',
          '^♣H5s',
          '^♣H5c',
          '^♣H5C',
          '^♣H5S',
          '^♣H4s',
          '^\\[♣',
          '^<YONHAP PHOTO',
          '^\\<LFCR\\>♣H6s',
          '^\\<LFCR\\>♣H5s',
          '^\\<LFCR\\>♣H5c',
          '^\\<LFCR\\>♣H5C',
          '^\\<LFCR\\>♣H5S',
          '^\\<LFCR\\>♣H4s',
          '^\\<LFCR\\>\\[♣',
          '^\\<LFCR\\><YONHAP PHOTO',
        ],
      },
      {
        target: 'HeadLine',
        patterns: [
          '궂긴',
          '^동정',
          '\\/동정',
          ' 동정',
          '바로잡습니다',
          '알림',
          '오늘의 경기',
          '내일의 경기',
          '주말의 경기',
          '\\/감독의 말',
          '\\/전적',
          '\\/여행 ?공책',
          '인덱스',
          '쪽지 ?뉴스',
          '경제 ?지표',
          '수정 ?중',
          '\\(온\\)',
          '\\@온',
          '\\#온',
          '\\/온\\/',
          '온라인\\/',
          '\\/온라인',
          '^킬$',
          '^킬[\\-\\/\\(\\#\\=\\.]',
          '\\(킬',
          '\\/킬',
          '\\@킬',
          '\\#킬',
          '^버림$',
          '^버림[\\-\\/\\(\\#\\=\\.]',
          '\\(버림',
          '\\/버림',
          '\\@버림',
          '\\#버림',
          '^불요$',
          '^불요[\\-\\/\\(\\#\\=\\.]',
          '\\(불요',
          '\\/불요',
          '\\@불요',
          '\\#불요',
          '\\#인사',
          '\\/그래프',
          '그래프\\/',
          '\\/그래픽',
          '그래픽\\/',
          '\\=그래픽',
          '그래픽\\(',
          '그래픽용',
          '그림용',
          '자료용',
          '지도용',
          '\\/단신',
          '단신\\/',
          '토막 ?소식',
          '토막 ?뉴스',
          '\\/토막',
          '\\/머리띠',
          '\\/머리말',
          '\\/사이드',
          '[\\/@]본방사수',
          '\\/사진',
          '사진\\/',
          '\\/이미지',
          '이미지\\/',
          '\\/인사',
          '인사\\/',
          '인사 ?종합',
          '고경일의 풍경',
          '김수박의 민들레',
          '\\/옵스큐라',
          '\\/타인의 시선',
          '\\/포토 ?에세이',
          '\\/한겨레\\! 나의',
          '\\/열쇳말',
          '\\/인포그라픽',
          '\\/인터넷',
          '\\/띠지',
          '\\/글자',
          '\\/발문',
          '시인의 마을',
          '[\\/=]박스',
          '지면 ?계획',
          '출고 ?계획',
          '기사 ?계획',
          '\\=교육',
          '\\=서문',
          '\\/렌즈 ?세상',
          '\\/일러스트',
          '일러스트\\/',
          '\\/표',
          '표\\/',
          '\\=표',
          '@하이라이트',
          '사진 ?설명',
          '사진 ?재송',
          '\\/새책',
          '새책\\/',
        ],
      },

      {
        target: 'ByLine',
        patterns: ['00Scan', '아르바이트'],
      },
    ],
    e: [
      {
        target: 'HeadLine',
        patterns: ['社說', '사설'],
      },
    ],
  },
};

module.exports = { keywordMap };
