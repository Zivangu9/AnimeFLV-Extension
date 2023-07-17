const getUserData = (username) => {
  const userData = localStorage.getItem(username);
  return JSON.parse(userData);
};

const setUserData = (username, userData) => {
  localStorage.setItem(username, JSON.stringify(userData));
};

const saveUserFetch = (username, animeLists) => {
  console.log(username);
  const userData = {
    watched: animeLists.watched,
    watching: animeLists.watching,
    favorite: animeLists.favorite,
    follow: animeLists.follow,
    pending: animeLists.pending,
    lastFetch: Date.now(),
  };
  console.log(userData);
  setUserData(username, userData);
};

const updateUserAnime = (username, anime) => {
  const userData = getUserData(username) || {
    watched: [],
    watching: [],
    favorite: [],
    follow: [],
    pending: [],
  };
  const watchingMap = new Map(
    userData.watching.map((anime) => [anime.id, anime])
  );
  const watchedMap = new Map(
    userData.watched.map((anime) => [anime.id, anime])
  );
  const favoriteMap = new Map(
    userData.favorite.map((anime) => [anime.id, anime])
  );
  const followMap = new Map(userData.follow.map((anime) => [anime.id, anime]));
  const pendingMap = new Map(
    userData.pending.map((anime) => [anime.id, anime])
  );
  watchingMap.delete(anime.id);
  watchedMap.delete(anime.id);
  favoriteMap.delete(anime.id);
  followMap.delete(anime.id);
  pendingMap.delete(anime.id);
  switch (getUserAnimeState(anime)) {
    case AnimeState.WATCHED:
      watchedMap.set(anime.id, anime);
      break;
    case AnimeState.WATCHING:
      watchingMap.set(anime.id, anime);
      break;
  }
  if (anime.favorite) favoriteMap.set(anime.id, anime);
  if (anime.follow) followMap.set(anime.id, anime);
  if (anime.pending) pendingMap.set(anime.id, anime);
  userData.watching = Array.from(watchingMap.values());
  userData.watched = Array.from(watchedMap.values());
  userData.favorite = Array.from(favoriteMap.values());
  userData.follow = Array.from(followMap.values());
  userData.pending = Array.from(pendingMap.values());
  setUserData(username, userData);
};
