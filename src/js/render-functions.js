// Описаний у документації
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const mainGallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more-button');

const simpleLightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
  fadeSpeed: 200,
});

export function createGallery(images) {
  if (!images || images.length === 0) return;

  const markup = images
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;

      return `
      <li class="gallery-item">
        <a class="gallery-link" href="${largeImageURL}">
          <img class="gallery-img" src="${webformatURL}" alt="${tags}" loading="lazy"/>
        </a>
        <div class="details">
          <p class="details-item"><b>Likes</b> ${likes}</p>
          <p class="details-item"><b>Views</b> ${views}</p>
          <p class="details-item"><b>Comments</b> ${comments}</p>
          <p class="details-item"><b>Downloads</b> ${downloads}</p>
        </div>
      </li>`;
    })
    .join('');

  mainGallery.insertAdjacentHTML('beforeend', markup);

  simpleLightbox.refresh();
}

export function clearGallery() {
  mainGallery.innerHTML = '';
}

export function hideLoadMoreButton() {
  loadMoreBtn.classList.add('hidden');
}

export function showLoadMoreButton() {
  loadMoreBtn.classList.remove('hidden');
}

export function showLoader(element) {
  const el = element ?? document.querySelector('.loader');
  el.classList.remove('hidden');
}

export function hideLoader(element) {
  const el = element ?? document.querySelector('.loader');
  el.classList.add('hidden');
}
