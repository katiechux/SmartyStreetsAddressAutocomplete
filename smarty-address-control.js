import { html, LitElement, css } from 'https://cdn.jsdelivr.net/gh/lit/dist@2/all/lit-all.min.js';
const PLUGIN_NAME = 'smarty-streets-address'

export default class AddressAutoComplete extends LitElement {

    static styles = css`
        .form-control:focus {
            border-color: #006BD6;
            box-shadow: 0 0 0 0;
        }
        .list-group:first-child {
            border-radius: 0px 0px 0.25rem 0.25rem;
        }
        .list-group-item:first-child {
            border-top: 0px;
        }
    `;
    
    static properties = {
        apiKey: { type: String },
        addresses: { type: Array },
        value: { type: String },
    };

    static get properties() {
        return {
            inputValue: { 
                type: String,
                attribute: false
            }
        }
    }

    static getMetaConfig() {
        return {
            controlName: PLUGIN_NAME,
            fallbackDisableSubmit: false,
            description: 'Smarty Streets US Address Autocomplete, Pro Edition Search Component',
            groupName: 'Samples',
            version: '1.0',
            properties: {
                apiKey: {
                    type: 'string',
                    title: 'Smarty Embedded API Key',
                },
                value: {
                    type: 'string',
                    title: 'Address',
                    isValueField: true,
                },
            },
            standardProperties: {
                fieldLabel: false,
                description: false,
                defaultValue: false,
                readOnly: false,
            },
            events: ["ntx-value-change"],
        };
    }

    render() {
        const inputStyle = this.addresses.length > 0 ? 'border-radius: 0.25rem 0.25rem 0px 0px;' : '';
        return  html`
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
            <div class="input-group input-group-sm" id="input-container" style="line-height: 1rem;">            
                <input type="text" class="form-control" value="${this.inputValue}" @keyup=${this.updateInputValue} aria-label="address" placeholder="Enter an address" id="address" style="font-size: 14px; padding: 7px 12px 7px 12px; ${inputStyle}"/>
            </div>
            <div>
                <ul class="list-group">
                    ${this.addresses.map((address, index) => html`<li class="list-group-item list-group-item-action" aria-label="${JSON.stringify(address)}" id="${index}" @click="${this.handleClick}" style="padding: 0.25rem 0.5rem; font-size: .875rem;">${address.street_line} ${address.secondary} ${address.city}, ${address.state} ${address.zipcode}</li>`)}
                </ul>
            </div>
        `;
    }

    handleInput(event) {
        if (this.inputValue && this.inputValue.length >= 4) {
            this.getSmartyStreets();
        } else {
            this.addresses = [];
        }
    }

    handleClick(event) {
        const addressObject = event.target.ariaLabel;
        const inputElement = this.renderRoot.querySelector('#address');
        inputElement.value = event.target.innerText;
        this.addresses = [];

        this.value = addressObject;
        const args = {
            bubbles: true,
            cancelable: false,
            composed: true,
            detail: addressObject,
        };
        const nintexEvent = new CustomEvent('ntx-value-change', args);
        this.dispatchEvent(nintexEvent);
    }

    async getSmartyStreets() {
        const response = await fetch('https://us-autocomplete-pro.api.smartystreets.com/lookup?search=' + this.inputValue + '&key=' + this.apiKey, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        this.addresses = result.suggestions;
    }

    updateInputValue(event) {
        this.inputValue = event.srcElement.value;
    }

    constructor() {
        super();
        this.addresses = [];
        this.addEventListener('input', this.handleInput);
    }
}

const elementName = PLUGIN_NAME;
customElements.define(elementName, AddressAutoComplete);