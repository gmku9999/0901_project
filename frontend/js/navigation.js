function initNavigation() {
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('main section[id]');
  const header = document.getElementById('header');

  // 모바일 메뉴 토글
  menuToggle.addEventListener('click', () => {
    const isActive = nav.classList.toggle('active');
    menuToggle.classList.toggle('active', isActive);
    menuToggle.setAttribute('aria-expanded', String(isActive));
  });

  // 메뉴 클릭 시 닫기 (모바일)
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('active');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // 스크롤 위치에 따라 현재 섹션 메뉴 하이라이트
  const highlightNav = () => {
    const scrollPos = window.scrollY + header.offsetHeight + 20;

    let currentId = '';
    sections.forEach((section) => {
      if (scrollPos >= section.offsetTop) {
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  };

  window.addEventListener('scroll', highlightNav);
  highlightNav();

  // 맨 위로 이동 버튼
  const toTop = document.getElementById('toTop');
  toTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
