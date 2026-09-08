function initTypingAnimation() {
  const target = document.getElementById('typingText');
  const words = ['Frontend Developer', 'Problem Solver', '꾸준히 성장하는 개발자'];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const type = () => {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    target.textContent = currentWord.slice(0, charIndex);

    let delay = isDeleting ? 60 : 100;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = 1500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 300;
    }

    setTimeout(type, delay);
  };

  type();
}

function initScrollFadeIn() {
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  fadeEls.forEach((el) => observer.observe(el));
}
