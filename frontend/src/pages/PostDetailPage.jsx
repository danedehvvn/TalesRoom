import { useParams } from 'react-router-dom';
import PostDeleteButton from '../components/PostDeleteButton'; // 삭제 버튼 (확인 팝업 → DELETE 요청 → 목록 이동)
import useAuth from '../hooks/useAuth'; // 로그인한 내 정보 { id, nickname, role } 꺼내기
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
    const { user } = useAuth(); // 로그인한 내 정보
    const isAdmin = user?.role === 'ADMIN'; // 관리자면 남의 글도 삭제 가능 (요구사항)

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

            {/* display:flex + gap → 버튼들을 가로로 나란히, 사이 간격 8px */}
            <div className="post-actions" style={{ marginTop: '20px', display: 'flex', gap: '8px' }}>
                <button onClick={() => navigate('/posts')} className="btn-back">목록으로</button>
                {/* 수정: 작성자만 (서버가 isMine = 글 작성자 id === 토큰의 id 로 알려줌) */}
                {/* Link(a 태그)는 밑줄·글꼴이 달라져서, 다른 버튼과 같은 button + navigate로 이동 */}
                {post.isMine && <button onClick={() => navigate(`/posts/${post.id}/edit`)} className="btn-back">수정</button>}
                {/* 삭제: 작성자 또는 관리자 (서버도 403으로 한 번 더 막음) */}
                {(post.isMine || isAdmin) && <PostDeleteButton postId={post.id} className="btn-back" />}
            </div>
        </div>
    );
}

export default PostDetailPage;