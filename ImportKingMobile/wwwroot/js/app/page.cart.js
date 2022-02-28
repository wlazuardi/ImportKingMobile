+function () {
    var globalTotalPrice = 0;

    function CalculateTotalPrice() {
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

    function ReloadCart() {
        $('#spinner').show();

        $.ajax({
            url: 'https://importking.mooo.com/api/Carts?email=' + userMail,
            method: 'GET',
            success: function (data) {
                var totalList = '';

                $.each(data, function (index, item) {
                    var cartId = item.cartId;
                    var productId = item.productId;
                    var qty = item.qty;
                    var categoryName = item.categoryName;
                    var brand = item.brand + ' ' + item.typeName;
                    var price = item.price;
                    var colorCode = item.colorCode;
                    var colorName = item.colorName;
                    var subTotal = (price * qty) || 0;

                    var list = '<li class="row mb-3">' +
                        '<div class="col-7">' +
                        '<input type="hidden" name="cartId" value="' + cartId + '">' +
                        '<input type="hidden" name="productId" value="' + productId + '">' +
                        '<input type="hidden" name="price" value="' + price + '">' +
                        '<div class="title">' + categoryName + '</div>' +
                        '<div>' + brand + '</div>' +
                        '<span class="badge text-capitalize" style="background:' + colorCode + ';">' + colorName + '</span > ' +
                        '<span>IDR. ' + App.Utils.formatCurrency(price) + '</span>' +
                        '<div class="small fw-bold input-subTotal">SubTotal = IDR. ' + App.Utils.formatCurrency(subTotal) + '</div>' +
                        '</div>' +
                        '<div class="col-5 text-center">' +
                        '<button class="btn btn-primary px-1 btn-sm btn-Qty-Min"><i class="material-icons md-remove"></i></button>' +
                        '<input name="qty" type="number" data-price="' + price + '" class="form-control input-Qty d-inline form-control-sm mx-1" value="' + qty + '">' +
                        '<button class="btn btn-primary px-1 btn-sm btn-Qty-Plus"><i class="material-icons md-add"></i></button>' +
                        '<div class="mt-2 text-left"><a class="btn-Delete py-1 px-1 btn btn-danger btn-sm text-white"><i class="material-icons md-delete"></i> Remove</a></div>' +
                        '</div>' +
                        '</li>';

                    totalList += list;
                });

                $('#productList').html(totalList);

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
                        $(this).parents('.row').find('.input-subTotal').html('SubTotal = IDR.' + total);
                    }

                    CalculateTotalPrice();
                });

                CalculateTotalPrice();

                $('#spinner').hide();

                $('.btn-Delete').off('click').click(function () {
                    var cartId = $(this).parents('.row').find('[name=cartId]').val();
                    var rowHtml = $(this).parents('.row').find('.col-7').html();
                    App.Confirm.show('Confirm', 'Are you sure want to delete this item? ' + '<div>' + rowHtml + '</div>', function () {
                        $('.app-content').progressBar();
                        $.ajax({
                            url: 'https://importking.mooo.com/api/Carts/' + cartId,
                            method: 'DELETE',
                            success: function (data) {
                                App.Alert.show('success', 'Success', 'Success to remove cart item');                                
                                ReloadCart();
                                $('.app-content').progressBar('hide');
                            },
                            fail: function () {
                                App.Alert.show('danger', 'Failed', 'Failed to remove cart item');
                                $('.app-content').progressBar('hide');
                            }
                        });
                    });
                });
            },
            fail: function () {
                $('#spinner').hide();
            }
        });
    }

    $(document).ready(function () {
        //productList
        ReloadCart();

        var modal = new App.Modal();

        var item = '<form id="orderForm" novalidate="novalidate">' + 
            '<div class="mb-3">' + 
            '<label class="form-label">Name</label>' + 
            '<div>' + 
            '<input class="form-control" placeholder="Name" name="shippingName" type="text">' + 
            '</div>' + 
            '</div>' +
            '<div class="mb-3">' +
            '<label class="form-label">Phone</label>' +
            '<div>' +
            '<input class="form-control" placeholder="Phone" name="shippingPhone" type="text">' +
            '</div>' +
            '</div>' +
            '<div class="mb-3">' +
            '<label class="form-label">Delivery Address</label>' +
            '<div>' +
            '<textarea class="form-control" placeholder="Street Address With No. / Building / Unit" name="shippingAddress"></textarea>' +
            '</div>' +
            '</div>' +
            '<div class="mb-3">' +
            '<label class="form-label">City</label>' +
            '<div>' +
            '<input class="form-control" placeholder="City" name="shippingCity" type="text">' +
            '</div>' +
            '</div>' +
            '<div class="mb-3">' +
            '<label class="form-label">Province</label>' +
            '<div>' +
            '<input class="form-control" placeholder="Province" name="shippingProvince" type="text">' +
            '</div>' +
            '</div>' +
            '<div class="mb-3">' +
            '<label class="form-label">Zip Code</label>' +
            '<div>' +
            '<input class="form-control" placeholder="Zip Code" name="shippingZipCode" type="text">' +
            '</div>' +
            '</div>' +
            '<div class="mb-3">' +
            '<label class="form-label">Courier</label>' +
            '<div>' +
            '<select class="form-control" placeholder="Courier" name="shippingCourier">' +
            '<option value="TIKI">TIKI</option>' +
            '<option value="JNE">JNE</option>' +
            '<option value="J&T">J&T</option>' +
            '<option value="Ninja Express">Ninja Express</option>' +
            '</select>' +
            '</div>' +
            '</div>' +
            '</form>';

        $('#btnSubmit').click(function (e) {
            modal.show('Submit Order', item, 'modal-dialog-long', {
                'Submit': function () {
                    var $oderForm = $('#orderForm');

                    $oderForm.validate({
                        rules: {
                            shippingName: {
                                required: true                                
                            },
                            shippingPhone: {
                                required: true
                            },
                            shippingAddress: {
                                required: true,
                                maxlength: 250
                            },
                            shippingCity: {
                                required: true,
                                maxlength: 50
                            },
                            shippingProvince: {
                                required: true,
                                maxlength: 50
                            },
                            shippingZipCode: {
                                required: true,
                                digits: true
                            },
                            shippingCourier: {
                                required: true
                            }
                        },
                        submitHandler: function () {
                            var formData = App.Utils.getFormData($oderForm);
                            formData['email'] = userMail;
                            formData['orderValue'] = globalTotalPrice;
                            formData['status'] = 'New';
                            formData['orderNo'] = 'X';
                            $.ajax({
                                url: 'https://importking.mooo.com/api/Orders',
                                data: JSON.stringify(formData),
                                method: 'POST',
                                dataType: 'JSON',
                                contentType: "application/json; charset=utf-8",
                                success: function (data) {
                                    $oderForm.progressBar('show');
                                    App.Alert.show('success', "Success", "Your order submitted successfully", function () {
                                        modal.hide();
                                    });
                                    modal.hide();
                                    ReloadCart();
                                }
                            }).fail(function (xhr, status, error) {
                                $oderForm.progressBar('hide');
                                App.Alert.show('danger', "Error", xhr.responseText);
                            });;
                        }
                    });

                    $oderForm.submit();
                }
            });
        });
    });
}();