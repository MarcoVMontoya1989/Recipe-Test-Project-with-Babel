import axios from 'axios';
import {proxy} from '../config';

export default class Search {
  constructor (query) {
    this.query = query;
  }

  async getResults () {
    try {
      const res = await axios(`${proxy}search?&q=${this.query}`);

      this.result = res.data.recipes;
    } catch (e) {
      console.log(e);
    }
  }
}
