const cardWrapper = document.querySelector('.card-wrapper');
const sort = document.querySelector('#sort');
const filter = document.querySelector('#filter');
const search = document.querySelector('#search');
const h1 = document.querySelector('h1');
const paginationButtonsWrapper = document.querySelector('.pagination-btn');

class App {
   #data;
   #currentPage = 1;
   #limit = 10;

   constructor() {
      this._getData();
      sort.addEventListener('change', this._sort.bind(this));
      filter.addEventListener('change', this._filter.bind(this));
      search.addEventListener('input', this._debounce.call(this, this._search, 200));
      paginationButtonsWrapper.addEventListener('click', this._setPage.bind(this));
   }

   _getData() {
      fetch('https://foodbukka.herokuapp.com/api/v1/restaurant')
         .then((response) => {
            if (!response.ok) {
               throw new Error(`Error ${response.status}: something went wrong.`);
            }
            return response.json();
         })
         .then((data) => {
            if (data.error) throw new Error(`Error: ${data.reason}`);
            this._setData(data);
         })
         .catch((error) => {
            alert(error);
         });
   }

   _setData(result) {
      this.#data = result.Result;
      this._paginationBtn.call(this, this.#data.length);
      this._pagination(this.#data, this.#currentPage, this.#limit);
   }

   _setPage(e) {
      if (e.target.dataset['page']) {
         const page = e.target.dataset['page'];
         this.#currentPage = page;
         this._pagination(this.#data, this.#currentPage, this.#limit);
      }
   }

   _pagination(data, currentPage, limit) {
      const start = (currentPage - 1) * limit;
      const end = start + limit;

      const diplayedData = data.slice(start, end);
      this._displayData(diplayedData);
   }

   _debounce(fn, delay) {
      let timeoutId;
      const context = this;
      const args = arguments;
      return function () {
         clearTimeout(timeoutId);
         timeoutId = setTimeout(() => fn.apply(context, args), delay);
      };
   }

   _search() {
      const value = search.value;
      const searchedData = this.#data.filter((d) => d.slug.includes(value));

      this._pagination(searchedData, this.#currentPage, this.#limit);
      this._paginationBtn(searchedData.length);
   }

   _displayData(data) {
      this._reset();
      h1.classList.add('hide');

      if (!data.length) {
         h1.classList.remove('hide');
      }

      data.forEach((res) => {
         const card = document.createElement('div');
         card.className = 'card';
         const innerHTML = `
               <img src="${res.image}" alt="${res.slugs}" />
               <h3>Name: ${res.slug}</h3>
               <p>Location: ${res.location}</p>
               <p>Reviews: ${res.reviews}</p>
               <p>Cost: ${res.averagecost}</p>`;
         card.innerHTML = innerHTML;

         cardWrapper.appendChild(card);
      });
   }

   _sort(event) {
      let sortedData = [];
      const selectedOption = +event.target.value;

      switch (selectedOption) {
         case 0:
            sortedData = this.#data.sort((a, b) => this._compare(a.slug, b.slug, 'A'));
            break;
         case 1:
            sortedData = this.#data.sort((a, b) =>
               this._compare(a.location, b.location, 'A')
            );
            break;
         case 2:
            sortedData = this.#data.sort((a, b) =>
               this._compare(a.reviews, b.reviews, 'D')
            );
            break;
         default:
            alert('Wrong');
      }
      this._pagination(sortedData, this.#currentPage, this.#limit);
      this._paginationBtn(sortedData.length);
   }

   _filter(event) {
      let filteredData = [];
      const filterBy = +event.target.value;

      switch (filterBy) {
         case 0:
            filteredData = this.#data.filter(
               (value) => value.location === 'Abraham Adesanya'
            );
            break;
         case 1:
            filteredData = this.#data.filter((value) => value.location === 'Badore');
            break;
         case 2:
            filteredData = this.#data.filter((value) => value.location === 'Ajah');
            break;
         case 3:
            filteredData = this.#data.filter((value) => value.location === 'Lekki');
            break;
      }

      this._pagination(sortedData, this.#currentPage, this.#limit);
      this._paginationBtn(sortedData.length);
   }

   _reset() {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => cardWrapper.removeChild(card));
   }

   _resetPaginationButtons() {
      this.#currentPage = 1;
      this.#limit = 10;
      const buttons = document.querySelectorAll('.pagination-btn button');
      buttons.forEach((button) => paginationButtonsWrapper.removeChild(button));
   }

   _compare(a, b, order) {
      a = '' + a;
      b = '' + b;

      if (order === 'A') return a.localeCompare(b);
      else return b.localeCompare(a);
   }

   _paginationBtn(totalRecords) {
      this._resetPaginationButtons();

      const totalPages = parseInt(totalRecords / this.#limit) + 1;

      for (let i = 1; i <= totalPages; i++) {
         const button = document.createElement('button');
         button.textContent = i;
         button.setAttribute('data-page', i);

         paginationButtonsWrapper.appendChild(button);
      }
   }
}

const app = new App();
