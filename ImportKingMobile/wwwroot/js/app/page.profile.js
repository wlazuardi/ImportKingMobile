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
                    url: 'https://importking.mooo.com/api/Users',
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
                });;
            }
        });

        $.ajax({
            url: 'https://importking.mooo.com/api/Users/GetByEmail/' + $('[name=email]').val(),            
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
        });

        $('#btnCancel').click(function () {
            $('#btnSubmit').hide();
            $('#btnCancel').hide();
            $('#btnEdit').show();
            $('[name=userId]').attr('disabled', 'disabled');
            $('[name=firstName]').attr('disabled', 'disabled');
            $('[name=lastName]').attr('disabled', 'disabled');
            $('[name=phoneNumber]').attr('disabled', 'disabled');
        });
    });
}();