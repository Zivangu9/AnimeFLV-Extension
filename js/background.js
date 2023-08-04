const progress = (progress) => {
  chrome.tabs.query({ url: "https://www3.animeflv.net/*" }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { action: "progress", progress });
    });
  });
};

let isRunning = false;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "fetchAnimes") {
    fetchUserAnimes(message.user);
  }
  if (message.action === "getUserData") {
    sendResponse(getUserData(message.user));
  }
  if (message.action === "updateUserAnime") {
    if (message.anime) updateUserAnime(message.user, message.anime);
    else if (message.animeUrl)
      fetchAnimes([message.animeUrl]).then((res) =>
        updateUserAnime(message.user, res[0])
      );
  }
  if (message.action === "autoFetch") {
    const userData = getUserData(message.user);
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    if (!userData || !userData.lastFetch || userData.lastFetch < oneWeekAgo) {
      fetchUserAnimes(message.user);
    }
  }
});

const complete_list = $.get("https://www3.animeflv.net/api/animes/list");

const fetchAnimes = (animes) => {
  const promises = animes.map((anime) =>
    fetch(`https://www3.animeflv.net/anime/${anime}`)
      .then((response) => response.text())
      .then((response) => {
        return parseHtmlToJson(response);
      })
  );
  return Promise.all(promises);
};

const fetchUserAnimes = (user) => {
  if (isRunning) return;
  isRunning = true;
  progress(0);
  complete_list.then(async (list) => {
    const listJson = JSON.parse(list).map((info) => info[2]);
    const total = listJson.length;
    const max = 50;
    let i = 0;
    const animeList = {
      watched: [],
      watching: [],
      favorite: [],
      follow: [],
      pending: [],
    };
    while (i < listJson.length) {
      await fetchAnimes(listJson.slice(i, i + max))
        .then((dataArray) => {
          dataArray.forEach((anime) => {
            const animeState = getUserAnimeState(anime);
            if (animeState === AnimeState.WATCHED)
              animeList.watched.push(anime);
            else if (animeState === AnimeState.WATCHING)
              animeList.watching.push(anime);
            if (anime.favorite) animeList.favorite.push(anime);
            if (anime.follow) animeList.follow.push(anime);
            if (anime.pending) animeList.pending.push(anime);
          });
          i += max;
          progress((i / max / (total / max)) * 100);
        })
        .catch((error) => {
          i = listJson.length;
          console.error("Error fetching data:", error);
        });
    }
    isRunning = false;
    saveUserFetch(user, animeList);
  });
};
