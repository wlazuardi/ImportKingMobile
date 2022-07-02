+function () {
    var price = 0,
        subTotal = 0,
        qty = 0,
        globalTotalPrice = 0;

    var calculateTotalPrice = function() {
        var totalPrice = 0;

        $('.input-Qty').each(function (index, item) {
            var price = $(item).attr('data-price');
            var qty = $(item).val();
            var subTotal = price * qty;

            if (!isNaN(subTotal)) {
                totalPrice += subTotal;
            }
        });

        globalTotalPrice = totalPrice;

        $('#totalPrice').html('IDR. ' + App.Utils.formatCurrency(totalPrice));
    }

    var reloadStockOutTemp = function () {
        $('.app-content').progressBar();
        var warehouseId = $('#warehouses').val();

        $.ajax({
            url: 'https://importking.mooo.com/api/StockOutTemps?email=' + userMail + '&warehouseId=' + warehouseId,
            method: 'GET',
            success: function (data) {
                var totalList = '';

                $.each(data, function (index, item) {
                    var stockOutTempId = item.stockOutTempId;
                    var productId = item.productId;
                    var qty = item.qty;
                    var categoryName = item.categoryName;
                    var brand = item.brand + ' ' + item.typeName;
                    var price = item.price;
                    var colorCode = item.colorCode;
                    var colorName = item.colorName;
                    var subTotal = (price * qty) || 0;
                    var textClass = App.Utils.isHexLight(colorCode) ? 'text-dark' : 'text-light';

                    var list = '<li class="row mb-3">' +
                        '<div class="col-7">' +
                        '<input type="hidden" name="stockOutTempId" value="' + stockOutTempId + '">' +
                        '<input type="hidden" name="productId" value="' + productId + '">' +
                        '<input type="hidden" name="price" value="' + price + '">' +
                        '<div class="title">' + categoryName + '</div>' +
                        '<div>' + brand + '</div>' +
                        '<span class="badge text-capitalize ' + textClass + '" style="background:' + colorCode + ';">' + colorName + '</span > ' +
                        '<span>IDR. ' + App.Utils.formatCurrency(price) + '</span>' +
                        '<div class="small fw-bold input-subTotal">SubTotal = IDR. ' + App.Utils.formatCurrency(subTotal) + '</div>' +
                        '</div>' +
                        '<div class="col-5 text-center">' +
                        '<button class="btn btn-primary px-1 btn-sm btn-Qty-Min"><i class="material-icons md-remove"></i></button>' +
                        '<input name="qtyEdit" type="number" data-price="' + price + '" class="form-control input-Qty d-inline form-control-sm mx-1 px-1 stockOutItem" value="' + qty + '">' +
                        '<button class="btn btn-primary px-1 btn-sm btn-Qty-Plus"><i class="material-icons md-add"></i></button>' +
                        '<div class="mt-2 text-left"><a class="btn-Delete py-1 px-1 btn btn-danger btn-sm text-white"><i class="material-icons md-delete"></i> Remove</a></div>' +
                        '</div>' +
                        '</li>';

                    totalList += list;
                });

                if (totalList == '') {
                    var item = '';
                    $('#productList').html(item);
                    $('#btnSubmit').attr('disabled', 'disabled');
                }
                else {
                    $('#productList').html(totalList);
                    $('#btnSubmit').removeAttr('disabled');
                }

                $('.app-content').progressBar('hide');
                calculateTotalPrice();
            },
            fail: function () {
                $('.app-content').progressBar('hide');
            }
        });
    };

    $(document).ready(function () {
        $('#warehouses').val(2);

        $.ajax({
            url: 'https://importking.mooo.com/api/Warehouses/Search',
            success: function (data) {
                $('#warehouses').select2({
                    data: data.results,
                    placeholder: 'Please select warehouse'
                });
                $('#warehouses').trigger('change');
            }
        });

        $('#warehouses').change(function () {
            var value = $(this).val();
            if (!value)
                $('#btnAddProduct').attr('disabled', 'disabled');
            else {
                $('#btnAddProduct').removeAttr('disabled');
                reloadStockOutTemp();
            }            
        });

        $('#btnAddProduct').click(function () {
            var modal = new App.Modal();

            var item =
                '<form id="addForm" class="mb-3">' +
                    '<div class="mb-2 form-group">' + 
                        '<label class="form-label">Category</label>' + 
                        '<div>' + 
                            '<input id="categories" name="categoryId" type="text" class="form-control bg-light" />' + 
                        '</div>' + 
                    '</div>' + 
                    '<div class="mb-2 form-group">' +
                        '<label class="form-label">Type</label>' + 
                        '<div>' + 
                            '<input id="types" name="typeId" type="text" class="form-control bg-light" />' + 
                        '</div>' + 
                    '</div>' + 
                    '<div class="mb-2 form-group">' +
                        '<label class="form-label">Color</label>' +
                        '<div>' +
                            '<input id="colors" name="colorId" type="text" class="form-control bg-light" />' +
                            '<input id="productId" name="productId" type="hidden" class="form-control bg-light" />' +
                        '</div>' +
                    '</div>' +
                    '<div class="mb-2 row form-group">' +
                        '<label class="col-6 form-label">Quantity</label>' +
                        '<label class="col-6 form-label">Current Stock</label>' +
                        '<div class="col-6">' +
                            '<button type="button" class="btn btn-primary px-1 btn-sm btn-Qty-Min">' +
                                '<i class="material-icons md-remove"></i>' +
                            '</button>' +
                            '<input name="qty" type="number" class="form-control input-Qty d-inline form-control-sm mx-1 px-1" value="1">' +
                            '<button type="button" class="btn btn-primary px-1 btn-sm btn-Qty-Plus">' +
                                '<i class="material-icons md-add"></i>' +
                            '</button>' +
                        '</div>' +
                        '<div class="col-6">' +
                            '<input name="stock" type="number" class="form-control d-inline form-control-sm mx-1" disabled="disabled">' +
                        '</div>' +
                    '</div>' +
                    '<div class="mt-2 form-group">' +
                        '<label class="form-label">Comments (Optional)</label>' +
                        '<div>' +
                            '<textarea class="form-control bg-white" name="comments"></textarea>' +
                        '</div>' +
                    '</div>' +
                    '<div class="mt-3 form-group">' +
                        '<div class="form-check form-switch">' +
                            '<input class="form-check-input" type="checkbox" id="switchDeductStock" checked="checked">' +
                            '<label class="form-check-label" for="switchDeductStock">Deduct warehouse stock</label>' +
                        '</div>' +
                    '</div>' +
                    '<div class="mt-3 form-group">' +
                        '<label class="form-label">Total Price</label>' +
                        '<div><span id="priceUnit">IDR. 0</span> x <span id="spanQty">1</span> = <span id="priceSubTotal" class="font-weight-bolder">IDR. 0</span></div>' +
                    '</div>' +
                '</form>';

            modal.show('Add Stock Out Item', item, '', {
                'Add Item': function () {
                    $('#addForm').validate({
                        rules: {
                            categoryId: {
                                required: true,
                                min: 0
                            },
                            typeId: {
                                required: true,
                                min: 0
                            },
                            colorId: {
                                required: true,
                                min: 0
                            },
                            qty: {
                                required: true,
                                number: true,
                                min: 1
                            }
                        },
                        submitHandler: function () {
                            var formData = App.Utils.getFormData($('#addForm'));
                            var warehouseId = $('#warehouses').val();                            
                            var data = {
                                email: userMail,
                                warehouseId: warehouseId,
                                productId: formData.productId,
                                qty: formData.qty,
                                price: price,
                                subTotal: subTotal,
                                comments: formData.comments,
                                isDeductStock: $('#switchDeductStock').is(':checked')
                            };

                            $('#modal' + modal.id + ' .modal-body').progressBar();
                            
                            $.ajax({
                                url: 'https://importking.mooo.com/api/StockOutTemps',
                                data: JSON.stringify(data),
                                method: 'POST',
                                dataType: 'JSON',
                                contentType: "application/json; charset=utf-8",
                                success: function () {
                                    $('#modal' + modal.id + ' .modal-body').progressBar('hide');
                                    modal.hide();
                                    reloadStockOutTemp();
                                },
                                fail: function () {
                                    $('#modal' + modal.id + ' .modal-body').progressBar('hide');
                                    App.Alert.show('danger', 'Failed', 'Failed to add product to stock out');
                                    modal.hide();
                                    reloadStockOutTemp();
                                }
                            });
                        }
                    });

                    $('#addForm').submit();
                }
            }, function () {
                var warehouseId = $('#warehouses').val();

                $('#modal' + modal.id + ' .modal-body').progressBar();

                $.ajax({
                    url: 'https://importking.mooo.com/api/Warehouses/' + warehouseId + '/Categories',
                    success: function (data) {
                        var results = $.map(data, function (item) {
                            return {
                                id: item.categoryId,
                                text: item.name
                            };
                        });

                        results.unshift({ text: 'Please select', id: 0 });
                        results.push({ text: 'Others', id: -1 });

                        $('#categories').select2({
                            data: results,
                            dropdownParent: $('#categories').parents('.modal').get(0),
                            placeholder: 'Please select category'
                        });

                        $('#types').select2({
                            data: [],
                            placeholder: 'Please select type'
                        });

                        $('#colors').select2({
                            data: [],
                            placeholder: 'Please select color'
                        });

                        $('#modal' + modal.id + ' .modal-body').progressBar('hide');
                    },
                    fail: function () {
                        $('#modal' + modal.id + ' .modal-body').progressBar('hide');
                    }
                });
            });

            $(document).off('change', '#categories').on('change', '#categories', function () {
                var warehouseId = $('#warehouses').val();
                var categoryId = $(this).val();

                $('#types').val('');
                $('#colors').val('');

                $('#types').select2({
                    data: [],
                    placeholder: 'Please select type',
                    dropdownParent: $('#types').parents('.modal').get(0)
                });

                $('#colors').select2({
                    data: [],
                    placeholder: 'Please select color',
                    dropdownParent: $('#colors').parents('.modal').get(0)
                });

                if (warehouseId && categoryId) {
                    $.ajax({
                        url: 'https://importking.mooo.com/api/Warehouses/' + warehouseId + '/Categories/' + categoryId + '/Types',
                        success: function (data) {
                            var results = $.map(data, function (item) {
                                return {
                                    id: item.typeId,
                                    text: item.brand + ' ' + item.name
                                };
                            });

                            results.unshift({ text: 'Please select', id: 0 });

                            $('#types').select2({
                                data: results,
                                dropdownParent: $('#types').parents('.modal').get(0),
                                placeholder: 'Please select type'
                            });
                        }
                    });
                }
            });

            $(document).off('change', '#types').on('change', '#types', function () {
                var warehouseId = $('#warehouses').val();
                var categoryId = $('#categories').val();
                var typeId = $(this).val();

                $('#colors').val('');

                if (warehouseId && categoryId && typeId) {
                    $.ajax({
                        url: 'https://importking.mooo.com/api/Warehouses/' + warehouseId + '/Categories/' + categoryId + '/Types/' + typeId + '/Colors',
                        success: function (data) {
                            var results = $.map(data, function (item) {
                                return {
                                    id: item.colorId,
                                    text: item.name,
                                    colorCode: item.colorCode
                                };
                            });

                            results.unshift({ text: 'Please select', id: 0 });

                            var formatData = function (data) {
                                if (data.colorCode)
                                    return "<span class='color-code d-inline-block m-1 mr-1 float-left' style='background:" + data.colorCode + "'></span> <span class='align-middle'>" + data.text + "</span>";

                                return "<span class='align-middle'>" + data.text + "</span>";
                            }

                            $('#colors').select2({
                                data: results,
                                placeholder: 'Please select color',
                                dropdownParent: $('#colors').parents('.modal').get(0),
                                templateResult: formatData,
                                templateSelection: formatData,
                                escapeMarkup: function (m) { return m; }
                            });
                        }
                    });
                }
                else {
                    $('#colors').select2({
                        data: [],
                        placeholder: 'Please select color',
                        dropdownParent: $('#colors').parents('.modal').get(0)
                    });
                }
            });

            $(document).off('change', '#colors').on('change', '#colors', function () {
                var warehouseId = $('#warehouses').val();
                var categoryId = $('#categories').val();
                var typeId = $('#types').val();
                var colorId = $(this).val();

                if (warehouseId && categoryId && typeId && colorId) {
                    $('#modal' + modal.id + ' .modal-body').progressBar();
                    $.ajax({
                        url: 'https://importking.mooo.com/api/Warehouses/' + warehouseId + '/Categories/' + categoryId + '/Types/' + typeId + '/Colors/' + colorId + '/Products',
                        success: function (data) {
                            $('#modal' + modal.id + ' .modal-body').progressBar('hide');
                            price = data[0].price;
                            qty = parseInt($('[name=qty]').val());
                            subTotal = price * qty;

                            $('#priceUnit').html('IDR. ' + App.Utils.formatCurrency(price));
                            $('#spanQty').html(qty);
                            $('#priceSubTotal').html('IDR. ' + App.Utils.formatCurrency(subTotal));
                            $('[name=stock]').val(data[0].stock);
                            $('[name=productId]').val(data[0].productId);
                        },
                        fail: function () {
                            $('#modal' + modal.id + ' .modal-body').progressBar('hide');
                        }
                    });
                }
            });
        });

        reloadStockOutTemp();

        var recalculatePrice = function () {
            qty = parseInt($('[name=qty]').val());
            subTotal = price * qty;
            $('#priceUnit').html('IDR. ' + App.Utils.formatCurrency(price));
            $('#spanQty').html(qty);
            $('#priceSubTotal').html('IDR. ' + App.Utils.formatCurrency(subTotal));
        };

        var recalculatePriceEdit = function (elem) {
            var qtyEdit = parseInt($(elem).val());
            var priceEdit = $(elem).attr('data-price');
            var subTotalEdit = priceEdit * qtyEdit;
            
            if (priceEdit && qtyEdit) {
                subTotalEdit = priceEdit * qtyEdit;

                var stockOutTempId = $(elem).parents('.row').find('[name=stockOutTempId]').val();
                $('.app-content').progressBar();
                $.ajax({
                    url: 'https://importking.mooo.com/api/StockOutTemps',
                    data: JSON.stringify({
                        stockOutTempId: stockOutTempId,
                        qty: qtyEdit,
                        price: priceEdit,
                        subTotal: subTotalEdit
                    }),
                    method: 'PATCH',
                    dataType: 'JSON',
                    contentType: 'application/json; charset=utf-8',
                    success: function () {
                        $('.app-content').progressBar('hide');
                    },
                    fail: function () {
                        $('.app-content').progressBar('hide');
                    }
                });

                subTotalEdit = App.Utils.formatCurrency(subTotalEdit);
                $(elem).parents('.row').find('.input-subTotal').html('SubTotal = IDR.' + subTotalEdit);                
            }
        };

        $(document).on('click', '.btn-Qty-Min', function () {
            var qty = $(this).siblings('.input-Qty').val() || 0;
            qty--;
            if (qty >= 1) {
                $(this).siblings('.input-Qty').val(qty);
                $(this).siblings('.input-Qty').trigger('change');
            }
        });

        $(document).on('click', '.btn-Qty-Plus', function () {
            var qty = $(this).siblings('.input-Qty').val() || 0;
            qty++;
            if (qty <= 100) {
                $(this).siblings('.input-Qty').val(qty);
                $(this).siblings('.input-Qty').trigger('change');
            }
        });

        $(document).on('change', '.input-Qty', function () {
            if ($(this).hasClass('stockOutItem')) {
                recalculatePriceEdit(this);
                calculateTotalPrice();
            }
            else {
                recalculatePrice();
            }
        });

        $(document).off('click', '.btn-Delete').on('click', '.btn-Delete', function () {
            var stockOutTempId = $(this).parents('.row').find('[name=stockOutTempId]').val();
            var rowHtml = $(this).parents('.row').find('.col-7').html();
            App.Confirm.show('Confirm', 'Are you sure want to delete this item? ' + '<div>' + rowHtml + '</div>', function () {
                $('.app-content').progressBar();
                $.ajax({
                    url: 'https://importking.mooo.com/api/StockOutTemps/' + stockOutTempId,
                    method: 'DELETE',
                    success: function (data) {
                        App.Alert.show('success', 'Success', 'Success to remove cart item');                        
                        reloadStockOutTemp();
                        $('.app-content').progressBar('hide');
                    },
                    fail: function () {
                        App.Alert.show('danger', 'Failed', 'Failed to remove cart item');
                        reloadStockOutTemp();
                        $('.app-content').progressBar('hide');
                    }
                });
            });
        });

        $(document).on('click', '#btnSubmitStockOut', function () {
            var modal = new App.Modal();

            var item =
                '<form id="submitForm" class="mb-3">' +
                    '<div class="mb-2 form-group">' +
                        '<label class="form-label">Comments (Optional)</label>' +
                        '<div>' +
                            '<textarea class="form-control bg-white" name="submitComments"></textarea>' +
                        '</div>' +
                    '</div>' +
                '</form>';

            modal.show('Submit Stock Out Item', item, '', {
                'Submit': function () {
                    $('.app-content').progressBar();

                    $('#submitForm').validate({
                        submitHandler: function () {
                            var warehouseId = $('#warehouses').val();
                            var formData = App.Utils.getFormData($('#submitForm'));
                            $.ajax({
                                url: 'https://importking.mooo.com/api/StockOutTemps/Submit',
                                data: JSON.stringify({
                                    email: userMail,
                                    warehouseId: warehouseId,
                                    comments: formData.submitComments
                                }),
                                dataType: 'JSON',
                                contentType: "application/json; charset=utf-8",
                                method: 'POST',
                                success: function () {
                                    App.Alert.show('success', 'Success', 'Success to submit stock out');
                                    $('.app-content').progressBar('hide');
                                    reloadStockOutTemp();
                                    modal.hide();
                                },
                                fail: function () {
                                    App.Alert.show('danger', 'Failed', 'Failed to submit stock out');
                                    $('.app-content').progressBar('hide');
                                }
                            });
                        }
                    });

                    $('#submitForm').submit();
                }
            });
        });
    });
}();