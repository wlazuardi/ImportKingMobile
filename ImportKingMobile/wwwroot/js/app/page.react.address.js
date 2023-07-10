class AddressPage extends React.Component {
    constructor(props) {
        super(props);
        this.addressListRef = React.createRef();
        this.modalAddressFormRef = React.createRef();
    }

    handleAddAddress() {
        this.modalAddressFormRef.current.setState({
            isShownAdd: true,
            formData: {
                alias: '',
                name: '',
                phone: '',
                fullAddress: '',
                city: '',
                cityId: 0,
                province: '',
                provinceId: 0,
                subDistrict: '',
                subDistrictId: 0,
                zipCode: '',
                isDefault: false
            }
        });
    }

    handleEditAddress(address) {
        this.modalAddressFormRef.current.setState({
            isShownAdd: true,
            formData: address
        });
    }

    handleSubmit() {
        this.addressListRef.current.loadAddresses();
    }

    render() {
        return (
            <div>
                <AddressList ref={this.addressListRef}
                    handleAddAddress={this.handleAddAddress.bind(this)}
                    handleEditAddress={this.handleEditAddress.bind(this)}
                />
                <ModalAddressForm
                    ref={this.modalAddressFormRef}
                    handleSubmit={this.handleSubmit.bind(this)}
                />
            </div>
        );
    }
}
ReactDOM.render(<AddressPage />, document.getElementById('root'));