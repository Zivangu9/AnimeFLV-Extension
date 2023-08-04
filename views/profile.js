if (currentPage === Pages.PROFILE) {
  $("div.Title:contains('Animes que veo')").text("Animes que sigo");
  getUser().then((user) => {
    const profileName = url.pathname.split("/")[2];
    if (
      user &&
      profileName &&
      user.toLowerCase() === profileName.toLowerCase()
    ) {
      const watchingSection = $(`
      <section class="WdgtCn">
        <div class="Top"><div class="Title">Animes que veo</div></div>
        <ul class="ListAnimes AX Rows A06 C04 D03"></ul>
        <a href="/perfil/${user}/viendo" class="Button StylC ShwMr Alt">Ver todos</a>
      </section>`);
      const watchedSection = $(`
        <section class="WdgtCn">
          <div class="Top"><div class="Title">Animes que vi</div></div>
          <ul class="ListAnimes AX Rows A06 C04 D03"></ul>
          <a href="/perfil/${user}/vistos" class="Button StylC ShwMr Alt">Ver todos</a>
        </section>`);
      $(".Main").append(watchedSection).append(watchingSection);

      chrome.runtime.sendMessage(
        { action: "getUserData", user },
        (response) => {
          let values = ["0", "0", "0", "0", "0"];
          if (response) {
            response.watching
              .sort(() => Math.random() - 0.5)
              .slice(0, 4)
              .forEach((anime) => {
                watchingSection
                  .find("ul")
                  .append(createAnimeLi(anime, AnimeLists.WATCHING));
              });
            response.watched
              .sort(() => Math.random() - 0.5)
              .slice(0, 4)
              .forEach((anime) => {
                watchedSection
                  .find("ul")
                  .append(createAnimeLi(anime, AnimeLists.WATCHED));
              });

            values = [
              response.favorite.length,
              response.follow.length,
              response.pending.length,
              response.watched.length,
              response.watching.length,
            ];
          }
          if (watchingSection.find("ul").children().length === 0) {
            watchingSection.find("ul,a").remove();
            watchingSection.append(
              `<p class="Norslts fa-meh-o">Todavía no haz agregado ninguna serie</p>`
            );
          }
          if (watchedSection.find("ul").children().length === 0) {
            watchedSection.find("ul,a").remove();
            watchedSection.append(
              `<p class="Norslts fa-meh-o">Todavía no haz agregado ninguna serie</p>`
            );
          }
          const titles = $("section.WdgtCn>div.Top>div.Title");
          titles.each(function (index) {
            $(this)
              .prepend(" ")
              .prepend($(`<span class="badge">${values[index]}</span> `));
          });
        }
      );
    }
    setLoading();
  });
}
