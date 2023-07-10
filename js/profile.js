//Create watched Section
const url = window.location.href;
if (
  url.startsWith("https://www3.animeflv.net/perfil/") &&
  url.split("/").length === 5
) {
  $(".Main").prepend(`
  	<section class="WdgtCn">
		<div class="Top"><div class="Title">Animes ya vistos</div></div>
		<a href="/perfil/${
      url.split("/")[4]
    }/vistos" class="Button StylC ShwMr Alt">Ver todos</a>
	</section>
  `);
    }
  });
}
