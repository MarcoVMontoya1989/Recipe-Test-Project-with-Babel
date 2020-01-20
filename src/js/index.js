import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';
import { elements, renderLoader, clearLoader } from './views/base';
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
      recipeView.renderRecipe(state.recipe,
        state.like.isLiked(id)
        );
    } catch (e) {
      alert(`Something is wrong: ${e}`);
    }

  }

};

const controlList = () => {
  //create a new list if it there none yet 
  if (!state.list) state.list = new List();
  
  // add the ingredients to the list from the Recipe Selected and UI
  state.recipe.ingredients.forEach(el => {
    const newList = state.list.addNewItem(el.count, el.unit, el.ingredient);

    listView.renderItemList(newList);
  });
};

state.like = new Likes();

const controlLike = () => {
  if (!state.like) state.like = new Likes();

  const currentID = state.recipe.recipeID;

  //add the liked recipe to the Likes list and UI
  if (!state.like.isLiked(currentID)) {
    //add to the state
    const newLike = state.like.addLike(currentID,
      state.recipe.recipeTitle,
      state.recipe.recipeAuthor,
      state.recipe.img);
    //toggle the like button
    likeView.toggleLikeBtn(true);

    // console.log(state.like);
    //add the like to the UI
    likeView.renderLikes(newLike);

  } else {
    //remove to the state
    state.like.deleteLikeId(currentID);
    //toggle the like button
    likeView.toggleLikeBtn(false);
    //remove the like to the UI
    likeView.deleteLikeListMenu(currentID);
    // console.log(state.like);
  }

  likeView.toggleLikeMenu(state.like.getNumLikes());
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

//Handling recipe button clicks
elements.recipe.addEventListener('click', e => {
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
    //decrease servings
    if (state.recipe.servings > 1) {
      state.recipe.updateServings('dec');
      recipeView.updateIngredientsServings(state.recipe);
    }
  } else if (e.target.matches('.btn-increase, .btn-increase *')) {
    //increase servings
    state.recipe.updateServings('inc');
    recipeView.updateIngredientsServings(state.recipe);
  } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
    controlList();
  } else if (e.target.matches('.recipe__love, .recipe__love *')) {
    //add recipe that is liked to the Like
    controlLike();
  }
});

//handling delete and update the list events
elements.shopping.addEventListener('click', e => {
  const idToDelete = e.target.closest('.shopping__item').dataset.itemid;

  //handle the delete button
  if(e.target.matches('.shopping__delete, .shopping__delete *')) {
    //delete from state
    state.list.deleteItemSelected(idToDelete);

    //delete from UI
    listView.deleteItemList(idToDelete);
  } else if(e.target.matches('.shopping__count-value')) {
    const val = parseFloat(e.target.value, 10);
    
    state.list.updateCount(idToDelete, val);
  }
});

window.l = new List();
