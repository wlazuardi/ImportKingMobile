+function () {
    $('input').change(function () {
        $('#result').html('');
    });

    $.ajax({
        url: 'https://importking.mooo.com/api/Categories/Search',
        success: function (d) {
            d.results = d.results.filter(e => e.text.toLowerCase().includes('testing') == false);            
            $('#categories').select2({
                data: d.results
            });
        }
    });

    $.ajax({
        url: 'https://importking.mooo.com/api/Types/Search',
        success: function (d) {
            d.results = d.results.filter(e => e.text.toLowerCase().includes('testing') == false);
            $('#types').select2({
                data: d.results
            });
        }
    });

    $.ajax({
        url: 'https://importking.mooo.com/api/Colors/Search',
        success: function (d) {
            d.results = d.results.filter(e => e.text.toLowerCase().includes('testing') == false);

            for (var i = 0; i < d.results.length; i++) {
                d.results[i].text = d.results[i].text.initCap();
            }

            d.results.unshift({ text: 'All Color', id: 0 });

            $('#colors').select2({
                data: d.results
            });
        }
    });

    $('#searchForm').validate({
        rules: {
            categories: {
                required: true
            },
            types: {
                required: true
            }
        },
        submitHandler: function () {
            $form = $('#searchForm');
            $('#productList').hide();
            $('#result').hide();
            $('#spinner').show();

            var formData = App.Utils.getFormData($form);

            if (formData.colors && formData.colors != '0') {
                $.ajax({
                    url: 'https://importking.mooo.com/api/Catalogs?categoryId=' + formData.categories + '&typeId=' + formData.types + '&colorId=' + formData.colors + '&length=10&start=0',
                    method: 'GET',
                    dataType: 'JSON',
                    success: function (data) {
                        $('#spinner').hide();
                        if (data.products.length > 0 && data.products[0].stock > 0) {
                            var div = '<div class="fw-bold fs-3 text-success"><div><i class="material-icons md-check_circle_outline fs-2"></i></div>Stock Available</div>';
                            $('#result').html(div);
                        }
                        else {
                            var div = '<div class="fw-bold fs-3 text-danger"><div><i class="material-icons md-highlight_off fs-2"></i></div>Stock Not Available</div>';
                            $('#result').html(div);
                        }
                        $('#result').show();
                    }
                }).fail(function (xhr, status, error) {
                    $('#spinner').hide();
                });
            }
            else {
                $.ajax({
                    url: 'https://importking.mooo.com/api/Catalogs?categoryId=' + formData.categories + '&typeId=' + formData.types + '&length=100&start=0',
                    method: 'GET',
                    dataType: 'JSON',
                    success: function (data) {
                        $('#spinner').hide();
                        if (data.products.length > 0) {
                            var items = '';
                            $.each(data.products, function (index, item) {
                                var icon = '<i class="material-icons md-highlight_off text-danger mr-0"></i>';
                                if (item.stock > 0) {
                                    icon = '<i class="material-icons md-check_circle_outline text-success mr-0"></i>';
                                }
                                var item = '<li class="nav-item">' +
                                        '<a class="icontext">' +
                                            '<div class="text">' +
                                                '<h6 class="title">' + item.categoryName + '</h6>' +
                                                '<div>' + item.brand + ' ' + item.typeName + '</div>' +
                                                '<span class="badge text-capitalize" style="background:' + item.colorCode + ';">' + item.colorName + '</span>' +
                                            '</div>' +
                                            icon +
                                        '</a>' +
                                    '</li>';

                                items += item;
                            });
                            $('#productList').html(items);
                            $('#productList').show();
                        }
                        else {
                            var div = '<div class="fw-bold fs-3 text-danger"><div><i class="material-icons md-highlight_off fs-2"></i></div>Stock Not Available</div>';
                            $('#result').html(div);
                            $('#result').show();
                        }
                    }
                }).fail(function (xhr, status, error) {
                    $('#spinner').hide();
                });
            }
        }
    });
}();