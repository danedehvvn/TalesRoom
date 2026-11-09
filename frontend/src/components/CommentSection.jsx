import React from 'react';

function CommentSection({
    comments,
    commentContent,
    setCommentContent,
    onCommentSubmit,
    onCommentDelete,
    user,
    isAdmin,
}) {
    return (
        <div className="comments-section">
            <h3>댓글 ({comments?.length || 0})</h3>

            {/* 댓글 작성 폼 (로그인한 경우에만 노출) */}
            {user ? (
                <form onSubmit={onCommentSubmit} className="comment-form">
                    <textarea
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        placeholder="댓글을 남겨보세요..."
                        rows="3"
                        className="comment-textarea"
                    />
                    <button type="submit" className="comment-submit-btn">
                        등록
                    </button>
                </form>
            ) : (
                <p className="login-guide">
                    댓글을 작성하려면 <a href="/login" className="login-link">로그인</a>이 필요합니다.
                </p>
            )}

            {/* 댓글 목록 */}
            {comments && comments.length > 0 ? (
                <ul className="comment-list">
                    {comments.map((comment, index) => {
                        const commentUserId = comment.userId || comment.memberId || comment.authorId || comment.author?.id;
                        const currentUserId = user?.id || user?.userId;
                        const isMyComment = comment.isMine || (currentUserId && commentUserId && String(currentUserId) === String(commentUserId));

                        return (
                            <li key={comment.id || index} className="comment-item">
                                <div className="comment-item-inner">
                                    <div className="comment-content-box">
                                        <div className="comment-info-row">
                                            <span className="comment-author-name">
                                                {comment.author?.nickname || comment.author?.name || comment.authorName || '방탈출러'}
                                            </span>
                                            <span className="comment-date">
                                                {comment.createdAt ? comment.createdAt.replace('T', ' ').substring(0, 16) : ''}
                                            </span>
                                        </div>
                                        <p className="comment-text">{comment.content}</p>
                                    </div>

                                    {/* 작성자 본인 또는 관리자일 때만 노출되는 삭제 버튼 */}
                                    {(isMyComment || isAdmin) && (
                                        <button
                                            onClick={() => onCommentDelete(comment.id)}
                                            className="comment-delete-btn"
                                        >
                                            삭제
                                        </button>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="no-comments">작성된 댓글이 없습니다.</p>
            )}
        </div>
    );
}

export default CommentSection;