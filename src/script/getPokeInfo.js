const errorSpam = document.querySelector('[data-js="error"]');
const mensagemError = document.createElement('span');
const errorMensage = () => {
  errorSpam.insertAdjacentElement('afterend', mensagemError);
  mensagemError.textContent = 'não foi possivel encontrar esse pokemon.';
  mensagemError.style.color = 'crimson';
};

const pokemonUrl = pokemon => `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
const pokemonSpecieUrl = pokemon =>
  `https://pokeapi.co/api/v2/pokemon-species/${pokemon}`;

const evolutionChainUrl = chainId =>
  `https://pokeapi.co/api/v2/evolution-chain/${chainId}/`;

const getFetchRequest = async url => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Errow('Não foi possivel obter os dados');
    }
    mensagemError.remove()
    return response.json();
  } catch (error) {
    errorMensage();
  }
};

const getPokemonInfo = pokemon => getFetchRequest(pokemonUrl(pokemon));
const getPokemonSpecies = pokemon => getFetchRequest(pokemonSpecieUrl(pokemon));
