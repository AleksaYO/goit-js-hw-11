import { Notify } from 'notiflix';
import FetchAplication from './fetchInfo';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import 'animate.css';

const gallery = document.querySelector('.gallery');
const form = document.querySelector('.search-form');
const loadmore = document.querySelector('.loadmore');
const arrow = document.querySelector('.icon-arrow');

form.addEventListener('submit', getQuery);
loadmore.addEventListener('click', onLoadMore);
window.addEventListener('scroll', () => {
  if (window.scrollY > 700) {
    arrow.classList.remove('is-hidden');
  } else if (window.scrollY < 700) {
    arrow.classList.add('is-hidden');
  }
});

arrow.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
});

arrow.classList.add('is-hidden');
const request = new FetchAplication();

const lightbox = new SimpleLightbox('.gallery a');

async function getQuery(e) {
  loadmore.classList.remove('is-hidden');
  loadmore.textContent = 'Грузим!';
  arrow.classList.add('is-hidden');

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
    } else {
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
          <div class="image"><a href='${largeImageURL}'><img src="${webformatURL}" alt="${tags}" loading="lazy"/></a></div>
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

// function onClickScrollUp() {
//   arrow.onclick = () => {
//     window.scrollTo({
//       top: 0,
//       left: 0,
//       behavior: 'smooth',
//     });
//   };
// }

// const total = totalHits / request.perPage;
// request.perItem = Math.ceil(total);
// if (request.page === request.perItem) {
//   Notify.warning('asdawda');
// }
