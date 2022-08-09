class PendingCartDetailPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isLoadingHeader: false,
            cartHeader: null,
            cartList: [],
            filteredCartList: [],
            alert: null
        }
    }

    componentDidMount() {
        this.setState({
            isLoading: true,
            isLoadingHeader: true
        });

        fetch('https://importking.mooo.com/api/Carts?email=' + cartMail)
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                throw {
                    message: res.statusText
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
            }, (error) => {
                this.setState({
                    isLoading: false,
                    alert: {
                        isShown: true,
                        mode: 'danger',
                        title: 'Failed',
                        message: error.message
                    }
                });
            });

        fetch('https://importking.mooo.com/api/Carts/GetPendingCart/' + cartMail)
            .then(res => {
                if (res.status == 200) {
                    return res.json();
                }
                throw {
                    message: res.statusText
                }
            })
            .then((result) => {
                if (result.length) {
                    result = result[0];

                    this.setState({
                        isLoadingHeader: false,
                        cartHeader: result
                    });
                }
                else {
                    this.setState({
                        isLoadingHeader: false,
                        cartHeader: null
                    });
                }
            }, (error) => {
                this.setState({
                    isLoadingHeader: false,
                    alert: {
                        isShown: true,
                        mode: 'danger',
                        title: 'Failed',
                        message: error.message
                    }
                });
            });
    }

    handleCheck(cart, e) {
        e.preventDefault();

        var { cartList } = this.state;

        this.setState({
            isLoading: true
        });

        fetch('https://importking.mooo.com/api/Carts/UpdateChecked', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cartId: cart.cartId,
                isChecked: !cart.isChecked
            })
        }).then(result => {
            if (result.status == 200) {
                return result.json();
            }
            throw {
                message: result.statusText
            };
        }).then((result) => {
            cartList.forEach(x => {
                if (x.cartId == cart.cartId)
                    x.isChecked = !cart.isChecked;
            })
            this.setState({
                isLoading: false,
                cartList: cartList
            });
        }, (error) => {
            this.setState({
                isLoading: false,
                alert: {
                    isShown: true,
                    mode: 'danger',
                    title: 'Failed',
                    message: 'Failed to update cart checked'
                }
            });
        });
    }

    render() {
        var { isLoading, isLoadingHeader, cartHeader, cartList } = this.state;
        return (
            <Progress isShown={isLoading || isLoadingHeader} class="mt-3">
                {
                    <div>
                        {
                            (cartHeader != null) ? (
                                <div class="card border-secondary mb-3 mx-2" key={cartHeader.email}>
                                    <div class="card-header p-2">
                                        {cartHeader.firstName} {cartHeader.lastName}
                                    </div>
                                    <div class="card-body text-secondary p-2">
                                        <p class="card-text m-0 small">
                                            Last Updated Date:
                                            {
                                                (cartHeader.lastUpdatedDate) ? (
                                                    <label class="ms-1">{moment(cartHeader.lastUpdatedDate).format('llll')}</label>
                                                ) : (
                                                    <label class="ms-1">Not available</label>
                                                )
                                            }
                                        </p>
                                        <p class="card-text m-0 small">
                                            Total Items: {cartHeader.totalItems} / Distinct Items: {cartHeader.totalDistinctItems}
                                        </p>
                                        <p class="card-text m-0 small">
                                            Total: IDR {App.Utils.formatCurrency(cartHeader.orderValue)}
                                        </p>
                                    </div>
                                </div>
                            ) : (<div />)
                        }
                        <ul class="px-3 list-menu mt-3">
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
                                            Qty:
                                            <input type="number" disabled class="form-control input-Qty d-inline form-control-sm mx-1 px-1"
                                                value={cart.qty} />
                                            {
                                                (!cart.isChecked) ? (
                                                    <div class="mt-2 text-left">
                                                        <a class="py-1 px-1 btn btn-warning btn-sm text-white" onClick={this.handleCheck.bind(this, cart)}>
                                                            <i class="me-1"></i>
                                                            Check
                                                        </a>
                                                    </div>
                                                ) : (
                                                    <div class="mt-2 text-left">
                                                        <a class="py-1 px-1 btn btn-primary btn-sm text-white" onClick={this.handleCheck.bind(this, cart)}>
                                                            <i class="fa fa-solid fa-check me-1"></i>
                                                            Checked
                                                        </a>
                                                    </div>
                                                )
                                            }
                                        </div>
                                        {
                                            cart.createdDate == null ? (
                                                <div class="small">{App.Utils.formatToLocalDate(cart.createdDate)}</div>
                                            ) : (
                                                <div class="small">{App.Utils.formatToLocalDate(cart.updatedDate)}</div>
                                            )
                                        }                                        
                                        {
                                            cart.isOutOfStock ? (<div class="small text-danger">This product maybe run out of stock</div>) : (<div></div>)
                                        }                                        
                                    </li>
                                ))
                            }
                        </ul>
                    </div>
                }
            </Progress>
        );
    }
}

ReactDOM.render(<PendingCartDetailPage />, document.getElementById('root'));