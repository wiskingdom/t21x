const keywordMap = {
  cho: {
    n: [
      {
        target: 'HeadLine',
        patterns: [
          '\\[사진',
          '부음',
          '단신\\]',
          '한자\\]',
          '한자어\\]',
          '實用漢字',
          '실용한자',
          '영어\\]',
          '영단어\\]',
          '일어\\]',
          '중어\\]',
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
};

module.exports = { keywordMap };
