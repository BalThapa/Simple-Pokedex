const typeButton = document.querySelector(".find button");
const searchByIcons = document.querySelector(".Icons");
const genBtnParent = document.querySelector("#generation");
const findBtn = document.querySelector(".find");
const nameInput = document.querySelector("#nameInput");
let pokeList = [];

let Generations = {
  first: { limit: 151, offset: 0 },
  second: { limit: 100, offset: 151 },
  third: { limit: 153, offset: 251 },
  fourth: { limit: 107, offset: 386 },
  fifth: { limit: 156, offset: 493 },
  sixth: { limit: 72, offset: 649 },
  seventh: { limit: 88, offset: 721 },
  eighth: { limit: 96, offset: 809 },
  nineth: { limit: 110, offset: 905 },
};

genBtnParent.addEventListener("click", (e) => {
  const lim = Generations[e.target.id].limit;
  const off = Generations[e.target.id].offset;
  pokemons(lim, off);
});

function pokemons(limit, offset) {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  pokeList = [];
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const fetches = data.results.map((item) => {
        return fetch(item.url).then((res) => res.json());
      });
      Promise.all(fetches).then((data) => {
        document.querySelector(".card").innerHTML = data
          .map((item) => {
            const pokeId = item.id;
            const pokeName = item.name;
            const pokeType = item.types.map((type) => type.type.name);
            const pokeImg = item.sprites.other.dream_world.front_default;
            const poke = {
              id: pokeId,
              name: pokeName,
              type: pokeType,
              img: pokeImg,
            };
            pokeList.push(poke);
            return pokeRender(pokeId, pokeName, pokeType, pokeImg);
          })
          .join("");
      });
    });
}

findBtn.addEventListener("click", () => {
  const searchKey = nameInput.value;
  const foundPoke = pokeList.filter((item) => {
    return item.name.includes(searchKey);
  });
  document.querySelector(".card").innerHTML = foundPoke
    .map((item) => pokeRender(item.id, item.name, item.type, item.img))
    .join("");
});

function pokeRender(id, name, type, img) {
  return `<li class = "${type[0]}">
  <img src="${img}"/>
  <h2>${name}</h2>
  <P>${type.join(", ")}</p>
  <P>*${id}</p></li> `;
}

searchByIcons.addEventListener("click", (e) => {
  if (e.target.id) {
    nameInput.value = "";
    const searchType = e.target.id;
    const filteredPoke = pokeList.filter((item) =>
      item.type.includes(searchType)
    );
    document.querySelector(".card").innerHTML = filteredPoke
      .map((item) => pokeRender(item.id, item.name, item.type, item.img))
      .join("");
  }
});
