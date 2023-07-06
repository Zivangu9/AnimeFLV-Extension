//Create watched view
if (
  url.startsWith("https://www3.animeflv.net/perfil/") &&
  url.split("/").length === 6 &&
  url.split("/")[5] === "vistos"
) {
  loadProfileBasePage(url.split("/")[4]);
}
