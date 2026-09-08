function initPostDetail() {
  const titleEl = document.getElementById("postTitle");
  if (!titleEl) {
    return;
  }

  const id = getQueryParam("id");
  const post = id ? getPostById(id) : null;
  const detail = document.getElementById("postDetail");
  const notFound = document.getElementById("postNotFound");

  if (!post) {
    detail.hidden = true;
    notFound.hidden = false;
    return;
  }

  document.title = `${post.title} | 홍길동의 블로그`;
  titleEl.textContent = post.title;
  document.getElementById("postAuthor").textContent = post.authorName;
  document.getElementById("postDate").textContent = formatDate(post.createdAt);
  document.getElementById("postBody").textContent = post.content;

  const session = getSession();
  if (session && session.username === post.authorUsername) {
    const actions = document.getElementById("postOwnerActions");
    actions.hidden = false;
    document.getElementById("editPostLink").href = `write.html?id=${encodeURIComponent(post.id)}`;
    document.getElementById("deletePostBtn").addEventListener("click", () => {
      if (!window.confirm("이 게시글을 삭제하시겠습니까?")) {
        return;
      }
      savePosts(getPosts().filter((p) => p.id !== post.id));
      window.location.href = "index.html";
    });
  }
}

initPostDetail();
