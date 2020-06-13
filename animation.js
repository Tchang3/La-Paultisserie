 window.addEventListener('scroll', function()
  {
    const parallax = document.querySelector('.accueilimage');
    let scrollPosition = window.pageYOffset;
    parallax.style.transform = 'translateY(' + scrollPosition * 0.4 + 'px';
  });
  window.addEventListener('scroll', function()
  {
    const parallax = document.querySelector('.image1');
    let scrollPosition = window.pageYOffset;
    parallax.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px';
  });
    window.addEventListener('scroll', function()
  {
    const parallax = document.querySelector('.image2');
    let scrollPosition = window.pageYOffset;
    parallax.style.transform = 'translateY(' + scrollPosition * 0.5 + 'px';
  });