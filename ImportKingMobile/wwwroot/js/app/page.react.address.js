class AddressPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isShownAdd: false,
            isShownProgress: false,
            isLoadingAddresses: false,
            isLoadingAll: false,
            addresses: [],
            alert: null,
            rules: {
                alias: {
                    required: true
                },
                name: {
                    required: true
                },
                phone: {
                    required: true
                },
                fullAddress: {
                    required: true,
                    maxlength: 250
                },
                city: {
                    required: true,
                    maxlength: 50
                },
                province: {
                    required: true,
                    maxlength: 50
                },
                zipCode: {
                    required: true,
                    digits: true
                }
            },
            formData: {
                isDefault: false
            }
        };

        this.myRef = React.createRef();
        this.loadAddresses();
    }

    loadAddresses() {
        this.setState({
            isLoadingAddresses: true
        });

        fetch('https://importking.mooo.com/api/Addresses/GetByEmail/' + userMail)
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

                result.sort(function (a, b) { return b.isDefault - a.isDefault });

                this.setState({
                    addresses: result,
                    isLoadingAddresses: false
                });
            }, (error) => {
                this.setState({
                    addresses: [],
                    isLoadingAddresses: false
                });
            });
    }

    handleAddAddress() {
        var formData = new Object();
        this.setState({
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

    handleSaveAddress() {
        this.myRef.current.handleSubmit();
    }

    handlePopUpHidden() {
        this.setState({
            isShownAdd: false
        });
    }

    handleSubmitAddress(e) {
        var formData = this.state.formData;

        formData['email'] = userMail;

        this.setState({
            isShownProgress: true
        });

        if (formData.addressId) {
            fetch('https://importking.mooo.com/api/Addresses/', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
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
                        isShownProgress: false,
                        isShownAdd: false,
                        formData: {
                            isDefault: false
                        }
                    });

                    this.loadAddresses();
                }, (error) => {
                    this.setState({
                        isShownProgress: false
                    });
                });
        }
        else {
            fetch('https://importking.mooo.com/api/Addresses/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
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
                        isShownProgress: false,
                        isShownAdd: false,
                        formData: {
                            isDefault: false
                        }
                    });

                    this.loadAddresses();
                }, (error) => {
                    this.setState({
                        isShownProgress: false
                    });
                });
        }
    }

    handleFormInputChange(e) {
        var { formData } = this.state;

        var inputName = e.target.name;
        formData[inputName] = e.target.value;

        if (inputName == "isDefault") {
            formData[inputName] = e.target.checked;
        }

        this.setState({
            formData: formData
        });
    }

    handleRemoveAddress(address, index, e) {
        e.preventDefault();
        var { addresses } = this.state;

        addresses.splice(index, 1);

        this.setState({
            isLoadingAll: true
        });

        fetch('https://importking.mooo.com/api/Addresses/' + address.addressId, {
            method: 'DELETE'
        })
            .then(result => {
                if (result.status == 200) {
                    this.setState({
                        alert: {
                            mode: 'success',
                            message: 'Address removed successfuly',
                            title: 'Success',
                            isShown: true
                        },
                        isLoadingAll: false,
                        addresses: addresses
                    });
                }
                else {
                    this.setState({
                        alert: {
                            mode: 'danger',
                            message: result.statusText,
                            title: 'Failed',
                            isShown: true
                        },
                        isLoadingAll: false,
                        addresses: addresses
                    });
                }
            });
    }


    handlEditAddress(address, e) {
        e.preventDefault();

        this.setState({
            isShownAdd: true,
            formData: address
        });
    }

    handleAlertHidden() {
        this.setState({
            alert: null
        });
    }

    render() {
        return (
            <Progress isShown={this.state.isLoadingAll} class="px-2">
                {
                    (this.state.alert) ?
                        <Alert isShown={this.state.alert.isShown} mode={this.state.alert.mode} title={this.state.alert.title} message={this.state.alert.message} onHidden={this.handleAlertHidden.bind(this)} /> :
                        <div></div>
                }
                {
                    (this.state.isLoadingAddresses) ? (<LoadSpinner />) : (
                        (this.state.addresses.length > 0) ?
                            (
                                this.state.addresses.map((address, index) => (
                                    (address.isDefault) ? (
                                        <div class="card border-primary mb-3">
                                            <div class="card-header p-2 bg-primary text-white">
                                                {address.alias}
                                                <button class="btn btn-sm btn-danger float-end p-1 py-1" style={{ fontSize: '15px' }}
                                                    onClick={this.handleRemoveAddress.bind(this, address, index)}>
                                                    <span class="fa-solid fa-trash" />
                                                </button>
                                                <button class="btn btn-sm btn-secondary float-end p-1 py-1 me-2" style={{ fontSize: '15px' }}
                                                    onClick={this.handlEditAddress.bind(this, address)}>
                                                    <span class="fa-solid fa-edit" />
                                                </button>
                                                <span class="badge badge-sm bg-primary float-end mt-1">Default</span>
                                            </div>
                                            <div class="card-body text-secondary p-2">
                                                <p class="card-text m-0 small">{address.name} ({address.phone})</p>
                                                <p class="card-text m-0 small">{address.fullAddress}, {address.city}, {address.province}, {address.zipCode}</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div class="card border-secondary mb-3">
                                            <div class="card-header p-2">
                                                {address.alias}
                                                <button class="btn btn-sm btn-danger float-end p-1 py-1" style={{ fontSize: '15px' }}
                                                    onClick={this.handleRemoveAddress.bind(this, address, index)}>
                                                    <span class="fa-solid fa-trash" />
                                                </button>
                                                <button class="btn btn-sm btn-secondary float-end p-1 py-1 me-2" style={{ fontSize: '15px' }}
                                                    onClick={this.handlEditAddress.bind(this, address)}>
                                                    <span class="fa-solid fa-edit" />
                                                </button>
                                            </div>
                                            <div class="card-body text-secondary p-2">
                                                <p class="card-text m-0 small">{address.name} ({address.phone})</p>
                                                <p class="card-text m-0 small">{address.fullAddress}, {address.city}, {address.province}, {address.zipCode}</p>
                                            </div>
                                        </div>
                                    )
                                ))
                            ) :
                            (
                                <div class="mb-3">
                                    <div class="text-center">No address to display</div>
                                    <div class="text-center">Please add new address</div>
                                </div>
                            )
                    )
                }
                <button class="btn btn-primary w-100 mb-3" onClick={this.handleAddAddress.bind(this)}>
                    <i class="icon fa-solid fa-plus me-2" />
                    Add Address
                </button>
                <ModalPopUp isShown={this.state.isShownAdd} class="modal" onHidden={this.handlePopUpHidden.bind(this)}>
                    <div class="modal-dialog" role="document">
                        <Progress isShown={this.state.isShownProgress} class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Add Product</h5>
                                <button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <FormValidate ref={this.myRef} novalidate="novalidate" rules={this.state.rules} submitHandler={this.handleSubmitAddress.bind(this)}>
                                    <div class="mb-3">
                                        <label class="form-label">Address Name</label>
                                        <div>
                                            <input class="form-control" name="alias" placeholder="e.g. Home, Office, Apartment" type="text" value={this.state.formData.alias} onChange={this.handleFormInputChange.bind(this)} />
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Recipient Name</label>
                                        <div>
                                            <input class="form-control" name="name" placeholder="Recipient Name" type="text" value={this.state.formData.name} onChange={this.handleFormInputChange.bind(this)} />
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Phone</label>
                                        <div>
                                            <input class="form-control" name="phone" placeholder="Phone" type="text" value={this.state.formData.phone} onChange={this.handleFormInputChange.bind(this)} />
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Delivery Address</label>
                                        <div>
                                            <textarea class="form-control" name="fullAddress" placeholder="Street Address With No." value={this.state.formData.fullAddress} onChange={this.handleFormInputChange.bind(this)}></textarea>
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">City</label>
                                        <div>
                                            <input class="form-control" name="city" placeholder="City" type="text" value={this.state.formData.city} onChange={this.handleFormInputChange.bind(this)} />
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Province</label>
                                        <div>
                                            <input class="form-control" name="province" placeholder="Province" type="text" value={this.state.formData.province} onChange={this.handleFormInputChange.bind(this)} />
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label">Zip Code</label>
                                        <div>
                                            <input class="form-control" name="zipCode" placeholder="Zip Code" type="text" value={this.state.formData.zipCode} onChange={this.handleFormInputChange.bind(this)} />
                                        </div>
                                    </div>
                                    <div class="mb-3">
                                        <div class="form-check">
                                            <input class="form-check-input" type="checkbox" name="isDefault" checked={this.state.formData.isDefault} onChange={this.handleFormInputChange.bind(this)} id="defaultAddress" />
                                            <label class="form-check-label" for="defaultAddress">
                                                Set as default address
                                            </label>
                                        </div>
                                        <input type="hidden" value={this.state.addressId}/>
                                    </div>
                                </FormValidate>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-primary" onClick={this.handleSaveAddress.bind(this)}>Save</button>
                            </div>
                        </Progress>
                    </div>
                </ModalPopUp>
            </Progress>
        );
    }
}

ReactDOM.render(<AddressPage />, document.getElementById('root'));