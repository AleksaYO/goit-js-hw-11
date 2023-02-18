import axios from 'axios';
const KEY = '33670371-d942f4f25aae3d20fc7b6df7e';

export default class FetchAplication {
  constructor() {
    this.page = 1;
    this.query = '';
    this.perPage = 12;
    this.perItem = null;
  }

  async getInfo() {
    const URL = `https://pixabay.com/api/?key=${KEY}&q=${this.query}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`;

    const response = await axios.get(URL);
    const hits = response.data;
    return hits;
  }

  nextPage() {
    this.page += 1;
  }

  firstPage() {
    this.page = 1;
  }
}
