// Set default screenshots
$(document).ready(() => {
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
      }
    }
  };

  const observer = new MutationObserver(callback);
  const config = { childList: true, subtree: true };
  observer.observe(document.body, config);
});
