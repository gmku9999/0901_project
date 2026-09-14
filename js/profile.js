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
  await renderMyPosts(listEl, session);
}

async function renderMyPosts(listEl, session) {
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
    const item = document.createElement("div");
    item.className = "post-card my-post-card";

    const info = document.createElement("div");
    info.className = "my-post-info";

    const titleLink = document.createElement("a");
    titleLink.className = "my-post-title";
    titleLink.href = `post.html?id=${encodeURIComponent(post.id)}`;
    const title = document.createElement("h3");
    title.textContent = post.title;
    titleLink.appendChild(title);

    const date = document.createElement("p");
    date.className = "post-meta";
    date.textContent = formatDate(post.createdAt);

    info.append(titleLink, date);

    const actions = document.createElement("div");
    actions.className = "my-post-actions";

    const editLink = document.createElement("a");
    editLink.className = "button secondary";
    editLink.href = `write.html?id=${encodeURIComponent(post.id)}`;
    editLink.textContent = "수정";

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "button danger";
    deleteBtn.textContent = "삭제";
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
        await renderMyPosts(listEl, session);
      } catch (error) {
        window.alert("서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.");
        deleteBtn.disabled = false;
      }
    });

    actions.append(editLink, deleteBtn);
    item.append(info, actions);
    listEl.appendChild(item);
  });
}

initProfilePage();
