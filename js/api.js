async function apiGet(action, params = {}) {
  const query = new URLSearchParams({ action, ...params }).toString();
  const response = await fetch(`${API_BASE_URL}?${query}`);
  return response.json();
}

async function apiPost(action, payload) {
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ action, payload }),
  });
  return response.json();
}

async function signupRequest(user) {
  return apiPost("signup", user);
}

async function loginRequest(credentials) {
  return apiPost("login", credentials);
}

async function fetchPosts({ forceRefresh = false } = {}) {
  if (!forceRefresh) {
    const cached = getCachedPosts();
    if (cached) {
      return cached;
    }
  }

  const result = await apiGet("posts");
  if (!result.success) {
    throw new Error(result.error || "게시글을 불러오지 못했습니다.");
  }
  setCachedPosts(result.data);
  return result.data;
}

async function createPostRemote(post) {
  const result = await apiPost("createPost", post);
  if (result.success) {
    clearPostsCache();
  }
  return result;
}

async function updatePostRemote(post) {
  const result = await apiPost("updatePost", post);
  if (result.success) {
    clearPostsCache();
  }
  return result;
}

async function deletePostRemote(id, authorUsername) {
  const result = await apiPost("deletePost", { id, authorUsername });
  if (result.success) {
    clearPostsCache();
  }
  return result;
}
