const template = document.createElement("template");

template.innerHTML = `
<style>
    .mp-button-cta {
        width: fit-content;
        padding: 4px 16px;
        border-radius: 8px;
        background-color: #5386E4;
        cursor: pointer;
    }

    .mp-button-cta p {
        font-weight: bold;
        color: #fff;
    }

    .modal-wrapper {
        display: none;
        position: fixed;
        z-index: 100;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0,0,0,0.4);
    }

    .modal-content {
        background-color: #fefefe;
        margin: auto;
        width: 95%;
        max-width:768px;
    }
</style>

<div id="modal-open-btn" class="mp-button-cta">
    <p>Compre com Mercado Credits</p>
</div>
<div id="mp-modal" class="modal-wrapper">
    <div class="modal-content">
        <h3>Pague com Mercado Credits</h3>
        <button id="modal-close-btn">Fechar</button>
    <div>
</div>
`;

class MercadoPagoWidget extends HTMLElement {
  constructor() {
    super();
    this._modal = null;
    this._modalVisible = false;
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
    this._modal = this.shadowRoot.querySelector("#mp-modal")
    this.shadowRoot.querySelector("#modal-open-btn").addEventListener('click', this._showModal)
    this.shadowRoot.querySelector("#modal-close-btn").addEventListener('click', this._hideModal)
  }

  disconnectedCallback() {
    this.shadowRoot.querySelector("#modal-open-btn").removeEventListener('click', this._showModal)
    this.shadowRoot.querySelector("#modal-close-btn").removeEventListener('click', this._hideModal)
  }

  _showModal() {
    this._modalVisible = true;
    this._modal.style.display = "block";
  }

  _hideModal() {
    this._modalVisible = false;
    this._modal.style.display = "none";
  }
}

window.customElements.define("mercado-pago-widget", MercadoPagoWidget);
