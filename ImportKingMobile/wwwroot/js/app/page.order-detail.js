function ColorBadge(props) {
    var className = 'badge text-capitalize';
    className += App.Utils.isHexLight(props.colorCode) ? ' text-dark' : ' text-light';
    return (
        <span class={className} style={{ background: props.colorCode }}>
            {props.colorName}
        </span>
    );
};

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

class OrderProcessedList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: props.order,
            stockOutDetails: props.stockOutDetails
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            order: props.order,
            stockOutDetails: props.stockOutDetails
        });
    };

    render() {
        const { order, stockOutDetails } = this.state;
        let isLoading = stockOutDetails.isLoading,
            error = stockOutDetails.error,
            items = stockOutDetails.items,
            total = 0;

        if (items && items.length > 0)
            items.forEach(x => total += x.subTotal);

        if (isLoading) {
            return <LoadSpinner />;
        }
        else {
            if (error) {
                return <ErrorAlert message={error.message} />;
            }
            else if (items.length > 0) {
                return (
                    <div class="card border-secondary mb-3 mx-2 mt-2" >
                        <div class="card-header p-2">
                            <a data-bs-toggle="collapse" href="#collapseProcessed" role="button" aria-expanded="true" aria-controls="collapseProcessed">
                                Processed Order Items
                            </a>
                        </div>
                        <div id="collapseProcessed" class="card-body p-2 collapse show">
                            <ul class="list-menu">
                                {
                                    items.map(item => (
                                        <li class="row mb-2">
                                            <div class="title text-capitalize">
                                                {
                                                    (item.productId > -1) ? (item.categoryName) : 'Other'
                                                }
                                            </div>
                                            <div class="col">
                                                <div>
                                                    {
                                                        (item.productId > -1) ? (item.brand + ' ' + item.typeName) : (item.customProductType)
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        (item.productId > -1) ?
                                                            (<ColorBadge colorCode={item.colorCode} colorName={item.colorName} />) :
                                                            (<ColorBadge colorCode="#000" colorName={item.customProductColor} />)
                                                    }
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
                            <span class="float-end">IDR. {App.Utils.formatCurrency(total)}</span>
                        </div>
                    </div>
                );
            }
            else {
                return <div></div>;
            }
        }
    }
}

class OrderUnprocessedList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            order: props.order,
            stockOutDetails: props.stockOutDetails
        }
    }

    componentWillReceiveProps(props) {
        this.setState({
            order: props.order,
            orderDetails: props.orderDetails,
            stockOutDetails: props.stockOutDetails
        });
    };

    render() {
        const { stockOutDetails, orderDetails } = this.state;
        let isLoading = stockOutDetails.isLoading,
            error = stockOutDetails.error,
            items = [],
            originalItems = [],
            total = 0;

        if (stockOutDetails && stockOutDetails.items && orderDetails && orderDetails.items) {
            items = stockOutDetails.items;
            originalItems = orderDetails.items;

            var unprocessedItems = [], temp = [];

            temp = originalItems.filter(x =>
                x.productId != -1 &&
                items.map(y => y.productId).indexOf(x.productId) == -1
            );

            unprocessedItems = unprocessedItems.concat(temp);

            temp = originalItems.filter(x =>
                x.productId == -1 &&
                items.map(y => y.customProductType.toLowerCase() + y.customProductColor.toLowerCase())
                    .indexOf(x.customProductType.toLowerCase() + x.customProductColor.toLowerCase()) == -1
            );

            unprocessedItems = unprocessedItems.concat(temp);

            items = unprocessedItems;
        }

        if (items && items.length > 0) {
            items.forEach(x => total += (x.price * x.qty));
        }

        if (isLoading) {
            return <LoadSpinner />;
        }
        else {
            if (error) {
                return <ErrorAlert message={error.message} />;
            }
            else if (items.length > 0) {
                return (
                    <div class="card border-secondary mb-3 mx-2 mt-2" >
                        <div class="card-header p-2">
                            <a data-bs-toggle="collapse" href="#collapseUnprocessed" role="button" aria-expanded="true" aria-controls="collapseUnprocessed">
                                Unprocessed Order Items
                            </a>
                        </div>
                        <div id="collapseUnprocessed" class="card-body p-2 collapse show">
                            <ul class="list-menu">
                                {
                                    items.map(item => (
                                        <li class="row mb-2">
                                            <div class="title text-capitalize">
                                                {
                                                    (item.productId > -1) ? (item.categoryName) : 'Other'
                                                }
                                            </div>
                                            <div class="col">
                                                <div>
                                                    {
                                                        (item.productId > -1) ? (item.brand + ' ' + item.typeName) : (item.customProductType)
                                                    }
                                                </div>
                                                <div>
                                                    {
                                                        (item.productId > -1) ?
                                                            (<ColorBadge colorCode={item.colorCode} colorName={item.colorName} />) :
                                                            (<ColorBadge colorCode="#000" colorName={item.customProductColor} />)
                                                    }
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
                            <span class="float-end">IDR. {App.Utils.formatCurrency(total)}</span>
                        </div>
                    </div>
                );
            }
            else {
                return <div></div>;
            }
        }
    }
}

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
            items = orderDetails.items,
            cardClassName = "card-body p-2 collapse",
            ariaExpanded = false;

        if (!order.stockOutId && order.stockOutId != undefined) {
            cardClassName = "card-body p-2 collapse show";
            ariaExpanded = true;
        }

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
                            <a data-bs-toggle="collapse" href="#collapseOriginal" role="button" aria-expanded={ariaExpanded} aria-controls="collapseOriginal">
                                Original Order Items
                            </a>
                        </div>
                        <div id="collapseOriginal" class={cardClassName}>
                            <ul class="list-menu">
                                {
                                    items.map(item => (
                                        (item.isOutOfStock) ? (
                                            <li class="row mb-2 text-danger">
                                                <div class="title text-capitalize">
                                                    {
                                                        (item.productId > -1) ? (item.categoryName) : 'Other'
                                                    }
                                                </div>
                                                <div class="col">
                                                    <div>
                                                        {
                                                            (item.productId > -1) ? (item.brand + ' ' + item.typeName) : (item.customProductType)
                                                        }
                                                    </div>
                                                    <div>
                                                        {
                                                            (item.productId > -1) ?
                                                                (<ColorBadge colorCode={item.colorCode} colorName={item.colorName} />) :
                                                                (<ColorBadge colorCode="#000" colorName={item.customProductColor} />)
                                                        }
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="text-end">IDR. {App.Utils.formatCurrency(item.price)} x {item.qty}</div>
                                                    <div class="fw-bold text-end">IDR. {App.Utils.formatCurrency(item.price * item.qty)}</div>
                                                </div>
                                            </li>
                                        ) : (
                                            <li class="row mb-2">
                                                <div class="title text-capitalize">
                                                    {
                                                        (item.productId > -1) ? (item.categoryName) : 'Other'
                                                    }
                                                </div>
                                                <div class="col">
                                                    <div>
                                                        {
                                                            (item.productId > -1) ? (item.brand + ' ' + item.typeName) : (item.customProductType)
                                                        }
                                                    </div>
                                                    <div>
                                                        {
                                                            (item.productId > -1) ?
                                                                (<ColorBadge colorCode={item.colorCode} colorName={item.colorName} />) :
                                                                (<ColorBadge colorCode="#000" colorName={item.customProductColor} />)
                                                        }
                                                    </div>
                                                </div>
                                                <div class="col">
                                                    <div class="text-end">IDR. {App.Utils.formatCurrency(item.price)} x {item.qty}</div>
                                                    <div class="fw-bold text-end">IDR. {App.Utils.formatCurrency(item.price * item.qty)}</div>
                                                </div>
                                            </li>
                                        )
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
                            <StatusBadge status={data.status} />
                        </div>
                        <div class="card-body text-secondary p-2">
                            <p class="card-text m-0 small fw-bolder">No Resi: <span class="float-end">{moment(data.createdDate).format('lll')}</span></p>
                            <p class="card-text m-0 small">{data.noResi ? data.noResi : 'N/A'} ({data.shippingCourier})</p>

                            <p class="card-text m-0 small pt-1 fw-bolder">Shipped To: </p>
                            <p class="card-text m-0 small">{data.shippingName} ({data.shippingPhone})</p>

                            <p class="card-text m-0 small pt-1 fw-bolder">Shipping Address: </p>
                            <p class="card-text m-0 small">{data.shippingAddress}, {data.shippingCity}, Shipping Province: {data.shippingProvince}, {data.shippingZipCode}</p>

                            <div class="row pt-1 card-text small">
                                <div class="col-6 m-0 fw-bolder">Total Product: </div>
                                <div class="col-6 m-0 text-end">IDR {App.Utils.formatCurrency(data.orderValue)}</div>
                            </div>
                            <div class="row pt-1 card-text small">
                                <div class="col-6 m-0 fw-bolder">Total Payment: </div>
                                <div class="col-6 m-0 text-end">IDR {App.Utils.formatCurrency(data.paymentAmount)}</div>
                            </div>
                            <div class="row pt-1 card-text small">
                                <div class="col-6 m-0 fw-bolder">Total Payment: </div>
                                <div class="col-6 m-0 text-end">IDR {App.Utils.formatCurrency(data.paymentAmount)}</div>
                            </div>
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
            },
            stockOutDetails: {
                items: null,
                isLoading: true,
                error: null
            },
            isShownReorder: false,
            isShownProgress: false,
            isShownDeliveryTracking: false,
            isLoadingDeliveryTracking: false,
            deliveryTracking: null,
            alert: null
        };
        this.reorderModalRef = React.createRef();

    };

    getOrderStockOut(stockOutId) {
        if (stockOutId) {
            fetch("https://importking.mooo.com/api/StockOuts/" + stockOutId + "/Details")
                .then((res) => {
                    if (res.status == 200)
                        return res.json();

                    throw {
                        message: res.statusText
                    };
                })
                .then((result) => {
                    this.setState({
                        stockOutDetails: {
                            items: result,
                            isLoading: false
                        }
                    });

                }, (error) => {
                    this.setState({
                        stockOutDetails: {
                            error: error,
                            isLoading: false
                        }
                    });
                });
        }
        else {
            this.setState({
                stockOutDetails: {
                    items: [],
                    isLoading: false
                }
            });
        }
    }

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

                this.getOrderStockOut(result.stockOutId);
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

    handleReorder() {
        this.setState({
            isShownReorder: true
        });
    };

    handleReorderPopUpHidden() {
        this.setState({
            isShownReorder: false
        });
    };

    handleDeliveryTrackingHidden() {
        this.setState({
            isShownDeliveryTracking: false
        });
    };

    handleReorderConfirm() {
        var { order } = this.state;

        this.setState({
            isShownReorder: false,
            isShownProgress: true
        });

        fetch('https://importking.mooo.com/api/Orders/' + order.data.orderId + '/Reorder', {
            method: 'POST'
        })
            .then(result => {
                if (result.status == 200)
                    return result.json();

                throw {
                    message: result.statusText
                };
            })
            .then(result => {
                debugger;
                this.setState({
                    isShownProgress: false,
                    alert: {
                        isShown: true,
                        mode: 'success',
                        title: 'Success',
                        message: 'Order copied successfully, please check your cart'
                    }
                });
            }, error => {
                debugger;
                this.setState({
                    isShownProgress: false,
                    alert: {
                        isShown: true,
                        mode: 'danger',
                        title: 'Error',
                        message: error.message
                    }
                });
            })
    };

    handleAlertHidden() {
        this.setState({
            alert: null
        });
    };

    handlePayment() {
        var { order } = this.state;
        var that = this;

        if (userType == 0) {
            fetch('https://importking.mooo.com/api/Payments/' + order.data.orderId + '/Token', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })
                .then(resToken => {
                    if (resToken.status == 200) {
                        return resToken.json();
                    }
                    else {
                        throw {
                            message: resToken.statusText
                        }
                    }
                })
                .then(resToken => {
                    window.snap.pay(resToken.paymentToken, {
                        gopayMode: 'deeplink',
                        onSuccess: function (result) {
                            /* You may add your own implementation here */
                            that.setState({
                                alert: {
                                    isShown: true,
                                    mode: 'success',
                                    title: 'Payment Succeed',
                                    message: 'Refreshing the page in 2 seconds.'
                                }
                            });

                            setTimeout(function () {
                                window.location.reload();
                            }, 2000);
                        },
                        onError: function (result) {
                            /* You may add your own implementation here */
                            that.setState({
                                alert: {
                                    isShown: true,
                                    mode: 'danger',
                                    title: 'Payment Failed',
                                    message: 'Please try again.'
                                }
                            });

                            setTimeout(function () {
                                window.location.reload();
                            }, 2000);
                        },
                        onPending: function (result) {
                            /* You may add your own implementation here */
                            that.setState({
                                alert: {
                                    isShown: true,
                                    mode: 'info',
                                    title: 'Payment Pending',
                                    message: 'Please complete payment to process order.'
                                }
                            });
                        },
                        onClose: function () {
                            /* You may add your own implementation here */
                            that.setState({
                                alert: {
                                    isShown: true,
                                    mode: 'warning',
                                    title: 'Warning',
                                    message: 'Please complete the payment to proceed the request.'
                                }
                            });
                        }
                    });
                });
        }
    }

    handleTrackShipping() {
        var { order } = this.state;
        var waybill = order.data.noResi;
        var courier = order.data.shippingCourier;

        this.setState({
            isLoadingDeliveryTracking: true,
            isShownDeliveryTracking: true
        });

        fetch("https://importking.mooo.com/api/waybills/" + courier + "/" + waybill)
            .then((res) => {
                if (res.status == 200)
                    return res.json();

                throw {
                    message: res.statusText
                };
            })
            .then((result) => {
                var tracking = (result && result.rajaOngkir && result.rajaOngkir.result) ? result.rajaOngkir.result : null;
                this.setState({
                    deliveryTracking: tracking,
                    isLoadingDeliveryTracking: false
                });

            }, (error) => {
                this.setState({
                    isLoadingDeliveryTracking: false
                });
            });
    }

    renderManifest(item) {
        return (
            <div class="row mb-3">
                <div class="fw-bold">{item.manifestDescription}</div>
                <div>{item.manifestDate} {item.manifestTime}</div>
                <div>{item.cityName}</div>
            </div>
        );
    }

    render() {
        const { order, orderDetails, stockOutDetails, deliveryTracking } = this.state;
        let isAdmin = userType == 3;
        return (
            <Progress isShown={this.state.isShownProgress}>
                {
                    this.state.alert ?
                        (
                            <Toast isShown={this.state.alert.isShown}
                                mode={this.state.alert.mode}
                                title={this.state.alert.title}
                                message={this.state.alert.message}
                                onHidden={this.handleAlertHidden.bind(this)}
                            />
                        ) :
                        (
                            <div />
                        )
                }
                <OrderHeader order={order} />
                <OrderProcessedList order={order} stockOutDetails={stockOutDetails} />
                <OrderUnprocessedList order={order} stockOutDetails={stockOutDetails} orderDetails={orderDetails} />
                <OrderDetailList order={order} orderDetails={orderDetails} />
                {
                    (isAdmin) ? (<div></div>) : (
                        <div>
                            {
                                (order && order.data && order.data.status == 'Waiting Payment') ?
                                    (
                                        <div class="d-grid gap-2 px-2 mb-2">
                                            <div class="alert alert-info">Please complete payment to process the order</div>
                                            <button class="btn btn-primary" type="button" onClick={this.handlePayment.bind(this)}>Complete Payment</button>
                                        </div>
                                    ) : (<div></div>)
                            }
                            <div class="d-grid gap-2 px-2 mb-2">
                                <button class="btn btn-outline-primary" type="button" onClick={this.handleReorder.bind(this)}>Reorder Product</button>
                            </div>
                            {
                                (order && order.data && order.data.noResi) ? (
                                    <div class="d-grid gap-2 px-2 mb-2">
                                        <button class="btn btn-outline-primary" type="button" onClick={this.handleTrackShipping.bind(this)}>Track Shipping</button>
                                    </div>
                                ) : (<div></div>)
                            }
                        </div>
                    )
                }
                <ModalPopUp id="reorderModal" ref={this.reorderModalRef} isShown={this.state.isShownReorder} class="modal" onHidden={this.handleReorderPopUpHidden.bind(this)}>
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Confirm Reorder</h5>
                                <button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body px-2">
                                Are you sure want to reorder this? All your items in your cart will be discarded.
                            </div>
                            <div class="modal-footer px-2">
                                <button class="btn btn-primary" onClick={this.handleReorderConfirm.bind(this)}>Yes</button>
                                <button class="btn btn-danger" data-bs-dismiss="modal">No</button>
                            </div>
                        </div>
                    </div>
                </ModalPopUp>

                <ModalPopUp id="deliveryTrackingModal" ref={this.deliveryTrackingModalRef} isShown={this.state.isShownDeliveryTracking} class="modal" onHidden={this.handleDeliveryTrackingHidden.bind(this)}>
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Delivery Tracking</h5>
                                <button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body px-2">
                                {
                                    (deliveryTracking != null) ?
                                        (
                                            <div>
                                                <div class="row">
                                                    <div class="col text-right">
                                                        <label class="fw-bold form-label">Courier Code:</label>
                                                    </div>
                                                    <div class="col text-left">{deliveryTracking.summary.courierCode}</div>
                                                </div>
                                                <div class="row">
                                                    <div class="col text-right">
                                                        <label class="fw-bold form-label">Courier Name:</label>
                                                    </div>
                                                    <div class="col text-left">{deliveryTracking.summary.courierName}</div>
                                                </div>
                                                <div class="row">
                                                    <div class="col text-right">
                                                        <label class="fw-bold form-label">Waybill No:</label>
                                                    </div>
                                                    <div class="col text-left">{deliveryTracking.summary.waybillNumber}</div>
                                                </div>
                                                <div class="row">
                                                    <div class="col text-right">
                                                        <label class="fw-bold form-label">Waybill Date:</label>
                                                    </div>
                                                    <div class="col text-left">{deliveryTracking.summary.waybillDate}</div>
                                                </div>
                                                <div class="row">
                                                    <div class="col text-right">
                                                        <label class="fw-bold form-label">Status:</label>
                                                    </div>
                                                    <div class="col text-left">{deliveryTracking.summary.status}</div>
                                                </div>
                                                <div class="row mt-3">
                                                    <div class="col text-right">
                                                        <label class="fw-bold form-label">Manifests:</label>
                                                    </div>
                                                </div>
                                                {
                                                    deliveryTracking.manifest.map(item => {
                                                        return this.renderManifest(item)
                                                    })
                                                }
                                            </div>
                                        ) : (
                                            <div class="my-3">No Data Found</div>
                                        )
                                }
                            </div>
                            <div class="modal-footer px-2">
                                <button class="btn btn-danger" data-bs-dismiss="modal">Close</button>
                            </div>
                        </div>
                    </div>
                </ModalPopUp>
            </Progress>
        );
    };
};

ReactDOM.render(<OrderDetailPage />, document.getElementById('root'));