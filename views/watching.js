//Create watched view
if (currentPage === Pages.WATCHING) {
  getUser().then((user) => {
    if (user) {
      const profileName = url.pathname.split("/")[2];
      if (profileName && user.toLowerCase() === profileName.toLowerCase()) {
        loadBaseListPage(user, "Animes Viendo").then(() => {
          chrome.runtime.sendMessage(
            { action: "getUserData", user },
            (response) => {
              if (response) {
                const result = filterList(response.watching, urlSearchParams);
                const fromItem =
                  result.pagination.pageSize * (result.pagination.page - 1);
                result.data
                  .slice(fromItem, fromItem + result.pagination.pageSize)
                  .forEach((anime) => {
                    $("main.Main>section>ul").append(createAnimeLi(anime));
                  });
                createPagination(result.pagination, `/perfil/${user}/viendo`);
              }
              setLoading();
            }
          );
        });
      } else setLoading();
    } else setLoading();
  });
}
