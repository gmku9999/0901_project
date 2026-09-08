async function initProfilePage() {
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

  guard.hidden = true;
  content.hidden = false;

  document.getElementById("profileName").textContent = session.name;
  document.getElementById("profileUsername").textContent = `@${session.username}`;
  document.getElementById("profileEmail").textContent = session.email;
  document.getElementById("profileJoined").textContent = `${formatDate(session.joinedAt)} 가입`;

  const listEl = document.getElementById("myPostList");
  listEl.innerHTML = '<p class="form-footnote">게시글을 불러오는 중입니다...</p>';

  let posts;
  try {
    posts = await fetchPosts();
  } catch (error) {
    listEl.innerHTML = "";
    const failed = document.createElement("p");
    failed.className = "form-footnote";
    failed.textContent = "게시글을 불러오지 못했습니다.";
    listEl.appendChild(failed);
    return;
  }

  const myPosts = posts
    .filter((post) => post.authorUsername === session.username)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

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
