const storage = {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },

  load(key, fallback) {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  },
};
