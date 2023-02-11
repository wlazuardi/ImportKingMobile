﻿class CategoryPicker extends React.Component {
    constructor(props) {
        super(props);
        this.fetchURL = 'https://importking.mooo.com/api/Categories';
        this.state = {
            isLoading: false,
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
            result = result.filter(x => x.isShowOnHome == true);

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
                categories: result
            });
        });
    }

    renderImage(category) {
        var fileName = (category.images != null && category.images.length > 0) ? category.images[0].fileName : '';
        var url = 'url("https://importking.mooo.com/Uploads/' + fileName + '")';
        if (fileName) return (
            <li class="col-4">
                <div class="custom-card">
                    <a href={'/Product/' + category.categoryId + '/Detail'} class="item-category-grid"
                        style={{ background: url, backgroundSize: 'cover' }}></a>
                    <div class="custom-card-text small">
                        {category.name}
                    </div>
                    <div class="custom-card-text small fw-bold">IDR {App.Utils.formatCurrency(category.price)}</div>
                    <div class="custom-card-text small">Terjual: {category.soldCount}</div>
                </div>
            </li>
        );
        else return (
            <li class="col-4">
                <div class="custom-card">
                    <a href={'/Product/' + category.categoryId + '/Detail'} class="item-category-grid">
                        <span class="icon-wrap">
                            <i class="icon material-icons md-stay_primary_portrait"></i>
                        </span>
                    </a>
                    <div class="custom-card-text small">
                        {category.name}
                    </div>
                    <div class="custom-card-text small fw-bold">IDR {App.Utils.formatCurrency(category.price)}</div>
                    <div class="custom-card-text small">Terjual: {category.soldCount}</div>
                </div>
            </li>
        );
    }

    render() {
        var { isLoading, categories } = this.state;
        return (
            <div>
                {
                    (isLoading) ? (
                        <LoadSpinner />
                    ) : (
                        <ul class="row">
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
            </div>
        );
    };
}

ReactDOM.render(<CategoryPicker />, document.getElementById('categoryPicker'));