const STORAGE_KEYS = {
  users: "blog.users",
  session: "blog.session",
  posts: "blog.posts",
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

function getUsers() {
  return readJSON(STORAGE_KEYS.users, []);
}

function saveUsers(users) {
  writeJSON(STORAGE_KEYS.users, users);
}

function findUser(username) {
  return getUsers().find((user) => user.username === username);
}

function getSession() {
  return readJSON(STORAGE_KEYS.session, null);
}

function setSession(user) {
  writeJSON(STORAGE_KEYS.session, { username: user.username, name: user.name });
}

function clearSession() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function seedPosts() {
  const posts = [
    {
      id: "seed-1",
      title: "블로그를 시작하며",
      content:
        "개인 프로필 페이지를 개인 블로그로 새로 꾸몄습니다.\n앞으로 공부하면서 배운 내용과 만든 것들을 이곳에 기록할 예정입니다.",
      authorUsername: "honggildong",
      authorName: "홍길동",
      createdAt: "2026-09-01T09:00:00.000Z",
    },
    {
      id: "seed-2",
      title: "HTML, CSS, JavaScript로 블로그 화면 구현하기",
      content:
        "프레임워크 없이 순수 HTML, CSS, JavaScript만으로 회원가입, 로그인, 게시글 작성/조회/수정/삭제 화면을 구현했습니다.\n서버가 없기 때문에 데이터는 브라우저의 localStorage에 저장됩니다.",
      authorUsername: "honggildong",
      authorName: "홍길동",
      createdAt: "2026-09-05T09:00:00.000Z",
    },
  ];
  savePosts(posts);
  return posts;
}

function getPosts() {
  const raw = localStorage.getItem(STORAGE_KEYS.posts);
  if (raw === null) {
    return seedPosts();
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return seedPosts();
  }
}

function savePosts(posts) {
  writeJSON(STORAGE_KEYS.posts, posts);
}

function getPostById(id) {
  return getPosts().find((post) => post.id === id);
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
