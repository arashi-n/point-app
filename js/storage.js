const state = {
  users: JSON.parse(localStorage.getItem("users")) || [],
  data: JSON.parse(localStorage.getItem("data")) || {},
  items: JSON.parse(localStorage.getItem("items")) || [],
};
