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
                            text: item.name
                        };
                    });

                    results.unshift({
                        id: 0,
                        text: '- Show All -'
                    });

                    results = (results) ? results.filter(e => e.text && e.text.toLowerCase().includes('testing') == false) : [];

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

                    results = (results) ? results.filter(e => e.text && e.text.toLowerCase().includes('testing') == false) : [];

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

                    results = (results) ? results.filter(e => e.text.toLowerCase().includes('testing') == false) : [];

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

        var url = 'https://importking.mooo.com/api/Catalogs?categoryId=' + categoryId + '&typeId=' + typeId + '&length=100&start=0';

        if (colorId != -1) {
            url = 'https://importking.mooo.com/api/Catalogs?categoryId=' + categoryId + '&typeId=' + typeId + '&colorId=' + colorId + '&length=100&start=0';
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

    render() {
        const { categories, types, colors, isLoadingProduct } = this.state;

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
                    <button type="submit" class="btn btn-primary w-100" onClick={this.handleSearch.bind(this)}> Search </button>
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
                                        </div>
                                        <div class="col-3">
                                            <button class="btn btn-sm btn-primary float-end" onClick={this.handleAddProduct.bind(this, product)}> Add +</button>
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
            isSubmittingCart: false
        }
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

    deductAmount() {
        var selectedProduct = this.state.selectedProduct;
        var qty = selectedProduct.qty;

        if (qty > 1)
            qty--;

        selectedProduct.qty = qty;

        this.setState({
            selectedProduct: selectedProduct
        });
    }

    addAmount() {
        var selectedProduct = this.state.selectedProduct;
        var qty = selectedProduct.qty;

        qty++;

        selectedProduct.qty = qty;

        this.setState({
            selectedProduct: selectedProduct
        });
    }

    addToCart(e) {
        e.preventDefault();

        var { selectedProduct } = this.state;

        var data = {
            email: userEmail,
            productId: selectedProduct.productId,
            price: selectedProduct.price,
            qty: selectedProduct.qty
        }

        this.setState({
            isSubmittingCart: true
        });

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

    handleModalHidden() {
        this.setState({
            isModalAddShown: false
        });
    }

    handleAlertHidden() {
        var { alert } = this.state;
        alert.isShown = false;

        this.setState({
            alert
        });
    }

    render() {
        return (
            <div>
                <ProductSearchForm onSearch={this.handleSearch.bind(this)} />
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
                                            <div class="row">
                                                <div class="col-7">
                                                    <div class="title">{this.state.selectedProduct.categoryName}</div>
                                                    <div>{this.state.selectedProduct.brand} {this.state.selectedProduct.typeName}</div>
                                                    <span class="badge text-capitalize me-1" style={{ backgroundColor: this.state.selectedProduct.colorCode }}>{this.state.selectedProduct.colorName}</span>
                                                    <span>IDR. {this.state.selectedProduct.price}</span>
                                                </div>
                                                <div class="col-5">
                                                    <button class="btn btn-primary px-1 btn-sm" onClick={this.deductAmount.bind(this)}>
                                                        <i class="material-icons md-remove"></i>
                                                    </button>
                                                    <input name="qty" type="number" class="form-control d-inline form-control-sm mx-1 input-Qty" value={this.state.selectedProduct.qty} />
                                                    <button class="btn btn-primary px-1 btn-sm" onClick={this.addAmount.bind(this)}>
                                                        <i class="material-icons md-add"></i>
                                                    </button>
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
                {
                    this.state.alert ?
                        (
                            <Alert isShown={this.state.alert.isShown} mode={this.state.alert.mode} title={this.state.alert.title} message={this.state.alert.message} onHidden={this.handleAlertHidden.bind(this)} />
                        ) :
                        (
                            <div />
                        )
                }
            </div>
        );
    };
}

ReactDOM.render(<ProductPage />, document.getElementById('root'));