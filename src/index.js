import { Notify } from 'notiflix';
import onGetFetch from './fetchInfo';

const box = document.querySelector('.gallery');
const form = document.querySelector('.search-form');

form.addEventListener('submit', onFetchInfo);

function onFetchInfo(e) {
  e.preventDefault();
  const { searchQuery } = e.currentTarget.elements;
  onGetFetch(searchQuery.value)
    .then(hits => {
      onCreateMarkup(hits);
    })
    .catch(error => Notify.failure(`${error}`));
  searchQuery.value = '';
}

function onCreateMarkup(arr) {
  box.innerHTML = '';
  const markup = arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) =>
        `<div class="photo-card">
          <img src="${webformatURL}" alt="#" loading="lazy"/>
          <div class="info">
            <p class="info-item">
              <b class='info-b'>Likes</b>
              ${likes}
            </p>
            <p class="info-item">
              <b class='info-b'>Views</b>
              ${views}
            </p>
            <p class="info-item">
              <b class='info-b'>Comments</b>
              ${comments}
            </p>
            <p class="info-item">
              <b class='info-b'>Downloads</b>
              ${downloads}
            </p>
          </div>
        </div>`
    )
    .join('');
  box.insertAdjacentHTML('beforeend', markup);
}
