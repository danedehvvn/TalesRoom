export function postFlag(value) {
  return value === true || value === 1 || value === '1';
}

export function isAcceptedReply(comment, acceptedId) {
  return postFlag(comment.isAccepted) || (acceptedId != null && String(comment.id) === String(acceptedId));
}

export function isSolvedPost(post) {
  return postFlag(post.isSolved) || (post.acceptedId != null && Number(post.acceptedId) > 0) || (post.comments || []).some((comment) => isAcceptedReply(comment, post.acceptedId));
}

export function ownsComment(comment, user) {
  const authorId = comment.author?.userId ?? comment.author?.id ?? comment.userId;
  const userId = user?.id ?? user?.userId;
  return Boolean(user && (postFlag(comment.isMine) || (authorId != null && userId != null && String(authorId) === String(userId))));
}
