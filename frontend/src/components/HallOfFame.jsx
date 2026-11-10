import { useEffect, useState } from "react";
import { fetchHallOfFame } from "../api/userApi";
import "../styles/HallOfFame.css";

function HallOfFame() {
    const [ranking, setRanking] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHallOfFame()
            .then((data) => setRanking(data || []))
            .catch((err) => console.error("명예의 전당 불러오기 실패:", err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="hof-loading">명예의 전당 불러오는 중...</div>;

    return (
        <div className="hall-of-fame-card">
            <h3 className="hof-title">🏆 방탈출 명예의 전당</h3>
            <p className="hof-subtitle">이번 달 가장 활발하게 탈출을 돕고 있는 방탈출러들입니다!</p>
            
            {ranking.length === 0 ? (
                <p className="hof-empty">아직 등록된 랭커가 없습니다.</p>
            ) : (
                <ul className="hof-list">
                    {ranking.map((user, index) => {
                        const rankNum = index + 1;
                        let medal = `${rankNum}위`;
                        if (rankNum === 1) medal = '🥇';
                        else if (rankNum === 2) medal = '🥈';
                        else if (rankNum === 3) medal = '🥉';

                        return (
                            <li key={user.id} className={`hof-item rank-${rankNum}`}>
                                <span className="hof-rank">{medal}</span>
                                <div className="hof-user-info">
                                    <span className="hof-nickname">{user.nickname}</span>
                                    <span className="hof-grade-badge">{user.grade}</span>
                                </div>
                                <span className="hof-score">{user.score}점</span>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}

export default HallOfFame;