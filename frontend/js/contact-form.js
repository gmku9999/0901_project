function initContactForm() {
  const form = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  const fields = {
    name: {
      input: document.getElementById('name'),
      error: document.getElementById('nameError'),
      validate: (value) => value.trim().length > 0 || '이름을 입력해주세요.',
    },
    email: {
      input: document.getElementById('email'),
      error: document.getElementById('emailError'),
      validate: (value) => {
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return pattern.test(value.trim()) || '올바른 이메일 형식을 입력해주세요.';
      },
    },
    message: {
      input: document.getElementById('message'),
      error: document.getElementById('messageError'),
      validate: (value) => value.trim().length >= 10 || '메시지는 10자 이상 입력해주세요.',
    },
  };

  const validateField = (field) => {
    const result = field.validate(field.input.value);
    const isValid = result === true;

    field.input.closest('.form-group').classList.toggle('error', !isValid);
    field.error.textContent = isValid ? '' : result;

    return isValid;
  };

  Object.values(fields).forEach((field) => {
    field.input.addEventListener('blur', () => validateField(field));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    successMsg.textContent = '';

    const results = Object.values(fields).map(validateField);
    const allValid = results.every(Boolean);

    if (allValid) {
      successMsg.textContent = '메시지가 성공적으로 전송되었습니다. (데모용 - 실제 전송은 백엔드 연동 필요)';
      form.reset();
    }
  });
}
