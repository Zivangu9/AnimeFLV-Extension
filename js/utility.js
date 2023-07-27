const AnimeLists = {
  FAVORITE: 0,
  FOLLOW: 1,
  PENDING: 2,
  WATCHED: 3,
  WATCHING: 4,
};

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
    if (anime.last_episode === anime.last_seen && anime.state === "2")
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
  DEFAULT: 6,
};

const getCurrentPage = (url) => {
  if (url.pathname.startsWith("/perfil/")) {
    if (url.pathname.split("/").length === 3) return Pages.PROFILE;
    if (url.pathname.split("/")[3] === "vistos") return Pages.WATCHED;
    if (url.pathname.split("/")[3] === "viendo") return Pages.WATCHING;
  }
  if (url.pathname.startsWith("/ver/")) return Pages.EPISODE;
  if (url.pathname.startsWith("/anime/")) return Pages.ANIME;
  return Pages.DEFAULT;
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
  anime.favorite = $html.find("#add_favorite").css("display") === "none";
  anime.follow = $html.find("#follow_anime").css("display") === "none";
  anime.pending = $html.find("#add_pending").css("display") === "none";
  // Stars
  anime.stars = $html.find("span.vtprmd[id='votes_prmd']").text();
  // Description
  anime.description = $html.find("div.Description>p").text();
  // Genres
  anime.genres = $html
    .find("nav.Nvgnrs>a")
    .map(
      (i, a) =>
        $(a)
          .attr("href")
          .match(/genre=(\w+)/)[1]
    )
    .get();
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
  if ($aside.hasClass("A")) return "2";
  if ($aside.hasClass("B")) return "3";
  return "1";
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

const getTypeText = (type) => {
  if (type === "tv") return "ANIME";
  if (type === "ova") return "OVA";
  if (type === "movie") return "PELÍCULA";
  if (type === "special") return "ESPECIAL ";
  return "";
};
//TODO: Remove social media links from profile

const createTypeListIcon = (typeList) => {
  if (typeList) {
    if (typeList === AnimeLists.WATCHED)
      return `<a class="AnmQv p-0 fa-eye-slash"></a>`;
    if (typeList === AnimeLists.WATCHING)
      return `<a class="AnmQv p-0 fa-eye"></a>`;
  }
  return "";
};
const createAnimeLi = (anime, typeList) => {
  return `
  <li>
    <article class="Anime alt">
    ${createTypeListIcon(typeList)}
      <div class="Image">
        <figure><img src="${anime.cover_url}" alt="" /></figure>
        <span class="Type ${anime.type}">${getTypeText(anime.type)}</span>
        <div class="Description">
          <div class="Title">
            <strong><a href="/anime/${anime.url_name}">${
    anime.name
  }</a></strong>
          </div>
          <div class="Vts fa-star">${anime.stars}</div>
          <p>${anime.description}</p>
        </div>
      </div>
      <h3 class="Title"><a href="/anime/${anime.url_name}">${
    anime.name
  }</a></h3>
    </article>
  </li>`;
};

const filterList = (list, params) => {
  const pageSize = Number.parseInt(params.get("page_size")) || 24;
  const page = Number.parseInt(params.get("page")) || 1;
  if (params.has("genre[]"))
    list = list.filter((anime) =>
      anime.genres.some((genre) => params.getAll("genre[]").includes(genre))
    );
  if (params.has("type[]"))
    list = list.filter((anime) => params.getAll("type[]").includes(anime.type));
  if (params.has("status[]"))
    list = list.filter((anime) =>
      params.getAll("status[]").includes(anime.state)
    );
  if (params.has("order")) {
    if (params.get("order") === "title")
      list = list.sort((a, b) => a.name.localeCompare(b.name));
    else if (params.get("order") === "rating")
      list = list.sort((a, b) => parseFloat(b.stars) - parseFloat(a.stars));
    else list = list.sort((a, b) => parseFloat(a.id) - parseFloat(b.id));
  }

  return {
    data: list,
    pagination: {
      page,
      pageSize,
      pages: Math.ceil(list.length / pageSize),
    },
  };
};

const createPageLink = (path, params, index) => {
  return $(`
  <li>
    <a href="${path}?${params}">
      ${index}
    </a>
  </li>`);
};

const pagesRange = (page, limit, total) => {
  const from = Math.max(1, page - limit);
  const to = Math.min(page + limit, total);
  return {
    from: Math.max(1, from - (page + limit - to)),
    to: Math.min(to + (from - (page - limit)), total),
  };
};

const createPagination = (pagination, path) => {
  const limit = 5;
  const pages = pagesRange(pagination.page, limit, pagination.pages);
  for (let index = pages.from; index <= pages.to; index++) {
    if (index < 1) index = 1;
    urlSearchParams.set("page", index);
    const liPage = createPageLink(path, urlSearchParams.toString(), index);
    if (pagination.page === index) liPage.addClass("active");
    $("ul.pagination").append(liPage);
  }

  //Add first page
  if (pages.from > 1) {
    $("ul.pagination>li:first").replaceWith("<li><span>…</span></li>");
    urlSearchParams.set("page", 1);
    $("ul.pagination").prepend(
      createPageLink(path, urlSearchParams.toString(), 1)
    );
  }

  //Add last page
  if (pages.to < pagination.pages) {
    $("ul.pagination>li:last").replaceWith("<li><span>…</span></li>");
    urlSearchParams.set("page", pagination.pages);
    $("ul.pagination").append(
      createPageLink(path, urlSearchParams.toString(), pagination.pages)
    );
  }

  //Add Prev and Next page buttons
  if (pagination.pages > 1) {
    const prev = $(`<li><a rel="prev">«</a></li>`);
    const next = $(`<li><a rel="next">»</a></li>`);
    if (pagination.page === 1) prev.addClass("disabled");
    else {
      urlSearchParams.set("page", pagination.page - 1);
      prev
        .find("a")
        .attr("href", `${url.pathname}?${urlSearchParams.toString()}`);
    }
    if (pagination.page === pagination.pages) next.addClass("disabled");
    else {
      urlSearchParams.set("page", pagination.page + 1);
      next
        .find("a")
        .attr("href", `${url.pathname}?${urlSearchParams.toString()}`);
    }
    $("ul.pagination").prepend(prev);
    $("ul.pagination").append(next);
  }
};

const setLoading = (flag = false) => {
  if (flag) $("div.Wrapper").removeClass("Loaded");
  else $("div.Wrapper").addClass("Loaded");
};
