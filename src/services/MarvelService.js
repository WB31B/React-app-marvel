class MarvelService {
  _apiBase = 'https://gateway.marvel.com:443/v1/public/';
  _apiKey = 'apikey=517b865b18e268f13d095160fa6d2a85';

  getResource = async (url) => {
    let res = await fetch(url);

    if (!res.ok) {
      throw new Error(res.status);
    }

    return await res.json();
  }

  getAllCharacters = () => {
    return this.getResource(`${this._apiBase}characters?limit=43&offset=5643&${this._apiKey}`);
  }

  getCharacter = (id) => {
    return this.getResource(`${this._apiBase}characters/${id}?${this._apiKey}`);
  }
}

export default MarvelService;