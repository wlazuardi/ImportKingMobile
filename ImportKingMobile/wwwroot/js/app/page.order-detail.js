function ColorBadge(props) {
    var className = 'badge text-capitalize';
    className += App.Utils.isHexLight(props.colorCode) ? ' text-dark' : ' text-light';
    return (
        <span class={className} style={{background: props.colorCode}}>
            {props.colorName}
        </span>
    );
};

class OrderDetailList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: props.order,
            orderDetails: props.orderDetails
        }
    };

    componentWillReceiveProps(props) {
        this.setState({
            order: props.order,
            orderDetails: props.orderDetails
        });
    };

    render() {
        const { order, orderDetails } = this.state;
        let isLoading = orderDetails.isLoading,
            error = orderDetails.error,
            items = orderDetails.items;

        if (isLoading) {
            return <LoadSpinner />;
        }
        else {
            if (error) {
                return <ErrorAlert message={error.message} />;
            }
            else {
                return (
                    <div class="card border-secondary mb-3 mx-2 mt-2" >
                        <div class="card-header p-2">
                            Order Items                            
                        </div>
                        <div class="card-body p-2">
                            <ul class="list-menu">
                            {   
                                items.map(item => (                            
                                    <li class="row mb-2">
                                        <div class="title text-capitalize">{item.categoryName}</div>
                                        <div class="col">                                    
                                            <div>{item.brand} {item.typeName}</div>
                                            <div>
                                                <ColorBadge colorCode={item.colorCode} colorName={item.colorName} />
                                            </div>
                                        </div>
                                        <div class="col">                                    
                                            <div class="text-end">IDR. {App.Utils.formatCurrency(item.price)} x {item.qty}</div>
                                            <div class="fw-bold text-end">IDR. {App.Utils.formatCurrency(item.price * item.qty)}</div>
                                        </div>
                                    </li>
                                ))
                                }                        
                            </ul>
                        </div>
                        <div class="card-footer p-2">
                            Total Order
                            <span class="float-end">IDR. {order && order.data && order.data.orderValue ? App.Utils.formatCurrency(order.data.orderValue) : ''}</span>
                        </div>
                    </div>);
            }
        }
    };
}

class OrderHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: props.order
        };
    };

    componentWillReceiveProps(props) {
        this.setState({
            order: props.order
        });
    };

    render() {
        const { order } = this.state;
        var isLoading = order.isLoading,
            error = order.error,
            data = order.data;
        
        if (isLoading) {
            return <LoadSpinner />;
        }
        else {
            if (error) {
                return <ErrorAlert message={error.message} />;
            }
            else {
                return (
                    <div class="card border-secondary mb-3 mx-2 mt-2" >
                        <div class="card-header p-2">
                            {data.orderNo}
                            <span class="float-end badge bg-success">{data.status}</span>
                        </div>
                        <div class="card-body text-secondary p-2">
                            <p class="card-text m-0 small fw-bolder">No Resi: <span class="float-end">{ moment(data.createdDate).format('lll')}</span></p>
                            <p class="card-text m-0 small">{data.noResi ? data.noResi : 'N/A'} ({data.shippingCourier})</p>

                            <p class="card-text m-0 small pt-1 fw-bolder">Shipped To: </p>
                            <p class="card-text m-0 small">{data.shippingName} ({data.shippingPhone})</p>

                            <p class="card-text m-0 small pt-1 fw-bolder">Shipping Address: </p>
                            <p class="card-text m-0 small">{data.shippingAddress}, {data.shippingCity}, Shipping Province: {data.shippingProvince}, {data.shippingZipCode}</p>
                        </div>
                    </div>
                );
            }
        }
    };
}

class OrderDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            orderId: orderId,
            order: {
                data: null,
                isLoading: true,
                error: null
            },
            orderDetails: {
                items: null,
                isLoading: true,
                error: null
            }
        };
    };

    componentDidMount() {
        fetch("https://importking.mooo.com/api/Orders/" + orderId)
            .then((res) => {
                if (res.status == 200)
                    return res.json();

                throw {
                    message: res.statusText
                };
            })
            .then((result) => {
                var order = {
                    data: result,
                    isLoading: false
                };
                this.setState({
                    order: order
                });
            }, (error) => {
                this.setState({
                    order: {
                        error: error,
                        isLoading: false
                    }
                });
            });

        fetch("https://importking.mooo.com/api/Orders/" + orderId + "/Detail")
            .then((res) => {
                if (res.status == 200)
                    return res.json();

                throw {
                    message: res.statusText
                };
            })
            .then((result) => {
                this.setState({
                    orderDetails: {
                        items: result,
                        isLoading: false
                    }
                });

            }, (error) => {
                this.setState({
                    orderDetails: {
                        error: error,
                        isLoading: false
                    }
                });
            });
    };

    render() {
        const { order, orderDetails } = this.state;
        return (
            <div>
                <OrderHeader order={order} />
                <OrderDetailList order={order} orderDetails={orderDetails} />
            </div>
        );
    };
};

ReactDOM.render(<OrderDetailPage />, document.getElementById('root'));