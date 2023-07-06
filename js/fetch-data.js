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

const getWatchedList = () => {
  return exampleAnimeList;
};
