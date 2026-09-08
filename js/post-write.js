async function initPostForm() {
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
  const submitBtn = form.querySelector('button[type="submit"]');

  const editId = getQueryParam("id");
  let editingPost = null;

  if (editId) {
    submitBtn.disabled = true;
    try {
      const posts = await fetchPosts();
      editingPost = posts.find((p) => p.id === editId);
    } catch (error) {
      editingPost = null;
    }
    submitBtn.disabled = false;

    if (!editingPost || editingPost.authorUsername !== session.username) {
      window.location.href = "index.html";
      return;
    }

    heading.textContent = "게시글 수정";
    titleInput.value = editingPost.title;
    contentInput.value = editingPost.content;
  }

  form.addEventListener("submit", async (event) => {
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

    submitBtn.disabled = true;

    try {
      if (editingPost) {
        const result = await updatePostRemote({
          id: editingPost.id,
          title,
          content,
          authorUsername: session.username,
        });

        if (!result.success) {
          window.alert(result.error || "수정에 실패했습니다.");
          return;
        }

        window.location.href = `post.html?id=${encodeURIComponent(editingPost.id)}`;
        return;
      }

      const result = await createPostRemote({
        title,
        content,
        authorUsername: session.username,
        authorName: session.name,
      });

      if (!result.success) {
        window.alert(result.error || "작성에 실패했습니다.");
        return;
      }

      window.location.href = `post.html?id=${encodeURIComponent(result.data.id)}`;
    } catch (error) {
      window.alert("서버와 통신할 수 없습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      submitBtn.disabled = false;
    }
  });
}

initPostForm();
