export default class Likes {
  constructor () {
    this.likes = [];
  };

  addLike(id, title, author, img) {
    const like = {
      id, title, author, img
    };

    this.likes.push(like);

    // perish data in the localstorage
    this.persistDataLikes();

    return like;
  };

  deleteLikeId (idToDelete) {
    const index = this.likes.findIndex(el => el.id === idToDelete)

    this.likes.splice(index, 1);

    //perish the data in the localstorage
    this.persistDataLikes();
  };

  isLiked(idLiked) {
    return this.likes.findIndex(el => el.id === idLiked) !== -1;

  };

  getNumLikes() {
    return this.likes.length;
  };

  persistDataLikes() {
    localStorage.setItem('likes', JSON.stringify(this.likes));
  };

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));
    if (storage) this.likes = storage;
  }
};
