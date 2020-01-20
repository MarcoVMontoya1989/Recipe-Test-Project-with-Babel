import {elements} from './base';
import {limitRecipeTitle} from './searchView';

export const toggleLikeBtn = isLiked => {
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';

  document.querySelector('.recipe__love use')
    .setAttribute('href', `img/icons.svg#${iconString}`);
};

export const toggleLikeMenu = numLikes => {
  elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

export const renderLikes = like => {
   const markup = `
    <li>
        <a class="likes__link" href="#${like.id}">
            <figure class="likes__fig">
                <img src="img/${like.img}" alt="${limitRecipeTitle(like.title)}">
            </figure>
            <div class="likes__data">
                <h4 class="likes__name">${like.title}</h4>
                <p class="likes__author">${like.author}</p>
            </div>
        </a>
    </li>
   `;

    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

export const deleteLikeListMenu = deleteLikeList => {
  const elem = document.querySelector(`.likes__link[href*="${deleteLikeList}"]`).parentElement;
  if (elem) {
    elem.parentElement.removeChild(elem);
  }
};
