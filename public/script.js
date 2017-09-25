console.log('Script Loaded');

document.addEventListener('DOMContentLoaded', function () {
  const elements = {
    deleteButton: document.querySelector('#delete-button'),
  };

  if (elements.deleteButton) {
    elements.deleteButton.addEventListener('click', function () {
      const bookId = elements.deleteButton.getAttribute('data-id');
      fetch(`/books/${bookId}`, { method: 'delete' })
      .then(response => {
        window.location = '/';
      })
      .catch(error => console.error(error));
    });
  };
});
