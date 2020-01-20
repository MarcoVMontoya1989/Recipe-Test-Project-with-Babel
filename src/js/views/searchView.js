import  { elements } from './base'

export const getInput = () => elements.searchInput.value;

const renderRecipe = recipe => {
  let html;

  html =
    `
      <li>
        <a class="results__link" href="#${recipe.recipe_id}">
          <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title, 20)}</h4>
            <p class="results__author">${recipe.publisher}</p>
          </div>
        </a>
      </li>`;

  elements.searchResList.insertAdjacentHTML('beforeend', html);
};

//showing results in the DOM
// export const renderResults = (data) => {
//   // data.forEach(recipes => renderRecipe(recipes));
//   data.forEach(renderRecipe);
// };

export const renderResults = (data, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end = page * resPerPage;

  // data.forEach(recipes => renderRecipe(recipes));
  data.slice(start, end).forEach(renderRecipe);

  renderButtons(page, data.length, resPerPage);
};

export const clearInputSearch = () => {
  elements.searchInput.value = '';
};

export const clearResultFields = () => {
  elements.searchResList.innerHTML = '';
  elements.searchResPagesButton.innerHTML = '';
};

export const limitRecipeTitle = (recipeTitle, limit = 17) => {
  const newTitle = [];

  if (recipeTitle.length > limit ) {
    recipeTitle.split(' ').reduce((accumulator, current) => {
      if (accumulator + current.length <= limit) {
        newTitle.push(current);
      }
      return accumulator + current.length;
    }, 0);

    return `${newTitle.join(' ')} ...`;
  }
  return recipeTitle;
};

const renderButtons = (page, numResults, resPerPage) => {
  // math ceil is handy for when the page is divided like 4.5 can show 5 results
  const pages = Math.ceil( numResults/ resPerPage);

  let button;
  if (page === 1 && pages > 1) {
    //only button for next page
    button = createButton(page, 'next');
  } else if (page < pages) {
    // both buttons for next and previous
    button = `
      ${createButton(page, 'prev')}
      ${createButton(page, 'next')}
    `
  }
  else if (page === pages  && pages > 1) {
    // only button to return previous page
    button = createButton(page, 'prev');
  }

  elements.searchResPagesButton.insertAdjacentHTML('afterbegin', button);
};

//type: next or prev
const createButton = (page, type) => `
<button class="btn-inline results__btn--${type}" data-goto="${type === 'prev' ? page -1 : page + 1}">
    <span>Page ${type === 'prev' ? page -1 : page + 1}</span>
    <svg class="search__icon">
        <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
    </svg>
</button>
`;

export const highlightSelected = id => {
  const resultArr = Array.from(document.querySelectorAll('.results__link'));
  resultArr.forEach(el => {
    el.classList.remove('results__link--active');
  })

  document.querySelector(`a[href*="${id}"]`).classList.add('results__link--active');
};