const url = window.location.href;
const currentPage = getCurrentPage(url);
$("head").append(`
<style type="text/css">
  a.a-spin::before {
    animation: fa-spin 1s steps(8) infinite;
  }
</style>
`);

//Add fetch button
getUser().then((user) => {
  if (user) {
    $("ul.ListUser").children().last().before(`
    <li>
        <a id="li-list-user" href="#" rel="nofollow" class="fa-spinner">Atualizar Lista</a>
    </li>
  `);

    const li = $("a#li-list-user");
    li.on("click", () => {
      chrome.runtime.sendMessage({
        action: "fetchAnimes",
        user,
      });
    });

    chrome.runtime.sendMessage({ action: "autoFetch", user });
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === "progress") {
        if (message.progress < 100) {
          li.addClass("a-spin");
          li.text(
            `Atualizando - ${new Intl.NumberFormat("default", {
              style: "percent",
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
            }).format(message.progress / 100)}`
          );
        } else {
          li.text("Atualizar Lista");
          li.removeClass("a-spin");
        }
      }
    });
  }
});

//TODO: Get url and create variables to store current page (example: index, profile, anime, etc)
