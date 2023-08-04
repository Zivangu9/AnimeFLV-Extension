const url = new URL(window.location.href);
const urlSearchParams = new URLSearchParams(url.search);
const currentPage = getCurrentPage(url);

$("div.Wrapper").append(`<span class="loader"></span>`);
$("ul.ListFollow").remove();
//Fix stars
$("div.Vts.fa-star").each((i, label) => {
  let stars = parseFloat($(label).text());
  if (stars > 5) stars = stars / 20;
  $(label).text(stars.toFixed(1));
});
// $("div.Vts.fa-star").text(parseFloat($("div.Vts.fa-star").text()).toFixed(1));

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
if (currentPage === Pages.DEFAULT) setLoading();
