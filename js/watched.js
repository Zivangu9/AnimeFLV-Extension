//Create watched view
if (currentPage === Pages.WATCHED) {
  getUser().then((user) => {
    if (user) {
      loadProfileBasePage(user);
    }
  });
}
