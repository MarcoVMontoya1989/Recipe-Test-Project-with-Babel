import uniqid from 'uniqid';

export default class List {
  constructor () {
    this.items = []
  };

  addNewItem(count, unit, ingredient) {
    const item = {
      id: uniqid(),
      count,
      unit,
      ingredient
    };

    this.items.push(item);
    return item;
  };

  deleteItemSelected(idDel) {
    const index = this.items.findIndex(el => el.id === idDel)

    this.items.splice(index, 1);
  };

  updateCount(idSelected, newCount) {
    this.items.find(el => el.id === idSelected).count = newCount
  }
}