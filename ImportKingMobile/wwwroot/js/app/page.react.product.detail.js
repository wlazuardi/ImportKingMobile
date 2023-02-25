class ProductDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            category: null,
            typeId: 0,
            colorId: 0,
            productId: 0,
            types: [],
            colors: [],
            isLoaded: false,
            error: null,
            isModalAddShown: false,
            qty: 1,
            typeName: '',
            stock: 0,
            isLoadingProduct: false,
            alert: {},
            catalogImages: []
        };
        this.getCategory();
        this.constructTyeDataSource();
    }

    componentDidUpdate() {
        setTimeout(function () {
            $('.carousel').carousel('cycle');
        }, 500);
    }

    getCategory() {
        var url = 'https://importking.mooo.com';
        fetch(url + '/api/Categories/' + categoryId, {
            method: 'GET'
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
                var data = result[0];
                this.setState({
                    category: data
                });
            });
    }

    constructTyeDataSource() {
        fetch('https://importking.mooo.com/api/Warehouses/0/Categories/' + categoryId + '/Types')
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
                        text: 'Pilih Tipe HP'
                    });

                    results.push({
                        id: -1,
                        text: 'Others'
                    });

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

    constructColorDatasource() {
        fetch('https://importking.mooo.com/api/Warehouses/0/Categories/' + categoryId + '/Types/' + this.state.typeId + '/Colors')
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

    handleTypeChange(el) {
        this.setState({
            typeId: el.value,
            typeName: el.text,
            colorId: 0,
            colorName: ''
        });
        this.constructColorDatasource();
    }

    handleColorChange(color) {
        this.setState({
            colorId: color.id
        });

        var { typeId } = this.state;

        var url = 'https://importking.mooo.com/api/Catalogs?categoryId=' + categoryId + '&typeId=' + typeId + '&colorId=' + color.id + '&length=100&start=0&userMail=' + userEmail;

        this.setState({
            isLoadingProduct: true
        });

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
                        isLoadingProduct: false
                    });
                    if (data && data.products.length > 0) {
                        this.setState({
                            productId: data.products[0].productId,
                            stock: data.products[0].stock,
                            catalogImages: data.products[0].productVariantImages
                        });
                    }
                },
                (error) => {
                    this.setState({
                        error
                    });
                }
            )
    }

    formatColor(data) {
        if (data.colorCode)
            return $("<span class='color-code d-inline-block me-1 float-left' style='background:" + data.colorCode + "'></span> <span class='align-middle'>" + data.text + "</span>");

        return $("<span class='align-middle'>" + data.text + "</span>");
    }

    renderColors(color) {
        var _className = (color.id == this.state.colorId) ? 'bg-primary text-white' : 'border-primary';
        return (
            <button class={'btn btn-sm ' + _className + ' shadow-sm me-2 mb-2'} onClick={this.handleColorChange.bind(this, color)}>
                <span class="color-code d-inline-block mt-1 me-1 float-left" style={{ background: color.colorCode }}></span>
                <span class="align-middle">{color.text}</span>
            </button>
        );
    }

    handleAddToCart() {
        var { typeId, colorId } = this.state;

        if (!typeId) {
            this.setState({
                typeError: 'Pilih Tipe HP'
            });
            return;
        }

        if (!colorId) {
            this.setState({
                colorError: 'Pilih Warna'
            });
            return;
        }

        this.setState({
            typeError: '',
            colorError: '',
            qty: 1,
            isModalAddShown: true
        });
    }

    directBuy() {
    }

    handleModalHidden() {
        this.setState({
            isModalAddShown: false
        });
    }

    deductAmount() {
        var { qty } = this.state;
        qty--;
        if (qty > 0) {
            this.setState({
                qty: qty
            });
        }
    }

    addAmount() {
        var { qty } = this.state;
        qty++;
        if (qty < 100) {
            this.setState({
                qty: qty
            });
        }
    }

    handleValueChange(e) {
        var qty = e.target.value;
        this.setState({
            qty: qty
        });
    }

    addToCart(e) {
        e.preventDefault();

        var { productId, category, qty, stock } = this.state;

        var data = {
            email: userEmail,
            productId: productId,
            categoryId: categoryId,
            price: category.price,
            qty: qty,
            isOutOfStock: stock <= 0
        }

        this.setState({
            isSubmittingCart: true
        });

        this.postCart(data);
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

    handleAlertHidden() {
        var { alert } = this.state;
        alert.isShown = false;

        this.setState({
            alert
        });
    }

    renderCatalogImages(image, i) {
        var fileName = (image != null) ? image.fileName : '';
        var url = "https://importking.mooo.com/Uploads/" + fileName;

        if (i == 0) {
            return (
                <div class="carousel-item active">
                    <img src={url} class="d-block w-100" alt={'Product ' + i} />
                </div>
            );
        }

        return (
            <div class="carousel-item">
                <img src={url} class="d-block w-100" alt={'Product ' + i} />
            </div>
        );
    }

    handleHelp() {
        var message = 'Hi admin, saya ada pertanyaan untuk produk ini: \n' + this.state.category.name + '\n' + window.location.href;
        message = encodeURI(message);
        window.open('https://wa.me/628179313535?text=' + message);
    }

    carouselNext() {
        $('#carouselProductIndicators').carousel('next');
    }

    carouselPrev() {
        $('#carouselProductIndicators').carousel('prev');
    }

    render() {
        var { category, types, typeId, colors, colorId, qty, typeError, colorError, catalogImages } = this.state;
        var typeName, colorCode, colorName;

        var selectedType = types.filter(x => x.id == typeId);
        if (selectedType && selectedType.length) {
            typeName = selectedType[0].text;
        }

        var selectedColor = colors.filter(x => x.id == colorId);
        if (selectedColor && selectedColor.length) {
            colorCode = selectedColor[0].colorCode;
            colorName = selectedColor[0].text;
        }

        var fileName = (category != null && category.images != null && category.images.length > 0) ? category.images[0].fileName : '';
        if (!fileName) {
            fileName = 'no-image.jpg';
        }
        var url = "https://importking.mooo.com/Uploads/" + fileName;

        return (
            <div>
                {
                    (category != null) ? (
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
                            <div>
                                {
                                    (catalogImages && catalogImages.length > 0) ?
                                        (
                                            <div id="carouselProductIndicators" class="carousel slide" data-ride="carousel">
                                                <div class="carousel-inner">
                                                    {
                                                        catalogImages.map((image, i) => (
                                                            this.renderCatalogImages(image, i)
                                                        ))
                                                    }
                                                </div>
                                                <a class="carousel-control-prev"
                                                    onClick={this.carouselPrev.bind(this)}>
                                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span class="sr-only">Previous</span>
                                                </a>
                                                <a class="carousel-control-next"
                                                    onClick={this.carouselNext.bind(this)}>
                                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                    <span class="sr-only">Next</span>
                                                </a>
                                            </div>
                                        ) : (
                                            <div id="carouselProductIndicators" class="carousel slide" data-ride="carousel">
                                                {
                                                    (category.images && category.images.length > 0) ? (
                                                        <div class="carousel-inner">
                                                            {
                                                                category.images.map((image, i) => (
                                                                    this.renderCatalogImages(image, i)
                                                                ))
                                                            }
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <div class="carousel-inner">
                                                                <div class="carousel-item active">
                                                                    <img src={url} class="w-100 d-block" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <a class="carousel-control-prev" 
                                                    onClick={this.carouselPrev.bind(this)}>
                                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                                    <span class="sr-only">Previous</span>
                                                </a>
                                                <a class="carousel-control-next" 
                                                    onClick={this.carouselNext.bind(this)}>
                                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                                    <span class="sr-only">Next</span>
                                                </a>
                                            </div>
                                        )
                                }
                            </div>
                            <div class="px-3" style={{ marginBottom: '150px' }}>
                                <div class="mt-2">
                                    <h4>{category.name}</h4>
                                    <h5>IDR {App.Utils.formatCurrency(category.price)}</h5>
                                    <div>Terjual: {category.soldCount}</div>
                                </div>
                                <div class="mt-2">
                                    <div>Deskripsi: </div>
                                    <div dangerouslySetInnerHTML={{ __html: (category.description) ? (category.description) : 'Belum ada deskripsi produk' }} />
                                </div>
                                <div class="mt-2">
                                    {
                                        (typeError) ? (<div class="text-danger">{typeError}</div>) : (<span></span>)
                                    }
                                    <Select2 value={this.state.typeId} class="form-control bg-light text-capitalize"
                                        dataSource={types}
                                        onChange={this.handleTypeChange.bind(this)} />
                                </div>
                                <div class="mt-2">
                                    {
                                        (colorError) ? (<div class="text-danger">{colorError}</div>) : (<span></span>)
                                    }
                                    {
                                        colors.map(color => (
                                            this.renderColors(color)
                                        ))
                                    }
                                </div>
                            </div>
                            <div class="payment-proceed mx-2 p-2">
                                <div class="row">
                                    <div class="col-4">
                                        <button class="btn btn-sm border-primary text-primary mt-1" onClick={this.handleHelp.bind(this)}>
                                            <i class="fa fa-question-circle me-1"></i>
                                            Bantuan
                                        </button>
                                    </div>
                                    <div class="col">
                                        <button class="btn btn-sm btn-primary float-end mt-1" disabled={this.state.isLoadingProduct} onClick={this.handleAddToCart.bind(this)}>+ Keranjang</button>
                                        {/*<button class="btn btn-sm border-primary text-primary float-end mt-1 me-2" disabled={this.state.isLoadingProduct} onClick={this.directBuy.bind(this)}>Beli Langsung</button>*/}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div></div>
                    )
                }
                <ModalPopUp isShown={this.state.isModalAddShown} onHidden={this.handleModalHidden.bind(this)}>
                    <div class="modal-dialog" role="document">
                        <Progress class="modal-content" isShown={this.state.isSubmittingCart}>
                            <div class="modal-header">
                                <h5 class="modal-title">Tambahkan ke Keranjang</h5>
                                <button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                {
                                    <div>
                                        <div class="row">
                                            <div class="col-7">
                                                <div class="title">{category ? category.name : ''}</div>
                                                <div>{typeName}</div>
                                                <span class="badge text-capitalize me-1" style={{ backgroundColor: colorCode }}>{colorName}</span>
                                                <span>IDR. {category ? App.Utils.formatCurrency(category.price) : 0}</span>
                                            </div>
                                            <div class="col-5">
                                                <button class="btn btn-primary px-1 btn-sm" onClick={this.deductAmount.bind(this)}>
                                                    <i class="material-icons md-remove"></i>
                                                </button>
                                                <input name="qty" type="number" class="form-control d-inline form-control-sm mx-1 input-Qty" value={qty} onChange={this.handleValueChange.bind(this)} />
                                                <button class="btn btn-primary px-1 btn-sm" onClick={this.addAmount.bind(this)}>
                                                    <i class="material-icons md-add"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div class="row pt-2">
                                            <div class="col-7 fw-bold">
                                                Subtotal
                                            </div>
                                            <div class="col-5 fw-bold text-end">
                                                IDR. {category ? App.Utils.formatCurrency(category.price * qty) : 0}
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Tutup</button>
                                <button type="button" class="btn btn-primary" disabled={this.state.isLoadingProduct} onClick={this.addToCart.bind(this)}>Tambahkan</button>
                            </div>
                        </Progress>
                    </div>
                </ModalPopUp>
            </div>
        );
    }
}

ReactDOM.render(<ProductDetail />, document.getElementById('root'));

$('.nav-bottom .nav-link[href="/Product"]').addClass('active');