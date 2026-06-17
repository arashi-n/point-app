// ======================
// 初期データ
// ======================
// localStorage.clear();
let selectedUser = localStorage.getItem("selectedChild");

if (!selectedUser || selectedUser === "") {
	selectedUser = "やまと";
	localStorage.setItem("selectedChild", selectedUser);
}

let data = JSON.parse(localStorage.getItem("data")) || {
	やまと: { point: 0, totalPoint: 0, histories: [] },
	あやと: { point: 0, totalPoint: 0, histories: [] },
	あらし: { point: 0, totalPoint: 0, histories: [] },
};

let items = JSON.parse(localStorage.getItem("items")) || [
	{ name: "宿題", point: 10 },
	{ name: "お手伝い", point: 20 },
];

// ======================
// 初期化
// ======================
init();

function init() {
	renderChildSelect();

	const select = document.getElementById("childSelect");

	if (!select.value) {
		select.value = "やまと";
	}

	selectedUser = select.value;

	localStorage.setItem("selectedChild", selectedUser);

	updateUI();
	renderItems();
}

// ======================
// 機能
// ======================
// 加算
function addPoint(itemName, num) {
	const now = new Date();
	const child = selectedUser;

	data[child].point += num;
	data[child].totalPoint += num;

	data[child].histories.unshift({
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
	const child = selectedUser;
	const amount = Number(document.getElementById("payAmount").value);

	if (!amount || amount <= 0) {
		alert("支給額を入力してください");
		return;
	}

	data[child].point -= amount;

	data[child].histories.unshift({
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
	const child = selectedUser;

	data[child].point = 0;

	saveData();
	updateUI();
}

// 子ども切替
function changeUser() {
	selectedUser = document.getElementById("childSelect").value;

	if (!selectedUser) selectedUser = "やまと";

	localStorage.setItem("selectedChild", selectedUser);

	updateUI();
}

// ======================
// UI
// ======================
// 子ども選択肢表示
function renderChildSelect() {
	const select = document.getElementById("childSelect");

	const users = JSON.parse(localStorage.getItem("children")) || [
		"やまと",
		"あやと",
		"あらし",
	];

	select.innerHTML = "";

	users.forEach((child) => {
		const option = document.createElement("option");

		option.value = child;
		option.textContent = child;

		select.appendChild(option);
	});

	if (!selectedUser || !users.includes(selectedUser)) {
		selectedUser = users[0];
	}

	select.value = selectedUser;
}

// UI更新
function updateUI() {
	console.log("selectedUser:", selectedUser);
	console.log("data:", data);

	if (!data[selectedUser]) {
		console.warn("存在しない子ども:", selectedUser);
		return;
	}
	document.getElementById("point").textContent = data[selectedUser];
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

		button.textContent = `${item.name} +${item.point}pt`;

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
