function initPostForm() {
  const form = document.getElementById("postForm");
  if (!form) {
    return;
  }

  const session = getSession();
  if (!session) {
    window.location.href = "login.html";
    return;
  }

  const titleInput = document.getElementById("title");
  const contentInput = document.getElementById("content");
  const heading = document.getElementById("writeHeading");

  const editId = getQueryParam("id");
  const editingPost = editId ? getPostById(editId) : null;

  if (editingPost) {
    if (editingPost.authorUsername !== session.username) {
      window.location.href = "index.html";
      return;
    }
    heading.textContent = "게시글 수정";
    titleInput.value = editingPost.title;
    contentInput.value = editingPost.content;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    let isValid = true;

    showFormError(titleInput, document.getElementById("titleError"), title ? "" : "제목을 입력해주세요.");
    if (!title) {
      isValid = false;
    }

    showFormError(contentInput, document.getElementById("contentError"), content ? "" : "내용을 입력해주세요.");
    if (!content) {
      isValid = false;
    }

    if (!isValid) {
      return;
    }

    const posts = getPosts();

    if (editingPost) {
      const index = posts.findIndex((p) => p.id === editingPost.id);
      posts[index] = { ...editingPost, title, content };
      savePosts(posts);
      window.location.href = `post.html?id=${encodeURIComponent(editingPost.id)}`;
      return;
    }

    const newPost = {
      id: `post-${Date.now()}`,
      title,
      content,
      authorUsername: session.username,
      authorName: session.name,
      createdAt: new Date().toISOString(),
    };
    posts.push(newPost);
    savePosts(posts);
    window.location.href = `post.html?id=${encodeURIComponent(newPost.id)}`;
  });
}

initPostForm();
