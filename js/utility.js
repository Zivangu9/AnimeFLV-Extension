const AnimeState = {
  NOT_WATCHING: 0,
  WATCHED: 1,
  WATCHING: 2,
};

const getUserAnimeState = (anime) => {
  if (
    anime &&
    anime.last_seen &&
    anime.last_episode &&
    anime.state &&
    anime.last_seen !== "0"
  ) {
    if (anime.last_episode === anime.last_seen && anime.state === 2)
      return AnimeState.WATCHED;
    return AnimeState.WATCHING;
  } else return AnimeState.NOT_WATCHING;
};

const Pages = {
  INDEX: 0,
  PROFILE: 1,
  WATCHED: 2,
  WATCHING: 3,
  EPISODE: 4,
  ANIME: 5,
};

const getCurrentPage = (url) => {
  if (
    url.startsWith("https://www3.animeflv.net/perfil/") &&
    url.split("/").length === 5
  )
    return Pages.PROFILE;
  if (
    url.startsWith("https://www3.animeflv.net/perfil/") &&
    url.split("/").length === 6 &&
    url.split("/")[5] === "vistos"
  )
    return Pages.WATCHED;
  if (
    url.startsWith("https://www3.animeflv.net/perfil/") &&
    url.split("/").length === 6 &&
    url.split("/")[5] === "viendo"
  )
    return Pages.WATCHING;
  if (url.startsWith("https://www3.animeflv.net/ver/")) return Pages.EPISODE;
  if (url.startsWith("https://www3.animeflv.net/anime/")) return Pages.ANIME;
};

const parseHtmlToJson = (htmlString) => {
  const $html = $(removeImagesFromHtml(htmlString));
  const anime = {};
  //<meta property="og:url" content="https://www3.animeflv.net/anime/rurouni-kenshin-meiji-kenkaku-romantan-2023">
  anime.name = $html.find("h1.Title").text();
  anime.url_name = $html
    .filter("meta[property='og:url']")
    .attr("content")
    .substring(32);
  anime.type = $html.find("span.Type").attr("class").split(" ")[1];
  anime.id = $html.find("div.Strs.RateIt").attr("data-id");
  anime.banner_url = `/uploads/animes/banners/${anime.id}.jpg`;
  anime.cover_url = `/uploads/animes/covers/${anime.id}.jpg`;
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
  for (let i = images.length - 1; i >= 0; i--) {
    if (/\/uploads\/avatars\//.test(images[i].src)) return images[i];
  }
  return null;
};

//TODO: Remove social media links from profile