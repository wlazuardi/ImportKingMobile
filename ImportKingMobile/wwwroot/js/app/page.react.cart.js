// Sample comments
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
        this.loadCart();
    }

    loadCart() {
        this.setState({
            isLoading: true
        });

        fetch(hostUrl + '/api/Carts?email=' + userMail, {
            method: 'GET',
            credentials: 'include'
        })
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
        fetch(hostUrl + '/api/Carts/', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cart),
            credentials: 'include'
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

        fetch(hostUrl + '/api/Carts/' + cart.cartId, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include'
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
                                            <div class="title">
                                                {(cart.productId == -1 && cart.categoryName == '') ? 'Other' : cart.categoryName}
                                                {(cart.isChecked) ? (<i class="ms-2 fa-solid fa-square-check text-primary" />) : (<i />)}
                                            </div>
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
            user: null,
            orderValue: 0,
            deliveryFee: 0,
            deliveryFeeDiscountPercentage: 0,
            deliveryFeeDiscount: 0,
            adminFee: 0,
            subTotal: 0,
            codPercentage: 0.02,
            codFee: 0,
            totalPayment: 0,
            codProfitMargin: 0,
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
                },
                dropshipperName: {
                    required: false
                },
                dropshipperPhone: {
                    required: false
                },
                codBillAmount: {
                    required: false
                }
            },
            deliveryServices: [],
            orderData: {
                courier: '',
                dropshipperName: '',
                dropshipperPhone: '',
                bookingCode: '',
                recipientName: '',
                recipientPhoneNo: '',
                codBillAmount: '',
                deliveryService: '',
                comments: ''
            },
            isLoadingSubmit: false,
            isDropshipping: false,
            dropshipType: 'manual',
            deliveryType: 'regular',
            deliveryLabelFile: null,
            step: 1,
            wallet: null,
            isUseWallet: false,
            usedWalletAmount: 0
        };

        this.myRef = React.createRef();
        this.orderModalRef = React.createRef();
        this.cartListRef = React.createRef();
        this.addressModalRef = React.createRef();
        this.addressListRef = React.createRef();
        this.modalAddressFormRef = React.createRef();
        this.loadUser();
        this.loadLookup();
    }

    loadWallet(userId) {
        fetch(hostUrl + '/api/Users/' + userId + '/Wallet', {
            method: 'GET',
            credentials: 'include'
        })
            .then((result) => {
                if (result.status == 200) {
                    return result.json();
                }
                else {
                    throw {
                        message: result.statusText
                    }
                }
            })
            .then((result) => {
                this.setState({
                    wallet: result
                });
            });
    }

    loadUser() {
        fetch(hostUrl + '/api/Users/GetByEmail/' + userMail, {
            method: 'GET',
            credentials: 'include'
        })
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
                var { orderData } = this.state;

                var isDropshipping = false;

                if (result.userType == App.Utils.UserType.Dropshipper) {
                    isDropshipping = true;
                }
                else if (result.userType == App.Utils.UserType.Reseller) {
                    orderData.courier = 'others';
                }
                else if (result.userType == App.Utils.UserType.BasicUser) {
                    isDropshipping = false;
                }

                var deliveryFeeDiscountPercentage = parseFloat(result.deliveryFeeDiscount);
                if (isNaN(deliveryFeeDiscountPercentage)) {
                    deliveryFeeDiscountPercentage = 0;
                }

                this.setState({
                    isDropshipping: isDropshipping,
                    user: result,
                    deliveryFeeDiscountPercentage: deliveryFeeDiscountPercentage
                });

                this.loadWallet(result.userId);
            });
    }

    loadLookup() {
        fetch(hostUrl + '/api/Lookups', {
            method: 'GET',
            credentials: 'include'
        })
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
                var adminFee = 0, codPercentage = 0;

                var temp = result.filter(x => x.category == 'ADMIN_FEE');
                if (temp && temp.length > 0) {
                    adminFee = parseInt(temp[0].value);
                }

                var temp = result.filter(x => x.category == 'COD_FEE');
                if (temp && temp.length > 0) {
                    codPercentage = parseFloat(temp[0].value);
                }

                this.setState({
                    adminFee: adminFee,
                    codPercentage: codPercentage
                });
            });
    }

    handleDropshipper(e) {
        this.setState({
            isDropshipping: e.target.checked
        });
    }

    handleDropshipType(e) {
        this.setState({
            dropshipType: e.target.value
        });

        var { orderData, deliveryType, deliveryFee } = this.state;

        if (e.target.value == 'marketplace') {
            deliveryFee = 0;
            orderData.courier = '';
            deliveryType = 'regular';
        }

        this.setState({
            orderData: orderData,
            deliveryType,
            deliveryFee
        });
    }

    handleDeliveryType(e) {
        var { orderData } = this.state;

        if (e.target.value == 'cod') {
            orderData.courier = 'jne';
        }
        else {
            orderData.courier = '';
        }

        this.setState({
            deliveryType: e.target.value,
            orderData: orderData
        });
    }

    handleUpload() {
        var fileUpload = document.getElementsByName('deliveryLabel')[0];
        fileUpload.files = null;
        fileUpload.click();
    }

    handleUploadChange(e) {
        var files = e.target.files;
        this.setState({
            isShownProgress: true
        });

        if (files.length > 0) {
            var data = new FormData();
            data.append('files', files[0]);

            fetch(hostUrl + '/api/Attachments', {
                method: 'POST',
                body: data,
                credentials: 'include'
            }).then(
                response => response.json() // if the response is a JSON object
            ).then(success => {
                if (success && success.length > 0) {
                    this.setState({
                        deliveryLabelFile: success[0].fileName,
                        isShownProgress: false
                    });
                }
            }).catch(
                error => {
                    this.setState({
                        isShownProgress: false
                    });
                }
            );
        }
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

            fetch(hostUrl + '/api/Addresses/GetByEmail/' + userMail, {
                method: 'GET',
                credentials: 'include'
            })
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

                    // getDeliveryFee Here
                    self.getDeliveryFee(selectedAddress, orderData);

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
        let { user, orderData, selectedAddress, isDropshipping, dropshipType, deliveryType, deliveryLabelFile, totalPayment } = this.state;

        var isRequiredPayment = user && (
            user.userType == App.Utils.UserType.BasicUser ||
            user.userType == App.Utils.UserType.Dropshipper || (
                user.userType == App.Utils.UserType.Reseller && isDropshipping == true
            )
        ) && deliveryType != 'cod' && totalPayment > 0;

        var codBillAmount = 0;
        if (orderData.codBillAmount) {
            codBillAmount = parseInt(orderData.codBillAmount.replace(/[.]|\D/gi, ''));
        }

        var formData = {
            email: userMail,
            orderValue: this.state.orderValue,
            status: 'New',
            orderNo: 'X',
            shippingName: (isDropshipping && dropshipType == 'marketplace') ? orderData.recipientName : selectedAddress.name,
            shippingPhone: (isDropshipping && dropshipType == 'marketplace') ? orderData.recipientPhoneNo : selectedAddress.phone,
            shippingAddress: (isDropshipping && dropshipType == 'marketplace') ? '' : selectedAddress.fullAddress,
            shippingProvince: (isDropshipping && dropshipType == 'marketplace') ? '' : selectedAddress.province,
            shippingCity: (isDropshipping && dropshipType == 'marketplace') ? '' : selectedAddress.city,
            shippingSubDistrict: (isDropshipping && dropshipType == 'marketplace') ? '' : selectedAddress.subDistrict,
            shippingZipCode: (isDropshipping && dropshipType == 'marketplace') ? '' : selectedAddress.zipCode,
            shippingProvinceId: (isDropshipping && dropshipType == 'marketplace') ? '' : selectedAddress.provinceId,
            shippingCityId: (isDropshipping && dropshipType == 'marketplace') ? '' : selectedAddress.cityId,
            shippingSubDistrictId: (isDropshipping && dropshipType == 'marketplace') ? '' : selectedAddress.subDistrictId,
            shippingCourier: orderData.courier,
            deliveryService: orderData.deliveryService,
            deliveryServiceText: orderData.deliveryServiceText,
            comments: orderData.comments,
            isDropshipping: isDropshipping,
            isFromMarketplace: (isDropshipping && dropshipType == 'marketplace'),
            isCOD: deliveryType == 'cod',
            deliveryLabelFile: deliveryLabelFile,
            dropshipperName: orderData.dropshipperName,
            dropshipperPhone: orderData.dropshipperPhone,
            codBillAmount: (deliveryType == 'cod') ? codBillAmount : 0,
            bookingCode: orderData.bookingCode,
            deliveryFee: this.state.deliveryFee,
            deliveryFeeDiscount: this.state.deliveryFeeDiscount,
            adminFee: this.state.adminFee,
            codFee: this.state.codFee,
            subTotal: this.state.subTotal,
            paymentAmount: this.state.totalPayment,
            senderName: this.state.user.firstName + ' ' + this.state.user.lastName,
            senderPhone: this.state.user.phoneNumber,
            isUseWallet: this.state.isUseWallet,
            walletAmount: this.state.usedWalletAmount
        }

        this.setState({
            isShownProgress: true
        });

        fetch(hostUrl + '/api/Orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
            credentials: 'include'
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

                if (isRequiredPayment) {
                    fetch(hostUrl + '/api/Payments/' + result + '/Token', {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                        credentials: 'include'
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
                            this.setState({
                                alert: {
                                    isShown: true,
                                    mode: 'success',
                                    title: 'Success',
                                    message: 'Order submitted, please complete the payment'
                                },
                                isShownOrderForm: false,
                                isShownProgress: false
                            });

                            this.cartListRef.current.loadCart();
                            var that = this;
                            setTimeout(function () {
                                window.snap.pay(resToken.paymentToken, {
                                    gopayMode: 'deeplink',
                                    onSuccess: function (res) {
                                        that.setState({
                                            alert: {
                                                isShown: true,
                                                mode: 'success',
                                                title: 'Success',
                                                message: 'Payment succeed. Refreshing the page in 2 seconds.'
                                            }
                                        });

                                        setTimeout(function () {
                                            window.location.href = '/Order/' + result + '/Detail';
                                        }, 2000);
                                    },
                                    onError: function (res) {
                                        that.setState({
                                            alert: {
                                                isShown: true,
                                                mode: 'danger',
                                                title: 'Payment Failed',
                                                message: 'Please try again.'
                                            }
                                        });

                                        setTimeout(function () {
                                            window.location.href = '/Order/' + result + '/Detail';
                                        }, 2000);
                                    },
                                    onPending: function (result) {
                                        that.setState({
                                            alert: {
                                                isShown: true,
                                                mode: 'info',
                                                title: 'Payment Pending',
                                                message: 'Please complete payment to process order.'
                                            }
                                        });

                                        setTimeout(function () {
                                            window.location.href = '/Order/' + result + '/Detail';
                                        }, 2000);
                                    },
                                    onClose: function () {
                                        that.setState({
                                            alert: {
                                                isShown: true,
                                                mode: 'warning',
                                                title: 'Warning',
                                                message: 'Please complete the payment to proceed the request.'
                                            }
                                        });

                                        setTimeout(function () {
                                            window.location.href = '/Order/' + result + '/Detail';
                                        }, 2000);
                                    }
                                });
                            }, 1000);
                        });
                }
                else {
                    this.setState({
                        alert: {
                            isShown: true,
                            mode: 'success',
                            title: 'Success',
                            message: 'Order submitted successfully'
                        },
                        isShownOrderForm: false,
                        isShownProgress: false
                    });

                    this.cartListRef.current.loadCart();
                }
            }, error => {
                this.setState({
                    alert: {
                        isShown: true,
                        mode: 'danger',
                        title: 'Error',
                        message: error.message
                    },
                    isShownProgress: false
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
        var { orderData } = this.state;

        orderData.courier = e.target.value;

        // getDeliveryFee here
        this.getDeliveryFee(this.state.selectedAddress, orderData);

        this.setState({
            orderData: orderData
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
                cityId: 0,
                province: '',
                provinceId: 0,
                subDistrict: '',
                subDistrictId: 0,
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

        // getDeliveryFee Here
        this.getDeliveryFee(address, orderData);
    }

    getDeliveryFee(selectedAddress, orderData) {
        if (!selectedAddress || !selectedAddress.subDistrictId)
            return;

        if (orderData.courier == 'others') {
            var deliveryServices = [{ id: 'other', text: 'Other', price: 0 }];
            this.setState({
                deliveryServices,
                deliveryFee: 0
            });
            return;
        }

        this.setState({
            isShownProgress: true
        });

        var data = {
            origin: '2088',
            destination: selectedAddress.subDistrictId,
            destinationZipCode: selectedAddress.zipCode,
            weight: 1,
            courier: orderData.courier
        };

        fetch(hostUrl + '/api/Deliveries/Cost', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include'
        })
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
                var deliveryServices = [{ id: '', text: '', price: 0 }];

                this.setState({
                    isShownProgress: false
                });

                if (!result.rajaOngkir.results) {
                    this.setState({
                        deliveryServices: deliveryServices
                    });
                    return;
                }

                $.each(result.rajaOngkir.results[0].costs, function (i, cost) {
                    $.each(cost.costList, function (j, costList) {
                        var text = `${cost.service} (${costList.etd} days) - IDR ${App.Utils.formatCurrency(costList.value)}`;
                        deliveryServices.push({
                            id: cost.service,
                            text: text,
                            price: costList.value
                        });
                    });
                });

                var orderData = this.state.orderData;
                orderData['deliveryService'] = '';

                this.setState({
                    orderData: orderData,
                    deliveryServices: deliveryServices
                });
            }, (error) => {
                this.setState({
                    isShownProgress: false
                });
            });
    }

    isPdf(fileName) {
        return fileName && fileName.endsWith('.pdf');
    }

    handleBillAmountChange(value) {
        var { orderData } = this.state;
        value = value.replace(/[.]|\D/gi, '');
        orderData.codBillAmount = App.Utils.formatCurrency(value);
        this.setState({
            orderData: orderData
        });
    }

    handlePrevForm() {
        var { step } = this.state;

        if (step > 1) {
            step--;
            this.setState({
                step
            });
        }
        else {
            this.setState({
                isShownOrderForm: false
            });
        }
    }

    handleNextFormValidated() {
        var {
            step,
            cartList,
            isDropshipping,
            deliveryType,
            dropshipType,
            deliveryFee,
            deliveryFeeDiscount,
            deliveryFeeDiscountPercentage,
            adminFee,
            subTotal,
            codPercentage,
            codFee,
            totalPayment,
            orderData,
            codProfitMargin,
            wallet,
            usedWalletAmount,
            isUseWallet
        } = this.state;

        var isValid = this.myRef.current.isValid();
        if (!isValid) return;

        if (step < 3) {
            step = 2;
        }

        var orderValue = 0;

        var balance = wallet ? wallet.wltBal : 0;

        if (cartList && cartList.length) {
            cartList.forEach(cart => {
                orderValue += cart.subTotal;
            });
        }

        deliveryFeeDiscount = parseInt(deliveryFee * deliveryFeeDiscountPercentage);
        deliveryFee = parseInt(deliveryFee - deliveryFeeDiscount);
        subTotal = orderValue + deliveryFee + adminFee;

        if (deliveryType == 'cod') {
            var codBillAmount = orderData.codBillAmount.replace(/[.]/gi, '');
            codFee = Math.ceil(codPercentage * parseInt(codBillAmount));
            totalPayment = subTotal + codFee;

            // if (isDropshipping) {
            codProfitMargin = parseInt(codBillAmount) - totalPayment;
            //}
            //else {
            //    codProfitMargin = 0;
            //}
        }
        else {
            totalPayment = subTotal;
        }

        if (isUseWallet) {
            if (totalPayment >= balance)
                usedWalletAmount = balance;
            else
                usedWalletAmount = totalPayment;

            totalPayment -= usedWalletAmount;
        }
        else {
            usedWalletAmount = 0;
        }

        this.setState({
            step,
            orderValue,
            subTotal,
            codFee,
            totalPayment,
            codProfitMargin,
            deliveryFeeDiscount,
            usedWalletAmount
        });
    }

    handleNextForm() {
        var {
            isDropshipping,
            deliveryType,
            dropshipType,
        } = this.state;

        var orderFormRules = {
            addressId: {
                required: true
            },
            courier: {
                required: true
            },
            deliveryService: {
                required: true
            },
            dropshipperName: {
                required: (isDropshipping == true)
            },
            dropshipperPhone: {
                required: (isDropshipping == true)
            },
            deliveryLabelFile: {
                required: (isDropshipping == true && dropshipType == 'marketplace')
            },
            bookingCode: {
                required: (isDropshipping == true && dropshipType == 'marketplace')
            },
            recipientName: {
                required: (isDropshipping == true && dropshipType == 'marketplace')
            },
            recipientPhoneNo: {
                required: (isDropshipping == true && dropshipType != 'marketplace')
            },
            codBillAmount: {
                required: (deliveryType == 'cod')
            }
        };

        this.setState({
            orderFormRules
        });

        this.myRef.current.updateRules(orderFormRules);
        this.handleNextFormValidated();
    }

    handleOrderDataChange(e) {
        var { orderData, deliveryFee } = this.state;
        var name = e.target.name;
        orderData[name] = e.target.value;

        if (name == 'deliveryService') {
            var temp = this.state.deliveryServices.filter(x => x.id == e.target.value);
            deliveryFee = (temp && temp.length > 0) ? temp[0].price : 0;
            orderData['deliveryServiceText'] = (temp && temp.length > 0) ? temp[0].text : '';
        }

        this.setState({
            orderData,
            deliveryFee
        });
    }

    handleUseWallet(e) {
        var isUseWallet = e.target.checked;

        this.setState({
            isUseWallet: isUseWallet
        });

        var that = this;
        setTimeout(function () {
            that.handleNextFormValidated();
        }, 100);
    }

    render() {
        var { user, selectedAddress, wallet, isDropshipping, deliveryType, usedWalletAmount } = this.state;

        var anyOutOfStockProduct = false;

        if (this.state.cartList.length > 0) {
            var temp = this.state.cartList.filter(x => x.isOutOfStock);
            if (temp.length > 0) {
                anyOutOfStockProduct = true;
            }
        }

        var isRequiredPayment = user && (
            user.userType == App.Utils.UserType.BasicUser ||
            user.userType == App.Utils.UserType.Dropshipper || (
                user.userType == App.Utils.UserType.Reseller && isDropshipping == true
            )
        ) && deliveryType != 'cod';

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
                    (this.state.cartList.length > 0 && !this.state.isShownOrderForm) ?
                        <CartFooter cartList={this.state.cartList} handleSubmitOrder={this.handleSubmitOrder.bind(this)} /> :
                        <div></div>
                }

                <ModalPopUp id="orderModal" ref={this.orderModalRef} isShown={this.state.isShownOrderForm} class="modal modal-on-top" onHidden={this.handlePopUpHidden.bind(this)}>
                    <div class="modal-dialog modal-fullscreen" role="document" style={{ zIndex: '10002' }}>
                        <Progress isShown={this.state.isShownProgress} class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Submit Order</h5>
                                <button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <div class="text-center mb-5 form-step" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <div class={this.state.step >= 1 ? 'step active' : 'step'}>
                                        {
                                            (this.state.step == 1) ? (<img alt="Shipping Info" src="/images/icon8/icons8-product.gif" />) : (<img alt="Shipping Info" src="/images/icon8/icons8-product-48.png" />)
                                        }
                                        <div>Shipping Info</div>
                                    </div>
                                    <div class={this.state.step >= 2 ? 'step active' : 'step'}>
                                        {
                                            (this.state.step == 2) ? (<img alt="Payment" src="/images/icon8/icons8-cheque.gif" />) : (<img alt="Payment" src="/images/icon8/icons8-cheque-48.png" />)
                                        }
                                        <div>Payment</div>
                                    </div>
                                    <div class={this.state.step >= 3 ? 'step active' : 'step'}>
                                        {
                                            (this.state.step == 3) ? (<img alt="Payment" src="/images/icon8/icons8-done.gif" />) : (<img alt="Payment" src="/images/icon8/icons8-done-48.png" />)
                                        }
                                        <div>Done</div>
                                    </div>
                                </div>
                                <FormValidate ref={this.myRef} novalidate="novalidate" rules={this.state.orderFormRules} submitHandler={this.handleSubmitOrderFormCallback.bind(this)}>
                                    {
                                        (this.state.step == 1) ? (
                                            <div>
                                                <div class="row alert alert-info">Please fill and review your shipping information</div>
                                                {
                                                    (user != null && user.userType == App.Utils.UserType.Reseller && user.allowDropship == true) ? (
                                                        <div class="mb-3">
                                                            <div>
                                                                <div class="form-switch">
                                                                    <input class="form-check-input me-2" type="checkbox" name="isDropship" id="isDropship" role="switch"
                                                                        checked={this.state.isDropshipping}
                                                                        onChange={this.handleDropshipper.bind(this)}
                                                                    />
                                                                    <label class="form-check-label" for="isDropship">Send as Dropshipper</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )
                                                }
                                                {
                                                    (user != null && this.state.isDropshipping == true) ? (
                                                        <div>
                                                            <div class="mb-3">
                                                                <label class="form-label">Dropship Type</label>
                                                                <div>
                                                                    <div class="form-check form-check-inline ps-0">
                                                                        <input class="form-radio-input me-2" type="radio" name="dropshipType" id="manualDropship" value="manual"
                                                                            checked={this.state.dropshipType == 'manual'}
                                                                            onChange={this.handleDropshipType.bind(this)} />
                                                                        <label class="form-radio-label" for="manualDropship">Manual</label>
                                                                    </div>
                                                                    <div class="form-check form-check-inline">
                                                                        <input class="form-radio-input me-2" type="radio" name="dropshipType" id="marketplaceDropship" value="marketplace"
                                                                            checked={this.state.dropshipType == 'marketplace'}
                                                                            onChange={this.handleDropshipType.bind(this)} />
                                                                        <label class="form-radio-label" for="marketplaceDropship">From Marketplace</label>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="mb-3">
                                                                <label class="form-label">Dropshipper Name</label>
                                                                <div>
                                                                    <input type="text" name="dropshipperName" class="form-control" placeholder="Custom Gadget Shop"
                                                                        value={this.state.orderData.dropshipperName}
                                                                        onChange={this.handleOrderDataChange.bind(this)}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <div class="mb-3">
                                                                <label class="form-label">Dropshipper Phone</label>
                                                                <div>
                                                                    <input type="text" name="dropshipperPhone" class="form-control" placeholder="08123456789"
                                                                        value={this.state.orderData.dropshipperPhone}
                                                                        onChange={this.handleOrderDataChange.bind(this)}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )
                                                }
                                                <div class="mb-3">
                                                    <label class="form-label">Courier</label>
                                                    <div>
                                                        <select class="form-control" name="courier" value={this.state.orderData.courier}
                                                            onChange={this.handleCourierChange.bind(this)}
                                                            disabled={this.state.deliveryType == 'cod'}>
                                                            <option value=""></option>
                                                            <option value="jne">JNE</option>
                                                            <option value="jnt">JNT</option>
                                                            <option value="pos">Pos Indonesia</option>
                                                            <option value="sicepat">SiCepat</option>
                                                            <option value="anteraja">AnterAja</option>
                                                            <option value="shopee_express">Shopee Express</option>
                                                            <option value="lazada_express">Lazada Express</option>
                                                            <option value="others">Others</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                {
                                                    (this.state.isDropshipping == false || this.state.dropshipType == 'manual') ? (
                                                        <div>
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
                                                                                        Add Shipping Addresss
                                                                                    </button>
                                                                                    <input type="text" name="addressId" value="" class="form-control form-control-card d-none" />
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div class="mb-3">
                                                                <label class="form-label">Upload Delivery Label</label>
                                                                <div class="alert alert-info"><i class="fa fa-info-circle" /> Mandatory for Shopee & Lazada Express</div>
                                                                <div class="w-100">
                                                                    <div class="card border-primary">
                                                                        <div class="card-body">
                                                                            <button class="btn btn-primary w-100" type="button" onClick={this.handleUpload.bind(this)}>
                                                                                <i class="fa fa-upload me-2" />
                                                                                Upload Label from Marketplace
                                                                            </button>
                                                                            {
                                                                                (this.state.deliveryLabelFile) ? (
                                                                                    (this.isPdf(this.state.deliveryLabelFile)) ? (
                                                                                        <div>
                                                                                                <PdfViewer id="deliveryLabelViewer" url={hostUrl + '/api/FileHandlers?fileName=' + this.state.deliveryLabelFile} class="pt-2 mt-2 pdf-viewer-container"></PdfViewer>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div>
                                                                                            <img class="w-100 mt-2" src={hostUrl + '/Uploads/' + this.state.deliveryLabelFile} />
                                                                                        </div>
                                                                                    )
                                                                                ) : (
                                                                                    <div></div>
                                                                                )
                                                                            }
                                                                            <input type="hidden" name="deliveryLabelFile" value={this.state.deliveryLabelFile} />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <input type="file" name="deliveryLabel" class="d-none" accept="application/pdf,image/*"
                                                                    onChange={this.handleUploadChange.bind(this)}
                                                                />
                                                            </div>
                                                            <div class="mb-3">
                                                                <label class="form-label">Delivery Booking Code</label>
                                                                <div>
                                                                    <input type="text" name="bookingCode" class="form-control" placeholder="Booking Code from Delivery Service"
                                                                        value={this.state.orderData.bookingCode}
                                                                        onChange={this.handleOrderDataChange.bind(this)} />
                                                                </div>
                                                            </div>
                                                            <div class="mb-3">
                                                                <label class="form-label">Recipient Name</label>
                                                                <div>
                                                                    <input type="text" name="recipientName" class="form-control" placeholder="Budi Anto"
                                                                        value={this.state.orderData.recipientName}
                                                                        onChange={this.handleOrderDataChange.bind(this)} />
                                                                </div>
                                                            </div>
                                                            <div class="mb-3">
                                                                <label class="form-label">Recipient Phone No.</label>
                                                                <div>
                                                                    <input type="text" name="recipientPhoneNo" class="form-control" placeholder="08123456789"
                                                                        value={this.state.orderData.recipientPhoneNo}
                                                                        onChange={this.handleOrderDataChange.bind(this)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    (this.state.dropshipType == 'marketplace') ? (
                                                        <div></div>
                                                    ) : (
                                                        <div class="mb-3">
                                                            <label class="form-label">Delivery Type</label>
                                                            <div>
                                                                <div class="form-check form-check-inline ps-0">
                                                                    <input class="form-radio-input me-2" type="radio" name="deliveryType" id="regularDelivery" value="regular"
                                                                        checked={this.state.deliveryType == 'regular'}
                                                                        onChange={this.handleDeliveryType.bind(this)}
                                                                    />
                                                                    <label class="form-radio-label" for="regularDelivery">Regular</label>
                                                                </div>
                                                                <div class="form-check form-check-inline">
                                                                    <input class="form-radio-input me-2" type="radio" name="deliveryType" id="codDelivery" value="cod"
                                                                        checked={this.state.deliveryType == 'cod'}
                                                                        onChange={this.handleDeliveryType.bind(this)}
                                                                    />
                                                                    <label class="form-radio-label" for="codDelivery">Cash on Delivery</label>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                {
                                                    (this.state.deliveryType == 'cod') ? (
                                                        <div>
                                                            <div class="mb-3">
                                                                <label class="form-label">COD Billing Amount</label>
                                                                <div>
                                                                    <input type="text" name="codBillAmount" class="form-control"
                                                                        placeholder="100.000"
                                                                        value={this.state.orderData.codBillAmount}
                                                                        onChange={e => this.handleBillAmountChange(e.target.value)} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )
                                                }
                                                {
                                                    (this.state.dropshipType != 'marketplace') ? (
                                                        <div class="mb-3">
                                                            <label class="form-label">Delivery Service</label>
                                                            <div>
                                                                {
                                                                    (this.state.deliveryServices && this.state.deliveryServices.length > 0) ? (
                                                                        <select class="form-control" name="deliveryService" placeholder="Delivery Service" value={this.state.orderData.deliveryService} onChange={this.handleOrderDataChange.bind(this)}>
                                                                            {
                                                                                this.state.deliveryServices.map(x => (
                                                                                    <option value={x.id}>{x.text}</option>
                                                                                ))
                                                                            }
                                                                        </select>
                                                                    ) : (
                                                                        <div class="alert alert-info"><i class="fa fa-info-circle" /> Please choose courier & address first</div>
                                                                    )
                                                                }
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )
                                                }
                                                <div class="mb-3">
                                                    <label class="form-label">Comments</label>
                                                    <div>
                                                        <textarea name="comments" class="form-control"
                                                            value={this.state.orderData.comments}
                                                            onChange={this.handleOrderDataChange.bind(this)} />
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <div class="mb-5">
                                                <div class="row alert alert-info">Please review your payment information</div>
                                                {
                                                    (user != null && user.userType == App.Utils.UserType.Reseller && !this.state.isDropshipping) ? (
                                                        <div class="row alert alert-success">You can submit the order and skip the payment, because you order as a reseller</div>
                                                    ) : (
                                                        <div></div>
                                                    )
                                                }
                                                {
                                                    (this.state.deliveryType == 'cod') ? (
                                                        <div>
                                                            <div class="row mt-5 mb-2 fw-bold">
                                                                <div class="col-6">
                                                                    COD Bill Amount
                                                                </div>
                                                                <div class="col text-end fw-bold">
                                                                    IDR. {App.Utils.formatCurrency(this.state.orderData.codBillAmount)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )
                                                }
                                                {
                                                    (isRequiredPayment && wallet && wallet.wltBal) ? (
                                                        <div class="mb-3">
                                                            <div class="row alert alert-success">
                                                                <div class="form-switch">
                                                                    <input class="form-check-input me-2" type="checkbox" name="isUseWallet" id="isUseWallet" role="switch"
                                                                        checked={this.state.isUseWallet}
                                                                        onChange={this.handleUseWallet.bind(this)} />
                                                                    <label class="form-check-label" for="dropshipper">Use Remaining Wallet Balance</label>
                                                                </div>
                                                                <div class="fw-bold d-flex justify-content-start mt-2">
                                                                    <div class="me-2">
                                                                        <i class="fa fa-wallet me-1"></i>Wallet Balance:
                                                                    </div>
                                                                    <div>
                                                                        IDR. {App.Utils.formatCurrency(wallet.wltBal)}
                                                                        {
                                                                            (usedWalletAmount) ?
                                                                            (
                                                                                <span class="ms-2 text-danger">
                                                                                    - IDR. {App.Utils.formatCurrency(usedWalletAmount)}
                                                                                </span>
                                                                            ) :
                                                                            (
                                                                                <span>
                                                                                </span>
                                                                            )
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (<div></div>)
                                                }
                                                <div class="row mb-2">
                                                    <div class="col-6 fw-bold">
                                                        Total Product
                                                    </div>
                                                    <div class="col text-end fw-bold">
                                                        IDR. {App.Utils.formatCurrency(this.state.orderValue)}
                                                    </div>
                                                </div>
                                                <div class="row mb-2">
                                                    <div class="col-6 fw-bold">
                                                        Delivery Fee
                                                    </div>
                                                    <div class="col text-end fw-bold">
                                                        IDR. {App.Utils.formatCurrency(this.state.deliveryFee)}
                                                    </div>
                                                </div>
                                                {
                                                    (this.state.deliveryFeeDiscountPercentage) ? (
                                                        <div class="row mb-2">
                                                            <div class="col-6 fw-bold">
                                                                Delivery Fee Discount
                                                            </div>
                                                            <div class="col text-end fw-bold">
                                                                - IDR. {App.Utils.formatCurrency(this.state.deliveryFee * this.state.deliveryFeeDiscountPercentage)}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div />
                                                    )
                                                }
                                                <div class="row mb-2">
                                                    <div class="col-6">
                                                        Admin Fee
                                                    </div>
                                                    <div class="col text-end">
                                                        IDR. {App.Utils.formatCurrency(this.state.adminFee)}
                                                    </div>
                                                </div>
                                                {
                                                    (this.state.isDropshipping == true && this.state.deliveryType == 'cod') ? (
                                                        <div>
                                                            <div class="row mb-2">
                                                                <div class="col-6">
                                                                    COD Fee<br />({this.state.codPercentage * 100}% from Bill)
                                                                </div>
                                                                <div class="col text-end">
                                                                    IDR. {App.Utils.formatCurrency(this.state.codFee)}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )
                                                }
                                                {
                                                    (this.state.isUseWallet) ? (
                                                        <div class="row mb-2 text-danger">
                                                            <div class="col-6">
                                                                Wallet Balance
                                                            </div>
                                                            <div class="col text-end">
                                                                - IDR. {App.Utils.formatCurrency(usedWalletAmount)}
                                                            </div>
                                                        </div>
                                                    ) : (<div />)
                                                }
                                                <div class="row mb-2 fw-bold border-top pt-2">
                                                    <div class="col-6">
                                                        Total Payment
                                                    </div>
                                                    <div class="col text-end fw-bold">
                                                        IDR. {App.Utils.formatCurrency(this.state.totalPayment)}
                                                    </div>
                                                </div>
                                                {
                                                    (this.state.deliveryType == 'cod') ? (
                                                        <div>
                                                            {
                                                                (this.state.codProfitMargin > 0) ? (
                                                                    <div class="row mb-2 fw-bold border-top pt-2 text-success">
                                                                        <div class="col-6">
                                                                            Profit Margin
                                                                        </div>
                                                                        <div class="col text-end fw-bold">
                                                                            IDR. {App.Utils.formatCurrency(this.state.codProfitMargin)}
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div class="row mb-2 fw-bold border-top pt-2 text-danger">
                                                                        <div class="col-6">
                                                                            Profit Margin
                                                                        </div>
                                                                        <div class="col text-end fw-bold">
                                                                            IDR. {App.Utils.formatCurrency(this.state.codProfitMargin)}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }
                                                        </div>
                                                    ) : (
                                                        <div></div>
                                                    )
                                                }
                                            </div>
                                        )
                                    }
                                </FormValidate>
                                {
                                    anyOutOfStockProduct ? (
                                        <div class="alert alert-warning">Some of your products maybe run out of stock</div>
                                    ) : (<div></div>)
                                }
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-sm btn-secondary w-25" onClick={this.handlePrevForm.bind(this)}>Back</button>
                                {
                                    (this.state.step == '2') ? (
                                        <button type="button" class="btn btn-sm btn-primary w-25" onClick={this.handleSubmitOrderForm.bind(this)}>Submit</button>
                                    ) : (
                                        <button type="button" class="btn btn-sm btn-primary w-25" onClick={this.handleNextForm.bind(this)}>Next</button>
                                    )
                                }
                            </div>
                        </Progress>
                    </div>
                </ModalPopUp >

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
            </div >
        );
    }
}

ReactDOM.render(<CartPage />, document.getElementById('root'));