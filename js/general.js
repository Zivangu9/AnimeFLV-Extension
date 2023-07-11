$("head").append(`
<style type="text/css">
  a.a-spin::before {
    animation: fa-spin 1s steps(8) infinite;
  }
</style>
`);
//Add fetch button
getUser().then((user) => {
  $("ul.ListUser").children().last().before(`
    <li>
        <a id="li-list-user" href="#" rel="nofollow" class="fa-spinner">Atualizar Lista</a>
    </li>
  `);
  const li = $("a#li-list-user");
  li.on("click", () => {
    getUser().then((user) => {
      if (user) {
        li.text(`Atualizando - 0%`);
        li.addClass("a-spin");
        fetchUserAnimes(
          (progress) => {
            if (progress < 100)
              li.text(
                `Atualizando - ${new Intl.NumberFormat("default", {
                  style: "percent",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                }).format(progress / 100)}`
              );
            else {
              li.text("Atualizar Lista");
              li.removeClass("a-spin");
            }
          },
          () => {}
        );
      }
    });
  });
});

//TODO: Get url and create variables to store current page (example: index, profile, anime, etc)
