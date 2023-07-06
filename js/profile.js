//Create watched Section
const url = window.location.href;
if (
  url.startsWith("https://www3.animeflv.net/perfil/") &&
  url.split("/").length === 5
) {
  const section = document.createElement("section");
  section.className = "WdgtCn";
  const sectionTitleTop = document.createElement("div");
  sectionTitleTop.className = "Top";
  const sectionTitle = document.createElement("div");
  sectionTitle.className = "Title";
  sectionTitle.textContent = "Animes Vistos";
  sectionTitleTop.appendChild(sectionTitle);
  section.appendChild(sectionTitleTop);

  document.getElementsByClassName("Main").item(0).prepend(section);
}
