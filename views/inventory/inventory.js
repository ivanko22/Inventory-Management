let items = [];
let tbody = document.querySelector("tbody");
console.log(merchant);

let renderIngredients = ()=>{
    while(tbody.hasChildNodes()){
        tbody.removeChild(tbody.firstChild);
    }

    for(let item of items){
        let row = document.createElement("tr");
        tbody.appendChild(row);

        let name = document.createElement("td");
        name.innerText = item.name;
        row.appendChild(name);

        let category = document.createElement("td");
        category.innerText = item.category;
        row.appendChild(category);

        let quantity = document.createElement("td");
        quantity.innerText = item.quantity;
        row.appendChild(quantity);

        let unit = document.createElement("td");
        unit.innerText = item.unit;
        row.appendChild(unit);

        let action = document.createElement("td");
        row.appendChild(action);

        let editBtn = document.createElement("button");
        editBtn.onclick = ()=>{editIngredient(item.id, row)};
        editBtn.innerText = "Edit";
        editBtn.className = "edit-button"
        action.appendChild(editBtn);

        let removeBtn = document.createElement("button");
        removeBtn.onclick = ()=>{removeIngredient(item.id, row)};
        removeBtn.innerText = "Remove";
        removeBtn.className = "edit-button";
        action.appendChild(removeBtn);
    }
}

let sortIngredients = (property)=>{
    items.sort((a, b) => (a[property] > b[property]) ? 1 : -1);
    renderIngredients();
}

let filter = ()=>{
    items = [];
    let searchString = document.querySelector("#filter").value.toLowerCase();
    for(let item of merchant.inventory){
        if(item.ingredient.name.toLowerCase().includes(searchString)){
            items.push({
                id: item.ingredient._id,
                name: item.ingredient.name,
                category: item.ingredient.category,
                quantity: item.quantity,
                unit: item.ingredient.unitType
            });
        }
    }

    sortIngredients("name");
    renderIngredients(items);
}

let editIngredient = (id, row)=>{
    let quantity = row.childNodes[2];
    let button = row.childNodes[4].childNodes[0];

    let quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.step = "0.01";
    quantityInput.value = quantity.innerText;

    quantity.innerText = "";
    quantity.appendChild(quantityInput);

    button.innerText = "Save";
    button.onclick = ()=>{updateOne(id, row)};
}

let updateOne = (id, row)=>{
    let quantityField = row.childNodes[2];
    let quantity = quantityField.childNodes[0].value;
    let button = row.childNodes[4].childNodes[0];

    quantityField.removeChild(quantityField.firstChild);
    quantityField.innerText = quantity;

    button.innerText = "Edit";
    button.onclick = ()=>{editThis(item.id, row)};

    axios.post("/ingredients/update", {
        id: id,
        quantity: quantity
    })
        .then((ingredient)=>{
            // console.log(ingredient);
        })
        .catch((err)=>{
            console.log(err);
        });
}

let removeIngredient = (id, row)=>{
    axios.post("/ingredients/remove", {id: id})
        .then((result)=>{
            console.log(result);
            for(let i = 0; i < items.length; i++){
                if(id === items[i].id){
                    items.splice(i, 1);
                }
            }
        
            renderIngredients();
        })
        .catch((err)=>{
            console.log(err);
        });
}

let displayAdd = ()=>{
    let modal = document.querySelector(".add-ingredient");
    let content = document.querySelector(".modal-content");

    let removeModal = (modal)=>{modal.style.visibility = "hidden";}

    modal.onclick = ()=>{removeModal(modal);}

    modal.style.visibility = "visible";
}

let addIngredient = ()=>{
    let content = document.querySelector(".modal-content");

    let newIngredient = {
        ingredient: {
            name: content.children[0].children[0].value,
            category: content.children[1].children[0].value,
            unitType: content.children[3].children[0].value
        },
        quantity: content.children[2].children[0].value
    }

    console.log(newIngredient);

    axios.post("/ingredients/createone", newIngredient)
        .then((ingredient)=>{
            console.log(ingredient);
            items.push({
                id: ingredient._id,
                name: newIngredient.ingredient.name,
                category: newIngredient.ingredient.category,
                quantity: newIngredient.quantity,
                unit: newIngredient.ingredient.unitType
            })
            
            sortIngredients("name");
            renderIngredients();
        })
        .catch((err)=>{
            console.log(err);
        });

    let modal = document.querySelector(".add-ingredient");
    modal.style.visibility = "hidden";
}

filter();