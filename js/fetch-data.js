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

const complete_list = $.get("https://www3.animeflv.net/api/animes/list");
const getWatchedList = () => {
  console.log();
  return exampleAnimeList;
};

const fetchAnimes = (urls) => {
  const promises = urls.map((url) =>
    fetch(`https://www3.animeflv.net/anime/${url[2]}`)
      .then((response) => response.text())
      .then((response) => {
        const anime = parseHtmlToJson(url, response);
        return anime;
      })
  );
  return Promise.all(promises);
};

const removeImagesFromHtml = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = doc.getElementsByTagName("img");
  for (let i = images.length - 1; i >= 0; i--) {
    images[i].remove();
  }
  const modifiedHtml = doc.documentElement.innerHTML;
  return modifiedHtml;
};

const getAvatarImage = (html) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const images = doc.getElementsByTagName("img");
  let avatarImage;
  for (let i = images.length - 1; i >= 0; i--) {
    if (/\/uploads\/avatars\//.test(images[i].src)) return images[i];
  }
  return null;
};

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

const fetchUserAnimes = (progress, myError) => {
  complete_list.then(async (list) => {
    // const listJson = JSON.parse(list).slice(0, 500); //Limit list to fetch
    const listJson = JSON.parse(list);
    const total = listJson.length;
    const max = 50;
    let i = 0;
    const watching = [];
    const watched = [];
    while (i < listJson.length) {
      await fetchAnimes(listJson.slice(i, i + max))
        .then((dataArray) => {
          const procesing = dataArray.filter(
            (anime) => getUserAnimeState(anime) !== 0
          );
          procesing.forEach((anime) => {
            if (getUserAnimeState(anime) === 1) watched.push(anime);
            else watching.push(anime);
          });
          i += max;
          progress((i / max / (total / max)) * 100);
        })
        .catch((error) => {
          i = listJson.length;
          myError();
          console.error("Error fetching data:", error);
        });
    }
    getUser().then((user) => {
      saveUserData(user, watched, watching);
    });
  });
};

const getUser = () =>
  fetch("https://www3.animeflv.net")
    .then((response) => response.text())
    .then((htmlString) => {
      const avatarImage = getAvatarImage(htmlString);
      if (avatarImage) {
        const $avatarImage = $(avatarImage);
        // console.log($avatarImage.attr("src")); //TODO: do we need the avatar image?
      }
      const $html = $(removeImagesFromHtml(htmlString));
      const script = $html.filter("script:not([src]):not([type])")[0];
      const is_user_match = script.innerHTML.match(/var is_user = (.+);/);
      if (
        !is_user_match ||
        (is_user_match && JSON.parse(is_user_match[1]) !== true)
      )
        return;
      const $span = $(
        $html.find("div.Login>label.Button>span.fa-chevron-down")[0]
      );
      if ($span) return $span.find("strong").text();
      return;
    })
    .catch((error) => {
      console.error("Error fetching profile page:", error);
    });
