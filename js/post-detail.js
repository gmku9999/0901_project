async function initPostDetail() {
  const titleEl = document.getElementById("postTitle");
  if (!titleEl) {
    return;
  }

  const detail = document.getElementById("postDetail");
  const notFound = document.getElementById("postNotFound");
  const id = getQueryParam("id");

  detail.hidden = true;
  notFound.hidden = true;

  if (!id) {
    notFound.hidden = false;
    return;
  }

  let posts;
  try {
    posts = await fetchPosts();
  } catch (error) {
    notFound.hidden = false;
    return;
  }

  const post = posts.find((p) => p.id === id);

  if (!post) {
    notFound.hidden = false;
    return;
  }

  detail.hidden = false;
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

    const deleteBtn = document.getElementById("deletePostBtn");
    deleteBtn.addEventListener("click", async () => {
      if (!window.confirm("이 게시글을 삭제하시겠습니까?")) {
        return;
      }

      deleteBtn.disabled = true;
      try {
        const result = await deletePostRemote(post.id, session.username);
        if (!result.success) {
          window.alert(result.error || "삭제에 실패했습니다.");
          deleteBtn.disabled = false;
          return;
        }
        window.location.href = "index.html";
      } catch (error) {
        window.alert("서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.");
        deleteBtn.disabled = false;
      }
    });
  }
}

initPostDetail();
