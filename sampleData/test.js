
const axios = require('axios');
const cheerio = require('cheerio');

// 중첩된 JSON 객체 추출
function extractJsonObject(text, start) {
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = start; i < text.length; i++) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
    } else if (ch === '{') {
      depth++;
    } else if (ch === '}') {
      depth--;

      if (depth === 0) {
        return JSON.parse(text.slice(start, i + 1));
      }
    }
  }

  throw new Error('JSON 객체가 완성되지 않았습니다.');
}

async function testCrawling(url) {
  console.log('크롤링 시작:', url);

  const response = await axios.get(url);

  console.log('HTTP 상태:', response.status);

  const $ = cheerio.load(response.data);

  // Next.js Flight 데이터 문자열 추출
  const chunks = [];

  $('script').each((_, el) => {
    const script = $(el).html() || '';

    const match = script.match(
      /self\.__next_f\.push\(\[1,\s*("(?:\\.|[^"\\])*")\s*\]\)/s
    );

    if (match) {
      chunks.push(JSON.parse(match[1]));
    }
  });

  const flightData = chunks.join('');

  // 실제 테마 상세 객체 검색
  const marker = '"escapeRoom":{';
  const index = flightData.indexOf(marker);

  if (index === -1) {
    throw new Error('escapeRoom 상세 데이터를 찾지 못했습니다.');
  }

  const start = index + '"escapeRoom":'.length;
  const room = extractJsonObject(flightData, start);

  // TalesRoom DB 형식으로 변환
  const theme = {
    id: room.escapeRoomId,
    title: room.name,
    storeName: room.store?.title ?? null,
    address: room.store?.address ?? null,
    content: room.introduction,
    minPeople: room.recommendMinPeopleCount,
    maxPeople: room.recommendMaxPeopleCount,
    playTime: room.playTime,
    difficulty: room.level,
    price: room.prices?.[0]?.peopleCount > 0
    ? Math.round(room.prices[0].price / room.prices[0].peopleCount)
    : null,
    genre: room.genre,
    thumbnailUrl:
      room.resizeThumbnailUrl ||
      room.thumbnailUrl ||
      room.images?.[0] ||
      null,
    latitude: room.store?.y ?? null, //y좌표
    longitude: room.store?.x ?? null //x좌표
  };

  return theme;
}

module.exports = { testCrawling };