/**
 * 0 = Not watching or whatched
 * 1 = watched
 * 2 = watching
 */
const getUserAnimeState = (anime) => {
  if (
    anime &&
    anime.last_seen &&
    anime.last_episode &&
    anime.state &&
    anime.last_seen !== "0"
  ) {
    if (anime.last_episode === anime.last_seen && anime.state === 2) return 1;
    return 2;
  } else return 0;
};
