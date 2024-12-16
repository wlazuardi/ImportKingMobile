+function () {
    $(document).ready(function () {
        $('#preloader').show();

        $('#registerForm').validate({
            rules: {
                firstName: {
                    required: true,
                    maxlength: 50
                },
                lastName: {
                    required: true,
                    maxlength: 50
                },
                email: {
                    required: true,
                    email: true
                },
                phoneNumber: {
                    required: true,
                    digits: true
                }
            },
            submitHandler: function () {
                $form = $('#registerForm');

                var formData = App.Utils.getFormData($form);
                formData.email = $('[name=email]').val();
                formData.userType = $('[name=userTypeId]').val();

                $('#preloader').show();

                $.ajax({
                    url: hostUrl + '/api/Users/Profile',
                    data: JSON.stringify(formData),
                    method: 'PATCH',
                    dataType: 'JSON',
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        $('#preloader').hide();
                        App.Alert.show('success', "Success", "Update profile succeed");
                        $('#btnCancel').click();
                    }
                }).fail(function (xhr, status, error) {
                    $('#preloader').hide();
                    App.Alert.show('danger', "Error", xhr.responseText);
                });
            }
        });

        $.ajax({
            url: hostUrl + '/api/Users/GetByEmail/' + $('[name=email]').val(),
            method: 'GET',
            dataType: 'JSON',
            contentType: "application/json; charset=utf-8",
            success: function (data) {
                $('#preloader').hide();
                $('[name=userId]').val(data.userId);
                $('[name=email]').val(data.email);
                $('[name=firstName]').val(data.firstName);
                $('[name=lastName]').val(data.lastName);
                $('[name=phoneNumber]').val(data.phoneNumber);
                $('[name=userTypeId]').val(data.userType);
                $('[name=merchantName]').val(data.merchantName);

                switch (data.userType) {
                    case 0:
                        $('[name=userType]').val('Basic User');
                        break;
                    case 1:
                        $('[name=userType]').val('Dropshipper');
                        break;
                    case 2:
                        $('[name=userType]').val('Reseller');
                        break;
                    case 3:
                        $('[name=userType]').val('Admin');
                        break;
                }

                $('#preloaderWallet').show();
                $.ajax({
                    url: hostUrl + '/api/Users/' + data.userId + '/Wallet',
                    method: 'GET',
                    dataType: 'JSON',
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        $('#preloaderWallet').hide();
                        if (data) {
                            var balance = App.Utils.formatCurrency(data.wltBal);
                            $('#walletAmount').text('IDR.' + balance);
                            $('#walletCode').val(data.wltAcctCode);
                        }
                        else {
                            $('#walletAmount').text('IDR.0');
                            $('#walletCode').val('');
                        }
                    }
                }).fail(function (xhr, status, error) {
                    $('#preloaderWallet').hide();
                    App.Alert.show('danger', "Error", xhr.responseText);
                    $('#walletAmount').text('IDR.0');
                    $('#walletCode').val('');
                });
            }
        }).fail(function (xhr, status, error) {
            $('#preloader').hide();
            App.Alert.show('danger', "Error", xhr.responseText);
        });

        $('#btnEdit').click(function () {
            $('#btnSubmit').show();
            $('#btnCancel').show();
            $('#btnEdit').hide();
            $('[name=userId]').removeAttr('disabled');
            $('[name=firstName]').removeAttr('disabled');
            $('[name=lastName]').removeAttr('disabled');
            $('[name=phoneNumber]').removeAttr('disabled');
            $('[name=merchantName]').removeAttr('disabled');
        });

        $('#btnCancel').click(function () {
            $('#btnSubmit').hide();
            $('#btnCancel').hide();
            $('#btnEdit').show();
            $('[name=userId]').attr('disabled', 'disabled');
            $('[name=firstName]').attr('disabled', 'disabled');
            $('[name=lastName]').attr('disabled', 'disabled');
            $('[name=phoneNumber]').attr('disabled', 'disabled');
            $('[name=merchantName]').attr('disabled', 'disabled');
        });

        $('#transHistoryLink').click(function () {
            var userId = $('[name=userId]').val();
            var walletCode = $('#walletCode').val();

            var modal = new App.Modal();

            $('body').progressBar();

            if (!walletCode || !userId) {
                $('body').progressBar('hide');
                modal.show('Wallet Transaction', 'No transaction was found', 'modal-on-top');
                return;
            }

            $.ajax({
                url: hostUrl + '/api/Users/' + userId + '/Wallet/' + walletCode + '/Histories',
                method: 'GET',
                dataType: 'JSON',
                contentType: "application/json; charset=utf-8",
                success: function (data) {
                    $('body').progressBar('hide');
                    var div = '';
                    if (data) {
                        $.each(data, function (i, row) {
                            var classText = row.tType == 'A' ? 'text-success' : 'text-danger';
                            var amount = App.Utils.formatCurrency(row.tAmt);
                            var sign = row.tType == 'A' ? '+' : '-';
                            div += `<li class="list-group-item">
                                        <div class="d-flex justify-content-between">
                                            <span class="fw-bold">${row.transNotes}</span>
                                            <span class="text-end">${App.Utils.formatToShortLocalDate(row.createdDate)}</span>
                                        </div>
                                        <span class="text-end ` + classText + `">${sign} IDR. ${amount}</span>
                                    </li>`;
                        });
                        div = '<ul class="list-group">' + div + '</ul>';
                        modal.show('Wallet Transaction', div, 'modal-on-top');
                    }
                    else {
                        modal.show('Wallet Transaction', 'No transaction was found', 'modal-on-top');
                    }
                }
            }).fail(function (xhr, status, error) {
                $('body').progressBar('hide');
                App.Alert.show('danger', "Error", xhr.responseText);
                modal.show('Wallet Transaction', 'No transaction was found', 'modal-on-top');
            });
        });

        $('#btnDeleteAccount').click(function () {
            $('#modalConfirmDeleteAccount').modal('show');

            $('#deleteAccountForm').validate({
                rules: {
                    confirmEmail: {
                        required: true
                    },
                    confirmPassword: {
                        required: true
                    }
                },
                submitHandler: function () {
                    var isValid = $('#deleteAccountForm').valid();
                    if (isValid) {
                        var formData = App.Utils.getFormData($('#deleteAccountForm'));

                        var userData = {};
                        userData.email = formData.confirmEmail;
                        userData.password = formData.confirmPassword;

                        $.ajax({
                            url: hostUrl + '/api/Users/DeleteAccount',
                            data: JSON.stringify(userData),
                            method: 'DELETE',
                            dataType: 'JSON',
                            contentType: "application/json; charset=utf-8",
                            success: function () {
                                $('#preloader').hide();
                                $('#modalConfirmDeleteAccount').modal('hide');
                                App.Alert.show('success', 'Success', 'User account successfully deleted');
                                setTimeout(function () {
                                    window.location.href = 'Logout';
                                }, 3000);
                            }
                        }).fail(function (xhr, status, error) {
                            $('#preloader').hide();
                            App.Alert.show('danger', "Error", xhr.statusText);
                        });
                    }
                    else {
                        console.log('Invalid form');
                    }
                }
            });
        });
    });
}();