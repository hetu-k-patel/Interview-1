const cardWrapper = document.querySelector('.card-wrapper');
const sort = document.querySelector('#sort');
const filter = document.querySelector('#filter');
const search = document.querySelector('#search');
const h1 = document.querySelector('h1');

class App {
   #data;

   constructor() {
      this._getData();
      sort.addEventListener('change', this._sort.bind(this));
      filter.addEventListener('change', this._filter.bind(this));
      search.addEventListener('input', this._debounce.call(this, this._search, 200));
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
      this._displayData(searchedData);
   }

   _setData(result) {
      this.#data = result.Result;
      this._displayData(this.#data);
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
      this._displayData(sortedData);
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

      this._displayData(filteredData);
   }

   _reset() {
      const cards = document.querySelectorAll('.card');
      cards.forEach((card) => cardWrapper.removeChild(card));
   }

   _compare(a, b, order) {
      a = '' + a;
      b = '' + b;

      if (order === 'A') return a.localeCompare(b);
      else return b.localeCompare(a);
   }
}

const app = new App();
