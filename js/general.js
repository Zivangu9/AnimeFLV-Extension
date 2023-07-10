//Add fetch button
getUser().then((user) => {
  $("ul.ListUser").children().last().before(`
    <li>
        <a id="li-list-user" href="#" rel="nofollow" class="fa-spinner">Atualizar Lista</a>
    </li>
  `);
  const li = $("a#li-list-user");
  li.on("click", () => {
    console.log("Click");
    getUser().then((user) => {
      if (user) {
        li.text(`Atualizando - 0%`);
        fetchUserAnimes(
          (progress) => {
            if (progress < 100) li.text(`Atualizando - ${progress}%`);
            else li.text("Atualizar Lista");
          },
          () => {}
        );
        const userData = getUserData(user);
        console.log(userData);
      }
    });
  });
});
