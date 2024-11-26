// loadHeader.js

export function loadHeader() {
  const headerPlaceholder = document.getElementById('header-placeholder');
  const footerPlaceholder = document.getElementById('footer-placeholder');

  if (headerPlaceholder) {
    fetch('components/header.html')
      .then((response) => response.text())
      .then((html) => {
        headerPlaceholder.innerHTML = html;
      })
      .catch((error) => console.error('Error loading header:', error));
  }

  if (footerPlaceholder) {
    fetch('components/footer.html')
      .then((response) => response.text())
      .then((html) => {
        footerPlaceholder.innerHTML = html;
      })
      .catch((error) => console.error('Error loading footer:', error));
  }
}
