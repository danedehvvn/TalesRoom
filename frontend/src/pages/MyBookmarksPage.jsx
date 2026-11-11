import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MyPageHeader from '../components/MyPageHeader';
import Pagination from '../components/Pagination';
import ThemeThumbnail from '../components/ThemeThumbnail';
import BookmarkButton from '../components/BookmarkButton';
import { fetchMyBookmarks } from '../api/userApi';
import { themeError } from '../api/themeApi';
import useAuth from '../hooks/useAuth';
import '../styles/MyPage.css';
import '../styles/MyBookmarksPage.css';

const PAGE_SIZE = 6;

export default function MyBookmarksPage() {
  const { user, isLoggedIn } = useAuth();
  const [params, setParams] = useSearchParams();
  const rawPage = Number(params.get('page') || 1);
  const page = Number.isSafeInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const userId = user?.id ?? user?.userId;
  const [state, setState] = useState({});
  const [retry, setRetry] = useState(0);
  const [notice, setNotice] = useState('');
  const requestKey = JSON.stringify([userId, page, retry]);
  const loading = state.key !== requestKey;
  useEffect(() => {
    if (!isLoggedIn) return;
    const controller = new AbortController();
    fetchMyBookmarks({ page, size: PAGE_SIZE }, controller.signal).then((data) => {
      if (!controller.signal.aborted) setState({ key: requestKey, data });
    }).catch((error) => {
      if (!controller.signal.aborted) setState({ key: requestKey, error: themeError(error) });
    });
    return () => controller.abort();
  }, [page, requestKey, isLoggedIn]);
  function changePage(number) {
    const next = new URLSearchParams(params);
    if (number === 1) next.delete('page'); else next.set('page', String(number));
    setParams(next);
  }
  function removed() {
    setNotice('북마크를 해제했습니다.');
    if (state.data?.items.length === 1 && page > 1) changePage(page - 1);
    else setRetry((value) => value + 1);
  }
  if (!isLoggedIn) return null;
  const data = state.data;
  return <div className="mypage-shell mypage-shell--activity my-bookmarks-page">
    <MyPageHeader backToMyPage eyebrow="MY BOOKMARKS" title="내 북마크 테마" description="관심 있는 테마를 모아 보고, 다음 방탈출을 골라보세요." />
    {notice && <p className="mypage-notice" role="status">{notice}</p>}
    <section className="mypage-card mypage-list-card" aria-label="내 북마크 테마 목록" aria-busy={loading}>
      <div className="mypage-list-toolbar"><strong>전체 테마 {loading ? '…' : data?.totalCount ?? '—'}개</strong><Link to="/themes" className="my-bookmarks-explore">테마 둘러보기 →</Link></div>
      {loading ? <div className="mypage-state" role="status">북마크한 테마를 불러오는 중이에요.</div> : state.error ? <div className="mypage-state" role="alert"><p>{state.error}</p><button onClick={() => setRetry((value) => value + 1)}>다시 시도</button></div> : !data.items.length ? <div className="mypage-state"><p>{page > 1 ? '이 페이지에는 북마크한 테마가 없습니다.' : '아직 북마크한 테마가 없습니다.'}</p>{page > 1 ? <button onClick={() => changePage(1)}>첫 페이지로</button> : <Link to="/themes" className="mypage-outline-button">관심 있는 테마 찾아보기</Link>}</div> : <ul className="my-bookmarks-list">{data.items.map((theme) => <li key={theme.id} className="my-bookmark-row">
        <Link to={`/themes/${theme.id}`} className="my-bookmark-theme"><div className="my-bookmark-image"><ThemeThumbnail url={theme.thumbnailUrl} /></div><div className="my-bookmark-copy"><span>{theme.genre && theme.genre !== '?' ? theme.genre : '미분류'}</span><h2>{theme.title}</h2><p>{theme.storeName || theme.store_name}</p></div></Link>
        <BookmarkButton themeId={theme.id} title={theme.title} isBookmarked={theme.isBookmarked} onChange={(active) => { if (!active) removed(); }} />
      </li>)}</ul>}
    </section>
    {!loading && !state.error && <Pagination page={page} totalPages={data.totalPages} onChange={changePage} />}
  </div>;
}
