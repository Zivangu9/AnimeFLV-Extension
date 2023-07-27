if (currentPage === Pages.EPISODE) {
  const animeUrl = $("a.fa-th-list").attr("href").substring(7);
  getUser().then((user) => {
    if (user) {
      chrome.runtime.sendMessage({
        action: "updateUserAnime",
        user,
        animeUrl,
      });
    }
  });
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.attributeName === "data-seen") {
        getUser().then((user) => {
          if (user) {
            chrome.runtime.sendMessage({
              action: "updateUserAnime",
              user,
              animeUrl,
            });
          }
        });
      }
    });
  });
  const config = { attributes: true };
  observer.observe($(".CVst")[0], config);
  setLoading();
}
