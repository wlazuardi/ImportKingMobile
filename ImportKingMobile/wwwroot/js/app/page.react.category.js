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
        var fileName = (category.images != null && category.images.length > 0) ? category.images[0].fileName : '';
        var url = 'url("https://importking.mooo.com/Uploads/' + fileName + '")';
        if (fileName) return (
            <li class="col-4">
                <a href={'/StockViewer?categoryId=' + category.categoryId} class="item-category-grid"
                    style={{ background: url, backgroundSize: 'cover' }}>
                    <small class="text text-bolder text-white" style={{ marginTop: '50px', background: '#00000054' }}>{category.name}</small>
                </a>
            </li >
        );
        else return (
            <li class="col-4">
                <a href={'/StockViewer?categoryId=' + category.categoryId} class="item-category-grid">
                    <span class="icon-wrap">
                        <i class="icon material-icons md-stay_primary_portrait"></i>
                    </span>
                    <small class="text">{category.name}</small>
                </a>
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
                <section class="px-3 pt-2 pb-2 fixed-top bg-white" style={{ top: '55px' }}>
                    <input type="text" placeholder="Search" class="bg-secondary-light border-0 form-control"
                        onChange={this.handleSearch.bind(this)}
                    />
                </section>
                {
                    (isLoading) ? (
                        <LoadSpinner />
                    ) : (
                        <ul class="row pt-5 px-2">
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