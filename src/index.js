import { Notify } from 'notiflix';
import FetchAplication from './fetchInfo';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'animate.css';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadmore = document.querySelector('.loadmore');

form.addEventListener('submit', getQuery);
loadmore.addEventListener('click', onLoadMore);

const request = new FetchAplication();

const lightbox = new SimpleLightbox('.gallery a');

async function getQuery(e) {
  loadmore.classList.remove('is-hidden');
  loadmore.textContent = 'Грузим!';

  onGalleryReset();

  e.preventDefault();

  const { searchQuery } = e.currentTarget.elements;

  request.query = searchQuery.value.trim();

  onFetchInfo();

  form.reset();
}

async function onFetchInfo() {
  loadmore.disabled = true;
  loadmore.textContent = 'Грузим!';

  const { hits, totalHits } = await request.getInfo();

  try {
    if (!totalHits) {
      throw new Error('Ничего не найдено, подумай ка лучше');
    } else if (request.page === 1) {
      Notify.success(`Найдено ${totalHits} фоточек`);
    }
    onCreateMarkup(hits);

    if (request.page >= 2) onSlowlyScroll();

    request.nextPage();
  } catch (error) {
    loadmore.classList.add('is-hidden');

    Notify.failure(error.message);

    gallery.innerHTML = `<p class="text-wor">Ало, такого не существует &#129320;</p>`;
  }
}

function onCreateMarkup(arr) {
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
        `<div class="photo-card animate__animated animate__bounceIn">
          <a href='${largeImageURL}'><div class="image"><img src="${webformatURL}" alt="${tags}" loading="lazy"/></div></a>
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

  gallery.insertAdjacentHTML('beforeend', markup);

  lightbox.refresh();
  loadmore.disabled = false;
  loadmore.textContent = 'Погнали дальше';
}

function onLoadMore() {
  onFetchInfo();
}

function onGalleryReset() {
  request.firstPage();
  gallery.innerHTML = '';
}

function onSlowlyScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}
