function initProfilePage() {
  const guard = document.getElementById("profileGuard");
  const content = document.getElementById("profileContent");
  if (!guard || !content) {
    return;
  }

  const session = getSession();
  if (!session) {
    guard.hidden = false;
    content.hidden = true;
    return;
  }

  const user = findUser(session.username);
  guard.hidden = true;
  content.hidden = false;

  document.getElementById("profileName").textContent = user.name;
  document.getElementById("profileUsername").textContent = `@${user.username}`;
  document.getElementById("profileEmail").textContent = user.email;
  document.getElementById("profileJoined").textContent = `${formatDate(user.joinedAt)} 가입`;

  const myPosts = getPosts()
    .filter((post) => post.authorUsername === user.username)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const listEl = document.getElementById("myPostList");
  listEl.innerHTML = "";

  if (myPosts.length === 0) {
    const empty = document.createElement("p");
    empty.className = "form-footnote";
    empty.textContent = "아직 작성한 게시글이 없습니다.";
    listEl.appendChild(empty);
    return;
  }

  myPosts.forEach((post) => {
    const item = document.createElement("a");
    item.className = "post-card";
    item.href = `post.html?id=${encodeURIComponent(post.id)}`;

    const title = document.createElement("h3");
    title.textContent = post.title;

    const date = document.createElement("p");
    date.className = "post-meta";
    date.textContent = formatDate(post.createdAt);

    item.append(title, date);
    listEl.appendChild(item);
  });
}

initProfilePage();
