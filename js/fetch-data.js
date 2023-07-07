const loadProfileBasePage = (profile) => {
  fetch(`https://www3.animeflv.net/perfil/${profile}/favoritos`)
    .then((response) => response.text())
    .then((html) => {
      document.documentElement.innerHTML = html;
      const section = document
        .getElementsByClassName("Main")
        .item(0)
        .getElementsByTagName("section")
        .item(0);
      const sectionTop = section.getElementsByClassName("Top").item(0);
      sectionTop.getElementsByClassName("Title").item(0).textContent =
        "Animes vistos";
      //Remove Filter
      sectionTop.removeChild(sectionTop.getElementsByTagName("div").item(1));
      section.removeChild(section.getElementsByTagName("form").item(0));
      section.removeChild(section.getElementsByClassName("NvCnAnm").item(0));
    })
    .catch((error) => {
      console.error("Error fetching profile page:", error);
    });
};

const exampleAnimeList = [
  {
    id: "1",
    name: "Bleach",
    url_name: "bleach-tv",
    description: `Kurosaki Ichigo es un estudiante de instituto de 15 años, que tiene una peculiaridad: es capaz de ver, oír y hablar con fantasmas. Pero no sabe hasta dónde puede abarcar la clasificación de espíritus, ni lo que conlleva el saberlo. Un buen día, una extraña chica de pequeña estatura que viste ropas negras de samurai entra en su cuarto. Se llama Rukia Kuchiki, y es una Shinigami (Dios de la Muerte). Ante la incredulidad de Ichigo, le explica que su trabajo es mandar a las almas buenas o plus a un lugar llamado la Sociedad de Almas, y eliminar a las almas malignas o hollows. Luego junto a Inoue Orihime, Ishida Ury y Sado Yasutora se veran envueltos en diferentes batallas, las cuales iran desarrollando sus diferentes habilidades que le otorgaran a cada uno su importancia en la serie.`,
    stars: 4.6,
    total_episodes: 366,
    last_seen: 16,
    genres: ["accion", "comedia", "shounen", "sobrenatural", "superpoderes"],
    type: "tv",
    state: 1,
  },
  {
    id: "2",
    name: "Naruto",
    url_name: "naruto",
    description: `Naruto, un aprendiz de ninja de la Aldea Oculta de Konoha es un chico travieso que desea llegar a ser el Hokage de la aldea para demostrar a todos lo que vale. Lo que descubre al inicio de la historia es que la gente le mira con desconfianza porque en su interior está encerrado el demonio Kyubi que una vez destruyó la aldea, y que el anterior líder de la misma tuvo que encerrar en su cuerpo siendo aún muy pequeño, a coste de su vida. Aunque sus compañeros no saben esto, tampoco le aprecian porque es mal estudiante y siempre está haciendo bromas. Sin embargo, la forma de actuar y la determinación de Naruto demuestran a los demás que puede llegar muy lejos, y el recelo de los otros chicos se va disipando. Naruto y sus compañeros Sakura y Sasuke, junto a su maestro Kakashi tendrán que enfrentarse a una serie de combates y misiones a lo largo de la historia que les permitirán mejorar y crecer. Naruto se vera enfrentado a sus principales enemigos Akatsuki, Itachi y Kisame.`,
    stars: 4.6,
    total_episodes: 220,
    last_seen: 220,
    genres: ["accion", "artes-marciales", "comedia", "shounen", "superpoderes"],
    type: "tv",
    state: 1,
  },
  {
    id: "3",
    name: "Naruto Shippuden",
    url_name: "naruto-shippuden-hd",
    description: `Pasados dos años y medio de entrenamiento con Jiraiya, Naruto Uzumaki regresa a la aldea oculta de la hoja, donde se reúne con sus viejos amigos y conforma de nuevo el Equipo 7. Debido a la ausencia de Sasuke, aparece un nuevo personaje llamado Sai el cual retoma su lugar.
      En esta secuela podremos notar como los compañeros de Naruto han madurado con respecto a su desempeño previo, mejorando la mayoría de estos en su nivel. Durante su entrenamiento con Jiraiya, Naruto aprendió a controlar un poco de la chacra del Kyubi.
      Lo contrario a la serie original, dónde sólo desempeñó un papel secundario, la organización Akatsuki asume el papel antagónico principal en Naruto Shippuden, buscando como objetivo principal el capturar a todos los poderosos monstruos Biju.`,
    stars: 4.6,
    total_episodes: 500,
    last_seen: 500,
    genres: ["accion", "artes-marciales", "comedia", "shounen", "superpoderes"],
    type: "tv",
    state: 1,
  },
];

const exampleList = [
  ["1", "Bleach", "bleach-tv", "3602", "tv"],
  ["2", "Naruto", "naruto", "5373", "tv"],
  // ["3", "Naruto Shippuden", "naruto-shippuden-hd", "5374", "tv"],
  // ["4", "Highschool of the Dead", "highschool-of-the-dead", "3564", "tv"],
  // ["5", "Fairy Tail", "fairy-tail", "5219", "tv"],
  // ["6", "To Love Ru", "to-love-ru", "6", "tv"],
  // ["7", "One Piece", "one-piece-tv", "5495", "tv"],
  // ["8", "Kaichou wa maid sama!", "kaichou-wa-maid-sama", "3551", "tv"],
  // ["9", "Elfen Lied", "elfen-lied", "9", "tv"],
  // ["10", "Death Note", "death-note", "5153", "tv"],
  // [
  //   "11",
  //   "Ichiban Ushiro no Daimaou",
  //   "ichiban-ushiro-no-daimaou",
  //   "5343",
  //   "tv",
  // ],
  // ["12", "07 Ghost", "07-ghost", "12", "tv"],
  // ["13", "ToraDora!", "toradora", "13", "tv"],
  // [
  //   "14",
  //   "Abenobashi Maho Shotengai",
  //   "abenobashi-maho-shotengai",
  //   "5323",
  //   "tv",
  // ],
  // ["15", "Air Gear", "air-gear", "4596", "tv"],
  [
    "3836",
    "Jujutsu Kaisen 2nd Season",
    "jujutsu-kaisen-2nd-season",
    "6275",
    "tv",
  ],
];
const complete_list = $.get("https://www3.animeflv.net/api/animes/list");
const getWatchedList = () => {
  console.log();
  return exampleAnimeList;
};

const requestOptions = {
  headers: {
    Accept: "text/html",
    "Content-Type": "text/html",
  },
};
function fetchAnimes(urls) {
  const promises = urls.map((url) =>
    fetch(`https://www3.animeflv.net/anime/${url[2]}`, requestOptions)
      .then((response) => response.text())
      .then((response) => {
        const anime = parseHtmlToJson(url, response);
        response = null;
        return anime;
      })
  );
  return Promise.all(promises);
}

function removeImagesFromHtml(html) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = doc.getElementsByTagName("img");
  for (let i = images.length - 1; i >= 0; i--) {
    images[i].remove();
  }
  const modifiedHtml = doc.documentElement.innerHTML;
  return modifiedHtml;
}

const parseHtmlToJson = (original, htmlString) => {
  const anime = {
    id: original[0],
    name: original[1],
    url_name: original[2],
    type: original[4],
    banner_url: `/uploads/animes/banners/${original[0]}.jpg`,
    cover_url: `/uploads/animes/covers/${original[0]}.jpg`,
  };
  const $html = $(removeImagesFromHtml(htmlString));
  // Stars
  anime.stars = $html.find("span.vtprmd[id='votes_prmd']").text();
  // Description
  anime.description = $html.find("div.Description>p").text();
  // Genres
  anime.genres = $html.find("nav.Nvgnrs>a").map(
    (i, a) =>
      $(a)
        .attr("href")
        .match(/genre=(\w+)/)[1]
  );
  // State
  const $aside = $($html.find("aside.SidebarA.BFixed>p.AnmStts"));
  anime.state = getState($aside);

  // Episodes
  const script = $html.filter("script:not([src]):not([type])")[2];
  if (script) {
    const last_seen_match = script.innerHTML.match(/var last_seen = (.+);/);
    if (last_seen_match) anime.last_seen = last_seen_match[1];
    const episodes_match = script.innerHTML.match(/var episodes = (\[.*?\]);/);
    if (episodes_match) anime.episodes = JSON.parse(episodes_match[1]);
    if (anime.episodes && anime.episodes.length > 0)
      anime.last_episode = anime.episodes[0][0].toString();
  }
  return anime;
};

const getState = ($aside) => {
  if ($aside.hasClass("A")) return 2;
  if ($aside.hasClass("B")) return 3;
  return 1;
};
