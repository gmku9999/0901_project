const STORAGE_KEYS = {
  session: "blog.session",
};

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
