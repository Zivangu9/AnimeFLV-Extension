//Create watched Section
const url = window.location.href;
if (
  url.startsWith("https://www3.animeflv.net/perfil/") &&
  url.split("/").length === 5
) {
  const section = document.createElement("section");
  // Section Title
  section.className = "WdgtCn";
  const sectionTitleTop = document.createElement("div");
  sectionTitleTop.className = "Top";
  const sectionTitle = document.createElement("div");
  sectionTitle.className = "Title";
  sectionTitle.textContent = "Animes vistos";
  sectionTitleTop.appendChild(sectionTitle);
  section.appendChild(sectionTitleTop);

  //Section List

  //Section bottom
  const button = document.createElement("a");
  button.href = `/perfil/${url.split("/")[4]}/vistos`;
  button.classList.add("Button", "StylC", "ShwMr", "Alt");
  button.textContent = "Ver todos";
  section.appendChild(button);
  document.getElementsByClassName("Main").item(0).prepend(section);
}
