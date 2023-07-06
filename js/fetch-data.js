const loadProfileBasePage = (profile) => {
  fetch(`https://www3.animeflv.net/perfil/${profile}/favoritos`)
    .then((response) => response.text())
    .then((html) => {
      document.documentElement.innerHTML = html;
      const section = document
        .getElementsByClassName("Main")
        .item(0)
        .getElementsByTagName("section")
        .item(0);
      const sectionTop = section.getElementsByClassName("Top").item(0);
      sectionTop.getElementsByClassName("Title").item(0).textContent =
        "Animes vistos";
      //Remove Filter
      sectionTop.removeChild(sectionTop.getElementsByTagName("div").item(1));
      section.removeChild(section.getElementsByTagName("form").item(0));
      section.removeChild(section.getElementsByClassName("NvCnAnm").item(0));
    })
    .catch((error) => {
      console.error("Error fetching profile page:", error);
    });
};
