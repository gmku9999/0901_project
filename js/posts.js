function initPostList() {
  const listEl = document.getElementById("postList");
  if (!listEl) {
    return;
  }

  const posts = getPosts()
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  listEl.innerHTML = "";

  if (posts.length === 0) {
    const empty = document.createElement("div");
    empty.className = "empty-state";

    const text = document.createElement("p");
    text.textContent = "아직 작성된 게시글이 없습니다.";

    const link = document.createElement("a");
    link.className = "button primary";
    link.href = "write.html";
    link.textContent = "첫 게시글 작성하기";

    empty.append(text, link);
    listEl.appendChild(empty);
    return;
  }

  posts.forEach((post) => {
    const card = document.createElement("a");
    card.className = "post-card";
    card.href = `post.html?id=${encodeURIComponent(post.id)}`;

    const meta = document.createElement("p");
    meta.className = "post-meta";
    const author = document.createElement("span");
    author.textContent = post.authorName;
    const date = document.createElement("span");
    date.textContent = formatDate(post.createdAt);
    meta.append(author, date);

    const title = document.createElement("h3");
    title.textContent = post.title;

    const excerpt = document.createElement("p");
    const flatContent = post.content.replace(/\n/g, " ");
    excerpt.textContent = flatContent.length > 90 ? `${flatContent.slice(0, 90)}...` : flatContent;

    card.append(meta, title, excerpt);
    listEl.appendChild(card);
  });
}

initPostList();
