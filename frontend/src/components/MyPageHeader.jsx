function MyPageHeader({ eyebrow, title, description }) {
  return (
    <header className="mypage-heading">
      <p className="mypage-heading__eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p className="mypage-heading__description">{description}</p>
    </header>
  );
}

export default MyPageHeader;
