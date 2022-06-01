+function () {
    var Modal = function () {
        var id = Date.now();
        this.id = id;
    };

    Modal.prototype.show = function (title, body, modalClass, buttons, onShown) {
        var buttonList = '';
        if (buttons) {
            for (var i in buttons) {
                buttonList = '<button name="' + i + '" type="button" class="btn btn-primary modalButton">' + i + '</button>';
            }
        }
        var modal =
            '<div id="modal' + this.id + '" class="modal" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">' +
                '<div class="modal-dialog" role="document">' +
                    '<div class="modal-content ' + modalClass + '">' +
                        '<div class="modal-header">' +
                            '<h5 class="modal-title" id="exampleModalLabel">' + title + '</h5>' +
                            '<button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" aria-label="Close">' +
                                '<span aria-hidden="true">&times;</span>' +
                            '</button>' +
                        '</div>' +
                        '<div class="modal-body">' +
                            body +
                        '</div>' +
                        '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>' +
                            buttonList +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>';

        $('#modal' + this.id).remove();

        $('body').append(modal);

        $('.modalButton').off('click').click(function () {
            var buttonName = $(this).attr('name');
            var callback = buttons[buttonName];
            callback();
        });

        $('#modal' + this.id).on('shown.bs.modal', function () {
            if (onShown) onShown();
        });

        var that = this;
        $('#modal' + this.id).on('hidden.bs.modal', function () {
            $('#modal' + that.id).remove();
        });

        $('#modal' + this.id).modal('show');
    };

    Modal.prototype.hide = function () {
        $('#modal' + this.id).modal('hide');
    };

    App.Modal = Modal;
}();