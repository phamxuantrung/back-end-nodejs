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
    const products = await Product.find({});
    const renderProducts = products.map((product => {
        product.currency = formatCurrency(product.price);
        if(product.discountPercentage)
            product.discountCurrency = formatCurrency(product.price - product.price*product.discountPercentage/100);
        return product;
    }))
    res.render("client/pages/product/index", {
        title: "Sản Phảm",
        products: products
    });
}

module.exports.productDetail = async (req, res) => {
    const find = {
        deleted: false,
        slug: req.params.slug,
        status: "active"
    }
    const product = await Product.findOne(find)
    product.currency = formatCurrency(product.price);
    if(product.discountPercentage)
        product.discountCurrency = formatCurrency(product.price - product.price*product.discountPercentage/100);
    res.render("client/pages/product/detail", {
        title: "Sản Phảm",
        slug: req.params.slug,
        product: product
    });
}