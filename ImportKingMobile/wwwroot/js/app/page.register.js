+function () {
    $(document).ready(function () {
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
                password: {
                    required: true,
                    maxlength: 50,
                    equalTo: "[name=confirmPassword]"
                },
                confirmPassword: {
                    required: true,
                    maxlength: 50,
                    equalTo: "[name=password]"
                },
                phoneNumber: {
                    required: true,
                    digits: true
                }
            },
            messages: {
                password: {
                    equalTo: "Please enter the same password confirmation"
                },
                confirmPassword: {
                    equalTo: "Please enter the same password confirmation"
                }
            },
            submitHandler: function () {
                $form = $('#registerForm');

                var formData = App.Utils.getFormData($form);

                $('#preloader').show();

                $.ajax({
                    url: 'https://importking.mooo.com/api/Users',
                    data: JSON.stringify(formData),
                    method: 'POST',
                    dataType: 'JSON',
                    contentType: "application/json; charset=utf-8",
                    success: function (data) {
                        $('#preloader').hide();
                        App.Alert.show('success', "Success", "Registration success, you will be redirected soon", function () {
                            window.location = '/User/Profile';
                        });
                        window.setTimeout(function () {
                            window.location = '/User/Profile';
                        }, 3000);
                    }
                }).fail(function (xhr, status, error) {
                    $('#preloader').hide();
                    App.Alert.show('danger', "Error", xhr.responseText);
                });;
            }
        });
    });
}();