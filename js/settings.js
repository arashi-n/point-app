// ======================
// アプリ設定
// ======================
let useGoalPoint = JSON.parse(localStorage.getItem("useGoalPoint")) ?? false;

let data = JSON.parse(localStorage.getItem("data")) || {};

let goalMode = localStorage.getItem("goalMode") || "personal";

let allowNegative = JSON.parse(localStorage.getItem("allowNegative")) ?? true;

let confirmDelete = JSON.parse(localStorage.getItem("confirmDelete")) ?? true;

let items = JSON.parse(localStorage.getItem("items")) || [
  { name: "宿題", point: 10 },
  { name: "お手伝い", point: 20 },
];

const checkbox = document.getElementById("useGoalPoint");
const goalSettings = document.getElementById("goalSettings");
const personalBox = document.getElementById("personalGoalSettings");
const sharedBox = document.getElementById("sharedGoalSettings");
const goalRadios = document.querySelectorAll('input[name="goalMode"]');

function initSettings() {
  loadSettings();
  toggleGoalSettings();
  renderPersonalGoals();
  updateGoalModeUI();
}

initSettings();

function toggleGoalSettings() {
  goalSettings.style.display = checkbox.checked ? "block" : "none";
}

function loadSettings() {
  document.getElementById("useGoalPoint").checked = useGoalPoint;

  document.getElementById("allowNegative").checked = allowNegative;

  document.getElementById("confirmDelete").checked = confirmDelete;

  const selected = document.querySelector(
    `input[name="goalMode"][value="${goalMode}"]`,
  );
  if (selected) selected.checked = true;
}

function updateGoalModeUI() {
  if (!useGoalPoint) return;

  const mode = document.querySelector('input[name="goalMode"]:checked')?.value;

  personalBox.style.display = mode === "personal" ? "block" : "none";
  sharedBox.style.display = mode === "shared" ? "block" : "none";
}

function renderPersonalGoals() {
  personalBox.innerHTML = "";

  state.users.forEach((user) => {
    const row = document.createElement("div");

    const label = document.createElement("span");
    label.textContent = user;

    const input = document.createElement("input");
    input.type = "number";
    input.value = data[user]?.goalPoint || 0;

    input.addEventListener("input", () => {
      data[user].goalPoint = Number(input.value) || 0;
      localStorage.setItem("data", JSON.stringify(data));
    });

    row.appendChild(label);
    row.appendChild(input);
    personalBox.appendChild(row);
  });
}

initSettings();

checkbox.addEventListener("change", function () {
  localStorage.setItem("useGoalPoint", JSON.stringify(this.checked));

  toggleGoalSettings();
});

document.querySelectorAll('input[name="goalMode"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    localStorage.setItem("goalMode", this.value);
    updateGoalModeUI();
  });
});

document
  .getElementById("allowNegative")
  .addEventListener("change", function () {
    localStorage.setItem("allowNegative", JSON.stringify(this.checked));
  });

document
  .getElementById("confirmDelete")
  .addEventListener("change", function () {
    localStorage.setItem("confirmDelete", JSON.stringify(this.checked));
  });

// ======================
// 項目
// ======================
// 項目データ
if (!localStorage.getItem("items")) {
  localStorage.setItem("items", JSON.stringify(items));
}

// 初期実行
init();

// 初期化処理
function init() {
  renderItems();
  loadSettings();
}

// UI表示
function renderItems() {
  const container = document.getElementById("itemButtons");

  container.innerHTML = "";

  items.forEach((item, index) => {
    const wrapper = document.createElement("div");

    const sign = item.point > 0 ? "+" : "";

    const btn = document.createElement("button");
    btn.textContent = `${item.name} ${sign}${item.point}pt`;

    const editBtn = document.createElement("button");
    editBtn.textContent = "編集";
    editBtn.onclick = () => editItem(index);

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.onclick = () => deleteItem(index);

    wrapper.appendChild(btn);
    wrapper.appendChild(editBtn);
    wrapper.appendChild(delBtn);

    container.appendChild(wrapper);
  });
}

// 作成
function createItem(name, point) {
  items.push({
    name,
    point,
  });

  saveItems();
  renderItems();
}

// 追加
function addItemFromUI() {
  const name = document.getElementById("itemName").value;
  const pointInput = document.getElementById("itemPoint").value;
  const point = Number(pointInput);

  const error = document.getElementById("errorMessage");

  if (!name || !point) {
    error.textContent = "項目名を入力してください";
    return;
  }

  if (pointInput.trim() === "" || Number.isNaN(point)) {
    error.textContent = "ポイントは半角数字で入力してください";
    return;
  }

  error.textContent = "";

  if (items.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
    error.textContent = "同じ項目名が既に存在します";
    return;
  }

  createItem(name, point);

  document.getElementById("itemName").value = "";
  document.getElementById("itemPoint").value = "";
}

// 編集
function editItem(index) {
  const newName = prompt("項目名", items[index].name);
  const pointInput = prompt("ポイント", items[index].point);

  if (pointInput === null) {
    return;
  }

  const newPoint = Number(pointInput);

  if (Number.isNaN(newPoint)) {
    alert("ポイントは半角数字で入力してください");
    return;
  }

  if (!newName || !newPoint) {
    return;
  }

  const trimmedName = newName.trim();

  if (
    items.some(
      (item, i) =>
        i !== index && item.name.toLowerCase() === trimmedName.toLowerCase(),
    )
  ) {
    alert("同じ項目名が既に存在します");
    return;
  }

  items[index] = {
    name: trimmedName,
    point: newPoint,
  };

  saveItems();
  renderItems();
}

// 削除
function deleteItem(index) {
  const confirmDelete =
    JSON.parse(localStorage.getItem("confirmDelete")) ?? true;

  if (confirmDelete) {
    if (!confirm("この項目を削除しますか？")) {
      return;
    }
  }

  items.splice(index, 1);

  saveItems();
  renderItems();
}

// 保存
function saveItems() {
  localStorage.setItem("items", JSON.stringify(items));
}

// ======================
// ユーザー
// ======================
// 初期保存
saveUsers();

// 初期実行
renderUsers();

// UI表示
function renderUsers() {
  const container = document.getElementById("userList");

  container.innerHTML = "";

  state.users.forEach((user, index) => {
    const div = document.createElement("div");

    div.textContent = user;

    const editBtn = document.createElement("button");

    editBtn.textContent = "編集";
    editBtn.onclick = () => editUser(index);

    const delBtn = document.createElement("button");
    delBtn.textContent = "削除";
    delBtn.onclick = () => deleteUser(index);

    div.appendChild(editBtn);
    div.appendChild(delBtn);

    container.appendChild(div);
  });
}

// 追加
function addUserFromUI() {
  const input = document.getElementById("userName");

  const name = input.value.trim();

  if (!name) {
    return;
  }

  if (state.users.includes(name)) {
    alert("同じ名前のユーザーが既に存在します");
    return;
  }

  state.users.push(name);

  const data = JSON.parse(localStorage.getItem("data")) || {};

  data[name] = {
    point: 0,
    totalPoint: 0,
    goalPoint: 0,
    histories: [],
  };

  localStorage.setItem("data", JSON.stringify(data));

  saveUsers();

  renderUsers();

  input.value = "";

  console.log(state.users);
  console.log(localStorage.getItem("users"));
}

// 編集
function editUser(index) {
  const oldName = state.users[index];

  const newName = prompt("新しい名前を入力してください", oldName);

  if (!newName) {
    return;
  }

  const trimmedName = newName.trim();

  if (!trimmedName) {
    alert("名前を入力してください");
    return;
  }

  if (trimmedName !== oldName && state.users.includes(trimmedName)) {
    alert("同じ名前のユーザーが既に存在します");
    return;
  }

  const data = JSON.parse(localStorage.getItem("data")) || {};

  data[trimmedName] = data[oldName];
  delete data[oldName];

  state.users[index] = trimmedName;

  if (localStorage.getItem("selectedUser") === oldName) {
    localStorage.setItem("selectedUser", newName);
  }

  localStorage.setItem("data", JSON.stringify(data));

  saveUsers();
  renderUsers();
}

// 削除
function deleteUser(index) {
  const confirmDelete =
    JSON.parse(localStorage.getItem("confirmDelete")) ?? true;

  if (confirmDelete) {
    if (!confirm("このユーザーを削除しますか？")) {
      return;
    }
  }

  const userName = state.users[index];

  state.users.splice(index, 1);
  saveUsers();

  const data = JSON.parse(localStorage.getItem("data")) || {};
  delete data[userName];
  localStorage.setItem("data", JSON.stringify(data));

  if (localStorage.getItem("selectedUser") === userName) {
    const newUser = state.users[0] || "";
    localStorage.setItem("selectedUser", newUser);
  }

  renderUsers();
}

// 保存
function saveUsers() {
  localStorage.setItem("users", JSON.stringify(state.users));
}
