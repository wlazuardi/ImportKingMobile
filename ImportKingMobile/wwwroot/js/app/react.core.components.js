class ErrorAlert extends React.Component {
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
        return <input value={this.props.value} type="text" class={this.props.class} ref={el => this.el = el} />;
    }
}

class ModalPopUp extends React.Component {
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
            <div class="modal" tabindex="-1" role="dialog" ref={el => this.el = el}>
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

class FormValidate extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.$el = $(this.el);
        var self = this;
        this.$el.validate({
            rules: this.props.rules,
            submitHandler: function () {
                if (self.props.submitHandler)
                    self.props.submitHandler(this);
            }
        });
    }

    handleSubmit() {
        this.$el.submit();
    }

    render() {
        return (
            <form novalidate={this.props.novalidate} class={this.props.class} ref={el => this.el = el}>
                {this.props.children}
            </form>
        );
    }
}