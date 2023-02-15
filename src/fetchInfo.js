import axios from 'axios';

export default function onGetFetch(info, pageNumber) {
  const KEY = '33670371-d942f4f25aae3d20fc7b6df7e';
  const URL = `https://pixabay.com/api/?key=${KEY}&q=${info}&image_type=photo&orientation=horizontal&safesearch=true&`;
  return axios.get(URL).then(({ data: { hits } }) => {
    if (hits.length === 0) {
      throw new Error(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    return hits;
  });
}
