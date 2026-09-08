const SPREADSHEET_ID = "1xnUJ9PLrSwA7moqEDG4T4p3hod_BzsZUzHT4VFntQaE";
const USERS_SHEET = "Users";
const USER_HEADERS = ["username", "name", "email", "password", "joinedAt"];
const POSTS_SHEET = "Posts";
const POST_HEADERS = ["id", "title", "content", "authorUsername", "authorName", "createdAt"];

function getSheet_(name, headers) {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
  }
  return sheet;
}

function getUsersSheet_() {
  return getSheet_(USERS_SHEET, USER_HEADERS);
}

function getPostsSheet_() {
  return getSheet_(POSTS_SHEET, POST_HEADERS);
}

function readRows_(sheet, headers) {
  const values = sheet.getDataRange().getValues();
  return values
    .slice(1)
    .filter((row) => row[0] !== "")
    .map((row) => {
      const obj = {};
      headers.forEach((key, i) => {
        obj[key] = row[i];
      });
      return obj;
    });
}

function readUsers_() {
  return readRows_(getUsersSheet_(), USER_HEADERS);
}

function readPosts_() {
  return readRows_(getPostsSheet_(), POST_HEADERS);
}

function findRowIndexById_(sheet, id) {
  const values = sheet.getDataRange().getValues();
  for (let i = 1; i < values.length; i++) {
    if (values[i][0] === id) {
      return i + 1; // 1-based row number
    }
  }
  return -1;
}

function jsonOutput_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  const action = e.parameter.action;

  if (action === "posts") {
    return jsonOutput_({ success: true, data: readPosts_() });
  }

  return jsonOutput_({ success: true, message: "블로그 Apps Script API가 정상 동작 중입니다." });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const body = JSON.parse(e.postData.getBlob().getDataAsString("UTF-8"));
    const action = body.action;
    const payload = body.payload || {};

    if (action === "signup") {
      return signup_(payload);
    }
    if (action === "login") {
      return login_(payload);
    }
    if (action === "createPost") {
      return createPost_(payload);
    }
    if (action === "updatePost") {
      return updatePost_(payload);
    }
    if (action === "deletePost") {
      return deletePost_(payload);
    }

    return jsonOutput_({ success: false, error: "알 수 없는 action입니다: " + action });
  } catch (error) {
    return jsonOutput_({ success: false, error: String(error) });
  } finally {
    lock.releaseLock();
  }
}

function signup_(payload) {
  const username = String(payload.username || "").trim();
  const name = String(payload.name || "").trim();
  const email = String(payload.email || "").trim();
  const password = String(payload.password || "");

  if (!username || !name || !email || !password) {
    return jsonOutput_({ success: false, error: "필수 항목이 비어 있습니다." });
  }

  const users = readUsers_();
  if (users.some((user) => user.username === username)) {
    return jsonOutput_({ success: false, error: "이미 사용 중인 아이디입니다." });
  }

  const joinedAt = new Date().toISOString();
  getUsersSheet_().appendRow([username, name, email, password, joinedAt]);

  return jsonOutput_({ success: true, data: { username, name, email, joinedAt } });
}

function login_(payload) {
  const username = String(payload.username || "").trim();
  const password = String(payload.password || "");

  const user = readUsers_().find((candidate) => candidate.username === username);

  if (!user || String(user.password) !== password) {
    return jsonOutput_({ success: false, error: "아이디 또는 비밀번호가 올바르지 않습니다." });
  }

  return jsonOutput_({
    success: true,
    data: { username: user.username, name: user.name, email: user.email, joinedAt: user.joinedAt },
  });
}

function createPost_(payload) {
  const title = String(payload.title || "").trim();
  const content = String(payload.content || "").trim();
  const authorUsername = String(payload.authorUsername || "").trim();
  const authorName = String(payload.authorName || "").trim();

  if (!title || !content || !authorUsername) {
    return jsonOutput_({ success: false, error: "필수 항목이 비어 있습니다." });
  }

  const id = "post-" + new Date().getTime();
  const createdAt = new Date().toISOString();

  getPostsSheet_().appendRow([id, title, content, authorUsername, authorName, createdAt]);

  return jsonOutput_({ success: true, data: { id, title, content, authorUsername, authorName, createdAt } });
}

function updatePost_(payload) {
  const id = String(payload.id || "");
  const authorUsername = String(payload.authorUsername || "").trim();
  const sheet = getPostsSheet_();
  const rowIndex = findRowIndexById_(sheet, id);

  if (rowIndex === -1) {
    return jsonOutput_({ success: false, error: "게시글을 찾을 수 없습니다." });
  }

  const ownerUsername = sheet.getRange(rowIndex, 4).getValue();
  if (ownerUsername !== authorUsername) {
    return jsonOutput_({ success: false, error: "수정 권한이 없습니다." });
  }

  sheet.getRange(rowIndex, 2).setValue(String(payload.title || "").trim());
  sheet.getRange(rowIndex, 3).setValue(String(payload.content || "").trim());

  return jsonOutput_({ success: true });
}

function deletePost_(payload) {
  const id = String(payload.id || "");
  const authorUsername = String(payload.authorUsername || "").trim();
  const sheet = getPostsSheet_();
  const rowIndex = findRowIndexById_(sheet, id);

  if (rowIndex === -1) {
    return jsonOutput_({ success: false, error: "게시글을 찾을 수 없습니다." });
  }

  const ownerUsername = sheet.getRange(rowIndex, 4).getValue();
  if (ownerUsername !== authorUsername) {
    return jsonOutput_({ success: false, error: "삭제 권한이 없습니다." });
  }

  sheet.deleteRow(rowIndex);
  return jsonOutput_({ success: true });
}
