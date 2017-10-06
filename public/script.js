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
    cartTotal: document.querySelector('.total'),
    cartContents: document.querySelector('.cart-contents'),
    addToCart: document.querySelector('#add-to-cart-button'),
    bookTitle: document.querySelector('#single-book-title'),
    bookPrice: document.querySelector('#single-book-price'),
    bookISBN: document.querySelector('#single-book-isbn'),
    bookCount: function () {
      return document.querySelectorAll('.book-count');
    },
    inStock: document.querySelector('#single-book-in-stock'),
    removeCartItem: function () {
      return document.querySelectorAll('.remove-from-cart');
    },
    bookCount: function () {
      return document.querySelectorAll('.book-count');
    },
    bookPriceSpan: function () {
      return document.querySelectorAll('.book-price-span');
    },
  };

  const numberInCart = function () {
    return parseInt(elements.openCart.innerText.match(/\d+/));
  };

  const removeFromCart = function () {
    let bookPrice;
    if (elements.bookPrice) {
      bookPrice = elements.bookPrice.innerText.replace(/Price: \$/g, '');
    }
    elements.removeCartItem().forEach(function (element) {
      if (element.getAttribute('name') === 'hasClick') {
        return;
      };
      element.setAttribute('name', 'hasClick');
      element.addEventListener('click', function (event) {
        bookPrice = element.previousElementSibling.innerText.replace(/\$/, '');
        const subValue = event.target.previousElementSibling.previousElementSibling.value;
        const itemSum = (parseFloat(subValue) * parseFloat(bookPrice));
        const currentTotal = parseFloat(elements.cartTotal.innerText.replace(/Total: \$/g, ''));
        elements.cartTotal.innerText = `Total: $${Math.round(parseFloat(currentTotal - itemSum)).toFixed(2)}`;
        elements.openCart.innerText = `Cart (${numberInCart() - subValue})`;
        let currentBookId = event.target.previousElementSibling.previousElementSibling.id.replace(/book/, '');
        fetch('/cart', {
          method: 'delete',
          body: JSON.stringify({ bookId: currentBookId }),
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
        })
        .then(response => response.json())
        .then(json => {
          if (json.error) {
            alert(json.error);
          } else {
            event.target.parentElement.remove();
          }
        })
        .catch(error => console.error(error));
      });
    });
  };

  const calculateOpenCartTotal = function (arrayOfElements) {
    arrayOfElements.forEach(function (element) {
      element.addEventListener('blur', function () {
        let bookTotalCount = 0;
        let totalPrice = 0;
        arrayOfElements.forEach(function (element) {
          if (parseFloat(element.value) < 0) {
            element.value = 0;
          }
          let bookPrice = parseFloat(element.nextElementSibling.innerText.replace(/\$/g, ''));
          let currentBookCount = parseFloat(element.value);
          bookTotalCount += currentBookCount;
          let bookValue = parseFloat((bookPrice * currentBookCount)).toFixed(2);
          totalPrice += parseFloat(bookValue);
          fetch('/cart', {
            method: 'put',
            body: JSON.stringify({
              bookId: element.id.replace(/book/, ''),
              quantity: currentBookCount,
            }),
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
          })
          .then(response => response.json())
          .then(json => {
            if (json.error) {
              alert(json.error);
            }
          })
          .catch(error => console.error(error));
        });

        elements.openCart.innerText = `Cart (${bookTotalCount})`;
        elements.cartTotal.innerText = `Total: $${totalPrice.toFixed(2)}`;
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

  const updateFetch = function (bookId, quantity) {
    fetch('/cart', {
      method: 'put',
      body: JSON.stringify({
        bookId: bookId,
        quantity: quantity,
      }),
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => response.json())
    .then(json => {
      if (json.error) {
        alert(json.error);
      }
    })
    .catch(error => console.error(error));
  };

  if (elements.addToCart) {
    let bookId = window.location.pathname.replace(/\/books\//, 'book');
    elements.addToCart.addEventListener('click', function () {
      let bookPrice = parseFloat(elements.bookPrice.innerText.replace(/Price: \$/g, ''));
      let currentTotal = parseFloat(elements.cartTotal.innerText.replace(/Total: \$/, ''));
      elements.openCart.innerText = `Cart (${numberInCart() + 1})`;
      if (document.querySelector(`#${bookId}`)) {
        let newBookCount = parseInt(document.querySelector(`#${bookId}`).value) + 1;
        document.querySelector(`#${bookId}`).value = newBookCount;
        currentTotal += parseFloat(bookPrice);
        elements.cartTotal.innerText = `Total: $${currentTotal.toFixed(2)}`;
        updateFetch(bookId.replace(/book/, ''), newBookCount);
        return;
      };
      let listItem = document.createElement('li');
      listItem.className = 'item';
      let bookTitleSpan = document.createElement('span');
      bookTitleSpan.className = 'book-title-span';
      bookTitleSpan.innerText = elements.bookTitle.innerText.replace(/Title: /g, '');
      let bookPriceSpan = document.createElement('span');
      bookPriceSpan.className = 'book-price-span';
      bookPriceSpan.innerText = `$${bookPrice}`;
      let removeCartItem = document.createElement('div');
      removeCartItem.className = 'remove-from-cart';
      removeCartItem.innerHTML = '&#10006';
      let numberOfBook = document.createElement('input');
      numberOfBook.className = 'book-count';
      numberOfBook.type = 'number';
      numberOfBook.id = bookId;
      numberOfBook.value += 1;
      listItem.appendChild(bookTitleSpan);
      listItem.appendChild(numberOfBook);
      listItem.appendChild(bookPriceSpan);
      listItem.appendChild(removeCartItem);
      elements.cartContents.appendChild(listItem);
      currentTotal += parseFloat(bookPrice * numberOfBook.value);
      elements.cartTotal.innerText = `Total: $${currentTotal.toFixed(2)}`;
      calculateOpenCartTotal(elements.bookCount());
      removeFromCart();
      updateFetch(bookId.replace(/book/, ''), numberOfBook.value);
    });
  };

  if (elements.deleteButton) {
    elements.deleteButton.addEventListener('click', function () {
      const bookId = elements.deleteButton.getAttribute('data-id');
      fetch(`/books/${bookId}`,
        { method: 'delete',
          credentials: 'same-origin',
      })
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

  if (elements.removeCartItem().length > 0) {
    let outerCartTotal = 0;
    let innerCartTotal = 0;
    elements.bookCount().forEach(function (element) {
      outerCartTotal += parseInt(element.value);;
    });
    elements.bookPriceSpan().forEach(function (element) {
      let bookPrice = parseFloat(element.innerText.replace(/\$/g, ''));
      let bookAmount = parseInt(element.previousElementSibling.value);
      innerCartTotal += (bookPrice * bookAmount);
    });
    elements.openCart.innerText = `Cart (${outerCartTotal})`;
    elements.cartTotal.innerText = `Total: $${innerCartTotal.toFixed(2)}`;
    removeFromCart();
  }
});
