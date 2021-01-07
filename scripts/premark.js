const { naList } = require('../resource/naList');

/* export modules */
module.exports = { classMark, dupMark };

/* main */

/* actions */

function dupMark(data) {
  // 중복기사 추정 데이터 추출 - 최적화 위해 reduce 대신 for 구문 사용
  const dupMap = new Map(); // acc
  const searchSize = 300;
  for (let i = 0; i < data.length; i++) {
    const { ID, NewsText } = data[i];
    const minIndex = i - searchSize > 0 ? i - searchSize : 0;
    const searchTargets = data.slice(minIndex, i);
    const copys = searchTargets
      .filter((row) => checkSimilar(0.3, 3, row['NewsText'], NewsText))
      .map((row) => row['ID']);
    copys.length > 0 && dupMap.set(ID, copys);
    process.stdout.write(`Checking redundancy with ID:${ID}\r`);
  }
  console.log('Checking redundancy');
  // 중복 추정 아이디 후방 파급 적용
  for (let entry of dupMap) {
    const [id, dubIds] = entry;
    const backDubIds = dubIds
      .map((dubId) => (dupMap.has(dubId) ? dupMap.get(dubId) : []))
      .reduce((acc, curr) => [...acc, ...curr], []);
    dupMap.set(id, [...new Set([...dubIds, ...backDubIds])]);
  }

  // 중복기사 추정 데이터 마킹
  for (let entry of dupMap) {
    const [id, dubIds] = entry;
    const markIndex = data.findIndex((row) => row['ID'] === id);
    const subMarkIndices = dubIds.map((id) =>
      data.findIndex((row) => row['ID'] === id)
    );
    data[markIndex] = { ...data[markIndex], PreMark: 'd', Dup: id };
    subMarkIndices.forEach(
      (subid) => (data[subid] = { ...data[subid], PreMark: 'd', Dup: id })
    );
  }
  return data;
}

// 비기사/사설 추정 데이터 마킹, 신문사별 키워드 리스트 적용 필요
function classMark(newsType) {
  return function (data) {
    for (let i = 0; i < data.length; i++) {
      const { HeadLine, SubHeadLine, ByLine, NewsText, ...others } = data[i];
      const SearchLink = getSearchLink(newsType, NewsText);
      const WordCount =
        typeof NewsText === 'string' ? NewsText.split(/\s+/).length : 0;
      const PreMark = naList.some((item) => `${HeadLine}`.includes(item))
        ? 'n'
        : 'y';
      data[i] = {
        ...others,
        PreMark,
        Dup: null,
        Mark: null,
        HeadLine,
        SubHeadLine,
        ByLine,
        NewsText,
        SearchLink,
        WordCount,
      }; // 최종 열 순서 고려

      if (['사설', '기자'].some((item) => `${HeadLine}`.includes(item))) {
        data[i]['PreMark'] = 'e';
      }
    }
    return data;
  };
}

/* functions */
function getSearchLink(newsType, text) {
  const words = `${text}`.replace(/<CRLF>/g, ' ').split(/[^가-힣\w]+/);
  const getIds = (getSize, totalSize) => {
    const startId = Math.floor((totalSize - getSize) / 2);
    const endId = startId + getSize;
    return totalSize > getSize ? [startId, endId] : [0];
  };
  const targetWords = words.slice(...getIds(10, words.length));
  const joinedWords = targetWords.join(' ');
  const preStrMap = {
    cho: 'https://www.chosun.com/nsearch/?query=',
    han: 'http://search.hani.co.kr/Search?command=query&keyword=',
  };
  const preStr = preStrMap[newsType];

  return typeof text === 'string' ? `${preStr}${joinedWords}` : '';
}

function checkSimilar(bar, n, strA, strB) {
  const aSet = new Set(nGrams(n, strA));
  const bSet = new Set(nGrams(n, strB));
  const interSet = intersection(aSet, bSet);
  const interByA = interSet.size / aSet.size;
  const interByB = interSet.size / bSet.size;
  const lesser = interByA < interByB ? interByA : interByB;
  return lesser > bar;
}

function intersection(setA, setB) {
  const reducer = (acc, curr) => {
    setA.has(curr) && acc.add(curr);
    return acc;
  };
  return [...setB].reduce(reducer, new Set());
}

function nGrams(n, str) {
  const maxIndex = n - 1;
  const uniGrams = `${str}`.trim().split(/[\s.?!,]+/);
  const indexPairs = getIndexPairs(maxIndex);
  const indices = indexPairs.map((pair) => pair[0]);
  const jIndices = countUp(uniGrams.length - n);
  const gramsList = indexPairs.map((pair) => uniGrams.slice(...pair));
  const ngramPairs = jIndices.map((j) => indices.map((i) => gramsList[i][j]));

  function getIndexPairs(num) {
    // eslint-disable-next-line no-unused-vars
    function aux(acc, curr) {
      if (curr === num) {
        return [...acc, [curr]];
      } else {
        return aux([...acc, [curr, curr - num]], curr + 1);
      }
    }
    return aux([], 0);
  }

  function countUp(num) {
    return num < 0 ? [] : [...countUp(num - 1), num];
  }

  return ngramPairs.map((pair) => pair.join(' '));
}
