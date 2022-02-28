+function () {
    $('document').ready(function () {
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

        var modal = new App.Modal();

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

                var url = 'https://importking.mooo.com/api/Catalogs?categoryId=' + formData.categories + '&typeId=' + formData.types + '&length=100&start=0';

                if (formData.colors && formData.colors != '0') {
                    url = 'https://importking.mooo.com/api/Catalogs?categoryId=' + formData.categories + '&typeId=' + formData.types + '&colorId=' + formData.colors + '&length=100&start=0';
                }

                $.ajax({
                    url: url,
                    method: 'GET',
                    dataType: 'JSON',
                    success: function (data) {
                        $('#spinner').hide();
                        if (data.products.length > 0) {
                            var items = '';
                            $.each(data.products, function (index, item) {
                                var btn = '';
                                if (item.stock > 0) {
                                    btn = '<div class="col-3"><button id="btn-AddCart" data-productId="' + item.productId + '" ' +
                                        'data-categoryName="' + item.categoryName + '" ' +
                                        'data-brand="' + item.brand + ' ' + item.typeName + '" ' +
                                        'data-colorCode="' + item.colorCode + '" ' +
                                        'data-colorName="' + item.colorName + '" ' +
                                        'data-price="' + item.price + '" ' +
                                        'class="btn btn-sm btn-primary btn-AddCart float-end" > Add +</button ></div >';
                                }
                                var item =
                                    '<li class="nav-item">' +
                                    '<a class="icontext">' +
                                    '<div class="col-9">' +
                                    '<h6 class="title">' + item.categoryName + '</h6>' +
                                    '<div>' + item.brand + ' ' + item.typeName + '</div>' +
                                    '<span class="badge text-capitalize" style="background:' + item.colorCode + ';">' + item.colorName + '</span>' +
                                    '<span class="mx-2">IDR. ' + App.Utils.formatCurrency(item.price) + '</span>' +
                                    '</div>' +
                                    btn +
                                    '</a>' +
                                    '</li>';

                                items += item;
                            });
                            $('#productList').html(items);
                            $('#productList').show();

                            $('.btn-AddCart').off('click').click(function () {
                                var productId = $(this).attr('data-productId');
                                var categoryName = $(this).attr('data-categoryName');
                                var brand = $(this).attr('data-brand');
                                var colorCode = $(this).attr('data-colorCode');
                                var colorName = $(this).attr('data-colorName');
                                var price = $(this).attr('data-price');

                                var item =
                                    '<div class="row">' +
                                    '<div class="col-7">' +
                                    '<input type="hidden" name="productId" value="' + productId + '">' +
                                    '<input type="hidden" name="price" value="' + price + '">' +
                                    '<div class="title">' + categoryName + '</div>' +
                                    '<div>' + brand + '</div>' +
                                    '<span class="badge text-capitalize" style="background:' + colorCode + ';">' + colorName + '</span > ' +
                                    '<span>IDR. ' + App.Utils.formatCurrency(price) + '</span>' +
                                    '</div>' +
                                    '<div class="col-5">' +
                                    '<button class="btn btn-primary px-1 btn-sm btn-Qty-Min"><i class="material-icons md-remove"></i></button>' +
                                    '<input name="qty" type="number" data-price="' + price + '" class="form-control input-Qty d-inline form-control-sm mx-1" value="1">' +
                                    '<button class="btn btn-primary px-1 btn-sm btn-Qty-Plus"><i class="material-icons md-add"></i></button>' +
                                    '</div>' +
                                    '</div>' +
                                    '<div class="row mt-2">' +
                                    '<div class="col-12">' +
                                    '<span class="float-start">Total Price:</span>' +
                                    '<span class="float-end input-TotalPrice">IDR.' + App.Utils.formatCurrency(price) + '</span>' +
                                    '</div>' +
                                    '</div>';

                                modal.show('Add to Cart', item, '', {
                                    'Add to Cart': function () {
                                        var productId = $('[name=productId]').val();
                                        var price = $('[name=price]').val();
                                        var qty = $('[name="qty"]').val();

                                        if (qty) {

                                            $('.modal').progressBar('show');
                                            $.ajax({
                                                url: 'https://importking.mooo.com/api/Carts',
                                                method: 'POST',
                                                data: JSON.stringify({
                                                    email: userEmail,
                                                    productId: productId,
                                                    price: price,
                                                    qty: qty
                                                }),
                                                dataType: 'JSON',
                                                contentType: "application/json; charset=utf-8",
                                                success: function () {
                                                    $('.modal').progressBar('hide');
                                                    App.Alert.show('success', 'Success', 'Product has been added to cart');
                                                    modal.hide();
                                                },
                                                fail: function () {
                                                    $('.modal').progressBar('hide');
                                                    App.Alert.show('danger', 'Failed', 'Failed to add product to cart');
                                                    modal.hide();
                                                }
                                            });
                                        }
                                    }
                                });

                                $('.input-Qty').trigger('change');

                                $('.btn-Qty-Min').off('click').click(function () {
                                    var qty = $(this).siblings('.input-Qty').val() || 0;
                                    qty--;
                                    if (qty >= 1) {
                                        $(this).siblings('.input-Qty').val(qty);
                                        $(this).siblings('.input-Qty').trigger('change');
                                    }
                                });

                                $('.btn-Qty-Plus').off('click').click(function () {
                                    var qty = $(this).siblings('.input-Qty').val() || 0;
                                    qty++;
                                    if (qty <= 100) {
                                        $(this).siblings('.input-Qty').val(qty);
                                        $(this).siblings('.input-Qty').trigger('change');
                                    }
                                });

                                $('.input-Qty').off('change').change(function () {
                                    var price = $(this).attr('data-price');
                                    var qty = $(this).val();

                                    if (price && qty) {
                                        var total = price * qty;
                                        total = App.Utils.formatCurrency(total);
                                        $('.input-TotalPrice').html('IDR.' + total);
                                    }
                                });
                            });
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
        });
    });
}();