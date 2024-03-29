﻿class ErrorAlert extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return <div class="alert alert-danger mx-2 mt-2" role="alert">Oops! We got error: {this.props.message}</div>;
    };
};

class LoadSpinner extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return <div><p class="text-center mt-3 text-primary"><span class="spinner-grow spinner-grow-sm" role="status"></span><span class="spinner-grow spinner-grow-sm" role="status"></span><span class="spinner-grow spinner-grow-sm" role="status"></span></p></div>;
    };
};

class Select2 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        }
    }

    componentDidMount() {
        this.$el = $(this.el);

        if (this.props.dropdownParent)
            this.$dropdownParent = $(this.props.dropdownParent);

        this.$el.select2({
            data: this.props.dataSource,
            multiple: false,
            dropdownParent: this.$dropdownParent,
            templateResult: this.props.templateResult,
            templateSelection: this.props.templateSelection,
            width: this.props.width
        });

        this.handleChange = this.handleChange.bind(this);
        this.$el.on('change', this.handleChange);
    }

    componentDidUpdate() {
        this.$el = $(this.el);

        this.$el.select2().empty();

        this.$el.select2({
            data: this.props.dataSource,
            multiple: false,
            dropdownParent: this.$dropdownParent,
            templateResult: this.props.templateResult,
            templateSelection: this.props.templateSelection,
            width: this.props.width
        });
    }

    handleChange(e) {
        if (this.props.onChange) {
            this.props.onChange(this.el);
        }
    }

    componentWillUnmount() {
        this.$el.select2('destroy');
    }

    render() {
        return <input value={this.props.value} name={this.props.name} type="text" class={this.props.class} ref={el => this.el = el} />;
    }
}

class ModalPopUp extends React.Component {
    constructor(props) {
        super(props);
    }

    onShown(e) {
        e.stopPropagation();
        if (this.props.onHidden) {
            this.props.onHidden(e);
        }
    }

    onHidden(e) {
        console.log(e);
        e.stopPropagation();
        console.log('onHidden', this.el);
        if (this.props.onHidden) {
            this.props.onHidden(e);
        }
    }

    componentDidMount() {
        this.$el = $(this.el);

        if (this.props.isShown) {
            this.$el.modal('show');
        }
        else {
            this.$el.modal('hide');
        }

        this.$el.off('shown.bs.modal').on('shown.bs.modal', this.onShown.bind(this));
        this.$el.off('shown.bs.modal').on('hidden.bs.modal', this.onHidden.bind(this));
    }

    componentDidUpdate() {
        if (this.props.isShown) {
            this.$el.modal('show');
        }
        else {
            this.$el.modal('hide');
        }
    }

    handleUpdate() {
        this.$el.modal('handleUpdate');
        console.log('handleUpdate');
    }

    render() {
        var className = this.props.class;
        className = className + " modal";

        return (
            <div id={this.props.id} class={className} ref={el => this.el = el} role="dialog" aria-hidden="true">
                {this.props.children}
            </div>
        );
    }
}

class Progress extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.$el = $(this.el);

        if (this.props.isShown) {
            this.$el.progressBar();
        }
        else {
            this.$el.progressBar('hide');
        }
    }

    componentDidUpdate() {
        if (this.props.isShown) {
            this.$el.progressBar();
        }
        else {
            this.$el.progressBar('hide');
        }
    }

    render() {
        return (
            <div class={this.props.class} ref={el => this.el = el}>
                {this.props.children}
            </div>
        );
    }
}

class Alert extends React.Component {
    constructor(props) {
        super(props);
    }

    onShown(e) {
        if (this.props.onHidden) {
            this.props.onHidden(e);
        }
    }

    onHidden(e) {
        if (this.props.onHidden) {
            this.props.onHidden(e);
        }
    }

    componentDidMount() {
        this.$el = $(this.el);
        if (this.props.isShown) {
            this.$el.modal('show');
        }
        else {
            this.$el.modal('hide');
        }

        this.$el.off('shown.bs.modal').on('shown.bs.modal', this.onShown.bind(this));
        this.$el.off('shown.bs.modal').on('hidden.bs.modal', this.onHidden.bind(this));
    }

    componentDidUpdate() {
        if (this.props.isShown) {
            this.$el.modal('show');
        }
        else {
            this.$el.modal('hide');
        }
    }

    render() {
        var className = 'modal-header bg-primary';

        switch (this.props.mode) {
            case 'success':
                className = 'modal-header bg-success';
                break;
            case 'danger':
                className = 'modal-header bg-danger';
                break;
            case 'warning':
                className = 'modal-header bg-warning';
                break;
        }

        return (
            <div class="modal" role="dialog" ref={el => this.el = el}>
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class={className}>
                            <h5 class="modal-title text-white">{this.props.title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            {this.props.message}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class Toast extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.toast = new bootstrap.Toast(this.el, {
            animation: true,
            autohide: true,
            delay: 5000
        });

        var self = this;
        this.$el = $(this.el);
        this.$el.off('hidden.bs.toast').on('hidden.bs.toast', function () {
            if (self.props.onHidden)
                self.props.onHidden();
        });

        this.$el.off('shown.bs.toast').on('shown.bs.toast', function () {
            if (self.props.onShown)
                self.props.onShown();
        });

        if (this.props.isShown) {
            this.toast.show();
        }
        else {
            this.toast.hide();
        }
    }

    componentDidUpdate() {
        if (this.props.isShown) {
            this.toast.show();
        }
        else {
            this.toast.hide();
        }
    }

    render() {
        var { mode, title, message } = this.props;

        var toastClass = "toast";

        switch (mode) {
            case 'success':
                toastClass += " bg-success text-white";
                break;
            case 'danger':
                toastClass += " bg-danger text-white";
                break;
            case 'warning':
                toastClass += " bg-warning text-white";
                break;
            default:
                toastClass += " bg-light text-dark";
                break;
        }

        var body = message;
        if (title) {
            body = title + ": " + message;
        }

        return (
            <div aria-live="assertive" aria-atomic="true">
                <div class="toast-container position-fixed pt-5 px-3 top-10 start-50 translate-middle" style={{ zIndex: 100000 }}>
                    <div ref={el => this.el = el} class={toastClass} role="alert">
                        <div class="d-flex">
                            <div class="toast-body">
                                {body}
                            </div>
                            <button type="button" class="btn-close mt-2 me-2 m-auto text-white" data-bs-dismiss="toast" aria-label="Close"></button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

class FormValidate extends React.Component {
    constructor(props) {
        super(props);

        this.DEFAULT_SCALE_DELTA = 1.1;
    }

    componentDidMount() {
        this.$el = $(this.el);
        var self = this;

        this.validator = this.$el.validate({
            rules: this.props.rules,
            ignore: [],
            messages: this.props.messages ? this.props.messages : [],
            errorPlacement: this.props.errorPlacement ? this.props.errorPlacement : this.errorPlacement,
            submitHandler: function () {
                if (self.props.submitHandler)
                    self.props.submitHandler(this);
            },
            invalidHandler: function (form, validator) {
                var errors = validator.numberOfInvalids();
                if (errors) {
                    validator.errorList[0].element.focus();
                }
            }
        });
    }

    errorPlacement(error, element) {
        var name = $(element).attr('name');
        for (var cnt = 0; cnt < this.findByName(name).length; cnt++) {
            var elem = this.findByName(name)[cnt];
            $(elem).parent().append(error);
        }
    }

    updateRules(rules) {
        this.validator.destroy();

        if (!rules) {
            rules = this.props.rules;
        }

        this.$el = $(this.el);
        var self = this;
        this.$el.validate({
            rules: rules,
            messages: this.props.messages ? this.props.messages : [],
            errorPlacement: this.props.errorPlacement ? this.props.errorPlacement : this.errorPlacement,
            ignore: [],
            submitHandler: function () {
                if (self.props.submitHandler)
                    self.props.submitHandler(this);
            },
            invalidHandler: function (form, validator) {
                var errors = validator.numberOfInvalids();
                if (errors) {
                    validator.errorList[0].element.focus();
                }
            }
        });
    }

    handleSubmit() {
        this.$el.submit();
    }

    isValid() {
        return this.$el.valid();
    }

    render() {
        return (
            <form novalidate={this.props.novalidate} class={this.props.class} ref={el => this.el = el}>
                {this.props.children}
            </form>
        );
    }
}

class PdfViewer extends React.Component {
    constructor(props) {
        super(props);
        var instanceId = Date.now();
        this.state = {
            instanceId: instanceId
        };
    }

    loadPdf() {
        var { url } = this.props;
    }

    componentDidMount() {
        if (this.props.url) {
            PDFViewerApplication.initUI(this.state.instanceId);
            PDFViewerApplication.open({
                url: this.props.url,
            });
        }
    }

    componentDidUpdate(prevProps) {
        if (!prevProps || prevProps.url !== this.props.url) {
            PDFViewerApplication.initUI(this.state.instanceId);
            PDFViewerApplication.open({
                url: this.props.url,
            });
        }
    }

    render() {
        var { id } = this.props;
        var { instanceId } = this.state;

        return (
            <div ref={el => this.el = el} style={this.props.style} class={this.props.class}>
                <div id={"viewerContainer" + instanceId} class="viewerContainer">
                    <div id="viewer" class="pdfViewer"></div>
                </div>

                <div id={"loadingBar" + instanceId} class="loadingBar">
                    <div class="progress"></div>
                    <div class="glimmer"></div>
                </div>

                <footer>
                    <button type="button" class="toolbarButton pageUp" title="Previous Page" id={"previous" + instanceId}>
                        <i class="fa fa-arrow-up"></i>
                    </button>
                    <button type="button" class="toolbarButton pageDown" title="Next Page" id={"next" + instanceId}>
                        <i class="fa fa-arrow-down"></i>
                    </button>

                    <input type="number" id={"pageNumber" + instanceId} class="toolbarField pageNumber" value="1" size="4" min="1" />

                    <button type="button" class="toolbarButton zoomOut" title="Zoom Out" id={"zoomOut" + instanceId}>
                        <i class="fa fa-search-minus"></i>
                    </button>
                    <button type="button" class="toolbarButton zoomIn" title="Zoom In" id={"zoomIn" + instanceId}>
                        <i class="fa fa-search-plus"></i>
                    </button>
                </footer>
            </div>
        );
    }
}