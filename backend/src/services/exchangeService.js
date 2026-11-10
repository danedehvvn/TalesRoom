import { useState, useEffect } from 'react';
import { fetchItems, exchangeItem, fetchMyExchanges } from '../api/exchangeApi';
import { fetchMyInfo } from '../api/userApi';
import { isLoggedIn, getErrorMessage } from '../api/axiosInstance'; 
import '../styles/ExchangePage.css';

function ExchangePage() {
  const [items, setItems] = useState([]);
  const [myHistory, setMyHistory] = useState([]);
  
  const [user, setUser] = useState({
    nickname: '',
    username: '',
    score: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const CONVERSION_RATE = 10;
  const availablePoints = user.score * CONVERSION_RATE;

  const loadData = async () => {
    try {
      setLoading(true);
      const itemsData = await fetchItems();
      setItems(itemsData);

      if (isLoggedIn()) {
        const myInfoData = await fetchMyInfo();
        setUser(myInfoData);

        const historyData = await fetchMyExchanges();
        setMyHistory(historyData);
      }
    } catch (err) {
      console.error('데이터 로드 실패:', err);
      setError(getErrorMessage(err, '데이터를 불러오는 중 오류가 발생했습니다.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExchangeClick = async (itemId, itemName, price) => {
    if (!isLoggedIn()) {
      alert('로그인이 필요한 서비스입니다.');
      return;
    }

    if (availablePoints < price) {
      alert('보유 포인트가 부족합니다. 커뮤니티 활동에 더 참여해 보세요.');
      return;
    }

    if (!window.confirm(`"${itemName}" 상품을 ${price.toLocaleString()} 포인트로 교환하시겠습니까?`)) {
      return;
    }

    try {
      await exchangeItem(itemId, 1);
      alert('상품 교환이 완료되었습니다.');
      loadData();
    } catch (err) {
      const errorMsg = getErrorMessage(err, '교환 중 오류가 발생했습니다.');
      alert(errorMsg);
    }
  };

  if (loading) return <div className="exchange-loading">로딩 중...</div>;
  if (error) return <div className="exchange-error">{error}</div>;

  const displayName = user.nickname || user.username || '회원';

  return (
    <div className="exchange-page">
      <div className="exchange-page__header">
        <h2 className="exchange-page__title">포인트 교환소</h2>
        <p className="exchange-page__description">
          커뮤니티 활동 점수가 포인트로 10배 자동 환산됩니다. (1점 = 10P)
        </p>
      </div>

      {isLoggedIn() && (
        <div className="exchange-banner">
          <div className="exchange-banner__welcome">
            <span>환영합니다, <strong>{displayName}</strong>님</span>
          </div>
          <div className="exchange-banner__stats">
            <div className="exchange-banner__stat-item">
              <span className="exchange-banner__label">내 활동 점수</span>
              <span className="exchange-banner__score-value">{user.score.toLocaleString()} 점</span>
            </div>
            <div className="exchange-banner__divider"></div>
            <div className="exchange-banner__stat-item">
              <span className="exchange-banner__label">사용 가능 포인트</span>
              <span className="exchange-banner__point-value">{availablePoints.toLocaleString()} P</span>
            </div>
          </div>
        </div>
      )}

      <section className="exchange-section">
        <h3 className="exchange-section__title">교환 가능한 상품</h3>
        <div className="exchange-grid">
          {items.map((item) => {
            const isAffordable = availablePoints >= item.price;
            const isSoldOut = item.stock <= 0;

            return (
              <div key={item.id} className={`exchange-card ${isSoldOut ? 'sold-out' : ''}`}>
                <div>
                  <h4 className="exchange-card__name">{item.name}</h4>
                  <p className="exchange-card__desc">{item.description}</p>
                </div>

                <div className="exchange-card__footer">
                  <div className="exchange-card__price-info">
                    <span className="exchange-card__price">{item.price.toLocaleString()} P</span>
                    <span className="exchange-card__stock">재고: {item.stock}개</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleExchangeClick(item.id, item.name, item.price)}
                    disabled={isSoldOut || (isLoggedIn() && !isAffordable)}
                    className="exchange-card__button"
                  >
                    {isSoldOut ? '품절' : !isAffordable && isLoggedIn() ? '포인트 부족' : '교환하기'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="history-section">
        <h3 className="exchange-section__title history-title">나의 교환 내역</h3>
        {!isLoggedIn() ? (
          <p className="history-login-guide">로그인 후 교환 내역을 확인하실 수 있습니다.</p>
        ) : myHistory.length === 0 ? (
          <p className="history-empty">아직 교환한 상품이 없습니다.</p>
        ) : (
          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>상품명</th>
                  <th>수량</th>
                  <th>사용 포인트</th>
                  <th>교환 일시</th>
                </tr>
              </thead>
              <tbody>
                {myHistory.map((history) => (
                  <tr key={history.id}>
                    <td className="history-table__name">{history.itemName}</td>
                    <td>{history.quantity}개</td>
                    <td className="history-table__points">-{history.usedPoints.toLocaleString()} P</td>
                    <td className="history-table__date">
                      {new Date(history.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ExchangePage;