class ErrorAlert extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        return <div class="alert alert-danger mx-2 mt-2" role="alert">Oops! We got error: { this.props.message }</div>;
    };
};

class LoadSpinner extends React.Component {
    constructor(props) {
        super(props);
    };
    render() {
        <div>
            <p class="text-center mt-3" id="spinner">
                <span class="spinner-grow spinner-grow-sm" role="status"></span>
                <span class="spinner-grow spinner-grow-sm" role="status"></span>
                <span class="spinner-grow spinner-grow-sm" role="status"></span>
            </p>
        </div>
    };
};