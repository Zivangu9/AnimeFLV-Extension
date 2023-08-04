if (currentPage === Pages.INDEX) {
  getUser().then((user) => {
    if (user) {
      const tabs = $("div.SldrHmCn.CX.Row.CFluid.Sp20.NMb>div");
      //Add Watched
      tabs.find("ul.nav.nav-tabs.ClFx.ListAnTbNvTp").append(`
        <li>
            <a data-toggle="tab" href="#tbwed" class="fa-eye-slash">Vistos</a>
        </li>`);

      const watchedTab = $(`
        <div id="tbwed" class="tab-pane fade">
            <a href="/perfil/${user}/vistos" class="Button Sm">VER MAS</a>
            <ul class="ListAnmsTp ClFx"></ul>
        </div>`);
      tabs.find("div.tab-content.AnTbCnTp").append(watchedTab);

      //Add Watching
      tabs.find("ul.nav.nav-tabs.ClFx.ListAnTbNvTp").append(`
        <li>
            <a data-toggle="tab" href="#tbwng" class="fa-eye">Viendo</a>
        </li>`);
      const watchingTab = $(`
        <div id="tbwng" class="tab-pane fade">
            <a href="/perfil/${user}/viendo" class="Button Sm">VER MAS</a>
            <ul class="ListAnmsTp ClFx"></ul>
        </div>`);
      tabs.find("div.tab-content.AnTbCnTp").append(watchingTab);
      chrome.runtime.sendMessage(
        { action: "getUserData", user },
        (response) => {
          if (response) {
            response.watching
              .sort(() => Math.random() - 0.5)
              .slice(0, 6)
              .forEach((anime) => {
                watchingTab.find("ul").append(createAnimeFigure(anime));
              });
            response.watched
              .sort(() => Math.random() - 0.5)
              .slice(0, 6)
              .forEach((anime) => {
                watchedTab.find("ul").append(createAnimeFigure(anime));
              });
          }
          if (watchedTab.find("ul").children().length === 0) {
            watchedTab.find("ul,a").remove();
            watchedTab.append(
              `<p class="Norslts fa-meh-o">Todavía no haz agregado ninguna serie</p>`
            );
          }
          if (watchingTab.find("ul").children().length === 0) {
            watchingTab.find("ul,a").remove();
            watchingTab.append(
              `<p class="Norslts fa-meh-o">Todavía no haz agregado ninguna serie</p>`
            );
          }
        }
      );
      setLoading();
    }
  });
}
