import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PostDeleteButton from '../components/PostDeleteButton';
import CommentSection from '../components/CommentSection';
import useAuth from '../hooks/useAuth';
import SpoilerCheckModal from '../components/SpoilerCheckModal';
import api from '../api/axiosInstance';
import '../styles/PostDetail.css';

function PostDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const isAdmin = user?.role === 'ADMIN';

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showSpoilerModal, setShowSpoilerModal] = useState(false);
    const [isSpoilerConfirmed, setIsSpoilerConfirmed] = useState(false);
    const [commentContent, setCommentContent] = useState('');

    const fetchPostDetail = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/posts/${id}`);
            const postData = res.data.data || res.data;
            setPost(postData);

            if (postData.isSpoiler && !isSpoilerConfirmed) {
                setShowSpoilerModal(true);
            }
        } catch (err) {
            console.error('게시글을 불러오지 못했습니다.', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostDetail();
    }, [id]);

    const handleSpoilerConfirm = () => {
        setIsSpoilerConfirmed(true);
        setShowSpoilerModal(false);
    };

    const handleSpoilerCancel = () => {
        setShowSpoilerModal(false);
        navigate('/posts');
    };

    // 댓글 작성 핸들러
    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentContent.trim()) return;

        try {
            await api.post(`/posts/${id}/comments`, { content: commentContent });
            setCommentContent('');
            fetchPostDetail();
        } catch (err) {
            console.error('댓글 작성 실패', err);
            alert('댓글 등록에 실패했습니다.');
        }
    };

    // 댓글 삭제 핸들러
    const handleCommentDelete = async (commentId) => {
        if (!window.confirm('정말 이 댓글을 삭제하시겠습니까?')) return;

        try {
            await api.delete(`/comments/${commentId}`);
            fetchPostDetail();
        } catch (err) {
            console.error('댓글 삭제 실패', err);
            alert('댓글 삭제에 실패했습니다.');
        }
    };

    if (loading || !post) {
        return <div className="loading">게시글을 불러오는 중입니다...</div>;
    }

    return (
        <div className="post-detail-container">
            <SpoilerCheckModal
                isOpen={showSpoilerModal}
                onConfirm={handleSpoilerConfirm}
                onCancel={handleSpoilerCancel}
            />

            {/* 게시글 헤더 */}
            <div className="post-header">
                <h2>{post.title}</h2>
                <div className="post-meta">
                    <span>조회수: {post.viewCount ?? 0}</span>
                    {post.isSpoiler && <span className="badge-spoiler">🚨 스포일러 포함</span>}
                </div>
            </div>

            <hr />

            {/* 본문 영역 */}
            <div className={`post-content-area ${post.isSpoiler && !isSpoilerConfirmed ? 'blurred' : ''}`}>
                <p>{post.content}</p>
            </div>

            <hr />

            {/* 댓글 컴포넌트 렌더링 */}
            <CommentSection
                comments={post.comments}
                commentContent={commentContent}
                setCommentContent={setCommentContent}
                onCommentSubmit={handleCommentSubmit}
                onCommentDelete={handleCommentDelete}
                user={user}
                isAdmin={isAdmin}
            />

            {/* 하단 버튼 영역 */}
            <div className="post-actions">
                <button onClick={() => navigate('/posts')} className="btn-back">목록으로</button>
                {post.isMine && <button onClick={() => navigate(`/posts/${post.id}/edit`)} className="btn-back">수정</button>}
                {(post.isMine || isAdmin) && <PostDeleteButton postId={post.id} className="btn-back" />}
            </div>
        </div>
    );
}

export default PostDetailPage;