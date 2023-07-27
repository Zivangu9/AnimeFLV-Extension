//Create watched view
if (currentPage === Pages.WATCHED) {
  getUser().then((user) => {
    if (user) {
      const profileName = url.pathname.split("/")[2];
      if (profileName && user.toLowerCase() === profileName.toLowerCase()) {
        loadBaseListPage(user, "Animes Vistos").then(() => {
          $("select#status_select").parent().remove();
          chrome.runtime.sendMessage(
            { action: "getUserData", user },
            (response) => {
              const result = filterList(response.watched, urlSearchParams);
              const fromItem =
                result.pagination.pageSize * (result.pagination.page - 1);
              result.data
                .slice(fromItem, fromItem + result.pagination.pageSize)
                .forEach((anime) => {
                  $("main.Main>section>ul").append(createAnimeLi(anime));
                });
              createPagination(result.pagination, `/perfil/${user}/vistos`);
              setLoading();
            }
          );
        });
      } else setLoading();
    } else setLoading();
  });
}
