const SPREADSHEET_ID = "1xnUJ9PLrSwA7moqEDG4T4p3hod_BzsZUzHT4VFntQaE";
const USERS_SHEET = "Users";
const USER_HEADERS = ["username", "name", "email", "password", "joinedAt"];

function getUsersSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(USERS_SHEET);
  if (!sheet) {
    sheet = ss.insertSheet(USERS_SHEET);
    sheet.appendRow(USER_HEADERS);
  }
  return sheet;
}

function readUsers_() {
  const values = getUsersSheet_().getDataRange().getValues();
  return values
    .slice(1)
    .filter((row) => row[0] !== "")
    .map((row) => {
      const user = {};
      USER_HEADERS.forEach((key, i) => {
        user[key] = row[i];
      });
      return user;
    });
}

function jsonOutput_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
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
