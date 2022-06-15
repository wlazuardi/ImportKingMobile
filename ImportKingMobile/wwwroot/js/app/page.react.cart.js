class CartList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            isUpdating: false,
            cartList: [],
            alert: null
        }
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        });

        fetch('https://importking.mooo.com/api/Carts?email=' + userMail)
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                else {
                    throw {
                        message: res.statusText
                    }
                }
            })
            .then((result) => {
                result.forEach(cart => {
                    cart.subTotal = cart.qty * cart.price;
                    cart.colorCodeClass = App.Utils.isHexLight(cart.colorCode) ? 'text-dark' : 'text-light';
                    cart.colorCodeClass += ' badge text-capitalize me-1';
                });

                this.setState({
                    isLoading: false,
                    cartList: result
                });

                this.handleListUpdated();
            }, (error) => {

                this.setState({
                    isLoading: false,
                    cartList: []
                });

                this.handleListUpdated();
            });
    }

    handleListUpdated() {
        var { cartList } = this.state;
        if (this.props.onListUpdate) {
            this.props.onListUpdate(cartList);
        }
    }

    updateCart(cart) {
        fetch('https://importking.mooo.com/api/Carts/', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart)
        })
            .then(result => {
                if (result.status == 200) {
                    return result.json();
                }

                throw {
                    message: result.statusText
                };
            })
            .then((result) => {

            }, (error) => {
                if (this.props.onUpdated) {
                    this.props.onUpdated({
                        isShown: true,
                        mode: 'danger',
                        title: 'Failed',
                        message: 'Failed to remove cart item'
                    });
                }
            });

        this.handleListUpdated();
    }

    handleDeductCart(cart, index) {
        var { cartList } = this.state;

        var newCart = cartList[index];

        if (newCart.qty > 1) {
            newCart.qty--;
            newCart.subTotal = newCart.qty * newCart.price;

            this.updateCart(cart);
        }

        this.setState({
            cartList
        });
    }

    handleAddCart(cart, index) {
        var { cartList } = this.state;

        var newCart = cartList[index];

        newCart.qty++;
        newCart.subTotal = newCart.qty * newCart.price;

        this.updateCart(cart);

        this.setState({
            cartList
        });
    }

    handleRemoveCart(cart, index) {
        var { cartList } = this.state;

        cartList.splice(index, 1);

        fetch('https://importking.mooo.com/api/Carts/' + cart.cartId, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(result => {
                if (result.status == 200) {
                    return result.json();
                }

                throw {
                    message: result.statusText
                };
            })
            .then((result) => {
                if (this.props.onUpdated) {
                    this.props.onUpdated({
                        isShown: true,
                        mode: 'success',
                        title: 'Success',
                        message: 'Success to remove cart item'
                    });
                }
            }, (error) => {
                if (this.props.onUpdated) {
                    this.props.onUpdated({
                        isShown: true,
                        mode: 'danger',
                        title: 'Failed',
                        message: 'Failed to remove cart item'
                    });
                }
            });

        this.setState({
            cartList
        });

        this.handleListUpdated();
    }

    handleQtyChange(cart, index, e) {
        var { cartList } = this.state;

        var value = 0;

        try {
            value = parseInt(e.target.value);
        }
        catch (err) {
            value = 0;
        }

        if (value) {
            cartList[index].qty = value;
        }
        else {
            cartList[index].qty = 0;
        }

        this.updateCart(cartList[index]);

        this.setState({
            cartList: cartList
        });
    }

    handleQtyBlur(cart, index, e) {
        var { cartList } = this.state;

        var value = 0;

        try {
            value = parseInt(e.target.value);
        }
        catch (err) {
            value = 0;
        }

        if (value > 0) {
            cartList[index].qty = value;
        }
        else {
            cartList[index].qty = 1;
        }

        this.updateCart(cartList[index]);

        this.setState({
            cartList: cartList
        });
    }

    render() {
        const { isLoading, cartList } = this.state;
        if (isLoading)
            return <LoadSpinner />;
        else {
            if (cartList.length <= 0) {
                return (
                    <ul class="px-3 list-menu mt-3" style={{ marginBottom: '80px' }}>
                        <li class="text-center">
                            <img src="images/empty-cart.jpg" class="w-50" />
                            <div>Your shopping cart is empty.</div>
                            <div>Browse product and add to item to cart.</div>
                            <div><a href="/Product" class="btn btn-primary btn-sm mt-2 text-white">Browse</a></div>
                        </li>
                    </ul>
                );
            }
            else {
                return (
                    <Progress isShown={this.state.isUpdating}>
                        <ul class="px-3 list-menu mt-3" style={{ marginBottom: '80px' }}>
                            {
                                cartList.map((cart, index) => (
                                    <li class="row mb-3">
                                        <div class="col-7">
                                            <div class="title">{cart.categoryName}</div>
                                            <div>{cart.brand}</div>
                                            <span class={cart.colorCodeClass} style={{ backgroundColor: cart.colorCode }}>{cart.colorName}</span>
                                            <span>IDR. {App.Utils.formatCurrency(cart.price)}</span>
                                            <div class="small fw-bold input-subTotal">IDR. {App.Utils.formatCurrency(cart.subTotal)}</div>
                                        </div>
                                        <div class="col-5 text-center">
                                            <button class="btn btn-primary px-1 btn-sm" onClick={this.handleDeductCart.bind(this, cart, index)}>
                                                <i class="material-icons md-remove"></i>
                                            </button>
                                            <input type="number" class="form-control input-Qty d-inline form-control-sm mx-1 px-1"
                                                value={cart.qty}
                                                onChange={this.handleQtyChange.bind(this, cart, index)}
                                                onBlur={this.handleQtyBlur.bind(this, cart, index)} />
                                            <button class="btn btn-primary px-1 btn-sm" onClick={this.handleAddCart.bind(this, cart, index)}>
                                                <i class="material-icons md-add"></i>
                                            </button>
                                            <div class="mt-2 text-left">
                                                <a class="btn-Delete py-1 px-1 btn btn-danger btn-sm text-white" onClick={this.handleRemoveCart.bind(this, cart, index)}>
                                                    <i class="material-icons md-delete"></i> Remove
                                                </a>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            }
                        </ul>
                    </Progress>
                );
            }
        }
    }
}

class CartFooter extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmitOrder() {
        console.log('handleSubmitOrder');
        if (this.props.handleSubmitOrder) {
            this.props.handleSubmitOrder();
        }
    }

    render() {
        const cartList = this.props.cartList;

        let totalPrice = 0;

        if (cartList && cartList.length) {
            cartList.forEach(cart => {
                totalPrice += cart.subTotal;
            });
        }

        return (
            <div class="payment-proceed mx-2 p-2">
                <div class="row">
                    <div class="col-6">
                        <div class="fw-bold small">Total Order</div>
                        <div id="totalPrice">IDR {App.Utils.formatCurrency(totalPrice)}</div>
                    </div>
                    <div class="col-6">
                        <button id="btnSubmit" class="btn btn-sm btn-primary float-end mt-1" onClick={this.handleSubmitOrder.bind(this)}>Submit Order</button>
                    </div>
                </div>
            </div>
        );
    }
}

class CartPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            alert: null,
            cartList: [],
            isShownOrderForm: false,
            selectedAddress: null,
            orderData: {
            }
        };

        this.myRef = React.createRef();
    }

    handleCartUpdated(alert) {
        this.setState({
            alert: alert
        });
    }

    handleAlertHidden() {
        this.setState({
            alert: {
                isShown: false
            }
        });
    }

    handleListUpdate(cartList) {
        this.setState({
            cartList: cartList
        });
    }

    handleSubmitOrder() {
        this.setState({
            isShownOrderForm: true
        });

        var self = this;
        setTimeout(function () {
            self.setState({
                isShownProgress: true
            });

            fetch('https://importking.mooo.com/api/Addresses/GetByEmail/' + userMail)
                .then(result => {
                    if (result.status == 200)
                        return result.json();
                    else
                        throw {
                            message: result.statusText
                        };
                    console.log(result);
                })
                .then(result => {
                    console.log(result);
                    var selectedAddress = result.filter(x => x.isDefault == true);
                    selectedAddress = (selectedAddress.length) ? selectedAddress[0] : null;

                    self.setState({
                        isShownProgress: false,
                        selectedAddress: selectedAddress
                    });
                }, error => {
                    console.log(error);
                    self.setState({
                        isShownProgress: false,
                        selectedAddress: null,
                        alert: {
                            mode: 'danger',
                            message: error,
                            title: 'Error While Retrieving Addresses'
                        }
                    });
                });

        }, 100);
    }

    handleSubmitOrderForm() {

    }

    handleSubmitOrderFormCallback(e) {
        console.log(e);
    }

    handlePopUpHidden() {
        this.setState({
            isShownOrderForm: false
        });
    }

    handleFormInputChange(e) {
        console.log(e);

        var { orderData } = this.state;

        var inputName = e.target.name;
        orderData[inputName] = e.target.value;

        this.setState({
            orderData: orderData
        });

        console.log(this.state.orderData);
    }

    handleCourierChange(e) {
        var order = this.state.orderData;
        order.courier = e.value;
        this.setState({
            orderData: order
        });
    }

    handleAddNewAddress(e) {
        e.preventDefault();
        console.log();
    }

    render() {
        var courier = [
            { id: 'Shop Courier', text: 'Shop Courier' },
            { id: 'Lalamove', text: 'Lalamove' },
            { id: 'Others', text: 'Others' }
        ]

        var { selectedAddress } = this.state;

        return (
            <div>
                {
                    (this.state.alert) ?
                        <Alert isShown={this.state.alert.isShown} mode={this.state.alert.mode} title={this.state.alert.title} message={this.state.alert.message} onHidden={this.handleAlertHidden.bind(this)} /> :
                        <div></div>
                }

                <CartList onUpdated={this.handleCartUpdated.bind(this)} onListUpdate={this.handleListUpdate.bind(this)} />

                <CartFooter cartList={this.state.cartList} handleSubmitOrder={this.handleSubmitOrder.bind(this)} />

                <ModalPopUp id="orderModal" isShown={this.state.isShownOrderForm} class="modal" onHidden={this.handlePopUpHidden.bind(this)}>
                    <div class="modal-dialog" role="document">
                        <Progress isShown={this.state.isShownProgress} class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Submit Order</h5>
                                <button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <FormValidate ref={this.myRef} novalidate="novalidate" submitHandler={this.handleSubmitOrderFormCallback.bind(this)}>
                                    <div class="mb-3">
                                        <label class="form-label">Shipping Address</label>
                                        <div class="w-100">
                                            <div class="card border-primary">
                                                {
                                                    (selectedAddress) ? (
                                                        <div class="card-body p-2">
                                                            <div>{selectedAddress.name} ({selectedAddress.phone})</div>
                                                            <div>{selectedAddress.fullAddress}, {selectedAddress.city}, {selectedAddress.province}, {selectedAddress.zipCode}</div>
                                                        </div>
                                                    ) : (
                                                        <div class="card-body p-2">
                                                            <div class="text-center mb-2">
                                                                You have no shipping address, please add new shipping address
                                                            </div>
                                                            <button class="btn btn-primary w-100" onClick={this.handleAddNewAddress.bind(this)}>
                                                                <i class="fa-solid fa-plus me-2" />
                                                                Add Shipping Address
                                                            </button>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Courier</label>
                                        <div class="w-100">
                                            <Select2 class="form-control" width="100%" name="courier" dataSource={courier} value={this.state.orderData.courier}
                                                onChange={this.handleCourierChange.bind(this)} dropdownParent="#orderModal" />
                                        </div>
                                    </div>
                                </FormValidate>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={this.handleSubmitOrderForm.bind(this)}>Save</button>
                            </div>
                        </Progress>
                    </div>
                </ModalPopUp>
            </div>
        );
    }
}

ReactDOM.render(<CartPage />, document.getElementById('root'));