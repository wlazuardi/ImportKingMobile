function StatusFilterButton(props) {
    var _className = (props.status == props.filteredStatus) ? 'bg-primary text-white' : 'border-primary';
    return (
        <div onClick={props.onClick.bind(this, props.status)}>
            <button class={'btn btn-sm ' + _className + ' shadow-sm'}>{props.status}</button>
        </div>
    );
}

function StatusBadge(props) {
    var className = "float-end badge ";

    switch (props.status) {
        case "New":
            className += "bg-info";
            break;
        case "Waiting Payment":
            className += "bg-danger";
            break;
        case "Payment Completed":
            className += "bg-success";
            break;
        case "In Process":
            className += "bg-warning";
            break;
        case "In Delivery":
            className += "bg-primary";
            break;
        case "Completed":
            className += "bg-success";
            break;
        case "Cancelled":
            className += "bg-danger";
            break;
    }

    return (
        <span class={className}>{props.status}</span>
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
            statuses: ['All', 'New', 'Waiting Payment', 'Payment Completed', 'In Process', 'In Delivery', 'Completed', 'Cancelled'],
            filteredStatus: 'All',            
            filteredInvoice: ''
        };
    }

    componentDidMount() {
        var url = hostUrl + "/api/Orders/GetByEmail/" + userMail;

        if (this.props.mode == 'admin' || userType == 3)
            url = hostUrl + "/api/Orders/";

        fetch(url, {
            method: 'GET',
            credentials: 'include'
        })
            .then((res) => {
                if (res.status == 200) {
                    return res.json();
                }
                else {
                    throw {
                        message: res.statusText
                    };
                }
            })
            .then(
                (result) => {
                    // Order by updated date desc
                    result.sort(function (a, b) {
                        var aDate = (new Date(a.updatedDate)).getTime();
                        var bDate = (new Date(b.updatedDate)).getTime();
                        return bDate - aDate;
                    });

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

    goToDetail = (orderId, e) => {        
        location.href = '/Order/' + orderId + '/Detail';
    }

    render() {
        const { error, isLoaded, statuses, filteredItems, filteredStatus } = this.state;

        if (error) {
            return (
                <div>
                    <section class="px-3 pb-3 pt-1 mb-2 bg-primary">
                        <input type="search" placeholder="Search" class="bg-primary-light border-0 form-control text-white" />
                    </section>
                    <div class="alert alert-danger mx-2" role="alert">Error: {error.message}</div>
                </div>
            );
        } else if (!isLoaded) {
            return (
                <div>
                    <section class="px-3 pb-3 pt-1 mb-2 bg-primary">
                        <input type="search" placeholder="Search" class="bg-primary-light border-0 form-control text-white"/>
                    </section>
                    <LoadSpinner />
                </div>
            );
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
                                <div class="card border-secondary mb-3 mx-2" key={item.orderId} onClick={this.goToDetail.bind(this, item.orderId)}>
                                    <div class="card-header p-2">
                                        {item.orderNo}
                                        <StatusBadge status={item.status} />
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

ReactDOM.render(<OrderPage mode="user"/>, document.getElementById('root'));