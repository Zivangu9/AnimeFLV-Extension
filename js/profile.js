//Create watched Section
if (currentPage === Pages.PROFILE) {
  $("div.Title:contains('Animes que veo')").text("Animes que sigo");
  getUser().then((user) => {
    const profileName = $("div.Avatar>div.Name");
    if (
      user &&
      profileName &&
      user.toLowerCase() === profileName.text().toLowerCase()
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
      $(".Main").prepend(watchedSection).prepend(watchingSection);
      chrome.runtime.sendMessage(
        { action: "getUserData", user },
        (response) => {
          response.watching
            .reverse()
            .slice(0, 4)
            .forEach((anime) => {
              watchingSection.find("ul").append(`
            <li>
              <article class="Anime alt">
                <a class="AnmQv p-0 fa-eye"></a>
                <div class="Image">
                  <figure><img src="${anime.cover_url}" alt="" /></figure>
                  <span class="Type ${anime.type}">${getTypeText(
                anime.type
              )}</span>
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
            </li>`);
            });
          response.watched
            .reverse()
            .slice(0, 4)
            .forEach((anime) => {
              watchedSection.find("ul").append(`
            <li>
              <article class="Anime alt">
                <a class="AnmQv p-0 fa-eye-slash"></a>
                <div class="Image">
                  <figure><img src="${anime.cover_url}" alt="" /></figure>
                  <span class="Type ${anime.type}">${getTypeText(
                anime.type
              )}</span>
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
            </li>`);
            });
          const values = [
            response.watching.length,
            response.watched.length,
            response.favorite.length,
            response.follow.length,
            response.pending.length,
          ];
          const titles = $("section.WdgtCn>div.Top>div.Title");
          titles.each(function (index) {
            $(this)
              .prepend(" ")
              .prepend($(`<span class="badge">${values[index]}</span> `));
          });
        }
      );
    }
  });
}
