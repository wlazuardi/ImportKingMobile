﻿class CartList extends React.Component {
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
        this.loadCart();
    }

    loadCart() {
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
                                            <div class="title">{(cart.productId > -1) ? cart.categoryName : 'Other'}</div>
                                            <div>{(cart.productId > -1) ? (cart.brand + ' ' + cart.typeName) : cart.customProductType}</div>
                                            {
                                                (cart.productId > -1) ? (
                                                    <span class={cart.colorCodeClass} style={{ backgroundColor: cart.colorCode }}>{cart.colorName}</span>
                                                ) : (
                                                    <span class={cart.colorCodeClass} style={{ backgroundColor: '#000' }}>{cart.customProductColor}</span>
                                                )
                                            }                                            
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
                                        {
                                            cart.isOutOfStock ? (<div class="small text-danger">This product maybe run out of stock</div>) : (<div></div>)
                                        }
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
            isShownAddressModal: false,
            isShownAddAddressModal: false,
            orderFormRules: {
                addressId: {
                    required: true
                },
                courier: {
                    required: true
                }
            },
            orderData: {
            }
        };

        this.myRef = React.createRef();
        this.orderModalRef = React.createRef();
        this.cartListRef = React.createRef();
        this.addressModalRef = React.createRef();
        this.addressListRef = React.createRef();
        this.modalAddressFormRef = React.createRef();
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
                    var orderData = self.state.orderData;

                    if (selectedAddress.length) {
                        selectedAddress = selectedAddress[0];
                        orderData.addressId = selectedAddress.addressId;
                    }
                    else {
                        selectedAddress = null;
                        orderData.addressId = "";
                    }

                    self.setState({
                        isShownProgress: false,
                        selectedAddress: selectedAddress,
                        orderData: orderData
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
        this.myRef.current.handleSubmit();
    }

    handleSubmitOrderFormCallback(e) {
        let { cartList, orderData, selectedAddress } = this.state;
        let totalPrice = 0;

        if (cartList && cartList.length) {
            cartList.forEach(cart => {
                totalPrice += cart.subTotal;
            });
        }

        var formData = {
            email: userMail,
            orderValue: totalPrice,
            status: 'New',
            orderNo: 'X',
            shippingName: selectedAddress.name,
            shippingPhone: selectedAddress.phone,
            shippingAddress: selectedAddress.fullAddress,
            shippingCity: selectedAddress.city,
            shippingProvince: selectedAddress.province,
            shippingZipCode: selectedAddress.zipCode,
            shippingCourier: orderData.courier,
            comments: orderData.comments
        }

        fetch('https://importking.mooo.com/api/Orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
            .then(result => {
                if (result.status == 200) {
                    return result.json();
                }
                else {
                    throw {
                        message: result.statusText
                    }
                }
            })
            .then(result => {
                this.setState({
                    alert: {
                        isShown: true,
                        mode: 'success',
                        title: 'Success',
                        message: 'Order submitted successfully'
                    },
                    isShownOrderForm: false
                });

                this.cartListRef.current.loadCart();
            }, error => {
                this.setState({
                    alert: {
                        isShown: true,
                        mode: 'danger',
                        title: 'Error',
                        message: error.message
                    }
                });
            });
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
        order.courier = e.target.value;
        this.setState({
            orderData: order
        });
    }

    handleAddNewAddress(e) {
        e.preventDefault();
        this.setState({
            isShownAddressModal: true,
            isShownOrderForm: false
        });
    }

    handleChangeAddress(e) {
        e.preventDefault();
        this.setState({
            isShownAddressModal: true,
            isShownOrderForm: false
        });
    }

    handleAddAddress() {
        this.modalAddressFormRef.current.setState({
            isShownAdd: true,
            formData: {
                alias: '',
                name: '',
                phone: '',
                fullAddress: '',
                city: '',
                province: '',
                zipCode: '',
                isDefault: false
            }
        });
    }

    handleEditAddress(address) {
        this.modalAddressFormRef.current.setState({
            isShownAdd: true,
            formData: address
        });
    }

    handleSubmit() {
        this.addressListRef.current.loadAddresses();
        this.addressModalRef.current.handleUpdate();
    }

    handleAddressPopUpHidden() {
        console.log('handleAddressPopUpHidden');
        this.setState({
            isShownAddressModal: false,
            isShownOrderForm: true
        });
    }

    handleItemClick(address) {
        var orderData = this.state.orderData;
        orderData.addressId = address.addressId;

        this.setState({
            selectedAddress: address,
            isShownAddressModal: false,
            isShownOrderForm: true,
            oderData: orderData
        });
    }

    render() {
        var courier = [
            { id: 'Shop Courier', text: 'Shop Courier' },
            { id: 'Lalamove', text: 'Lalamove' },
            { id: 'Others', text: 'Others' }
        ]

        var { selectedAddress } = this.state;

        var anyOutOfStockProduct = false;

        if (this.state.cartList.length > 0) {
            var temp = this.state.cartList.filter(x => x.isOutOfStock);
            if (temp.length > 0) {
                anyOutOfStockProduct = true;
            }
        }

        return (
            <div>
                {
                    (this.state.alert) ?
                        <Toast isShown={this.state.alert.isShown} mode={this.state.alert.mode} title={this.state.alert.title} message={this.state.alert.message} onHidden={this.handleAlertHidden.bind(this)} /> :
                        <div></div>
                }
                <h5 class="pt-3 px-3">Shopping Cart</h5>
                <CartList ref={this.cartListRef} onUpdated={this.handleCartUpdated.bind(this)} onListUpdate={this.handleListUpdate.bind(this)} />

                {
                    (this.state.cartList.length > 0) ?
                        <CartFooter cartList={this.state.cartList} handleSubmitOrder={this.handleSubmitOrder.bind(this)} /> :
                        <div></div>
                }

                <ModalPopUp id="orderModal" ref={this.orderModalRef} isShown={this.state.isShownOrderForm} class="modal" onHidden={this.handlePopUpHidden.bind(this)}>
                    <div class="modal-dialog" role="document">
                        <Progress isShown={this.state.isShownProgress} class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Submit Order</h5>
                                <button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <FormValidate ref={this.myRef} novalidate="novalidate" rules={this.state.orderFormRules} submitHandler={this.handleSubmitOrderFormCallback.bind(this)}>
                                    <div class="alert alert-info">This is the last step. Make sure your order and shipping information is already correct.</div>
                                    <div class="mb-3">
                                        <label class="form-label">Shipping Address</label>
                                        <div class="w-100">
                                            <div class="card border-primary">
                                                {
                                                    (selectedAddress) ? (
                                                        <div>
                                                            <div class="card-header p-2 bg-primary text-white">
                                                                {selectedAddress.alias}
                                                            </div>
                                                            <div class="card-body p-2" onClick={this.handleChangeAddress.bind(this)}>
                                                                <div>{selectedAddress.name} ({selectedAddress.phone})</div>
                                                                <div>{selectedAddress.fullAddress}, {selectedAddress.city}, {selectedAddress.province}, {selectedAddress.zipCode}</div>
                                                            </div>
                                                            <input type="text" name="addressId" value={this.state.orderData.addressId} class="form-control form-control-card d-none" />
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
                                                            <input type="text" name="addressId" value="" class="form-control form-control-card d-none" />
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Courier</label>
                                        <div>
                                            <select class="form-control" name="courier" value={this.state.orderData.courier} onChange={this.handleCourierChange.bind(this)}>
                                                <option value=""></option>
                                                <option value="Shop Courier">Shop Courier</option>
                                                <option value="Lalamove">Lalamove</option>
                                                <option value="Others">Others</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Comments</label>
                                        <div>
                                            <input type="text" name="comments" class="form-control" />
                                        </div>
                                    </div>
                                    {
                                        anyOutOfStockProduct ? (
                                            <div class="alert alert-warning">Some of your products maybe run out of stock. Are you still want to submit order?</div>
                                        ) : (<div></div>)

                                    }
                                </FormValidate>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <button type="button" class="btn btn-primary" onClick={this.handleSubmitOrderForm.bind(this)}>Submit</button>
                            </div>
                        </Progress>
                    </div>
                </ModalPopUp>

                <ModalPopUp ref={this.addressModalRef} id="addressModal" isShown={this.state.isShownAddressModal} class="modal" onHidden={this.handleAddressPopUpHidden.bind(this)}>
                    <div class="modal-dialog" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Maintain Shipping Address</h5>
                                <button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body px-2">
                                <div class="px-2 mb-3 text-center">Choose shipping address below</div>
                                <AddressList ref={this.addressListRef}
                                    handleAddAddress={this.handleAddAddress.bind(this)}
                                    handleEditAddress={this.handleEditAddress.bind(this)}
                                    handleItemClick={this.handleItemClick.bind(this)} />
                            </div>
                        </div>
                    </div>
                </ModalPopUp>

                <ModalAddressForm ref={this.modalAddressFormRef} handleSubmit={this.handleSubmit.bind(this)} />
            </div>
        );
    }
}

ReactDOM.render(<CartPage />, document.getElementById('root'));