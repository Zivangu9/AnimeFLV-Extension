//Create watched Section
if (currentPage === Pages.PROFILE) {
  $(".Main").prepend(`
  	<section class="WdgtCn">
		<div class="Top"><div class="Title">Animes ya vistos</div></div>
		<a href="/perfil/${
      url.split("/")[4]
    }/vistos" class="Button StylC ShwMr Alt">Ver todos</a>
	</section>
  `);
  getUser().then((user) => {
    if (user) {
      chrome.runtime.sendMessage(
        { action: "getUserData", user },
        (response) => {
          console.log(response);
        }
      );
    }
  });
}
