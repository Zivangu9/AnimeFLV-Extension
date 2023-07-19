const loadProfileBasePage = (user) => {
  fetch(`https://www3.animeflv.net/perfil/${user}/favoritos`)
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

const getUser = () =>
  fetch("https://www3.animeflv.net")
    .then((response) => response.text())
    .then((htmlString) => {
      const avatarImage = getAvatarImage(htmlString);
      if (avatarImage) {
        const $avatarImage = $(avatarImage);
        // console.log($avatarImage.attr("src")); //TODO: do we need the avatar image?
      }
      const $html = $(removeImagesFromHtml(htmlString));
      const script = $html.filter("script:not([src]):not([type])")[0];
      const is_user_match = script.innerHTML.match(/var is_user = (.+);/);
      if (
        !is_user_match ||
        (is_user_match && JSON.parse(is_user_match[1]) !== true)
      )
        return;
      const $span = $(
        $html.find("div.Login>label.Button>span.fa-chevron-down")[0]
      );
      if ($span) return $span.find("strong").text();
      return;
    })
    .catch((error) => {
      console.error("Error fetching profile page:", error);
    });
