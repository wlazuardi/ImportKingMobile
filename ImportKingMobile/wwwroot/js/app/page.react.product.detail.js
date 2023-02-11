class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        this.getCategory();
    }

    getCategory() {
        var url = 'https://importking.mooo.com';
        fetch(url + '/Categories/')
            .then()
    }

    render() {
        return (
            <div>Hello World</div>
        );
    }
}

ReactDOM.render(<ProductDetail />, document.getElementById('root'));