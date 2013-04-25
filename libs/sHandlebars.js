var fs = require('fs'),
	hbs = require('handlebars');


/**
 * get header template compiled and ready
 */
hbs.registerPartial('topnav', fs.readFileSync('./views/common/topnav.html', 'utf8'));
hbs.registerPartial('_header', fs.readFileSync('./views/common/_header.html', 'utf8'));
hbs.registerPartial('header', fs.readFileSync('./views/common/header.html', 'utf8'));
hbs.registerPartial('headerSmall', fs.readFileSync('./views/common/headerSmall.html', 'utf8'));
hbs.registerPartial('footer', fs.readFileSync('./views/common/footer.html', 'utf8'));
hbs.registerPartial('wpo', fs.readFileSync('./views/common/wpo.html', 'utf8'));


hbs.registerPartial('breadcrumbs', fs.readFileSync('./views/category/breadcrumbs.html', 'utf8'));
hbs.registerPartial('categories', fs.readFileSync('./views/category/menu.html', 'utf8'));
hbs.registerPartial('categoryProducts', fs.readFileSync('./views/search/grid.html', 'utf8'));

hbs.registerPartial('basketItem', fs.readFileSync('./views/my/basketItem.html', 'utf8'));

hbs.registerPartial('product_grid_api', fs.readFileSync('./views/common/productGrid.html', 'utf8'));
hbs.registerPartial('productDetail', fs.readFileSync('./views/common/productDetail.html', 'utf8'));

hbs.registerPartial('grid', fs.readFileSync('./views/search/grid.html',  'utf8'));


exports = hbs;