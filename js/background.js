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

const fetchAnimes = (urls) => {
  const promises = urls.map((url) =>
    fetch(`https://www3.animeflv.net/anime/${url}`)
      .then((response) => response.text())
      .then((response) => {
        const anime = parseHtmlToJson(response);
        return anime;
      })
  );
  return Promise.all(promises);
};

const fetchUserAnimes = (user) => {
  if (isRunning) return;
  isRunning = true;
  progress(0);
  complete_list.then(async (list) => {
    // const listJson = JSON.parse(list).slice(0, 500); //Limit list to fetch
    const listJson = JSON.parse(list).map((info) => info[2]);
    const total = listJson.length;
    const max = 50;
    let i = 0;
    const watching = [];
    const watched = [];
    while (i < listJson.length) {
      await fetchAnimes(listJson.slice(i, i + max))
        .then((dataArray) => {
          const procesing = dataArray.filter(
            (anime) => getUserAnimeState(anime) !== AnimeState.NOT_WATCHING
          );
          procesing.forEach((anime) => {
            if (getUserAnimeState(anime) === AnimeState.WATCHED)
              watched.push(anime);
            else watching.push(anime);
          });
          i += max;
          progress((i / max / (total / max)) * 100);
        })
        .catch((error) => {
          i = listJson.length;
          console.error("Error fetching data:", error);
        });
    }
    saveUserFetch(user, watched, watching);
    isRunning = false;
  });
};
