import axios from 'axios';
import { proxy }  from '../config';

export default class Recipe {
  constructor (recipeID) {
    this.recipeID = recipeID;
  };

  async getRecipe() {
    try {
      const res = await axios(`${proxy}get?rId=${this.recipeID}`);
      this.recipeTitle = res.data.recipe.title;
      this.recipeAuthor = res.data.recipe.publisher;
      this.img = res.data.recipe.image_url;
      this.url = res.data.recipe.source_url;
      this.ingredients = res.data.recipe.ingredients;

    } catch (e) {
      console.log(`Something went wrong: \n ${e}`);
    }
  };

  //This function is to assuming that we need 15 mins each ingredients
  calcTime() {
    const numIng = this.ingredients.length;
    const periods = Math.ceil(numIng/3);
    this.time = periods * 15;
  }

  //This function is to calculate the amount of ingredients for 4 person
  calcServings() {
    this.servings = 4;
  }
}