const getUserData = (username) => {
  const userData = localStorage.getItem(username);
  return JSON.parse(userData);
};

const saveUserData = (username, whatched, whatching) => {
  const userData = {
    whatched,
    whatching,
  };
  localStorage.setItem(username, JSON.stringify(userData));
};

const updateUserAnime = (username, anime) => {
  const userData = getUserData(username);
  const isWatched = anime.
  userData.listA[index] = updatedObject;
  saveUserData(username, userData.listA, userData.listB);
};
