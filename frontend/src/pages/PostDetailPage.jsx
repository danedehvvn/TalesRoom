import { useParams } from 'react-router-dom';
import { usePostDetail } from '../hooks/usePostDetail';
import SpoilerCheckModal from '../components/SpoilerCheckModal';
import '../styles/PostDetail.css';

function PostDetailPage() {
    const { id } = useParams();
    const {
        post,
        loading,
        showSpoilerModal,
        isSpoilerConfirmed,
        handleSpoilerConfirm,
        handleSpoilerCancel,
        navigate,
    } = usePostDetail(id);

    if (loading || !post) {
        return <div className="loading">게시글을 불러오는 중입니다...</div>;
    }

    return (
        <div className="post-detail-container">
            {/* 스포일러 경고 모달 */}
            <SpoilerCheckModal
                isOpen={showSpoilerModal}
                onConfirm={handleSpoilerConfirm}
                onCancel={handleSpoilerCancel}
            />

            {/* 게시글 헤더 (제목, 조회수, 스포일러 여부) */}
            <div className="post-header">
                <h2>{post.title}</h2>
                <div className="post-meta">
                    <span>조회수: {post.viewCount ?? 0}</span>
                    {post.isSpoiler && <span className="badge-spoiler">🚨 스포일러 포함</span>}
                </div>
            </div>

            <hr />

            {/* 본문 영역 (스포일러 동의 전에는 블러 처리) */}
            <div className={`post-content-area ${!isSpoilerConfirmed ? 'blurred' : ''}`}>
                <p>{post.content}</p>
            </div>

            <hr />

            {/* 댓글 목록 영역 */}
            <div className="comments-section">
                <h3>댓글 ({post.comments?.length || 0})</h3>
                {post.comments && post.comments.length > 0 ? (
                    <ul>
                        {post.comments.map((comment, index) => (
                            <li key={comment.id || index} className="comment-item">
                                <span className="comment-text">{comment.content}</span>
                                {comment.author && (
                                    <span className="comment-author">
                                        ({comment.author.nickname || comment.author.id})
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="no-comments">작성된 댓글이 없습니다.</p>
                )}
            </div>

            <div className="post-actions" style={{ marginTop: '20px' }}>
                <button onClick={() => navigate('/posts')} className="btn-back">목록으로</button>
            </div>
        </div>
    );
}

export default PostDetailPage;