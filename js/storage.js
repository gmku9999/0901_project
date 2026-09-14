const STORAGE_KEYS = {
  session: "blog.session",
  postsCache: "blog.postsCache",
  draftPrefix: "blog.draft.",
};

const POSTS_CACHE_TTL_MS = 20000;

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : JSON.parse(raw);
  } catch (error) {
    return fallback;
  }
}

function writeJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getSession() {
  return readJSON(STORAGE_KEYS.session, null);
}

function setSession(user) {
  writeJSON(STORAGE_KEYS.session, {
    username: user.username,
    name: user.name,
    email: user.email,
    joinedAt: user.joinedAt,
  });
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function getCachedPosts() {
  const cache = readJSON(STORAGE_KEYS.postsCache, null);
  if (!cache || Date.now() - cache.savedAt > POSTS_CACHE_TTL_MS) {
    return null;
  }
  return cache.posts;
}

function setCachedPosts(posts) {
  writeJSON(STORAGE_KEYS.postsCache, { posts, savedAt: Date.now() });
}

function clearPostsCache() {
  localStorage.removeItem(STORAGE_KEYS.postsCache);
}

function getDraftKey(postId) {
  return `${STORAGE_KEYS.draftPrefix}${postId || "new"}`;
}

function getDraft(postId) {
  return readJSON(getDraftKey(postId), null);
}

function saveDraft(postId, draft) {
  writeJSON(getDraftKey(postId), { ...draft, savedAt: Date.now() });
}

function clearDraft(postId) {
  localStorage.removeItem(getDraftKey(postId));
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function showFormError(input, errorEl, message) {
  input.closest(".form-group").classList.toggle("error", Boolean(message));
  if (errorEl) {
    errorEl.textContent = message || "";
  }
}

function setFormMessage(el, text, isError) {
  el.textContent = text;
  el.className = `form-message ${isError ? "error" : "success"}`;
}
