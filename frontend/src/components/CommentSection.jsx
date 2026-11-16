import { Link } from 'react-router-dom';
import { formatDate } from '../utils/postFormat';
import { isAcceptedReply, isSolvedPost, ownsComment } from '../utils/communityPost';

export default function CommentSection({ post, commentContent, setCommentContent, onCommentSubmit, onCommentDelete, onCommentAccept, user, isAdmin, pending }) {
  const comments = [...(post.comments || [])].sort((a, b) => Number(isAcceptedReply(b, post.acceptedId)) - Number(isAcceptedReply(a, post.acceptedId)));
  const solved = isSolvedPost(post);
  return <section className="comments-section">
    <div className="comments-heading"><h2>댓글 <span>{comments.length}</span></h2>{post.category === 'QUESTION' && <p>질문 작성자는 댓글을 답변으로 채택할 수 있어요.</p>}</div>
    <ul className="comment-list">{comments.map((comment) => {
      const accepted = isAcceptedReply(comment, post.acceptedId);
      const mine = ownsComment(comment, user);
      const name = comment.author?.nickname || '익명';
      const canAccept = user && post.isMine && post.category === 'QUESTION' && !solved && !mine;
      return <li key={comment.id} className={`comment-item ${accepted ? 'comment-item--accepted' : ''}`}>
        <span className="post-avatar" aria-hidden="true">{Array.from(name)[0]}</span><div className="comment-content-box"><div className="comment-info-row"><strong>{name}</strong>{comment.author?.grade && <span className="post-grade-badge">{comment.author.grade}</span>}{accepted && <span className="comment-accepted-badge">✓ 채택된 답변</span>}</div><p className="comment-text">{comment.content}</p></div>
        <div className="comment-item-actions"><time dateTime={comment.createdAt}>{formatDate(comment.createdAt)}</time><div>{canAccept && <button type="button" disabled={pending} className="comment-accept-button" onClick={() => onCommentAccept(comment.id)}>채택</button>}{(mine || isAdmin) && <button type="button" disabled={pending} className="comment-delete-button" onClick={() => onCommentDelete(comment.id)}>삭제</button>}</div></div>
      </li>;
    })}</ul>
    {!comments.length && <p className="no-comments">첫 번째 댓글을 남겨보세요.</p>}
    {user ? <form onSubmit={onCommentSubmit} className="comment-form"><textarea aria-label="댓글 내용" value={commentContent} onChange={(event) => setCommentContent(event.target.value)} placeholder="댓글을 작성해보세요!" rows="1" required disabled={pending} /><button className="comment-submit-button" disabled={pending || !commentContent.trim()}>{pending ? '처리 중…' : '등록'}</button></form> : <p className="post-login-guide">댓글을 작성하려면 <Link to="/login">로그인</Link>해 주세요.</p>}
  </section>;
}
