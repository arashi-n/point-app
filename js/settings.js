//項目
let items = JSON.parse(localStorage.getItem("items")) || [];

init();

function init() {
	renderItems();
}

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

function createItem(name, point) {
	items.push({
		name,
		point,
	});

	saveItems();
	renderItems();
}

function deleteItem(index) {
	items.splice(index, 1);

	saveItems();
	renderItems();
}

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

function saveItems() {
	localStorage.setItem("items", JSON.stringify(items));
}

//子ども

let children = JSON.parse(localStorage.getItem("children")) || [
	"やまと",
	"あやと",
	"あらし",
];

renderChildren();

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

function addChildFromUI() {
	const input = document.getElementById("childName");

	const name = input.value.trim();

	if (!name) {
		return;
	}

	children.push(name);

	saveChildren();

	renderChildren();

	input.value = "";
}

function editChild(index) {
	const newName = prompt("新しい名前を入力してください", children[index]);

	if (!newName) {
		return;
	}

	children[index] = newName;

	saveChildren();
	renderChildren();
}

function deleteChild(index) {
	children.splice(index, 1);

	saveChildren();
	renderChildren();
}

function saveChildren() {
	localStorage.setItem("children", JSON.stringify(children));
}
