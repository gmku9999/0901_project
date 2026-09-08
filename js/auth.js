function initSignupForm() {
  const form = document.getElementById("signupForm");
  if (!form) {
    return;
  }

  const nameInput = document.getElementById("name");
  const usernameInput = document.getElementById("username");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const passwordConfirmInput = document.getElementById("passwordConfirm");
  const message = document.getElementById("signupMessage");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    message.textContent = "";
    message.className = "form-message";

    let isValid = true;

    if (!nameInput.value.trim()) {
      showFormError(nameInput, document.getElementById("nameError"), "이름을 입력해주세요.");
      isValid = false;
    } else {
      showFormError(nameInput, document.getElementById("nameError"), "");
    }

    const username = usernameInput.value.trim();
    if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
      showFormError(
        usernameInput,
        document.getElementById("usernameError"),
        "아이디는 영문/숫자/밑줄 3~20자로 입력해주세요."
      );
      isValid = false;
    } else if (findUser(username)) {
      showFormError(usernameInput, document.getElementById("usernameError"), "이미 사용 중인 아이디입니다.");
      isValid = false;
    } else {
      showFormError(usernameInput, document.getElementById("usernameError"), "");
    }

    const email = emailInput.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFormError(emailInput, document.getElementById("emailError"), "올바른 이메일 형식을 입력해주세요.");
      isValid = false;
    } else {
      showFormError(emailInput, document.getElementById("emailError"), "");
    }

    const password = passwordInput.value;
    if (password.length < 6) {
      showFormError(passwordInput, document.getElementById("passwordError"), "비밀번호는 6자 이상 입력해주세요.");
      isValid = false;
    } else {
      showFormError(passwordInput, document.getElementById("passwordError"), "");
    }

    if (password !== passwordConfirmInput.value) {
      showFormError(
        passwordConfirmInput,
        document.getElementById("passwordConfirmError"),
        "비밀번호가 일치하지 않습니다."
      );
      isValid = false;
    } else {
      showFormError(passwordConfirmInput, document.getElementById("passwordConfirmError"), "");
    }

    if (!isValid) {
      return;
    }

    const users = getUsers();
    users.push({
      name: nameInput.value.trim(),
      username,
      email,
      password,
      joinedAt: new Date().toISOString(),
    });
    saveUsers(users);
    setSession({ username, name: nameInput.value.trim() });

    setFormMessage(message, "회원가입이 완료되었습니다. 잠시 후 홈으로 이동합니다.", false);
    form.reset();
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 900);
  });
}

function initLoginForm() {
  const form = document.getElementById("loginForm");
  if (!form) {
    return;
  }

  const usernameInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");
  const message = document.getElementById("loginMessage");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    const user = findUser(username);

    if (!user || user.password !== password) {
      setFormMessage(message, "아이디 또는 비밀번호가 올바르지 않습니다.", true);
      return;
    }

    setSession(user);
    setFormMessage(message, "로그인되었습니다. 잠시 후 홈으로 이동합니다.", false);
    window.setTimeout(() => {
      window.location.href = "index.html";
    }, 500);
  });
}

initSignupForm();
initLoginForm();
