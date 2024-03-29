﻿class AddressList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isShownProgress: false,
            isLoadingAddresses: false,
            isLoadingAll: false,
            addresses: [],
            alert: null
        };

        this.loadAddresses();
    }

    loadAddresses() {
        this.setState({
            isLoadingAddresses: true
        });

        fetch(hostUrl + '/api/Addresses/GetByEmail/' + userMail, {
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
        if (this.props.handleAddAddress)
            this.props.handleAddAddress();
    }

    handleRemoveAddress(address, index, e) {
        e.preventDefault();
        e.stopPropagation();
        var { addresses } = this.state;

        addresses.splice(index, 1);

        this.setState({
            isLoadingAll: true
        });

        fetch(hostUrl + '/api/Addresses/' + address.addressId, {
            method: 'DELETE',
            credentials: 'include'
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

    handleEditAddress(address, e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.props.handleEditAddress)
            this.props.handleEditAddress(address);
    }

    handleAlertHidden() {
        this.setState({
            alert: null
        });
    }

    handleItemClick(address, e) {
        e.stopPropagation();
        if (this.props.handleItemClick)
            this.props.handleItemClick(address);

        console.log('handleItemClick');
    }

    render() {
        return (
            <Progress isShown={this.state.isLoadingAll} class="px-2">
                {
                    (this.state.alert) ?
                        <Toast isShown={this.state.alert.isShown} mode={this.state.alert.mode} title={this.state.alert.title} message={this.state.alert.message} onHidden={this.handleAlertHidden.bind(this)} /> :
                        <div></div>
                }
                {
                    (this.state.isLoadingAddresses) ? (<LoadSpinner />) : (
                        (this.state.addresses.length > 0) ?
                            (
                                this.state.addresses.map((address, index) => (
                                    (address.isDefault) ? (
                                        <div class="card border-primary mb-3" onClick={this.handleItemClick.bind(this, address)}>
                                            <div class="card-header p-2 bg-primary text-white">
                                                {address.alias}
                                                <button class="btn btn-sm btn-danger float-end p-1 py-1" style={{ fontSize: '15px' }}
                                                    onClick={this.handleRemoveAddress.bind(this, address, index)}>
                                                    <span class="fa-solid fa-trash" />
                                                </button>
                                                <button class="btn btn-sm btn-secondary float-end p-1 py-1 me-2" style={{ fontSize: '15px' }}
                                                    onClick={this.handleEditAddress.bind(this, address)}>
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
                                        <div class="card border-secondary mb-3" onClick={this.handleItemClick.bind(this, address)}>
                                            <div class="card-header p-2">
                                                {address.alias}
                                                <button class="btn btn-sm btn-danger float-end p-1 py-1" style={{ fontSize: '15px' }}
                                                    onClick={this.handleRemoveAddress.bind(this, address, index)}>
                                                    <span class="fa-solid fa-trash" />
                                                </button>
                                                <button class="btn btn-sm btn-secondary float-end p-1 py-1 me-2" style={{ fontSize: '15px' }}
                                                    onClick={this.handleEditAddress.bind(this, address)}>
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
            </Progress>
        );
    }
}

class ModalAddressForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            provinces: [],
            cities: [],
            subdistricts: [],
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
                cityId: {
                    min: 1
                },
                provinceId: {
                    min: 1
                },
                subDistrictId: {
                    min: 1
                },
                zipCode: {
                    required: true,
                    digits: true
                }
            },
            messages: {
                cityId: {
                    min: 'Please select city'
                },
                provinceId: {
                    min: 'Please select province'
                },
                subDistrictId: {
                    min: 'Please select sub district'
                }
            },
            formData: {
                isDefault: false
            }
        }
        this.myRef = React.createRef();
        this.populateProvinces();
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.formData && this.state.formData.province) {
            if (!prevState.formData || this.state.formData.province != prevState.formData.province) {
                this.populateCities();
            }
        }

        if (this.state.formData && this.state.formData.city) {
            if (!prevState.formData || this.state.formData.city != prevState.formData.city) {
                this.populateDistricts();
            }
        }
    }

    populateProvinces() {
        this.setState({
            isLoadingAll: true
        });

        fetch(hostUrl + '/api/Deliveries/Province/0', {
            method: 'GET',
            credentials: 'include'
        })
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
                    var results = $.map(data.rajaOngkir.results, function (item) {
                        return {
                            id: item.provinceId,
                            text: item.province
                        };
                    });

                    results.unshift({
                        id: 0,
                        text: ''
                    });

                    this.setState({
                        provinces: results,
                        isLoadingAll: false
                    });
                },
                (error) => {
                    this.setState({
                        isLoadingAll: false
                    });
                }
            )
    }

    populateCities() {
        this.setState({
            isLoadingAll: true
        });

        fetch(hostUrl + '/api/Deliveries/Province/' + this.state.formData.provinceId + '/City/0', {
            method: 'GET',
            credentials: 'include'
        })
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
                    var results = $.map(data.rajaongkir.results, function (item) {
                        return {
                            id: item.cityId,
                            text: item.type + " " + item.cityName,
                            postalCode: item.postalCode
                        };
                    });

                    results.unshift({
                        id: 0,
                        text: '',
                        postalCode: ''
                    });

                    this.setState({
                        cities: results,
                        isLoadingAll: false
                    });
                },
                (error) => {
                    this.setState({
                        isLoadingAll: false
                    });
                }
            )
    }

    populateDistricts() {
        this.setState({
            isLoadingAll: true
        });

        fetch(hostUrl + '/api/Deliveries/Province/' + this.state.formData.provinceId + '/City/' + this.state.formData.cityId + '/SubDistrict', {
            method: 'GET',
            credentials: 'include'
        })
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
                    var results = $.map(data.rajaOngkir.results, function (item) {
                        return {
                            id: item.subdistrictId,
                            text: item.subdistrictName
                        };
                    });

                    results.unshift({
                        id: 0,
                        text: ''
                    });

                    this.setState({
                        subdistricts: results,
                        isLoadingAll: false
                    });
                },
                (error) => {
                    this.setState({
                        isLoadingAll: false
                    });
                }
            )
    }

    handlePopUpHidden() {
        this.setState({
            isShownAdd: false
        });
    }

    handleSaveAddress() {
        this.myRef.current.handleSubmit();
    }

    handleSubmit(e) {
        var formData = this.state.formData;

        formData['email'] = userMail;

        this.setState({
            isShownProgress: true
        });

        if (formData.addressId) {
            fetch(hostUrl + '/api/Addresses/', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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
                        isShownProgress: false,
                        isShownAdd: false,
                        formData: {
                            isDefault: false
                        }
                    });

                    if (this.props.handleSubmit)
                        this.props.handleSubmit();
                }, (error) => {
                    this.setState({
                        isShownProgress: false
                    });
                });
        }
        else {
            fetch(hostUrl + '/api/Addresses/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
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
                        isShownProgress: false,
                        isShownAdd: false,
                        formData: {
                            isDefault: false
                        }
                    });

                    if (this.props.handleSubmit)
                        this.props.handleSubmit();
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

        if (inputName == 'provinceId') {
            var temp = this.state.provinces.filter(x => x.id == this.state.formData.provinceId);
            var province = (temp && temp.length) ? temp[0].text : '';            
            formData['province'] = province;
            this.populateCities();
        }
        else if (inputName == 'cityId') {
            var temp = this.state.cities.filter(x => x.id == this.state.formData.cityId);
            if (temp && temp.length > 0) {
                formData['zipCode'] = temp[0].postalCode;
                formData['city'] = temp[0].text;
            }
            this.populateDistricts();
        }
        else if (inputName == 'subDistrictId') {
            var temp = this.state.subdistricts.filter(x => x.id == this.state.formData.subDistrictId);
            if (temp && temp.length > 0) {                
                formData['subDistrict'] = temp[0].text;
            }
        }

        this.setState({
            formData: formData
        });
    }

    handleFormSelectChange(e) {
        var { formData } = this.state;

        var inputName = e.name;
        formData[inputName] = e.value;

        if (inputName == 'province')
            this.populateCities();

        if (inputName == 'city') {
            var temp = this.state.cities.filter(x => x.id == this.state.formData.city);
            if (temp && temp.length > 0) {
                formData['zipCode'] = temp[0].postalCode;
            }
            this.populateDistricts();
        }

        this.setState({
            formData: formData
        });
    }

    render() {
        return (
            <Progress isShown={this.state.isLoadingAll} class="px-2">
                {
                    (this.state.alert) ?
                        <Toast isShown={this.state.alert.isShown} mode={this.state.alert.mode} title={this.state.alert.title} message={this.state.alert.message} onHidden={this.handleAlertHidden.bind(this)} /> :
                        <div></div>
                }
                <ModalPopUp id="addNewAddressModal" isShown={this.state.isShownAdd} class="modal" onHidden={this.handlePopUpHidden.bind(this)}>
                    <div class="modal-dialog" role="document">
                        <Progress isShown={this.state.isShownProgress} class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Add Address</h5>
                                <button type="button" class="close btn btn-secondary btn-sm" data-bs-dismiss="modal" target="#addNewAddressModal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-body">
                                <FormValidate ref={this.myRef} novalidate="novalidate" rules={this.state.rules} messages={this.state.messages} submitHandler={this.handleSubmit.bind(this)}>
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
                                    <div id="provinceRow" class="mb-3">
                                        <label class="form-label">Province</label>
                                        <div>
                                            {/*<Select2 class="form-control w-100" name="province" value={this.state.formData.provinceId} dataSource={this.state.provinces} dropdownParent="#addNewAddressModal" width="100%" onChange={this.handleFormSelectChange.bind(this)} />*/}
                                            <select class="form-control" name="provinceId" placeholder="Province" value={this.state.formData.provinceId} onChange={this.handleFormInputChange.bind(this)}>
                                                {
                                                    this.state.provinces.map(x => (
                                                        <option value={x.id}>{x.text}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div id="cityRow" class="mb-3">
                                        <label class="form-label">City</label>
                                        <div>
                                            {/*<Select2 class="form-control w-100" name="city" value={this.state.formData.cityId} dataSource={this.state.cities} dropdownParent="#addNewAddressModal" width="100%" onChange={this.handleFormSelectChange.bind(this)} />*/}
                                            <select class="form-control" name="cityId" placeholder="City" value={this.state.formData.cityId} onChange={this.handleFormInputChange.bind(this)}>
                                                {
                                                    this.state.cities.map(x => (
                                                        <option value={x.id}>{x.text}</option>
                                                    ))
                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div id="subDistrictRow" class="mb-3">
                                        <label class="form-label">District</label>
                                        <div>
                                            {/*<Select2 class="form-control w-100" name="subDistrict" value={this.state.formData.subDistrictId} dataSource={this.state.cities} dropdownParent="#addNewAddressModal" width="100%" onChange={this.handleFormSelectChange.bind(this)} />*/}
                                            <select class="form-control" name="subDistrictId" placeholder="Sub District" value={this.state.formData.subDistrictId} onChange={this.handleFormInputChange.bind(this)}>
                                                {
                                                    this.state.subdistricts.map(x => (
                                                        <option value={x.id}>{x.text}</option>
                                                    ))
                                                }
                                            </select>
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
                                        <input type="hidden" value={this.state.addressId} />
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