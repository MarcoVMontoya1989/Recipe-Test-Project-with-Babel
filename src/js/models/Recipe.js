import axios from 'axios'
import { proxy } from '../config'
import { unitLongAbr, unitShortAbr } from '../dictionaryAbbreviation'

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
  };

  //This function is to calculate the amount of ingredients for 4 person
  calcServings() {
    this.servings = 4;
  };

  parseIngredients() {
    const unitsLong = unitLongAbr, shortUnits = unitShortAbr;

    this.ingredients = this.ingredients.map(el => {
      // 1) Uniform units
      let ingredient = el.toLowerCase();
      unitsLong.forEach((unit, index) => {
        ingredient = ingredient.replace(unit, shortUnits[index]);
      });

      // 2) Remove Parentheses
      ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");

      //3) Parse ingredient into count, unit and ingredient
      const arrIng = ingredient.split(' ');
      const unitIndex = arrIng.findIndex(el2 => {
        shortUnits.includes(el2);
      });

      let objIng;
      if (unitIndex > -1) {
        //there's a unit

        //EX: 4 1/2 cups = arrCount[4, 1/2]
        //EX: 4 cups = arrCount[4]
        const arrCount = arrIng.slice(0, unitIndex);
        let count;

        if (arrCount.length === 1) {
          count = eval(arrIng[0].replace('-', '+'));
        } else {
          //EX: 4 1/2 --> eval("4+1/2") --> 4.5
          count = eval(arrIng.slice(0, unitIndex).join('+'));
        }

        objIng = {
          count,
          unit: arrIng[unitIndex],
          ingredient: arrIng.slice(unitIndex + 1).join(' '),
        }

      } else if (parseInt(arrIng[1], 10)) {
        //there's no unit but the first element is number
        objIng = {
          count: parseInt(arrIng[0], 10),
          unit: '',
          ingredient: arrIng.slice(1).join(' '),
        }
      } else if (unitIndex === -1) {
        //there's NOT a unit and no number in the 1st position
        objIng = {
          count: 1,
          unit: '',
          ingredient,
        }
      }

      return objIng;
    });
  }
}