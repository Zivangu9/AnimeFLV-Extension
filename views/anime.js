// Set default screenshots
if (currentPage === Pages.ANIME) {
  const processImage = (img) => {
    const src = img.attr("data-src");
    fetch(src).catch((error) => {
      const defaultSrc = $('img[itemprop="image"]').attr("src");
      img.attr("src", defaultSrc);
    });
  };

  $('img.lazy[data-src^="https://cdn.animeflv.net/screenshots/"]').each(
    function () {
      processImage($(this));
    }
  );

  const callback = (mutationsList, observer) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        $(mutation.addedNodes)
          .find('img.lazy[data-src^="https://cdn.animeflv.net/screenshots/"]')
          .each(function () {
            processImage($(this));
          });
      } else if (
        mutation.type === "attributes" &&
        mutation.attributeName === "style"
      ) {
        callUpdateUserAnime();
      }
    }
  };

  const observer = new MutationObserver(callback);
  const config = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style"],
  };
  observer.observe(document.body, config);

  const anime = parseHtmlToJson($("html").html());
  getUser().then((user) => {
    if (user) {
      chrome.runtime.sendMessage({ action: "updateUserAnime", user, anime });
    }
  });

  const callUpdateUserAnime = () => {
    getUser().then((user) => {
      if (user && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage({
          action: "updateUserAnime",
          user,
          animeUrl: anime.url_name,
        });
      }
    });
  };

  $(document).on("DOMNodeInserted", ".alertify-logs", callUpdateUserAnime);
  setLoading();
}
