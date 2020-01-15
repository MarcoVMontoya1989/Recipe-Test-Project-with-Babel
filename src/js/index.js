import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

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

    //4) Search for recipes
    await state.search.getResults();

    //5) Render results on UI
    console.log('result state',state.search.result);
    searchView.renderResults(state.search.result);

  } else {
    alert(`it's empty`);
  }
}

elements.searchForm.addEventListener('submit', el => {
  el.preventDefault();
  controlSearch().then(r => console.log(`testing ${r}`));
});


// search.getResult();
