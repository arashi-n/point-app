// ======================
// 初期データ
// ======================
// localStorage.clear();
let users = JSON.parse(localStorage.getItem("users")) || [
	"やまと",
	"あやと",
	"あらし",
];

let selectedUser = localStorage.getItem("selectedUser");

if (!selectedUser || selectedUser === "") {
	selectedUser = users[0];
	localStorage.setItem("selectedUser", selectedUser);
}

let data = JSON.parse(localStorage.getItem("data")) || {};

let items = JSON.parse(localStorage.getItem("items")) || [
	{ name: "宿題", point: 10 },
	{ name: "お手伝い", point: 20 },
];

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
}

function normalizeState() {
	// usersに存在するユーザーのdataを保証
	users.forEach((user) => {
		if (!data[user]) {
			data[user] = {
				point: 0,
				totalPoint: 0,
				histories: [],
			};
		}
	});

	// usersに存在しないdataを削除
	Object.keys(data).forEach((user) => {
		if (!users.includes(user)) {
			delete data[user];
		}
	});

	// selectedUser補正
	if (!users.includes(selectedUser)) {
		selectedUser = users[0] || "";
	}

	localStorage.setItem("selectedUser", selectedUser);
	localStorage.setItem("users", JSON.stringify(users));
	localStorage.setItem("data", JSON.stringify(data));
}

// ======================
// 機能
// ======================
// 加算
function addPoint(itemName, num) {
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
}

// 支給
function payPoint() {
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
	const user = selectedUser;

	data[user].point = 0;

	saveData();
	updateUI();
}

// 子ども切替
function changeUser() {
	selectedUser = document.getElementById("userSelect").value;

	if (!users.includes(selectedUser)) {
		selectedUser = users[0] || "";
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

	const users = JSON.parse(localStorage.getItem("users")) || [
		"やまと",
		"あやと",
		"あらし",
	];

	select.innerHTML = "";

	users.forEach((user) => {
		const option = document.createElement("option");

		option.value = user;
		option.textContent = user;

		select.appendChild(option);
	});

	if (!selectedUser || !users.includes(selectedUser)) {
		selectedUser = users[0];
	}

	select.value = selectedUser;
}

// UI更新
function updateUI() {
	if (!data[selectedUser]) {
		data[selectedUser] = {
			point: 0,
			totalPoint: 0,
			histories: [],
		};
		saveData();
	}

	console.log("selectedUser:", selectedUser);
	console.log("data:", data);

	if (!data[selectedUser]) {
		console.warn("存在しない子ども:", selectedUser);
		return;
	}
	document.getElementById("point").textContent = data[selectedUser].point;
	document.getElementById("totalPoint").textContent =
		data[selectedUser].totalPoint;

	displayHistory();
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
