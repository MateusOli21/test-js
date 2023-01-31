const template = document.createElement("template");

template.innerHTML = `
<style>
    .mp-button-cta {
        width: fit-content;
        padding: 0px 24px;
        border-radius: 8px;
        background-color: #5386E4;
        cursor: pointer;
    }

    .mp-button-cta p {
        font-weight: bold;
        color: #fff;
        line-height: 150%;
        padding: 8px 0;
        font-size: 14px;
    }
</style>

<div id="modal-open-btn" class="mp-button-cta">
    <p>Compre com Mercado Credits</p>
</div>
`;

class MercadoPagoWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this.shadowRoot.querySelector("#modal-open-btn").addEventListener('click', this._showModal.bind(this))
    this.shadowRoot.dispatchEvent(new CustomEvent('widget-clicked', {
      composed: true,
      bubbles: true
    }))
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("#modal-open-btn").removeEventListener('click', this._showModal)
  }

  _showModal() {
    document.querySelector('#mp-modal-comp').setAttribute("display", "block")
  }
}

window.customElements.define("mercado-pago-widget", MercadoPagoWidget);
