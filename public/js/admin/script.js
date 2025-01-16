document.querySelector(".jsFilter").addEventListener("click", function () {
  document.querySelector(".filter-menu").classList.toggle("active");
  document.querySelector(".options-menu").classList.remove("active");
});


document.querySelector(".jsOptions").addEventListener("click", function () {
  document.querySelector(".options-menu").classList.toggle("active");
  document.querySelector(".filter-menu").classList.remove("active");
});

document.querySelector(".grid").addEventListener("click", function () {
  document.querySelector(".list").classList.remove("active");
  document.querySelector(".grid").classList.add("active");
  document.querySelector(".products-area-wrapper").classList.add("gridView");
  document
    .querySelector(".products-area-wrapper")
    .classList.remove("tableView");
});

document.querySelector(".list").addEventListener("click", function () {
  document.querySelector(".list").classList.add("active");
  document.querySelector(".grid").classList.remove("active");
  document.querySelector(".products-area-wrapper").classList.remove("gridView");
  document.querySelector(".products-area-wrapper").classList.add("tableView");
});

var modeSwitch = document.querySelector(".mode-switch");
modeSwitch.addEventListener("click", function () {
  document.documentElement.classList.toggle("light");
  modeSwitch.classList.toggle("active");
});

// Filter Status
const selectStatus = document.querySelector("select.status");
let url = new URL(location.href);
selectStatus.value = url.searchParams.get("status") || "";

document.querySelector(".filter-button.apply").onclick = () => {
  let status = selectStatus.value;
  if (status) url.searchParams.set("status", status);
  else url.searchParams.delete("status");
  url.searchParams.delete("page");
  location.href = url.href;
};

// Search Bar
const searchBar = document.querySelector("input.search-bar");
searchBar.value = url.searchParams.get("keyword") || "";
searchBar.addEventListener("keydown", (event) => {
  if (event.key === "Enter" || event.keyCode === 13) {
    event.preventDefault();
    let keyword = searchBar.value;
    if (keyword) url.searchParams.set("keyword", keyword);
    else url.searchParams.delete("keyword");
    location.href = url.href;
  }
});

// Navagation
const pageItems = document.querySelectorAll("li.page-item");

pageItems.forEach((pageItem) => {
  pageItem.onclick = (event) => {
    event.preventDefault();
    let page = pageItem.innerText;

    if (parseInt(page) && parseInt(page) != 1)
      url.searchParams.set("page", page);
    else url.searchParams.delete("page");
    location.href = url.href;
  };
});

const previousPage = (start) => {
  let cur = parseInt(url.searchParams.get("page"));
  if (cur == 2) {
    url.searchParams.delete("page");
    location.href = url.href;
  } else if (cur > start) {
    url.searchParams.set("page", cur - 1);
    location.href = url.href;
  }
};

const nextPage = (end) => {
  let cur = parseInt(url.searchParams.get("page")) || 1;
  if (cur < end) {
    url.searchParams.set("page", cur + 1);
    location.href = url.href;
  }
};

// change status
const statusBtns = document.querySelectorAll("span.status");
const formChangeStatuss = document.querySelector("#form-change-status");
statusBtns.forEach((statusBtn) => {
  statusBtn.onclick = function () {
    let id = this.getAttribute("_id");
    let status = this.getAttribute("status");
    status = status === "active" ? "disabled" : "active";
    formChangeStatuss.action = "/admin/product/change-status?_method=PATCH";
    formChangeStatuss.querySelector("input[name='id']").value = id;
    formChangeStatuss.querySelector("input[name='status']").value = status;
    formChangeStatuss.submit();
  };
});

// Check product
const checkAllProductBtn = document.querySelector(
  "input[name='check-all-product']"
);
const checkProductBtns = document.querySelectorAll(
  "input[name='check-product']"
);
const cntCheckedProduct = () => {
  let acc = 0;
  checkProductBtns.forEach((checkProduct) => {
    acc = checkProduct.checked ? acc + 1 : acc;
  });
  return acc;
};

checkAllProductBtn.onclick = function () {
  if (cntCheckedProduct() == checkProductBtns.length) {
    checkProductBtns.forEach((checkProduct) => {
      checkProduct.checked = false;
    });
    document
      .querySelector(".options-button-wrapper")
      .classList.remove("active");
  } else {
    checkProductBtns.forEach((checkProduct) => {
      checkProduct.checked = true;
    });
    document.querySelector(".options-button-wrapper").classList.add("active");
  }
};

checkProductBtns.forEach((checkProduct) => {
  checkProduct.onclick = function () {
    if (cntCheckedProduct() == checkProductBtns.length) {
      checkAllProductBtn.checked = true;
    } else if (cntCheckedProduct() == 0) {
      checkAllProductBtn.checked = false;
      document
        .querySelector(".options-button-wrapper")
        .classList.remove("active");
    } else {
      checkAllProductBtn.checked = false;
      document.querySelector(".options-button-wrapper").classList.add("active");
    }
  };
});

// Change multi product
const formChangeMultiStatus = document.querySelector(
  "#form-change-multi-status"
);
const changeMultiStatusBtns = document.querySelectorAll(
  ".change-multi-status-btn"
);
changeMultiStatusBtns.forEach(
  (changeMultiStatusBtn) =>
    (changeMultiStatusBtn.onclick = function () {
      formChangeMultiStatus.action =
        "/admin/product/change-multi-status?_method=PATCH";
      let ids = [];
      checkProductBtns.forEach((e) => {
        if (e.checked) return ids.push(e.getAttribute("_id"));
      });
      formChangeMultiStatus.querySelector("input[name='ids']").value =
        ids.join(" ");
      formChangeMultiStatus.querySelector("input[name='status']").value =
        this.getAttribute("data-status");
      formChangeMultiStatus.submit();
    })
);

// Remove product
const removeBtns = document.querySelectorAll(".remove-btn");
const formRemoveProduct = document.querySelector("#form-remove-product");
removeBtns.forEach((removeBtn) => {
  removeBtn.onclick = function () {
    const isConfirm = confirm("Bạn chắc chắn muốn xóa sản phẩm này không?");
    if (isConfirm) {
      let id = this.getAttribute("_id");
      formRemoveProduct.querySelector("input[name='id']").value = id;
      formRemoveProduct.action = "/admin/product/remove-product?_method=DELETE";

      formRemoveProduct.submit();
    }
  };
});

// Remove multi product
const formRemoveMultiProuct = document.querySelector(
  "#form-remove-multi-product"
);
const removeMultiProductBtn = document.querySelector(
  ".remove-multi-product-btn"
);
removeMultiProductBtn.onclick = function () {
  const isConfirm = confirm(
    "Bạn chắc chắn muốn xóa tất cả sản phẩm đang chọn không?"
  );
  if (isConfirm) {
    formRemoveMultiProuct.action =
      "/admin/product/remove-multi-product?_method=DELETE";
    let ids = [];
    checkProductBtns.forEach((e) => {
      if (e.checked) return ids.push(e.getAttribute("_id"));
    });
    formRemoveMultiProuct.querySelector("input[name='ids']").value =
      ids.join(" ");
    formRemoveMultiProuct.submit();
  }
};


// Alert Handler
const alert = document.querySelector(".alert")
if(alert){
  setTimeout(() => {
    alert.classList.add("hidden")
  }, parseInt(alert.getAttribute("time")))

  alert.querySelector(".close-alert").onclick = function(){
    alert.classList.add("hidden")
  }
}

const undoBtn = document.querySelector(".alert .undo div")
if(undoBtn) undoBtn.onclick = function(){
  document.querySelector(".alert .undo").action =  "/admin/product/undo-remove-product?_method=PATCH";
  document.querySelector(".alert .undo").submit();
}
