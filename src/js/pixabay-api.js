import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '53389241-61d9b890c2cc3baebfd2ae29c';

export async function getImagesByQuery(query, page = 1) {
  const response = await axios.get(BASE_URL, {
    params: {
      key: API_KEY,
      q: query,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: true,
      page,
      per_page: 15,
    },
  });

  return {
    hits: response.data.hits,
    totalHits: response.data.totalHits,
  };
}
