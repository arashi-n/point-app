// ======================
// 初期データ
// ======================
// localStorage.clear();
const state = {
	users: JSON.parse(localStorage.getItem("users")) || [
		"Aさん",
		"Bさん",
		"Cさん",
	],
	data: JSON.parse(localStorage.getItem("data")) || {},
	items: JSON.parse(localStorage.getItem("items")) || [
		{ name: "項目A", point: 10 },
		{ name: "項目B", point: 20 },
	],
};

let selectedUser = localStorage.getItem("selectedUser");

if (!selectedUser || selectedUser === "") {
	selectedUser = state.users[0];
	localStorage.setItem("selectedUser", selectedUser);
}

let showAllHistory = false;

let useGoalPoint = JSON.parse(localStorage.getItem("useGoalPoint")) ?? false;

let goalMode = localStorage.getItem("goalMode") || "personal";

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
}

init();

function normalizeState() {
	if (!state.users.includes(selectedUser)) {
		selectedUser = state.users[0] || "";
	}

	state.users.forEach((user) => {
		if (!state.data[user]) {
			state.data[user] = {
				point: 0,
				totalPoint: 0,
				goalPoint: 0,
				histories: [],
			};
		}

		if (state.data[user].goalPoint === undefined) {
			state.data[user].goalPoint = 0;
		}
	});

	Object.keys(state.data).forEach((user) => {
		if (!state.users.includes(user)) {
			delete state.data[user];
		}
	});

	localStorage.setItem("selectedUser", selectedUser);
	localStorage.setItem("state.users", JSON.stringify(state.users));
	localStorage.setItem("data", JSON.stringify(state.data));
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

	state.data[user].point += num;
	state.data[user].totalPoint += num;

	state.data[user].histories.unshift({
		date: now.toLocaleString(),
		type: "add",
		itemName: itemName,
		point: num,
	});

	saveData();
	updateUI();
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

	if (!allowNegative && amount > state.data[user].point) {
		alert("ポイントが不足しています");
		return;
	}

	state.data[user].point -= amount;

	state.data[user].histories.unshift({
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

	state.data[user].point = 0;

	saveData();
	updateUI();
}

// ユーザー切替
function changeUser() {
	selectedUser = document.getElementById("userSelect").value;

	if (!state.users.includes(selectedUser)) {
		selectedUser = state.users[0] || "";
	}

	localStorage.setItem("selectedUser", selectedUser);

	showAllHistory = false;

	updateUI();
}

// ======================
// UI
// ======================
// ユーザー選択肢表示
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
function updateGoalModeUI() {
	const mode = localStorage.getItem("goalMode") || "personal";

	const personalArea = document.getElementById("goalAreaPersonal");
	const sharedArea = document.getElementById("goalAreaShared");

	if (!personalArea || !sharedArea) return;

	personalArea.style.display = mode === "personal" ? "block" : "none";

	sharedArea.style.display = mode === "shared" ? "block" : "none";
}

function updateCommonUI() {
	if (!selectedUser || !state.data[selectedUser]) return;

	const pointEl = document.getElementById("point");
	const totalEl = document.getElementById("totalPoint");

	if (pointEl) pointEl.textContent = state.data[selectedUser].point;
	if (totalEl) totalEl.textContent = state.data[selectedUser].totalPoint;
}

function updatePersonalUI() {
	if (!selectedUser || !state.data[selectedUser]) return;

	const goal = state.data[selectedUser]?.goalPoint || 0;
	const current = state.data[selectedUser]?.point || 0;

	const remain = goal - current;

	document.getElementById("goalPointDisplay").textContent = goal;
	document.getElementById("remainingPointPersonal").textContent =
		remain <= 0 ? "達成！" : `${remain}pt`;

	const progress = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;

	const progressBar = document.getElementById("goalProgress");

	if (progressBar) {
		progressBar.style.width = progress + "%";
		document.getElementById("goalPercent").textContent =
			Math.floor(progress) + "%";
	}

	if (progress >= 100) {
		progressBar.style.backgroundColor = "#ffb300";
	} else {
		progressBar.style.backgroundColor = "steelblue";
	}
}

function updateGoalVisibilityUI() {
	const personalArea = document.getElementById("goalAreaPersonal");
	const sharedArea = document.getElementById("goalAreaShared");

	if (!personalArea || !sharedArea) return;

	const useGoalPoint =
		JSON.parse(localStorage.getItem("useGoalPoint")) ?? false;

	if (!useGoalPoint) {
		personalArea.style.display = "none";
		sharedArea.style.display = "none";
		return;
	}

	personalArea.style.display = "block";
	sharedArea.style.display = "block";

	updateGoalModeUI();
}

function updateSharedUI() {
	const sharedGoal = Number(localStorage.getItem("sharedGoalPoint")) || 0;

	const total = Object.values(state.data).reduce((sum, user) => {
		return sum + (user.point || 0);
	}, 0);

	const remain = sharedGoal - total;

	const progress =
		sharedGoal > 0 ? Math.min((total / sharedGoal) * 100, 100) : 0;

	const progressBar = document.getElementById("sharedGoalProgress");

	const goalEl = document.getElementById("sharedGoalPoint");
	const totalEl = document.getElementById("sharedTotalPoint");
	const remainEl = document.getElementById("remainingPointShared");
	const percentEl = document.getElementById("sharedGoalPercent");

	if (goalEl) goalEl.textContent = sharedGoal;
	if (totalEl) totalEl.textContent = total;
	if (remainEl) {
		remainEl.textContent = remain <= 0 ? "達成！" : `${remain}pt`;
	}

	if (progressBar) {
		progressBar.style.width = progress + "%";

		if (progress >= 100) {
			progressBar.style.backgroundColor = "#ffb300";
		} else {
			progressBar.style.backgroundColor = "steelblue";
		}
	}

	if (percentEl) {
		percentEl.textContent = Math.floor(progress) + "%";
	}
}

function updateUI() {
	console.log("useGoalPoint:", localStorage.getItem("useGoalPoint"));
	console.log("goalAreaPersonal:", document.getElementById("goalAreaPersonal"));

	if (!selectedUser || !state.data?.[selectedUser]) {
		showEmptyState();
		return;
	}

	hideEmptyState();

	updateGoalModeUI();
	updateCommonUI();
	updatePersonalUI();
	updateGoalVisibilityUI();
	updateSharedUI();
	displayHistory();
	renderMainItems();
}

//  履歴表示
function displayHistory() {
	const userData = state.data?.[selectedUser];
	if (!userData) return;

	const list = userData.histories ?? [];
	const history = document.getElementById("history");

	if (list.length === 0) {
		history.innerHTML = "<li>まだ履歴はありません</li>";
		return;
	}

	const displayList = showAllHistory ? list : list.slice(0, 5);

	let html = "";

	for (const item of displayList) {
		const sign = item.point > 0 ? "+" : "";

		html += `
	<li>
		<span class="historyDate">${item.date}</span>
		<span class="historyName">${item.itemName}</span>
		<span class="historyPoint">${sign}${item.point}pt</span>
	</li>
`;
	}

	history.innerHTML = html;

	const btn = document.getElementById("historyToggleBtn");

	if (btn) {
		if (list.length <= 5) {
			btn.style.display = "none";
		} else {
			btn.style.display = "block";
			btn.textContent = showAllHistory ? "▲ 閉じる" : "▼ もっと見る";
		}
	}
}

function toggleHistory() {
	if (!selectedUser || !state.data[selectedUser]) return;

	showAllHistory = !showAllHistory;
	displayHistory();
}

function showEmptyState() {
	const el = document.getElementById("statusMessage");
	if (!el) return;

	el.style.display = "block";
	el.textContent = "ユーザーがいません";
}

function hideEmptyState() {
	const el = document.getElementById("statusMessage");
	if (!el) return;

	el.style.display = "none";
}

// 項目表示
function renderMainItems() {
	const container = document.getElementById("itemButtons");

	container.innerHTML = "";

	state.items.forEach((item) => {
		const button = document.createElement("button");

		const sign = item.point > 0 ? "+" : "";

		button.innerHTML = `
	<span class="itemName">${item.name}</span>
	<span class="itemPoint">${sign}${item.point}pt</span>
`;

		button.onclick = () => addPoint(item.name, item.point);

		container.appendChild(button);
	});
	console.log("renderMainItems実行");
}

// ======================
// 保存
// ======================
function saveData() {
	localStorage.setItem("data", JSON.stringify(state.data));
}
