import { useEffect, useState } from "react";
import { fetchHallOfFame } from "../../api/userApi";

function HomeLeaderboard() {
  const [state, setState] = useState({ loading: true, items: [], error: "" });
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;

    fetchHallOfFame()
      .then((data) => {
        if (active) setState({ loading: false, items: Array.isArray(data) ? data : [], error: "" });
      })
      .catch(() => {
        if (active) setState({ loading: false, items: [], error: "명예의 전당을 불러오지 못했어요." });
      });

    return () => {
      active = false;
    };
  }, [retry]);

  return (
    <section className="tr-home-section tr-home-leaderboard" aria-labelledby="home-leaderboard-title">
      <div className="tr-home-section-heading">
        <div>
          <span className="tr-home-section-kicker">HALL OF FAME</span>
          <h2 id="home-leaderboard-title">방탈출 명예의 전당</h2>
          <p>활동 점수가 높은 다섯 명의 탈출러를 소개합니다.</p>
        </div>
      </div>

      <div className="tr-home-ranking-card">
        {state.loading && <p className="tr-home-panel-state">정보를 불러오는 중이에요.</p>}
        {!state.loading && state.error && (
          <div className="tr-home-panel-state">
            <p>{state.error}</p>
            <button
              type="button"
              onClick={() => {
                setState((current) => ({ ...current, loading: true, error: "" }));
                setRetry((value) => value + 1);
              }}
            >
              다시 시도
            </button>
          </div>
        )}
        {!state.loading && !state.error && state.items.length === 0 && (
          <p className="tr-home-panel-state">아직 명예의 전당에 오른 회원이 없어요.</p>
        )}
        {!state.loading && !state.error && state.items.length > 0 && (
          <ol className="tr-home-ranking-list">
            {state.items.slice(0, 5).map((user, index) => (
              <li key={user.id} className={`tr-home-rank tr-home-rank--${index + 1}`}>
                <span className="tr-home-rank-number">{index + 1}</span>
                <span className="tr-home-rank-avatar" aria-hidden="true">
                  {Array.from(user.nickname || "탈")[0]}
                </span>
                <span className="tr-home-rank-user">
                  <strong>{user.nickname || user.id}</strong>
                  <small>{user.grade || "방린이"}</small>
                </span>
                <strong className="tr-home-rank-score">{Number(user.score || 0).toLocaleString()}점</strong>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}

export default HomeLeaderboard;
