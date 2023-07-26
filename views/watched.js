//Create watched view
if (currentPage === Pages.WATCHED) {
  getUser().then((user) => {
    if (user) {
      const profileName = url.pathname.split("/")[2];
      if (
        user &&
        profileName &&
        user.toLowerCase() === profileName.toLowerCase()
      ) {
        loadBaseListPage(user).then(() => {
          $("select#status_select").parent().remove();
          chrome.runtime.sendMessage(
            { action: "getUserData", user },
            (response) => {
              filterList(response.watched, urlSearchParams).forEach((anime) => {
                $("main.Main>section>ul").append(createAnimeLi(anime));
              });
            }
          );
        });
      }
    }
  });
}
