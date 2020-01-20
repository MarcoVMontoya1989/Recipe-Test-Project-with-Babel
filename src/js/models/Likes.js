export default class Likes {
  constructor () {
    this.likes = [];
  };

  addLike(id, title, author, img) {
    const like = {
      id, title, author, img
    };

    this.likes.push(like);

    return like;
  };

  deleteLikeId (idToDelete) {
    const index = this.likes.findIndex(el => el.id === idToDelete)

    this.likes.splice(index, 1);
  };

  isLiked(idLiked) {
    return this.likes.findIndex(el => el.id === idLiked) !== -1;

  };

  getNumLikes() {
    return this.likes.length;
  };

};
