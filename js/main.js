// ======================
// ① 初期データ
// ======================
// localStorage.clear();
let selectedChild = localStorage.getItem("selectedChild") || "yamato";

let data = JSON.parse(localStorage.getItem("data")) || {
	yamato: { point: 0, totalPoint: 0, histories: [] },
	ayato: { point: 0, totalPoint: 0, histories: [] },
	arashi: { point: 0, totalPoint: 0, histories: [] },
};

let items = JSON.parse(localStorage.getItem("items")) || [
	{ name: "宿題", point: 10 },
	{ name: "お手伝い", point: 20 },
];

// ======================
// ② 初期化
// ======================
init();

function init() {
	document.getElementById("childSelect").value = selectedChild;

	updateUI();
	renderItems();
}

// ======================
// ③ 機能系
// ======================
// ポイント加算
function addPoint(itemName, num) {
	const now = new Date();
	const child = selectedChild;

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
	const child = selectedChild;
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
	const child = selectedChild;

	data[child].point = 0;

	saveData();
	updateUI();
}

// 子ども切替
function changeChild() {
	selectedChild = document.getElementById("childSelect").value;
	localStorage.setItem("selectedChild", selectedChild);

	updateUI();
}

// ======================
// ④ UI系（ここに集約）
// ======================
function updateUI() {
	document.getElementById("point").textContent = data[selectedChild].point;

	document.getElementById("totalPoint").textContent =
		data[selectedChild].totalPoint;

	displayHistory();
}

//  履歴表示
function displayHistory() {
	const list = data[selectedChild].histories;
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

function renderItems() {
	const container = document.getElementById("itemButtons");

	container.innerHTML = "";

	items.forEach((item, index) => {
		const wrapper = document.createElement("div");

		const button = document.createElement("button"); // ←これが必須

		button.textContent = `${item.name} +${item.point}pt`;

		button.onclick = () => addPoint(item.name, item.point);

		const editBtn = document.createElement("button");
		editBtn.textContent = "編集";
		editBtn.onclick = () => editItem(index);

		const delBtn = document.createElement("button");
		delBtn.textContent = "削除";
		delBtn.onclick = () => deleteItem(index);

		wrapper.appendChild(button);
		wrapper.appendChild(editBtn);
		wrapper.appendChild(delBtn);

		container.appendChild(wrapper);
	});
}

function init() {
	loadItems();
	renderItems();
}

function loadItems() {
	items = JSON.parse(localStorage.getItem("items")) || [];
}

// ======================
// ⑤ 保存
// ======================
function saveData() {
	localStorage.setItem("data", JSON.stringify(data));
}

updateUI();
displayHistory();
renderItems();
