const Product = require("../../models/product.model")

function formatCurrency(number) {
    // Chuyển số thành chuỗi và tách phần nguyên và phần thập phân
    let parts = number.toFixed(0).toString().split(".");
    let integerPart = parts[0];
    let decimalPart = parts.length > 1 ? "." + parts[1] : "";
    
    // Sử dụng biểu thức chính quy để chèn dấu chấm vào phần nguyên
    let formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    
    return formattedIntegerPart + decimalPart + " đ";
  }

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    }

    if(req.query.status) find.status = req.query.status;
    if(req.query.keyword) find.title = new RegExp(req.query.keyword, "i");
    

    // Pagination
    let pagination = {
        currentPage: parseInt(req.query.page) || 1,
        numberRenderPageItem: 7, // số lẻ
        numberPerPage: 20,
    }

    const countProduct = await Product.countDocuments(find)
    pagination.skip = (pagination.currentPage - 1) * pagination.numberPerPage
    pagination.totalPage = Math.ceil(countProduct / pagination.numberPerPage)

    pagination.renderPageItem = function(){
        let space = pagination.numberRenderPageItem/2;
        let arr = [];
        for(i = 1; i <= pagination.totalPage; i++){
            arr.push(i);
        }
        if(pagination.currentPage <= pagination.numberRenderPageItem  - space) arr = arr.filter(i => {
            if(i <= pagination.numberRenderPageItem ) return i;
        })
        else if(pagination.currentPage >= pagination.totalPage  - space) arr = arr.filter(i => {
            if(i > pagination.totalPage - pagination.numberRenderPageItem ) return i;
        })
        else arr = arr.filter(i => {
            if(i >= pagination.currentPage - space && i <= pagination.currentPage + space ) return i;
        })

        return arr;
    }
    

    const products = await Product.find(find).limit(pagination.numberPerPage).skip(pagination.skip).sort({position: -1});
    const renderProducts = products.map((product => {
        product.currency = formatCurrency(product.price);
        if(product.discountPercentage)
            product.discountCurrency = formatCurrency(product.price - product.price*product.discountPercentage/100);
        return product;
    }))
    res.render("admin/pages/product/index", {
        title: "Trang quản lý sản phẩm",
        products: products,
        pagination: pagination
    })
}

module.exports.changeStatus = async (req, res) => {
    const id = req.body.id;
    const status = req.body.status;

    await Product.updateOne({_id: id}, {status})

    req.flash('success', 'Thay đổi trạng thái sản phẩm thành công!');
    res.redirect("back")
}

module.exports.changeMultiStatus = async (req, res) => {
    const ids = req.body.ids.split(" ");
    const status = req.body.status;

    await Product.updateMany({_id: {$in: ids}}, {$set: {status}})
    
    req.flash('success', 'Thay đổi trạng thái tất cả sản phẩm thành công!');
    res.redirect("back")
}

module.exports.removeProduct = async (req, res) => {
    const id = req.body.id;
    await Product.updateOne({_id: id}, {deleted: true, deletedAt: new Date()})

    req.flash('removeSuccess', 'Xóa sản phẩm thành công!');
    res.redirect("back")
}

module.exports.removeMultiProduct = async (req, res) => {
    const ids = req.body.ids.split(" ");
    await Product.updateMany({_id: {$in: ids}}, {$set: {deleted: true, deletedAt: new Date()}})

    req.flash('removeSuccess', 'Xóa tất cả sản phẩm thành công!');
    res.redirect("back")
}

module.exports.undoRemoveProduct = async (req, res) => {
    const latestRemoveProduct = await Product.findOne().sort({ deletedAt: -1 });
    await Product.updateMany({deletedAt: latestRemoveProduct.deletedAt}, {deleted: false})

    req.flash('success', 'Khôi phục sản phẩm thành công!');
    res.redirect("back")
}

module.exports.createProductView = (req, res) => {
    res.render("admin/pages/product/create.pug", {title: "Tao san pham"})
}

module.exports.createProduct = async (req, res) => {
    const countProducts = await Product.countDocuments({});
    const newProduct = new Product({
        title: req.body.title,
        description: req.body.description || "Sản phẩm này không có mô tả.",
        price: parseInt(req.body.price),
        discountPercentage: Number(req.body.discountPercentage),
        stock: parseInt(req.body.stock),
        status: req.body.status,
        position: countProducts + 1,
        thumbnail: `/uploads/${req.file.filename}`
    })
    await newProduct.save(newProduct);

    req.flash('success', 'Tạo mới sản phẩm thành công!');
    res.redirect("/admin/product")
}

module.exports.updateProductView = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({_id: id});

    res.render("admin/pages/product/update.pug", {title: "Sua san pham", product: product,})
}

module.exports.updateProduct = async (req, res) => {
    let thumbnail = req.body.thumbnail;
    if(req.file) thumbnail = `/uploads/${req.file.filename}`
    await Product.updateOne({_id: req.params.id}, {
        title: req.body.title,
        description: req.body.description || "Sản phẩm này không có mô tả.",
        price: parseInt(req.body.price),
        discountPercentage: Number(req.body.discountPercentage),
        stock: parseInt(req.body.stock),
        status: req.body.status,
        thumbnail: thumbnail
    });

    req.flash('success', 'Chỉnh sửa sản phẩm thành công!');
    res.redirect("/admin/product")
}

module.exports.detailProduct = async (req, res) => {
    const id = req.params.id;
    const product = await Product.findOne({_id: id});

    res.render("admin/pages/product/detail.pug", {title: "Sua san pham", product: product,})
}
