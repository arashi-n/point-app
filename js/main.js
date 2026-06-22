// ======================
// 初期データ
// ======================
// localStorage.clear();
const state = {
  users: JSON.parse(localStorage.getItem("users")) || [
    "やまと",
    "あやと",
    "なつき",
  ],
  data: JSON.parse(localStorage.getItem("data")) || {},
  items: JSON.parse(localStorage.getItem("items")) || [
    { name: "宿題", point: 10 },
    { name: "お手伝い", point: 20 },
  ],
};

let selectedUser = localStorage.getItem("selectedUser");

if (!selectedUser || selectedUser === "") {
  selectedUser = state.users[0];
  localStorage.setItem("selectedUser", selectedUser);
}

let data = JSON.parse(localStorage.getItem("data")) || {};

let items = JSON.parse(localStorage.getItem("items")) || [
  { name: "宿題", point: 10 },
  { name: "お手伝い", point: 20 },
];

let useGoalPoint = JSON.parse(localStorage.getItem("useGoalPoint")) ?? false;

let goalMode = localStorage.getItem("goalMode") || "user";

let goalPoint = Number(localStorage.getItem("goalPoint")) || 0;

const allowNegative = JSON.parse(localStorage.getItem("allowNegative")) ?? true;

// ======================
// 初期化
// ======================
init();

function init() {
  normalizeState();
  renderUserSelect();
  updateUI();
  renderItems();
  displayHistory();
}

function normalizeState() {
  if (!state.users.includes(selectedUser)) {
    selectedUser = state.users[0] || "";
  }

  state.users.forEach((user) => {
    if (!data[user]) {
      data[user] = {
        point: 0,
        totalPoint: 0,
        goalPoint: 0,
        histories: [],
      };
    }

    if (data[user].goalPoint === undefined) {
      data[user].goalPoint = 0;
    }
  });

  Object.keys(data).forEach((user) => {
    if (!state.users.includes(user)) {
      delete data[user];
    }
  });

  localStorage.setItem("selectedUser", selectedUser);
  localStorage.setItem("state.users", JSON.stringify(state.users));
  localStorage.setItem("data", JSON.stringify(data));
}

// ======================
// 機能
// ======================
// 加算
function addPoint(itemName, num) {
  console.log("addPoint実行");
  if (!selectedUser) {
    return;
  }

  const now = new Date();
  const user = selectedUser;

  data[user].point += num;
  data[user].totalPoint += num;

  data[user].histories.unshift({
    date: now.toLocaleString(),
    type: "add",
    itemName: itemName,
    point: num,
  });

  saveData();
  updateUI();
  displayHistory();
}

// 支給
function payPoint() {
  if (!selectedUser) {
    alert("ユーザーを追加してください");
    return;
  }

  const user = selectedUser;
  const amount = Number(document.getElementById("payAmount").value);

  if (!amount || amount <= 0) {
    alert("支給額を入力してください");
    return;
  }

  if (!allowNegative && amount > data[user].point) {
    alert("ポイントが不足しています");
    return;
  }

  data[user].point -= amount;

  data[user].histories.unshift({
    date: new Date().toLocaleString(),
    type: "pay",
    itemName: "支給",
    point: -amount,
  });

  saveData();
  updateUI();
}

// リセット
function resetPoint() {
  if (!selectedUser) {
    alert("ユーザーを追加してください");
    return;
  }

  const user = selectedUser;

  data[user].point = 0;

  saveData();
  updateUI();
}

// 子ども切替
function changeUser() {
  selectedUser = document.getElementById("userSelect").value;

  if (!state.users.includes(selectedUser)) {
    selectedUser = state.users[0] || "";
  }

  localStorage.setItem("selectedUser", selectedUser);

  updateUI();
}

// ======================
// UI
// ======================
// 子ども選択肢表示
function renderUserSelect() {
  const select = document.getElementById("userSelect");

  select.innerHTML = "";

  if (state.users.length === 0) {
    select.innerHTML = "";

    const option = document.createElement("option");
    option.textContent = "ユーザーなし";
    option.value = "";

    select.appendChild(option);

    return;
  }

  state.users.forEach((user) => {
    const option = document.createElement("option");

    option.value = user;
    option.textContent = user;

    select.appendChild(option);
  });

  if (!selectedUser || !state.users.includes(selectedUser)) {
    selectedUser = state.users[0];
  }

  console.log(state.users);

  select.value = selectedUser;
}

// UI更新
function updateUI() {
  if (!selectedUser || !data[selectedUser]) {
    console.warn("selectedUser異常:", selectedUser);
    return;
  }

  if (!data[selectedUser]) return;

  const goalEl = document.getElementById("goalPointDisplay");
  const remainEl = document.getElementById("remainingPoint");

  const goal = data[selectedUser]?.goalPoint || 0;
  const current = data[selectedUser]?.point || 0;
  const pointEl = document.getElementById("point");
  if (pointEl) {
    pointEl.textContent = data[selectedUser].point;
  }
  const totalEl = document.getElementById("totalPoint");
  if (totalEl) {
    totalEl.textContent = data[selectedUser].totalPoint;
  }

  if (!goalEl || !remainEl) return;

  goalEl.textContent = goal;

  const remain = goal - current;

  remainEl.textContent = remain <= 0 ? "達成！" : `${remain}pt`;
}

//  履歴表示
function displayHistory() {
  const list = data[selectedUser].histories;
  const history = document.getElementById("history");

  if (list.length === 0) {
    history.innerHTML = "<li>まだ履歴はありません</li>";
    return;
  }

  let html = "";

  for (const item of list) {
    const sign = item.point > 0 ? "+" : "";

    html +=
      "<li>" +
      item.date +
      " " +
      item.itemName +
      " " +
      sign +
      item.point +
      "pt</li>";
  }

  history.innerHTML = html;
}

// 項目表示
function renderItems() {
  const container = document.getElementById("itemButtons");

  container.innerHTML = "";

  items.forEach((item) => {
    const button = document.createElement("button");

    const sign = item.point > 0 ? "+" : "";

    button.textContent = `${item.name} ${sign}${item.point}pt`;

    button.onclick = () => addPoint(item.name, item.point);

    container.appendChild(button);
  });
  console.log("renderItems実行");
}

// ======================
// 保存
// ======================
function saveData() {
  localStorage.setItem("data", JSON.stringify(data));
}

// if (!localStorage.getItem("data")) {
// 	saveData();
// }
