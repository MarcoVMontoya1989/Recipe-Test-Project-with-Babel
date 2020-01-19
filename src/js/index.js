import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

import { elements, renderLoader, clearLoader } from './views/base'
import { clearRecipe } from './views/recipeView'

/*
* GLOBAL STATE of the APP
* -- Search Object
* -- Current recipe object
* -- Shopping list object
* -- liked recipes
* */
const state = {};

const controlSearch = async () => {
  //1) Get Query from View
  const query = searchView.getInput();

  //2) Send Query to Search
  if (query) {
    //2.1) Search query and add to the state
    state.search = new Search(query);

    //3) Prepare UI for results
    searchView.clearInputSearch();
    searchView.clearResultFields();
    renderLoader(elements.searchRes); //loading icon

    //4) Search for recipes
    try {
      await state.search.getResults();

      //5) Render results on UI
      // console.log('result state',state.search.result);
      clearLoader(); //remove loader after received the promise
      searchView.renderResults(state.search.result);
    } catch (e) {
      alert('Error');
      clearLoader();
    }

  } else {
    alert(`it's empty`);
  }
};

// const resultRecipeSearched = new Recipe(46956);
const controlRecipe = async () => {
  //get ID from the URL Example: /api/get?rId=12345 or #12345
  const id = window.location.hash.replace('#', '');

  if (id) {
    //prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    //create new recipes and parse ingredients
    state.recipe = new Recipe(id);

    //highlight the selected recipe
    if (state.search) {
      searchView.highlightSelected(id);
    }

    //get recipe data
    try {
      await state.recipe.getRecipe();
      state.recipe.parseIngredients();

      //calculate serving and time data
      state.recipe.calcServings();
      state.recipe.calcTime();

      //render recipe
      clearLoader();
      recipeView.clearRecipe();
      recipeView.renderRecipe(state.recipe);
    } catch (e) {
      alert(`Something is wrong: ${e}`);
    }

  }

}

// resultRecipeSearched.getRecipe();
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);
['load', 'hashchange'].forEach(event => window.addEventListener(event, controlRecipe));


elements.searchForm.addEventListener('submit', el => {
  el.preventDefault();
  controlSearch().then(r => console.log(`testing ${r}`));
});

elements.searchForm.addEventListener('load', el => {
  el.preventDefault();
  controlSearch().then(r => console.log(`testing ${r}`));
});

// event delegation for buttons because it's not yet generated
elements.searchResPagesButton.addEventListener('click', ev => {
  // console.log(ev.target);
  const btn = ev.target.closest('.btn-inline');

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);
    searchView.clearResultFields();
    searchView.renderResults(state.search.result, goToPage);
  }
});