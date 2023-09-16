class CategoryPage extends React.Component {
    constructor(props) {
        super(props);
        this.fetchURL = hostUrl + '/api/Catalogs/' + userMail + '/Categories/0';
        this.state = {
            isLoading: true,
            categoriesOri: [],
            categories: []
        };
        this.getData();
    }

    getData() {
        this.setState({
            isLoading: true
        });

        fetch(this.fetchURL, {
            method: 'GET',
            credentials: 'include'
        }).then(result => {
            if (result.status == 200) {
                return result.json();
            }
            else {
                throw {
                    message: result.statusText
                }
            }
        }).then(result => {
            result = result.filter(x => x.isInactive == false);

            //$.map(result, function (item) {
            //    item.name = item.name.toLowerCase();
            //    return item;
            //});

            result.sort((a, b) => {
                if (a.name < b.name) {
                    return -1;
                }
                if (a.name > b.name) {
                    return 1;
                }
                return 0;
            });

            this.setState({
                isLoading: false,
                categoriesOri: result,
                categories: result
            });
        });
    }

    renderImage(category) {
        var fileName = 'no-image.jpg'
        if (category.images != null && category.images.length > 0) {
            try {
                fileName = category.images[0].fileName;
            } catch (e) {

            }
        }

        var url = 'url("' + hostUrl + '/Uploads/' + fileName + '")';
        if (fileName) return (
            <li class="col-6 product-item mb-2">
                <div class="custom-card">
                    <a href={'/Product/' + category.categoryId + '/Detail'} class="item-category-grid"
                        style={{ backgroundImage: url }}></a>
                    <div class="custom-card-text card-text-title small">
                        {category.name}
                    </div>
                    <div class="custom-card-text card-text-subtitle small fw-bold">IDR {App.Utils.formatCurrency(category.price)}</div>
                    {/*<div class="custom-card-text card-text-attribute small">Terjual: {category.soldCount}</div>*/}
                </div>
            </li>
        );
        else return (
            <li class="col-6 product-item mb-2">
                <div class="custom-card">
                    <a href={'/Product/' + category.categoryId + '/Detail'} class="item-category-grid">
                        <span class="icon-wrap">
                            <i class="icon material-icons md-stay_primary_portrait"></i>
                        </span>
                    </a>
                    <div class="custom-card-text card-text-title small">
                        {category.name}
                    </div>
                    <div class="custom-card-text card-text-subtitle small fw-bold">IDR {category.price ? App.Utils.formatCurrency(category.price) : ''}</div>
                    {/*<div class="custom-card-text card-text-attribute small">Terjual: {category.soldCount}</div>*/}
                </div>
            </li>
        );
    }

    handleSearch(e) {
        var value = e.target.value.toLowerCase();
        var { categoriesOri, categories } = this.state;
        categories = categoriesOri.filter(x => x.name.toLowerCase().indexOf(value) >= 0);
        this.setState({
            categories
        });
    }

    render() {
        var { isLoading, categories } = this.state;
        return (
            <div>
                <section class="px-2 py-2 mb-1 fixed-top bg-primary catalog-search-box">
                    <div class="input-group">
                        <input type="text" placeholder="Search" class="bg-primary-light text-white border-0 form-control form-control-sm rounded"
                            onChange={this.handleSearch.bind(this)} />
                        <div class="input-group-append border-white ms-1">
                            <a class="btn btn-sm text-white" href="../Product">
                                <i class="fa fa-sliders"></i>
                            </a>
                        </div>
                    </div>
                </section>
                {
                    (isLoading) ? (
                        <ul class="row mt-5 pt-2 px-2">
                            <li class="col-12 mb-2">
                                <span class="skeleton-loader rounded" style={{ height:'40px'}}>&nbsp;</span>
                            </li>
                            <li class="col-6 product-item mb-2">
                                <div class="custom-card">
                                    <a href="#" class="item-category-grid skeleton-loader">
                                        &nbsp;
                                    </a>
                                    <div class="custom-card-text card-text-title small">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-subtitle small fw-bold">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-attribute small">
                                        <span class="skeleton-loader" />
                                    </div>
                                </div>
                            </li>
                            <li class="col-6 product-item mb-2">
                                <div class="custom-card">
                                    <a href="#" class="item-category-grid skeleton-loader">
                                        &nbsp;
                                    </a>
                                    <div class="custom-card-text card-text-title small">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-subtitle small fw-bold">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-attribute small">
                                        <span class="skeleton-loader" />
                                    </div>
                                </div>
                            </li>
                            <li class="col-6 product-item mb-2">
                                <div class="custom-card">
                                    <a href="#" class="item-category-grid skeleton-loader">
                                        &nbsp;
                                    </a>
                                    <div class="custom-card-text card-text-title small">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-subtitle small fw-bold">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-attribute small">
                                        <span class="skeleton-loader" />
                                    </div>
                                </div>
                            </li>
                            <li class="col-6 product-item mb-2">
                                <div class="custom-card">
                                    <a href="#" class="item-category-grid skeleton-loader">
                                        &nbsp;
                                    </a>
                                    <div class="custom-card-text card-text-title small">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-subtitle small fw-bold">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-attribute small">
                                        <span class="skeleton-loader" />
                                    </div>
                                </div>
                            </li>
                            <li class="col-6 product-item mb-2">
                                <div class="custom-card">
                                    <a href="#" class="item-category-grid skeleton-loader">
                                        &nbsp;
                                    </a>
                                    <div class="custom-card-text card-text-title small">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-subtitle small fw-bold">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-attribute small">
                                        <span class="skeleton-loader" />
                                    </div>
                                </div>
                            </li>
                            <li class="col-6 product-item mb-2">
                                <div class="custom-card">
                                    <a href="#" class="item-category-grid skeleton-loader">
                                        &nbsp;
                                    </a>
                                    <div class="custom-card-text card-text-title small">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-subtitle small fw-bold">
                                        <span class="skeleton-loader" />
                                    </div>
                                    <div class="custom-card-text card-text-attribute small">
                                        <span class="skeleton-loader" />
                                    </div>
                                </div>
                            </li>
                        </ul>
                    ) : (
                        <ul class="row mt-5 pt-2 px-2">
                            <li class="col-12 mb-2 fw-bold px-2 text-primary">
                                <i class="fa fa-tag" /> All Products
                            </li>
                            {
                                (categories && categories.length > 0) ? (
                                    categories.map(category => {
                                        return (
                                            this.renderImage(category)
                                        )
                                    })
                                ) : (
                                    <li class="text-center fw-bolder pt-3 text-secondary">There is no product to display</li>
                                )
                            }
                        </ul>
                    )
                }
                <br />
            </div>
        );
    };
}

ReactDOM.render(<CategoryPage />, document.getElementById('root'));

$('.nav-bottom .nav-link[href="/Category"]').addClass('active');