function StatusFilterButton(props) {
    var _className = (props.status == props.filteredStatus) ? 'bg-primary text-white' : 'border-primary';
    return (
        <div onClick={props.onClick.bind(this, props.status)}>
            <button class={'btn btn-sm ' + _className + ' shadow-sm'}>{props.status}</button>
        </div>
    );
}

class OrderPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            filteredItems: [],
            statuses: ['All', 'New', 'In Process', 'In Delivery', 'Completed', 'Cancelled'],
            filteredStatus: 'All',            
            filteredInvoice: ''
        };
    }

    componentDidMount() {
        fetch("https://importking.mooo.com/api/Orders/GetByEmail/" + userMail)
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        items: result,
                        filteredItems: result
                    });
                    console.log(result);
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    filter = () => {
        const { items, filteredStatus, filteredInvoice } = this.state;

        var _filteredItems = items.filter(item =>
            (item.status.toLowerCase() == filteredStatus.toLowerCase() || filteredStatus == 'All') &&
            (item.orderNo.toLowerCase().indexOf(filteredInvoice.toLowerCase()) > -1 || filteredInvoice == '')
        );

        this.setState({
            filteredItems: _filteredItems
        });
    }

    filterStatus = (status, e) => {
        const { items, filteredInvoice } = this.state;

        var _filteredItems = items.filter(item =>
            (item.status.toLowerCase() == status.toLowerCase() || status == 'All') &&
            (item.orderNo.toLowerCase().indexOf(filteredInvoice.toLowerCase()) > -1 || filteredInvoice == '')
        );

        this.setState({            
            filteredStatus: status,
            filteredItems: _filteredItems
        });
    }

    filterInvoice = (e) => {
        const { items, filteredStatus } = this.state;

        var _filteredItems = items.filter(item =>
            (item.status.toLowerCase() == filteredStatus.toLowerCase() || filteredStatus == 'All') &&
            (item.orderNo.toLowerCase().indexOf(e.target.value.toLowerCase()) > -1 || e.target.value == '')
        );

        this.setState({
            filteredItems: _filteredItems,
            filteredInvoice: e.target.value
        });
    }

    render() {
        const { error, isLoaded, statuses, filteredItems, filteredStatus } = this.state;

        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div>
                    <section class="px-3 pb-3 pt-1 mb-2 bg-primary">
                        <input value={this.state.filteredInvoice} type="search" placeholder="Search" class="bg-primary-light border-0 form-control text-white" onChange={this.filterInvoice.bind(this)} />
                    </section>
                    <div class="px-2 scroll-horizontal">
                        {
                            statuses.map(status => (
                                <StatusFilterButton
                                    onClick={this.filterStatus.bind(this, status)}
                                    status={status}
                                    filteredStatus={filteredStatus} />
                            ))
                        }
                    </div>
                    {
                        filteredItems.length == 0 ? (
                            <div class="text-center mx-2">
                                No items found
                            </div>
                        ):
                        (
                            filteredItems.map(item => (
                                <div class="card border-secondary mb-3 mx-2" key={item.orderId}>
                                    <div class="card-header p-2">
                                        {item.orderNo}
                                        <span class="float-end badge bg-success">{item.status}</span>
                                    </div>
                                    <div class="card-body text-secondary p-2">
                                        <span class="float-end small">{moment(item.createdDate).format('llll')}</span>
                                        <p class="card-text m-0 small">Name: {item.shippingName}</p>
                                        <p class="card-text m-0 small">Total: IDR {App.Utils.formatCurrency(item.orderValue)}</p>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
            );
        }
    }
}

ReactDOM.render(<OrderPage />, document.getElementById('root'));