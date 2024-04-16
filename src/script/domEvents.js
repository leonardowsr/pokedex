const form = document.querySelector('form');
const pokeAddName = document.querySelector('[data-js="pokeName"]');
const pokeSprite = document.querySelector('[data-js="poke-sprite"]');
const pokeWeight = document.querySelector('[data-js="Weight"]');
const pokeCategory = document.querySelector('[data-js="Category"]');
const pokeHeight = document.querySelector('[data-js="Height"]');
const pokeAbilities = document.querySelector('[data-js="Abilities"]');
const pokeTypes = document.querySelector('[data-js="type-poke"]');
const pokeDescription = document.querySelector('[data-js="Description"]');
const listPoke = document.querySelector('[data-js="lista-poke"]');
const containerLista = document.querySelector('[data-js="container-lista"]');
const evolution = document.querySelector('[data-js="evolution"]');
const containerPokeMain = document.querySelector('[data-js="conteiner-Main"]');
const pikachuGif = document.querySelector('[data-js="pikachu-gif"]');
const modal = document.querySelector('[data-js="modal"]');
const ashChampion = document.querySelector('[data-js="ash-champion"]');
const mainContentContainer = document.querySelector('main');

let counter = 1;
const changerGif = setInterval(() => {
  pikachuGif.src = `src/img/poke gif ${counter}.gif`;
  counter++;
  if (counter > 10) {
    counter = 1;
  }
  console.log(counter);
}, 2000);

document
  .querySelector('[data-js="historico"]')
  .addEventListener('click', () => {
    containerLista.classList.toggle('hidden');
  });

const clearHistorico = () => {
  const arraya = document.querySelectorAll('[data-js="lista-poke"] li');
  arraya.forEach((element, index) => {
    if (index === 6) {
      element.remove();
    }
  });
};

const addPokemonFav = (pokeName, objeto) => {
  const li = document.createElement('li');
  const imgLink = objeto.front_default;
  li.setAttribute('data-js', 'li');
  listPoke.insertAdjacentElement('afterbegin', li);
  clearHistorico(listPoke);

  li.innerHTML = `<img src="${imgLink}" class="img-historico" alt='pokemon'> <p style="display:inline;">${pokeName}</p>`;
};

const catchSpecie = objeto => {
  const objSpecie = objeto.filter(({ language }) => language.name === 'en');
  const name = objSpecie[0].genus;
  const specieName = name.slice(0, name.length - 8);
  return specieName;
};

const getDescriptionTextEn = objeto => {
  const [, objDescription] = objeto.filter(
    ({ language }) => language.name === 'en'
  );
  console.log(objDescription);
  return objDescription;
};

const addOtherInfoPoke = (objeto, genera, ability, name, Description) => {
  const descriptionFormated = Description.replace('', ' ').replace(
    'POKéMON',
    'pokémon'
  );

  console.log(Description);
  pokeDescription.textContent = descriptionFormated;
  pokeAddName.textContent = name;
  pokeWeight.textContent = `${Math.round(objeto.weight * 0.1)} kg`;
  pokeHeight.textContent = `${objeto.height * 10} cm`;
  pokeCategory.textContent = catchSpecie(genera);
  pokeAbilities.textContent = ability.ability.name;
};

const getTypes = objeto => {
  const tipos = objeto.reduce((total, array) => {
    total += `${array.type.name} `;
    return total;
  }, '');
  return tipos;
};
const addTypes = objeto => {
  pokeTypes.textContent = getTypes(objeto);
};
const addPokeImg = numeroPoke => {
  const urlTeste = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${numeroPoke}.png`;
  pokeSprite.src = urlTeste;
  pokeSprite.setAttribute('width', '300px');
};

const addEvolutions = objeto => {
  const { species } = objeto;
  const firstEvolution = species.name;
  let secondEvolution = '';
  let thirdEvolution = '';
  const evolves_to = objeto.evolves_to[0];
  evolution.textContent = `Unevolved`;
  if (objeto.evolves_to.length === 1) {
    secondEvolution = evolves_to.species.name;
    evolution.textContent = `${firstEvolution} → ${secondEvolution}`;

    if (evolves_to.evolves_to.length === 1) {
      thirdEvolution = evolves_to.evolves_to[0].species.name;
      evolution.textContent = `${firstEvolution} → ${secondEvolution} → ${thirdEvolution}`;
    }
  }
};

form.addEventListener('submit', async e => {
  e.preventDefault();
  clearInterval(changerGif);
  const inputValue = e.target.pokeName.value;
  const pokeName = inputValue.toLowerCase();

  const pokeInfor = await getPokemonInfo(pokeName);
  const { abilities, sprites, types, name, id } = pokeInfor;
  const { genera, flavor_text_entries, evolution_chain } =
    await getPokemonSpecies(pokeName);
  const { chain } = await getFetchRequest(evolution_chain.url);
  const { flavor_text } = getDescriptionTextEn(flavor_text_entries);

  addEvolutions(chain);
  addOtherInfoPoke(pokeInfor, genera, abilities[0], name, flavor_text);
  addPokeImg(id);
  addTypes(types);
  addPokemonFav(pokeName, sprites);

  containerPokeMain.classList.remove('hidden');
  pikachuGif.classList.add('hidden');
  form.reset();
});

function activeModal() {
  ashChampion.addEventListener('click', () => {
    modal.classList.remove('hidden');
    mainContentContainer.classList.add('hidden');
  });
}
activeModal();

function closeModal() {
  modal.addEventListener('click', e => {
    const classes = ['modalChampion', 'modal-close', 'tittle-congratulations'];
    const check = classes.some(item => item === e.target.classList.value);
    if (check) {
      modal.classList.add('hidden');
      mainContentContainer.classList.remove('hidden');
    }
  });
}
closeModal();
