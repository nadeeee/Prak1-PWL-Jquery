let stok = {
    "Jet Tempur": 5,
    "Nuklir Hiroshima": 30,
    "Infinity Stone": 8,
    "Burj Khalifa": 4,
    "Rudal": 18
};


function getobj(obj1, obj2) {
    const keys = Object.keys(obj1).filter(key => key in obj2);

    const inv = Object.assign({}, obj1)
    for (const key of keys) {
        delete inv[key]
    }

    return inv
}

function validate() {
    const orders = getOrders();
    if (Object.keys(orders).length <= 0 && $("#input-name").val() === "") {
        return false
    }

    for (const id of Object.keys(orders)) {
        if (orders[id] <= 0 || orders[id] > stok[id]) {
            return false
        }
    }

    return true
}

function getOrder(item, count) {
    return `<li>${item} (${count})</li>`
}

function getName() {
    const name = $("#input-name").val();

    return `<h2>${name}</h2>`;
}

function getOrders() {
    const orders = {};

    $("#select-product div").each(function() {
        const id = $(this).find($("select option:selected")).val();
        const val = $(this).find($("input")).val()

        if (id === "Pilih Produk") {
            return
        }

        orders[id] = val;
    })

    return orders;
}

function constructOrderDetail() {
    const name = getName();
    const orders = getOrders();
    const items = Object.keys(orders).map(id => getOrder(id, orders[id]));

    return [
        "<h2>Detail Pesanan</h2>",
        "<hr>",
        "<p> Orderan atas nama",
        name,
        "</p>",
        "<ul>",
        ...items,
        "</ul>"
    ].join("\n");
}

function showSummary() {
    const orderDetail = constructOrderDetail()

    $("#summary").html(orderDetail)
}

function newProductOption(products) {
    const opts = Object.keys(products).map(p => `<option value='${p}'>${p}</option>`);

    return `<select class='form-control'>${opts.join("\n")}</select>`;
    
}

function newProductInput() {
    return `<input type='number' class='form-control' placeholder='Jumlah' min='1' max='${stok[$("#select-product div:last-child select option:selected").val()]}'>`;
}

function newXButton() {
    return `<button type="button" class='btn danger btn-cl'>Batal</button>`;
}

function x() {

    const orders = getOrders();
    const orderCount = Object.keys(orders).length;

    const prods = getobj(stok, orders);

    let productOption = newProductOption(prods);
    let productInput = newProductInput();
    let xBtn = "";

    if (orderCount > 0) {
        xBtn = newXButton();
    }
    
    return [
        "<div class='flex flex-content form-group product-opt mb-3'>",
        productOption,
        productInput,
        xBtn,
        "</div>",
    ].join("\n")
}

function ProductList() {
    const po = x()
    $("#select-product").append(po);

    $("#select-product div select").change(function() {
        $("#add-product").show();
    })
}

function actionRemove() {
    const orders = getOrders();
    const orderCount = Object.keys(orders).length;
    const stokCount = Object.keys(stok).length;

    if (orderCount == 0) {
        return
    }

    $("#select-product div:last-child").remove();
    $("#select-product div:last-child button").show();

    $("#select-product div:last-child button").click(actionRemove);
    

    if (orderCount < stokCount) {
        $("#add-product").show();
    }

    $("#select-product div:last-child select").attr("disabled", false);
}

$(function() {
    $("#add-product").hide();
    $("#add-product").click(function() {
        $("#select-product div:last-child select").attr("disabled", true)
        $("#select-product div:last-child button").hide();

        const val = parseInt($("#select-product div:last-child input").val());

        if ( isNaN(val) ) {
            alert("Isikan jumlah yang diinginkan");
            return
        }

        const select = x();
        $("#select-product").append(select);
        $("#select-product div:last-child button").click(actionRemove);

        const orders = getOrders();
        const orderCount = Object.keys(orders).length;
        const stokCount = Object.keys(stok).length

        if (orderCount == stokCount) {
            $(this).hide();
        }
    })
    ProductList();

    $("#orderBtn").click(function() {
        isEligible = validate()
        if (!isEligible) {
            alert("order tidak valid")
            return
        }

        showSummary();
    })
})