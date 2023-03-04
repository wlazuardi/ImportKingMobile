class CategoryPage extends React.Component {
    constructor(props) {
        super(props);
        this.fetchURL = 'https://importking.mooo.com/api/Categories';
        this.state = {
            isLoading: false,
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
            method: 'GET'
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

            $.map(result, function (item) {
                item.name = item.name.toLowerCase();
                return item;
            });

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

        var url = 'url("https://importking.mooo.com/Uploads/' + fileName + '")';
        if (fileName) return (
            <li class="col-4 product-item">
                <div class="custom-card">
                    <a href={'/Product/' + category.categoryId + '/Detail'} class="item-category-grid"
                        style={{ backgroundImage: url }}></a>
                    <div class="custom-card-text card-text-title small">
                        {category.name}
                    </div>
                    <div class="custom-card-text card-text-subtitle small fw-bold">IDR {App.Utils.formatCurrency(category.price)}</div>
                    <div class="custom-card-text card-text-attribute small">Terjual: {category.soldCount}</div>
                </div>
            </li>
        );
        else return (
            <li class="col-4 product-item">
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
                    <div class="custom-card-text card-text-attribute small">Terjual: {category.soldCount}</div>
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
                <section class="px-3 py-1 mt-2 mb-1 fixed-top bg-white" style={{ top: '55px' }}>
                    <input type="text" placeholder="Search" class="bg-secondary-light border-0 form-control"
                        onChange={this.handleSearch.bind(this)}
                    />
                </section>
                {
                    (isLoading) ? (
                        <LoadSpinner />
                    ) : (
                        <ul class="row mt-5 pt-2 px-2">
                            {
                                categories.map(category => {
                                    return (
                                        this.renderImage(category)
                                    )
                                })
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

$('.nav-bottom .nav-link[href="/Product"]').addClass('active');