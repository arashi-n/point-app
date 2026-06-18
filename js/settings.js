// ======================
// 項目
// ======================
// 項目データ
let items = JSON.parse(localStorage.getItem("items")) || [
	{ name: "宿題", point: 10 },
	{ name: "お手伝い", point: 20 },
];

if (!localStorage.getItem("items")) {
	localStorage.setItem("items", JSON.stringify(items));
}

// 初期実行
init();

// 初期化処理
function init() {
	renderItems();
}

// UI表示
function renderItems() {
	const container = document.getElementById("itemButtons");

	container.innerHTML = "";

	items.forEach((item, index) => {
		const wrapper = document.createElement("div");

		const btn = document.createElement("button");
		btn.textContent = `${item.name} +${item.point}pt`;

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
	const point = Number(document.getElementById("itemPoint").value);

	const error = document.getElementById("errorMessage");

	if (!name || !point) {
		error.textContent = "入力してください";
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
	const newPoint = Number(prompt("ポイント", items[index].point));

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
	items.splice(index, 1);

	saveItems();
	renderItems();
}

// 保存
function saveItems() {
	localStorage.setItem("items", JSON.stringify(items));
}

// ======================
// 子ども
// ======================
let users = JSON.parse(localStorage.getItem("users")) || [
	"やまと",
	"あやと",
	"あらし",
];

// 初期保存
saveUsers();

// 初期実行
renderUsers();

// UI表示
function renderUsers() {
	const container = document.getElementById("userList");

	container.innerHTML = "";

	users.forEach((user, index) => {
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

	if (users.includes(name)) {
		alert("同じ名前のユーザーが既に存在します");
		return;
	}

	users.push(name);

	const data = JSON.parse(localStorage.getItem("data")) || {};

	data[name] = {
		point: 0,
		totalPoint: 0,
		histories: [],
	};

	localStorage.setItem("data", JSON.stringify(data));

	saveUsers();

	renderUsers();

	input.value = "";
}

// 編集
function editUser(index) {
	const oldName = users[index];

	const newName = prompt("新しい名前を入力してください", oldName);

	if (!newName) {
		return;
	}

	const trimmedName = newName.trim();

	if (!trimmedName) {
		alert("名前を入力してください");
		return;
	}

	if (trimmedName !== oldName && users.includes(trimmedName)) {
		alert("同じ名前のユーザーが既に存在します");
		return;
	}

	const data = JSON.parse(localStorage.getItem("data")) || {};

	data[trimmedName] = data[oldName];
	delete data[oldName];

	users[index] = trimmedName;

	if (localStorage.getItem("selectedUser") === oldName) {
		localStorage.setItem("selectedUser", newName);
	}

	localStorage.setItem("data", JSON.stringify(data));

	saveUsers();
	renderUsers();
}

// 削除
function deleteUser(index) {
	const userName = users[index];

	users.splice(index, 1);
	saveUsers();

	const data = JSON.parse(localStorage.getItem("data")) || {};
	delete data[userName];
	localStorage.setItem("data", JSON.stringify(data));

	if (localStorage.getItem("selectedUser") === userName) {
		const newUser = users[0] || "";
		localStorage.setItem("selectedUser", newUser);
	}

	renderUsers();
}

// 保存
function saveUsers() {
	localStorage.setItem("users", JSON.stringify(users));
}
