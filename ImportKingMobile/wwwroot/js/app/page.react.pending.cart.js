class PendingCartPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            cartList: [],
            filteredCartList: [],
            error: null
        }
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        });

        fetch(hostUrl + '/api/Carts/GetPendingCart', {
            method: 'GET',
            credentials: 'include'
        })
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                throw {
                    message: res.statusText
                }
            })
            .then((result) => {
                this.setState({
                    isLoading: false,
                    cartList: result,
                    filteredCartList: result
                });
            }, (error) => {
                this.setState({
                    isLoading: false,
                    error: error
                });
            });
    }

    onSearchChange(e) {
        var value = e.target.value.toLowerCase();

        var { cartList } = this.state;

        cartList = cartList.filter(x =>
            x.firstName.toLowerCase().indexOf(value) > -1 ||
            x.lastName.toLowerCase().indexOf(value) > -1 ||
            x.email.toLowerCase().indexOf(value) > -1
        );

        this.setState({
            filteredCartList: cartList
        });
    }

    goToDetail(item) {
        window.location.href = '/Cart/Pending/' + item.email + '/Detail';
    }

    render() {
        var { isLoading, filteredCartList } = this.state;
        return (
            (isLoading) ?
                (
                    <div>
                        <section class="px-3 pb-3 pt-1 mb-2 bg-primary">
                            <input type="search" placeholder="Search" class="bg-primary-light border-0 form-control text-white" onChange={this.onSearchChange.bind(this)} />
                        </section>
                        <LoadSpinner />
                    </div>
                ) :
                (
                    <div>
                        <section class="px-3 pb-3 pt-1 mb-2 bg-primary">
                            <input type="search" placeholder="Search" class="bg-primary-light border-0 form-control text-white" onChange={this.onSearchChange.bind(this)} />
                        </section>
                        {
                            filteredCartList.map(item => (
                                <div class="card border-secondary mb-3 mx-2" key={item.email} onClick={this.goToDetail.bind(this, item)}>
                                    <div class="card-header p-2">
                                        {item.firstName} {item.lastName}
                                    </div>
                                    <div class="card-body text-secondary p-2">
                                        <p class="card-text m-0 small">
                                            Last Updated Date:
                                            {
                                                (item.lastUpdatedDate) ? (
                                                    <label class="ms-1">{moment(item.lastUpdatedDate).format('llll')}</label>
                                                ) : (
                                                    <label class="ms-1">Not available</label>
                                                )
                                            }
                                        </p>
                                        <p class="card-text m-0 small">
                                            Total Items: {item.totalItems} / Distinct Items: {item.totalDistinctItems}
                                        </p>
                                        <p class="card-text m-0 small">
                                            Total: IDR {App.Utils.formatCurrency(item.orderValue)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                )
        );
    }
}

ReactDOM.render(<PendingCartPage />, document.getElementById('root'));