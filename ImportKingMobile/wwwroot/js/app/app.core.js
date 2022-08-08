var App = {};

+function () {
    var Utils = function () {
    };

    Utils.prototype.getFormData = function ($form) {
        var unindexedArray = $form.serializeArray();
        var indexedArray = {};

        $.map(unindexedArray, function (n, i) {
            indexedArray[n['name']] = n['value'];
        });

        return indexedArray;
    };

    Utils.prototype.formatCurrency = function (number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };

    Utils.prototype.isHexLight = function (color) {
        const hex = color.replace('#', '');
        const c_r = parseInt(hex.substr(0, 2), 16);
        const c_g = parseInt(hex.substr(2, 2), 16);
        const c_b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((c_r * 299) + (c_g * 587) + (c_b * 114)) / 1000;
        return brightness > 155;
    };

    Utils.prototype.formatToLocalDate = function (date) {
        var utcDate = new Date(date);
        var offset = new Date().getTimezoneOffset();
        var localDate = new Date(utcDate.getTime() - (offset * 60000));
        return moment(localDate).format('ddd, DD-MM-YYYY @ HH:mm:ss');
    };

    App.Utils = new Utils();

    var Confirm = function () {
        this.id = 0;
        this.init();
    };

    Confirm.prototype.init = function () {
        this.id = Date.now();
    };

    Confirm.prototype.show = function (title, message, callback) {
        if (!title)
            title = 'Confirmation';

        if (!message)
            message = 'Are you sure you want to do this?';

        var popup = '<div id="confirm' + this.id + '" class="modal" tabindex="-1" role="dialog">' +
            '<div class="modal-dialog" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<h5 class="modal-title">' + title + '</h5>' +
            '<button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">' +
            '<span aria-hidden="true">&times;</span>' +
            '</button>' +
            '</div>' +
            '<div class="modal-body">' +
            message +
            '</div>' +
            '<div class="modal-footer">' +
            '<button type="button" class="btn btn-yes btn-primary">Yes</button>' +
            '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">No</button>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        $('#confirm' + this.id).remove();

        $('html body').append(popup);

        $('#confirm' + this.id).modal('show');

        $('#confirm' + this.id + ' .btn-yes').off('click').click(function () {
            $(this).parents('.modal').modal('hide');

            if (callback)
                callback();
        });
    };

    App.Confirm = new Confirm();

    var Alert = function () {
        this.id = 0;
        this.init();
    };

    Alert.prototype.init = function () {
        this.id = Date.now();
    };

    Alert.prototype.show = function (mode, title, message, callback) {
        this.id = Date.now();

        if (!title)
            title = 'Alert';

        if (!message)
            message = 'Alert title';

        var className = 'bg-primary';
        switch (mode) {
            case 'success':
                className = 'bg-success';
                break;
            case 'danger':
                className = 'bg-danger';
                break;
            case 'warning':
                className = 'bg-warning';
                break;
        }

        var popup = '<div id="alert' + this.id + '" class="modal" tabindex="-1" role="dialog">' +
            '<div class="modal-dialog" role="document">' +
            '<div class="modal-content">' +
            '<div class="modal-header ' + className + '">' +
            '<h5 class="modal-title text-white">' + title + '</h5>' +
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>' +            
            '</div>' +
            '<div class="modal-body">' +
            message +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

        $('html body').append(popup);

        $('#alert' + this.id).modal('show');
    };

    App.Alert = new Alert();
}();

+function () {
    var ProgressBar = function (selector, option) {
        this.selector = selector;
        var spinner =
            '<div class="progressbar-element d-flex justify-content-center align-items-center">' +
            '<div class="fmi-spinner" >' +
            '<div class="spinner-grow text-primary" role="status"></div>' +
            '<div class="spinner-grow text-primary" role="status"></div>' +
            '<div class="spinner-grow text-primary" role="status"></div>' +
            '<div class="spinner-grow text-primary" role="status"></div>' +
            '</div> ' +
            '</div>';

        $(this.selector).prepend(spinner);

        var progressBar = $(this.selector).find('.progressbar-element').get(0);
        var $parent = $(progressBar).parent();
        $(progressBar).width($parent.width());
        $(progressBar).height($parent.height());
    };

    ProgressBar.prototype.hide = function () {
        $(this.selector).find('.progressbar-element').remove();
    };

    ProgressBar.DEFAULTS = {

    };

    function Plugin(option) {
        var args = Array.apply(null, arguments);
        args.shift();

        if (typeof option === 'string') {
            var data = $(this[0]).data('app.progressbar');
            if (data) {
                return data[option].apply(data, args);
            }
        }

        return this.each(function () {
            var $this = $(this);
            var data = $this.data('app.progressbar');
            var options = $.extend({}, ProgressBar.DEFAULTS, $this.data(), typeof option === 'object' && option);

            $this.data('app.progressbar', data = new ProgressBar(this, options));
            if (typeof option === 'string' && typeof data[option] === 'function') {
                data[option].apply(data, args);
            }
        });
    }

    var old = $.fn.progressBar;

    $.fn.progressBar = Plugin;
    $.fn.progressBar.Constructor = ProgressBar;

    $.fn.progressBar.noConflict = function () {
        $.fn.progressBar = old;
        return this;
    };
}();


$(document).ready(function () {
    $.validator.setDefaults({
        errorElement: 'span',
        errorPlacement: function (error, element) {
            error.addClass('invalid-feedback');
            element.closest('.form-group>div').append(error);
        },
        highlight: function (element, errorClass, validClass) {
            if ($(element).hasClass('select2-hidden-accessible')) {
                var element = $(element).parent().find('.select2-selection');
                $(element).addClass('form-control border border-danger');
            }
            else if ($(element).hasClass('form-control-card'))
            {
                var element = $(element).parents('.card');
                $(element).addClass('border border-danger');
                $(element).removeClass('border border-primary');
            }
            $(element).addClass('is-invalid');
        },
        unhighlight: function (element, errorClass, validClass) {
            if ($(element).hasClass('select2-hidden-accessible')) {
                var element = $(element).parent().find('.select2-selection');
                $(element).removeClass('form-control border border-danger');
            }
            else if ($(element).hasClass('form-control-card')) {
                var element = $(element).parents('.card');
                $(element).removeClass('border border-danger');
                $(element).addClass('border border-primary');
            }
            $(element).removeClass('is-invalid');
        }
    });

    var pathname = window.location.pathname;
    $('.nav-bottom .nav-link').removeClass('active');
    $('.nav-bottom .nav-link[href="' + pathname + '"]').addClass('active');

    $('#linkLogout').click(function () {
        window.location.href = '/User/Logout';
    });
});

String.prototype.initCap = function () {
    return this.toLowerCase().replace(/(?:^|\s)[a-z]/g, function (m) {
        return m.toUpperCase();
    });
};