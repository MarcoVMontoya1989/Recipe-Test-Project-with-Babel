import  { elements } from './base'

export const getInput = () => elements.searchInput.value;

const renderRecipe = recipe => {
  let html;

  html =
    `
      <li>
        <a class="results__link results__link--active" href="${recipe.recipe_id}">
          <figure class="results__fig">
            <img src="${recipe.image_url}" alt="${recipe.title}">
          </figure>
          <div class="results__data">
            <h4 class="results__name">${recipe.title}</h4>
            <p class="results__author">${recipe.publisher}</p>
          </div>
        </a>
      </li>`;

  elements.searchResList.insertAdjacentHTML('beforeend', html);
};

//showing results in the DOM
export const renderResults = (data) => {
  // data.forEach(recipes => renderRecipe(recipes));
  data.forEach(renderRecipe);
};

export const clearInputSearch = () => {
  elements.searchInput.value = '';
};

export const clearResultFields = () => {
  elements.searchResList.innerHTML = '';
};