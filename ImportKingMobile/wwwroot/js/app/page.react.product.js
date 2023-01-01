class ProductSearchForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            warehouseId: 0,
            categoryId: 0,
            typeId: 0,
            colorId: 0,
            categories: [],
            types: [],
            colors: [],
            productList: [],
            isLoadingProduct: false
        };
    }

    constructCategoryDataSource() {
        fetch("https://importking.mooo.com/api/Warehouses/0/Categories")
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
                (data) => {
                    var results = $.map(data, function (item) {
                        return {
                            id: item.categoryId,
                            text: item.name,
                            price: item.price
                        };
                    });

                    results.unshift({
                        id: 0,
                        text: '- Show All -',
                        price: 0
                    });

                    //results.push({
                    //    id: -1,
                    //    text: 'Others',
                    //    price: 0
                    //});

                    if (userEmail != 'haris.tester@gmail.com' && userEmail != 'sandbox.willy.lazuardi@gmail.com') { 
                        results = (results) ? results.filter(e => e.text && e.text.toLowerCase().includes('testing') == false) : [];
                    }

                    this.setState({
                        categories: results
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    constructTypeDataSource() {
        if (this.state.categoryId == -1) {
            var results = [{
                id: -1,
                text: 'Others'
            }];

            this.setState({
                types: results,
                colors: results,
                typeId: -1,
                colorId: -1
            });

            return;
        }

        fetch('https://importking.mooo.com/api/Warehouses/0/Categories/' + this.state.categoryId + '/Types')
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
                (data) => {
                    var results = $.map(data, function (item) {
                        return {
                            id: item.typeId,
                            text: item.brand.initCap() + ' ' + item.name
                        };
                    });

                    results.unshift({
                        id: 0,
                        text: '- Show All -'
                    });

                    results.push({
                        id: -1,
                        text: 'Others'
                    });

                    if (userEmail != 'haris.tester@gmail.com' && userEmail != 'sandbox.willy.lazuardi@gmail.com') {
                        results = (results) ? results.filter(e => e.text && e.text.toLowerCase().includes('testing') == false) : [];
                    }

                    this.setState({
                        types: results
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    constructColorDataSource() {
        if (this.state.categoryId == -1 || this.state.typeId == -1) {
            var results = [{
                id: -1,
                text: 'Others'
            }];

            this.setState({
                colors: results,
                colorId: -1
            });

            return;
        }

        fetch('https://importking.mooo.com/api/Warehouses/0/Categories/' + this.state.categoryId + '/Types/' + this.state.typeId + '/Colors')
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
                (data) => {
                    var results = $.map(data, function (item) {
                        return {
                            id: item.colorId,
                            text: item.name.initCap(),
                            colorCode: item.colorCode
                        };
                    });

                    results.unshift({
                        id: 0,
                        text: '- Show All -'
                    });

                    results.push({
                        id: -1,
                        text: 'Others'
                    });

                    //results = (results) ? results.filter(e => e.text.toLowerCase().includes('testing') == false) : [];

                    this.setState({
                        colors: results
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }

    componentDidMount() {
        this.constructCategoryDataSource();
        this.constructTypeDataSource();
        this.constructColorDataSource();
    }

    handleCategoryChange(el) {
        this.setState({
            categoryId: el.value
        });
        this.constructTypeDataSource();
    }

    handleTypeChange(el) {
        this.setState({
            typeId: el.value
        });
        this.constructColorDataSource();
    }

    handleColorChange(el) {
        this.setState({
            colorId: el.value
        });
    }

    formatColor(data) {
        if (data.colorCode)
            return $("<span class='color-code d-inline-block me-1 float-left' style='background:" + data.colorCode + "'></span> <span class='align-middle'>" + data.text + "</span>");

        return $("<span class='align-middle'>" + data.text + "</span>");
    }

    handleSearch(e) {
        e.preventDefault();

        const { categoryId, typeId, colorId } = this.state;

        var url = 'https://importking.mooo.com/api/Catalogs?categoryId=' + categoryId + '&typeId=' + typeId + '&length=100&start=0&userMail=' + userEmail;

        if (colorId != -1) {
            url = 'https://importking.mooo.com/api/Catalogs?categoryId=' + categoryId + '&typeId=' + typeId + '&colorId=' + colorId + '&length=100&start=0&userMail=' + userEmail;
        }

        this.setState({
            isLoadingProduct: true
        });

        this.state.isLoadingProduct = true;

        this.props.onSearch(this.state);

        fetch(url)
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
                (data) => {
                    this.setState({
                        isLoadingProduct: false,
                        productList: data.products
                    });
                    this.props.onSearch(this.state);
                },
                (error) => {
                    this.setState({
                        isLoadingProduct: false,
                        error
                    });
                    this.props.onSearch(this.state);
                }
            )
    }

    handleAddCustomProduct(e) {
        var { categories, categoryId } = this.state;

        var categories = categories.filter(x => x.id == categoryId);
        var category;

        if (categories.length > 0) {
            category = categories[0];
        }

        e.preventDefault();
        if (this.props.onAddCustomProduct)
            this.props.onAddCustomProduct(category);
    }

    render() {
        const { categories, types, colors, isLoadingProduct } = this.state;

        var isSearchMode = true;
        if (this.state.categoryId == -1 || this.state.typeId == -1 || this.state.colorId == -1)
            isSearchMode = false;

        return (
            <div>
                <form id="searchForm" class="mb-3">
                    <div class="mb-3">
                        <label class="form-label">Category</label>
                        <div>
                            <Select2 value={this.state.categoryId} class="form-control bg-light text-capitalize" dataSource={categories}
                                onChange={this.handleCategoryChange.bind(this)} />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Type</label>
                        <div>
                            <Select2 value={this.state.typeId} class="form-control bg-light text-capitalize" dataSource={types}
                                onChange={this.handleTypeChange.bind(this)} />
                        </div>
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Color</label>
                        <div>
                            <Select2 value={this.state.colorId} class="form-control bg-light" dataSource={colors}
                                onChange={this.handleColorChange.bind(this)}
                                templateResult={this.formatColor.bind(this)}
                                templateSelection={this.formatColor.bind(this)} />
                        </div>
                    </div>
                    {
                        (isSearchMode) ? (
                            <button type="submit" class="btn btn-primary w-100" onClick={this.handleSearch.bind(this)}> Search </button>
                        ) : (
                            <button type="submit" class="btn btn-primary w-100" onClick={this.handleAddCustomProduct.bind(this)}> Add Custom Order </button>
                        )
                    }
                </form>
            </div>
        );
    }
}

class ProductList extends React.Component {
    constructor(props) {
        super(props);
    }

    handleAddProduct(product, e) {
        if (this.props.onAddClick) {
            this.props.onAddClick(product);
        }
    }

    render() {
        const { isLoading, dataSource } = this.props;

        return (isLoading ? (<LoadSpinner />) :
            (
                dataSource.length ? (
                    <ul class="list-menu" id="productList">
                        {
                            dataSource.map(product => (
                                <li class="nav-item">
                                    <a class="icontext">
                                        <div class="col-9">
                                            <h6 class="title">{product.categoryName}</h6>
                                            <div>{product.brand} {product.typeName}</div>
                                            <span class="badge text-capitalize" style={{ backgroundColor: product.colorCode }}>{product.colorName}</span>
                                            <span class="mx-2">IDR. {App.Utils.formatCurrency(product.price)}</span>
                                            {
                                                (product.stock > 0) ? (
                                                    <div></div>
                                                ) : (
                                                    <div class="text-danger small">This product maybe run out of stock</div>
                                                )
                                            }
                                        </div>
                                        <div class="col-3">
                                            {
                                                (product.stock > 0) ? (
                                                    <button class="btn btn-sm btn-primary float-end" onClick={this.handleAddProduct.bind(this, product)}> Add +</button>
                                                ) : (
                                                    <button class="btn btn-sm btn-outline-primary float-end" onClick={this.handleAddProduct.bind(this, product)}> Add +</button>
                                                )
                                            }
                                        </div>
                                    </a>
                                </li>
                            ))
                        }
                    </ul>
                ) :
                    (
                        <ul class="list-menu" id="productList">
                            <li class="nav-item text-center">
                                No products to display
                            </li>
                            <li class="nav-item text-center">
                                Click search button to start
                            </li>
                        </ul>
                    )
            )
        );
    }
}

class ProductPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadingProduct: false,
            productList: [],
            isModalAddShown: false,
            selectedProduct: null,
            isSubmittingCart: false,
            rules: {
                customProductType: {
                    required: true
                },
                customProductColor: {
                    required: true
                }
            }
        }

        this.myRef = React.createRef();
    }

    handleSearch(e) {
        const { isLoadingProduct, productList, error } = e;

        if (!error) {
            this.setState({
                isLoadingProduct: e.isLoadingProduct,
                productList
            });
        }
        else {
            this.setState({
                isLoadingProduct: e.isLoadingProduct,
                productList: [],
                alert: {
                    isShown: true,
                    mode: 'danger',
                    title: 'Error',
                    message: 'Failed to retrieve product list'
                }
            });
        }
    }

    handleOnAddClick(product) {
        product['qty'] = 1;

        this.setState({
            isModalAddShown: true,
            selectedProduct: product
        });
    }

    deductAmount(e) {
        e.preventDefault();

        var selectedProduct = this.state.selectedProduct;
        var qty = selectedProduct.qty;

        if (qty > 1)
            qty--;

        selectedProduct.qty = qty;

        this.setState({
            selectedProduct: selectedProduct
        });
    }

    addAmount(e) {
        e.preventDefault();

        var selectedProduct = this.state.selectedProduct;
        var qty = selectedProduct.qty;

        qty++;

        selectedProduct.qty = qty;

        this.setState({
            selectedProduct: selectedProduct
        });
    }

    postCart(data) {
        fetch('https://importking.mooo.com/api/Carts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(res => {
            if (res.status == 200) {
                return res.json();
            }
            else {
                throw {
                    message: res.statusText
                };
            }
        }).then(
            (result) => {
                this.setState({
                    isModalAddShown: false,
                    isModalCustomAddShown: false,
                    isSubmittingCart: false,
                    alert: {
                        isShown: true,
                        mode: 'success',
                        title: 'Success',
                        message: 'Product has been added to cart'
                    }
                });
            },
            (error) => {
                this.setState({
                    isSubmittingCart: false,
                    alert: {
                        isShown: true,
                        mode: 'danger',
                        title: 'Failed',
                        message: 'Failed to add product to cart'
                    }
                });
            }
        );
    }

    addToCart(e) {
        e.preventDefault();

        var { selectedProduct } = this.state;

        var data = {
            email: userEmail,
            productId: selectedProduct.productId,
            categoryId: selectedProduct.categoryId,
            price: selectedProduct.price,
            qty: selectedProduct.qty,
            isOutOfStock: selectedProduct.stock <= 0
        }

        this.setState({
            isSubmittingCart: true
        });

        this.postCart(data);
    }

    addToCartCustom(e) {
        e.preventDefault();
        this.myRef.current.handleSubmit();
    }

    handleModalHidden() {
        this.setState({
            isModalAddShown: false
        });
    }

    handleModalCustomHidden() {
        this.setState({
            isModalCustomAddShown: false
        });
    }

    handleAlertHidden() {
        var { alert } = this.state;
        alert.isShown = false;

        this.setState({
            alert
        });
    }

    handleAddCustomProduct(category) {
        var categoryId = 0, price = 0;

        if (category) {
            categoryId = category.id;
            price = category.price;
        }

        var product = {
            productId: -1,
            categoryId: categoryId,
            price: price,
            qty: 1,
            customProductType: '',
            selectedProduct: ''
        };

        this.setState({
            isModalCustomAddShown: true,
            selectedProduct: product
        });
    }

    handleValueChange(e) {
        var { selectedProduct } = this.state;
        var name = e.target.name;
        selectedProduct[name] = e.target.value;
        this.setState({
            selectedProduct
        });
    }

    handleSubmitProduct() {
        var { selectedProduct } = this.state;

        var data = {
            email: userEmail,
            productId: -1,
            categoryId: selectedProduct.categoryId,
            customProductType: selectedProduct.customProductType,
            customProductColor: selectedProduct.customProductColor,
            price: selectedProduct.price,
            qty: selectedProduct.qty,
            isOutOfStock: 0
        }

        this.setState({
            isSubmittingCart: true
        });

        this.postCart(data);
    }

    render() {
        return (
            <div>
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
                <ProductSearchForm onSearch={this.handleSearch.bind(this)} onAddCustomProduct={this.handleAddCustomProduct.bind(this)} />
                <ProductList isLoading={this.state.isLoadingProduct} dataSource={this.state.productList} onAddClick={this.handleOnAddClick.bind(this)} />
                <ModalPopUp isShown={this.state.isModalAddShown} onHidden={this.handleModalHidden.bind(this)}>
                    <div class="modal-dialog" role="document">
                        <Progress class="modal-content" isShown={this.state.isSubmittingCart}>
                            <div class="modal-header">
                                <h5 class="modal-title">Add Product</h5>
                                <button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                {
                                    this.state.selectedProduct ?
                                        (
                                            <div>
                                                <div class="row">
                                                    <div class="col-7">
                                                        <div class="title">{this.state.selectedProduct.categoryName}</div>
                                                        <div>{this.state.selectedProduct.brand} {this.state.selectedProduct.typeName}</div>
                                                        <span class="badge text-capitalize me-1" style={{ backgroundColor: this.state.selectedProduct.colorCode }}>{this.state.selectedProduct.colorName}</span>
                                                        <span>IDR. {App.Utils.formatCurrency(this.state.selectedProduct.price)}</span>
                                                    </div>
                                                    <div class="col-5">
                                                        <button class="btn btn-primary px-1 btn-sm" onClick={this.deductAmount.bind(this)}>
                                                            <i class="material-icons md-remove"></i>
                                                        </button>
                                                        <input name="qty" type="number" class="form-control d-inline form-control-sm mx-1 input-Qty" value={this.state.selectedProduct.qty} onChange={this.handleValueChange.bind(this)} />
                                                        <button class="btn btn-primary px-1 btn-sm" onClick={this.addAmount.bind(this)}>
                                                            <i class="material-icons md-add"></i>
                                                        </button>
                                                    </div>
                                                    {
                                                        (this.state.selectedProduct.stock > 0) ? (
                                                            <div></div>
                                                        ) : (
                                                            <div class="text-danger small">This product maybe run out of stock</div>
                                                        )
                                                    }
                                                </div>
                                                <div class="row pt-2">
                                                    <div class="col-7 fw-bold">
                                                        Subtotal
                                                    </div>
                                                    <div class="col-5 fw-bold text-end">
                                                        IDR {App.Utils.formatCurrency(this.state.selectedProduct.price * this.state.selectedProduct.qty)}
                                                    </div>
                                                </div>
                                            </div>
                                        ) :
                                        (
                                            <div class="row">
                                                No product selected
                                            </div>
                                        )
                                }
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={this.addToCart.bind(this)}>Add to Cart</button>
                            </div>
                        </Progress>
                    </div>
                </ModalPopUp>
                <ModalPopUp isShown={this.state.isModalCustomAddShown} onHidden={this.handleModalCustomHidden.bind(this)}>
                    <div class="modal-dialog" role="document">
                        <Progress class="modal-content" isShown={this.state.isSubmittingCart}>
                            <div class="modal-header">
                                <h5 class="modal-title">Add Product</h5>
                                <button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                {
                                    (this.state.selectedProduct) ? (
                                        <FormValidate ref={this.myRef} novalidate="novalidate" rules={this.state.rules} submitHandler={this.handleSubmitProduct.bind(this)} >
                                            <div class="row mb-3">
                                                {
                                                    (this.state.categoryId == -1) ?
                                                        (
                                                            <div>
                                                                <label class="form-label">Product Name</label>
                                                                <input class="form-control form-control-sm"
                                                                    type="text" name="customProductType"
                                                                    placeholder="Clear View Case Iphone 6, etc"
                                                                    value={this.state.selectedProduct.customProductType}
                                                                    onChange={this.handleValueChange.bind(this)} />
                                                            </div>
                                                        ) : 
                                                        (
                                                            <div>
                                                                <label class="form-label">Type</label>
                                                                <input class="form-control form-control-sm"
                                                                    type="text" name="customProductType"
                                                                    placeholder="Iphone 6, Samsung S22, etc"
                                                                    value={this.state.selectedProduct.customProductType}
                                                                    onChange={this.handleValueChange.bind(this)} />
                                                            </div>
                                                        )
                                                }                               
                                            </div>
                                            <div class="row mb-3">
                                                <div class="col-7">
                                                    <label class="form-label">Product Color</label>
                                                    <input class="form-control form-control-sm" type="text" name="customProductColor" placeholder="Black, Blue, etc."
                                                        value={this.state.selectedProduct.customProductColor}
                                                        onChange={this.handleValueChange.bind(this)} />
                                                </div>
                                                <div class="col-5">
                                                    <div class="form-label">Qty</div>
                                                    <button class="btn btn-primary px-1 btn-sm" onClick={this.deductAmount.bind(this)}>
                                                        <i class="material-icons md-remove"></i>
                                                    </button>
                                                    <input name="qty" type="number" class="form-control d-inline form-control-sm mx-1 input-Qty"
                                                        value={this.state.selectedProduct.qty}
                                                        onChange={this.handleValueChange.bind(this)} />
                                                    <button class="btn btn-primary px-1 btn-sm" onClick={this.addAmount.bind(this)}>
                                                        <i class="material-icons md-add"></i>
                                                    </button>
                                                </div>
                                            </div>
                                            {
                                                (this.state.selectedProduct.price) ? (
                                                    <div class="row mx-1">
                                                        Price: @IDR. {App.Utils.formatCurrency(this.state.selectedProduct.price)}
                                                    </div>
                                                ) :
                                                    (
                                                    <div class="row">
                                                        <div class="alert alert-info">
                                                            For the custom product, price will be calculated after order by the admin
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </FormValidate>
                                    ) : (
                                        <div></div>
                                    )
                                }
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={this.addToCartCustom.bind(this)}>Add to Cart</button>
                            </div>
                        </Progress>
                    </div>
                </ModalPopUp>
            </div >
        );
    };
}

ReactDOM.render(<ProductPage />, document.getElementById('root'));