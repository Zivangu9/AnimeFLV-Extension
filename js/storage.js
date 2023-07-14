const getUserData = (username) => {
  const userData = localStorage.getItem(username);
  return JSON.parse(userData);
};

const setUserData = (username, userData) => {
  localStorage.setItem(username, JSON.stringify(userData));
};

const saveUserFetch = (username, watched, watching) => {
  const userData = {
    watched,
    watching,
    lastFetch: Date.now(),
  };
  setUserData(username, userData);
};

const updateUserAnime = (username, anime) => {
  const userData = getUserData(username) || { watching: [], watched: [] };
  const watchingMap = new Map(
    userData.watching.map((anime) => [anime.id, anime])
  );
  const watchedMap = new Map(
    userData.watched.map((anime) => [anime.id, anime])
  );
  watchingMap.delete(anime.id);
  watchedMap.delete(anime.id);
  switch (getUserAnimeState(anime)) {
    case AnimeState.WATCHED:
      watchedMap.set(anime.id, anime);
      break;
    case AnimeState.WATCHING:
      watchingMap.set(anime.id, anime);
      break;
  }
  userData.watching = Array.from(watchingMap.values());
  userData.watched = Array.from(watchedMap.values());
  setUserData(username, userData);
};
