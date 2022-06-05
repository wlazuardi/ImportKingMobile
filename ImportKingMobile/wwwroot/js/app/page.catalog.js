+function () {
    $.ajax({
        url: 'https://importking.mooo.com/api/Catalogs?length=50',
        crossDomain: true,
        dataType: 'json',
        success: function (data) {
            if (data.length > 0) {

            }

            var products = '';

            if (data.products) {
                $.each(data.products, function (index, item) {
                    var str = item.categoryName;
                    var matches = str.match(/\b(\w)/g); // ['J','S','O','N']
                    var acronym = matches.join(''); // JSON;

                    var isAvailable = false;
                    if (item.stock > 0) {
                        isAvailable = true;
                    }

                    var textClass = App.Utils.isHexLight(item.colorCode) ? 'text-dark' : 'text-light';

                    products += '<li class="nav-item">' +
                        '<a href="" class="icontext" >' +                            
                            '<span class="icon icon-sm rounded">' + acronym.toUpperCase() + '</span>' +
                            '<div class="text"><h6 class="title">' + item.categoryName + ' / ' + item.brand + ' - ' + item.typeName + (isAvailable == false ? '<i class="icon material-icons md-block text-danger ml-2" style="background:none;"></i>' : '') + '</h6>' +
                            '<span class="badge text-capitalize ' + textClass + '" style="background:' + item.colorCode + ';">' + item.colorName + '</span>' +
                            '</div> '
                        '</a>'
                    '</li>';
                });

                var html = $('#productList').html();
                $('#productList').html(html + products);
            }
        }
    });
}();