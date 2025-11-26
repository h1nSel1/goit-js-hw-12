import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css'; // додатковий імпорт стилів iziToast

import { getImagesByQuery } from './js/pixabay-api';

import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
} from './js/render-functions';

const form = document.querySelector('.form');
const input = document.querySelector('input');
const loadMoreBtn = document.querySelector('.load-more-button');
const loadMoreLoaderEl = document.querySelector('.load-more-loader');

let currentQuery = '';
let currentPage = 1;
let totalHits = 0;

form.addEventListener('submit', onSearch);
loadMoreBtn.addEventListener('click', loadMoreBtnClickHandler);

async function onSearch(event) {
  event.preventDefault();

  const query = input.value.trim();

  if (query === '') {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query.',
      position: 'topRight',
      closeOnClick: true,
      closeOnEscape: true,
    });
    return;
  }

  currentQuery = query;
  currentPage = 1;

  clearGallery();
  hideLoadMoreButton();
  showLoader();

  try {
    const { hits, totalHits: total } = await getImagesByQuery(
      currentQuery,
      currentPage
    );

    totalHits = total;

    if (!hits || hits.length === 0) {
      iziToast.error({
        title: '',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
        closeOnClick: true,
        closeOnEscape: true,
      });
      return;
    }

    createGallery(hits);

    if (hits.length < 15 || hits.length === totalHits) {
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }
  } catch (error) {
    console.log('Error fetching images:', error);
    iziToast.error({
      title: 'Error',
      message:
        'Something went wrong while fetching images. Please try again later.',
      position: 'topRight',
      closeOnClick: true,
      closeOnEscape: true,
    });
  } finally {
    hideLoader();
  }
}

async function loadMoreBtnClickHandler() {
  currentPage++;

  showLoader(loadMoreLoaderEl);
  hideLoadMoreButton();

  try {
    const { hits } = await getImagesByQuery(currentQuery, currentPage);

    createGallery(hits);

    const loaded = document.querySelectorAll('.gallery a').length;

    if (loaded >= totalHits) {
      hideLoadMoreButton();
      iziToast.info({
        title: '',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
        closeOnClick: true,
        closeOnEscape: true,
      });
    } else {
      showLoadMoreButton();
    }

    const firstGalleryCard = document.querySelector('.gallery a');
    if (firstGalleryCard) {
      const { height: galleryCardHeight } =
        firstGalleryCard.getBoundingClientRect();

      scrollBy({
        top: galleryCardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.log(error);
  } finally {
    hideLoader(loadMoreLoaderEl);
  }
}
