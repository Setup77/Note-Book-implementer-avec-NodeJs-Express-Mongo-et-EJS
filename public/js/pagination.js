//console.log(pagee);
// Fonction de pagination
function renderPagination(totalPages, list) {
  paginationTop.innerHTML = '';
  paginationBottom.innerHTML = '';

  const paginations = [paginationTop, paginationBottom];

  paginations.forEach(paginationEl => {
    // Bouton précédent
    const prevLi = document.createElement('li');
    prevLi.className = 'page-item' + (currentPage === 1 ? ' disabled' : '');
    prevLi.innerHTML = `<button class="page-link">Préc</button>`;
    prevLi.onclick = () => {
      if (currentPage > 1) {
        currentPage--;
        renderItems(list);
        scrollToTop();
      }
    };
    paginationEl.appendChild(prevLi);

    // Pages numérotées
    for (let p = 1; p <= totalPages; p++) {
      const li = document.createElement('li');
      li.className = 'page-item' + (p === currentPage ? ' active' : '');
      li.innerHTML = `<button class="page-link">${p}</button>`;
      li.onclick = () => {
        currentPage = p;
        renderItems(list);
        scrollToTop();
      };
      paginationEl.appendChild(li);
    }

    // Bouton suivant
    const nextLi = document.createElement('li');
    nextLi.className = 'page-item' + (currentPage === totalPages ? ' disabled' : '');
    nextLi.innerHTML = `<button class="page-link">Suiv</button>`;
    nextLi.onclick = () => {
      if (currentPage < totalPages) {
        currentPage++;
        renderItems(list);
        scrollToTop();
      }
    };
    paginationEl.appendChild(nextLi);
  });
}


// Fonction de retour en haut de la page
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}