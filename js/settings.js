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

	createItem(name, point);

	document.getElementById("itemName").value = "";
	document.getElementById("itemPoint").value = "";
}

// 編集
function editItem(index) {
	const newName = prompt("項目名", items[index].name);
	const newPoint = Number(prompt("ポイント", items[index].point));

	if (!newName || !newPoint) return;

	items[index] = {
		name: newName,
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
let children = JSON.parse(localStorage.getItem("children")) || [
	"やまと",
	"あやと",
	"あらし",
];

// 初期保存
saveChildren();

// 初期実行
renderChildren();

// UI表示
function renderChildren() {
	const container = document.getElementById("childList");

	container.innerHTML = "";

	children.forEach((child, index) => {
		const div = document.createElement("div");

		div.textContent = child;

		const editBtn = document.createElement("button");

		editBtn.textContent = "編集";
		editBtn.onclick = () => editChild(index);

		const delBtn = document.createElement("button");
		delBtn.textContent = "削除";
		delBtn.onclick = () => deleteChild(index);

		div.appendChild(editBtn);
		div.appendChild(delBtn);

		container.appendChild(div);
	});
}

// 追加
function addChildFromUI() {
	const input = document.getElementById("childName");

	const name = input.value.trim();

	if (!name) {
		return;
	}

	children.push(name);

	const data = JSON.parse(localStorage.getItem("data")) || {};

	data[name] = {
		point: 0,
		totalPoint: 0,
		histories: [],
	};

	localStorage.setItem("data", JSON.stringify(data));

	saveChildren();

	renderChildren();

	input.value = "";
}

// 編集
function editChild(index) {
	const newName = prompt("新しい名前を入力してください", children[index]);

	if (!newName) {
		return;
	}

	children[index] = newName;

	saveChildren();
	renderChildren();
}

// 削除
function deleteChild(index) {
	children.splice(index, 1);

	saveChildren();
	renderChildren();
}

// 保存
function saveChildren() {
	localStorage.setItem("children", JSON.stringify(children));
}
