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
  complete_list.then(async (list) => {
    const listJson = JSON.parse(list);
    const max = 100;
    let i = 0;
    const watching = [];
    const watched = [];
    while (i < listJson.length) {
      await fetchAnimes(listJson.slice(i, i + max))
        .then((dataArray) => {
          const procesing = dataArray.filter(
            (anime) =>
              anime &&
              anime.last_seen &&
              anime.last_episode &&
              anime.state &&
              anime.last_seen !== "0"
          );
          procesing.forEach((anime) => {
            if (anime.last_episode === anime.last_seen && anime.state === 2)
              watched.push(anime);
            else watching.push(anime);
          });
          i += max;
        })
        .catch((error) => {
          i = listJson.length;
          console.error("Error fetching data:", error);
        });
    }
    console.log("watchinng:");
    console.log(watching);
    console.log("watched:");
    console.log(watched);
    console.log("Finish");
  });
}
