
const axios = require('axios');
const fs = require('fs/promises');
const path = require('path');
const { testCrawling } = require('./test');

// 실제 잼핏 지역 ID 확인 후 수정
const areaIds = [1, 2, 3, 4, 5, 6];

const sleep = ms =>
  new Promise(resolve => setTimeout(resolve, ms));

async function crawl180() {
  const themes = [];
  const failed = [];
  const ids = new Set();

  for (const areaId of areaIds) {
    console.log(`\n===== 지역 ${areaId} 수집 시작 =====`);

    try {
      // 1. 지역별 목록 30개 조회
      const response = await axios.get(
        'https://web.zamfit.kr/api/escapes',
        {
          params: {
            page: 1,
            size: 30,
            areaIds: areaId
          },
          timeout: 15000
        }
      );

      const items = response.data?.data?.content;

      if (!Array.isArray(items)) {
        throw new Error('목록 응답 형식이 올바르지 않습니다.');
      }

      console.log(`목록 ${items.length}개 확인`);

      // 2. 상세 데이터 수집
      for (const item of items.slice(0, 30)) {
        if (ids.has(item.id)) {
          console.log(`중복 건너뜀: ${item.id}`);
          continue;
        }

        const url =
          `https://web.zamfit.kr/escapes/${item.id}/${encodeURIComponent(item.name.trim())}`;

        try {
          const theme = await testCrawling(url);

          if (theme?.id !== item.id || !theme.title) {
            throw new Error('상세 데이터 ID 또는 제목 불일치');
          }

          themes.push(theme);
          ids.add(theme.id);

          console.log(`✅ ${theme.id} - ${theme.title}`);

        } catch (error) {
          failed.push({
            id: item.id,
            name: item.name,
            url,
            error: error.message
          });

          console.log(`❌ ${item.id}: ${error.message}`);
        }

        // 요청 간격 유지
        await sleep(1500);
      }

    } catch (error) {
      console.error(`지역 ${areaId} 실패:`, error.message);
    }

    // 지역별 결과 저장
    const dataDir = path.join(__dirname, 'data');
    await fs.mkdir(dataDir, { recursive: true });

    await fs.writeFile(
      path.join(dataDir, 'themes180.json'),
      JSON.stringify(themes, null, 2),
      'utf8'
    );

    await fs.writeFile(
      path.join(dataDir, 'failed.json'),
      JSON.stringify(failed, null, 2),
      'utf8'
    );

    console.log(`현재 누적: ${themes.length}개`);
  }

  console.log('\n===== 수집 결과 =====');
  console.log(`성공: ${themes.length}개`);
  console.log(`실패: ${failed.length}개`);
}

crawl180().catch(console.error);
