// ======================
// アプリ設定
// ======================
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

let useGoalPoint = JSON.parse(localStorage.getItem("useGoalPoint")) ?? false;

let goalMode = localStorage.getItem("goalMode") || "personal";

let allowNegative = JSON.parse(localStorage.getItem("allowNegative")) ?? true;

let confirmDelete = JSON.parse(localStorage.getItem("confirmDelete")) ?? true;

let items = JSON.parse(localStorage.getItem("items")) || [
	{ name: "項目A", point: 10 },
	{ name: "項目B", point: 20 },
];

const checkbox = document.getElementById("useGoalPoint");
const goalSettings = document.getElementById("goalSettings");
const personalBox = document.getElementById("personalGoalSettings");
const sharedBox = document.getElementById("sharedGoalSettings");
const goalRadios = document.querySelectorAll('input[name="goalMode"]');

function initSettings() {
	loadSettings();
	renderUsers();
	renderSettingsItems();
	toggleGoalSettings();
	renderPersonalGoals();
	renderSharedGoal();
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
		input.value = state.data[user]?.goalPoint || 0;

		input.addEventListener("input", () => {
			state.data[user].goalPoint = Number(input.value) || 0;
			localStorage.setItem("data", JSON.stringify(state.data));
		});

		row.appendChild(label);
		row.appendChild(input);
		personalBox.appendChild(row);
	});
}

function renderSharedGoal() {
	const input = document.getElementById("sharedGoalPoint");

	input.value = localStorage.getItem("sharedGoalPoint") || 0;

	input.addEventListener("input", () => {
		localStorage.setItem("sharedGoalPoint", input.value);
	});
}

checkbox.addEventListener("change", function () {
	localStorage.setItem("useGoalPoint", JSON.stringify(this.checked));

	useGoalPoint = this.checked;

	toggleGoalSettings();
	updateGoalModeUI();
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

document.getElementById("clearAllBtn").addEventListener("click", () => {
	const ok = confirm("すべてのデータを初期化します。よろしいですか？");
	if (!ok) return;

	localStorage.clear();

	alert("初期化しました。ページを再読み込みします。");
	location.reload();
});

// ======================
// 項目
// ======================
// 項目データ
if (!localStorage.getItem("state.items")) {
	localStorage.setItem("state.items", JSON.stringify(state.items));
}

// 初期実行
initSettings();

// UI表示
function renderSettingsItems() {
	const container = document.getElementById("itemButtons");
	container.innerHTML = "";

	state.items.forEach((item, index) => {
		const wrapper = document.createElement("div");
		wrapper.className = "itemRow";

		const label = document.createElement("div");
		label.className = "itemLabel";

		const sign = item.point > 0 ? "+" : "";
		label.textContent = `${item.name} ${sign}${item.point}pt`;

		const actions = document.createElement("div");
		actions.className = "itemActions";

		const editBtn = document.createElement("button");
		editBtn.textContent = "編集";
		editBtn.onclick = () => editItem(index);

		const delBtn = document.createElement("button");
		delBtn.textContent = "削除";
		delBtn.onclick = () => deleteItem(index);

		actions.appendChild(editBtn);
		actions.appendChild(delBtn);

		wrapper.appendChild(label);
		wrapper.appendChild(actions);

		container.appendChild(wrapper);
	});
}

// 作成
function createItem(name, point) {
	state.items.push({
		name,
		point,
	});

	saveItems();
	renderSettingsItems();
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

	if (
		state.items.some((item) => item.name.toLowerCase() === name.toLowerCase())
	) {
		error.textContent = "同じ項目名が既に存在します";
		return;
	}

	createItem(name, point);

	document.getElementById("itemName").value = "";
	document.getElementById("itemPoint").value = "";
}

// 編集
function editItem(index) {
	const newName = prompt("項目名", state.items[index].name);
	const pointInput = prompt("ポイント", state.items[index].point);

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
		state.items.some(
			(item, i) =>
				i !== index && item.name.toLowerCase() === trimmedName.toLowerCase(),
		)
	) {
		alert("同じ項目名が既に存在します");
		return;
	}

	state.items[index] = {
		name: trimmedName,
		point: newPoint,
	};

	saveItems();
	renderSettingsItems();
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

	state.items.splice(index, 1);

	saveItems();
	renderSettingsItems();
}

// 保存
function saveItems() {
	localStorage.setItem("state.items", JSON.stringify(state.items));
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

	const empty = document.getElementById("userEmpty");
	if (!empty) return;

	container.innerHTML = "";

	if (state.users.length === 0) {
		container.style.display = "none";
		empty.innerHTML = `
			<div class="emptyState">
				ユーザーがいません<br>
				追加してください
			</div>
		`;
		return;
	}

	container.style.display = "block";
	empty.innerHTML = "";

	state.users.forEach((user, index) => {
		const wrapper = document.createElement("div");
		wrapper.className = "userRow";

		const name = document.createElement("div");
		name.className = "userName";
		name.textContent = user;

		const actions = document.createElement("div");
		actions.className = "userActions";

		const editBtn = document.createElement("button");
		editBtn.textContent = "編集";
		editBtn.onclick = () => editUser(index);

		const delBtn = document.createElement("button");
		delBtn.textContent = "削除";
		delBtn.onclick = () => deleteUser(index);

		actions.appendChild(editBtn);
		actions.appendChild(delBtn);

		wrapper.appendChild(name);
		wrapper.appendChild(actions);

		container.appendChild(wrapper);
	});
}

// 追加
function addUserFromUI() {
	const input = document.getElementById("userName");
	if (!input) return;

	const name = input.value.trim();
	if (!name) return;

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

	state.data = data;

	localStorage.setItem("users", JSON.stringify(state.users));
	localStorage.setItem("data", JSON.stringify(data));
	localStorage.setItem("selectedUser", name);

	saveUsers();

	renderUsers();
	renderPersonalGoals();

	selectedUser = name;

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

	localStorage.setItem("data", JSON.stringify(state.data));

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
	localStorage.setItem("data", JSON.stringify(state.data));

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
