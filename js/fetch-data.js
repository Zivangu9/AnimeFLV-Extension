const loadBaseListPage = (user, title) =>
  fetch(`https://www3.animeflv.net/perfil/${user}/favoritos`)
    .then((response) => response.text())
    .then((html) => {
      if ($("html")) {
        //Set Tab Title
        $("head>title").text(`${user} - AnimeFlV`);
        //Load Body
        $("div.Wrapper>div.Body").replaceWith(
          $(html).filter("div.Wrapper").children().filter("div.Body")
        );
        $("main.Main>section>div.Top>div.Title").text(title);
        $("main.Main>section>ul").children().remove();

        //Filter
        $("select#order_select")
          .find("option[value='updated'], option[value='added']")
          .remove();

        $("body").append(
          "<link rel='stylesheet' type='text/css' href='/assets/animeflv/css/bootstrap-multiselect.css'>"
        );
        $("body").append(
          "<script type='text/javascript' src='/assets/animeflv/js/bootstrap-multiselect.js'></script>"
        );
        $("body").append(
          "<script type='text/javascript' src='/assets/animeflv/js/abrowser.js'></script>"
        );
        //Customize Filter
        $("select#year_select").parent().remove();
        $("form[action='/perfil/zivangu9/favoritos']").attr(
          "action",
          url.pathname
        );
        $("ul.pagination").children().remove();
        //Set current filter
        $("input[type='checkbox'], input[type='radio']").each(
          (index, input) => {
            var value = $(input).val();
            if (
              urlSearchParams.getAll("genre[]").includes(value) ||
              urlSearchParams.getAll("type[]").includes(value) ||
              urlSearchParams.getAll("status[]").includes(value) ||
              urlSearchParams.get("order") === value
            ) {
              $(input).trigger("click");
            }
          }
        );
        $("body").trigger("click");
        $(".AAShwHdd-lnk").on("click", () => {
          const shwhdd = $(".AAShwHdd-lnk").attr("data-shwhdd");
          $(".AAShwHdd-lnk").toggleClass("on");
          $("#" + shwhdd).toggleClass("show");
        });
        $("ul.ListFollow").remove();
      }
    })
    .catch((error) => {
      console.error("Error fetching profile page:", error);
    });

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
