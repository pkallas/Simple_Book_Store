console.log('Script Loaded');

document.addEventListener('DOMContentLoaded', function () {
  const elements = {
    deleteButton: document.querySelector('#delete-button'),
    addAuthorButton: document.querySelector('#add-author-input'),
    addGenreButton: document.querySelector('#add-genre-input'),
    removeInputButton: function () {
      return document.querySelectorAll('.remove-input');
    },
    genreInputs: function () {
      return document.querySelectorAll('.genre-input');
    },
    authorInputs: function () {
      return document.querySelectorAll('.author-input');
    },
    openCart: document.querySelector('.open-cart'),
    modalOverlay: document.querySelector('.modal-overlay'),
    modal: document.querySelector('.modal'),
    closeCart: document.querySelector('.close-cart'),
    total: document.querySelector('.total'),
    cartContents: document.querySelector('.cart-contents'),
    addToCart: document.querySelector('#add-to-cart-button'),
    bookTitle: document.querySelector('#single-book-title'),
    bookPrice: document.querySelector('#single-book-price'),
    bookISBN: document.querySelector('#single-book-isbn'),
    parsedBookISBN: document.querySelector('#single-book-isbn').innerText.replace(/ISBN: /g, 'isbn'),
    bookCount: function () {
      return document.querySelectorAll('.book-count');
    },
  };

  const numberInCart = function () {
    return parseInt(elements.openCart.innerText.match(/\d+/));
  };

  const calculateOpenCartTotal = function (arrayOfElements) {
    arrayOfElements.forEach(function (element) {
      element.addEventListener('blur', function () {
        let bookTotalCount = 0;
        arrayOfElements.forEach(function (element) {
          bookTotalCount += parseInt(element.value);
        });

        elements.openCart.innerText = `Cart (${bookTotalCount})`;
      });
    });
  };

  if (elements.bookCount().length > 0) {
    calculateOpenCartTotal(elements.bookCount());
  };

  if (elements.openCart) {
    elements.openCart.addEventListener('click', function () {
      elements.modalOverlay.style.display = 'flex';
      elements.modal.style.display = 'flex';
    });

    elements.closeCart.addEventListener('click', function () {
      elements.modalOverlay.style.display = 'none';
      elements.modal.style.display = 'none';
    });
  };

  if (elements.addToCart) {
    elements.addToCart.addEventListener('click', function () {
      elements.openCart.innerText = `Cart (${numberInCart() + 1})`;
      if (document.querySelector(`#${elements.parsedBookISBN}`)) {
        let currentBookCount = parseInt(document.querySelector(`#${elements.parsedBookISBN}`).value);
        document.querySelector(`#${elements.parsedBookISBN}`).value = currentBookCount + 1;
        return;
      };

      let listItem = document.createElement('li');
      listItem.className = 'item';
      let bookTitleSpan = document.createElement('span');
      bookTitleSpan.className = 'book-title-span';
      bookTitleSpan.innerText = elements.bookTitle.innerText.replace(/Title: /g, '');
      let bookPriceSpan = document.createElement('span');
      bookPriceSpan.className = 'book-price-span';
      bookPriceSpan.innerText = elements.bookPrice.innerText.replace(/Price: /g, '');
      let removeCartItem = document.createElement('button');
      removeCartItem.className = 'remove-cart-item';
      removeCartItem.innerText = 'X';
      let numberOfBook = document.createElement('input');
      numberOfBook.className = 'book-count';
      numberOfBook.type = 'number';
      numberOfBook.id = elements.parsedBookISBN;
      numberOfBook.value += 1;
      listItem.appendChild(bookTitleSpan);
      listItem.appendChild(numberOfBook);
      listItem.appendChild(bookPriceSpan);
      listItem.appendChild(removeCartItem);
      elements.cartContents.appendChild(listItem);
      calculateOpenCartTotal(elements.bookCount());
      removeCartItem.addEventListener('click', function () {
        event.target.parentElement.remove();
        const subValue = event.target.previousElementSibling.previousElementSibling.value;
        elements.openCart.innerText = `Cart (${numberInCart() - subValue})`;
      });
    });
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

  if (elements.addGenreButton) {
    elements.addGenreButton.addEventListener('click', function () {
      const previousGenreName = event.target.previousElementSibling.firstElementChild.name;
      const previousGenreNumber = parseInt(previousGenreName.match(/\d+/g));
      const currentIndex = previousGenreNumber + 1;
      const parent = event.target.parentElement;
      const genreDiv = document.createElement('div');
      genreDiv.classList.add('genre-input');
      genreDiv.innerHTML = `<input list="genres" name="genre${currentIndex}">
      <button id="button-genre${currentIndex}" type="button" class="remove-input">X</button>`;
      parent.insertBefore(genreDiv, event.target);
      const currentButton = document.querySelector(`#button-genre${currentIndex}`);
      removeInput(currentButton, 'genre');
    });
  };

  if (elements.addAuthorButton) {
    elements.addAuthorButton.addEventListener('click', function () {
      const previousAuthorName = event.target.previousElementSibling.firstElementChild.name;
      const previousAuthorNumber = parseInt(previousAuthorName.match(/\d+/g));
      const currentIndex = previousAuthorNumber + 1;
      const parent = event.target.parentElement;
      const authorDiv = document.createElement('div');
      authorDiv.classList.add('author-input');
      authorDiv.innerHTML = `First Name: <input name="firstName${currentIndex}">
        Last Name: <input name="lastName${currentIndex}">
        <button id="button-author${currentIndex}" type="button" class="remove-input">X</button>`;
      parent.insertBefore(authorDiv, event.target);
      const currentButton = document.querySelector(`#button-author${currentIndex}`);
      removeInput(currentButton, 'author');
    });
  };

  const removeInput = (button, section) => {
    const sectionFuncName = section + 'Inputs';
    button.addEventListener('click', function () {
      if (elements[sectionFuncName]().length === 1) {
        return;
      };
      event.target.parentElement.remove();
      changeInputNames(sectionFuncName);
    });
  };

  const changeInputNames = function (section) {
    if (section === 'genreInputs') {
      let genreInputs = elements.genreInputs();
      genreInputs.forEach(function (genre, index) {
        genre.firstElementChild.name = `genre${index}`;
        genre.children[1].id = `button-genre${index}`;
      });
    } else {
      let authorInputs = elements.authorInputs();
      authorInputs.forEach(function (author, index) {
        author.children[0].name = `firstName${index}`;
        author.children[1].name = `lastName${index}`;
        author.children[2].id = `button-author${index}`;
      });
    };
  };

  if (elements.removeInputButton().length > 0) {
    elements.removeInputButton().forEach(function (button, index) {
      let section = button.parentElement.classList.value.match(/\w+(?=-)/);
      removeInput(button, section);
    });
  };
});
