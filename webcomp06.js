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
        position: absolute; 
        z-index: 100; 
        padding-top: 100px; 
        left: 0;
        top: 0;
        width: 100%; 
        height: 100%; 
        overflow: auto; 
        background-color: rgba(0,0,0,0.4); 
    }

    .modal-content {
        position: relative;
        margin: auto;
        padding: 0;
        width: 80%;
        max-width: 768px;
        border: 1px solid #888;
        background-color: #fefefe;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
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
    this.shadowRoot.querySelector("#modal-open-btn").addEventListener('click', this._showModal.bind(this))
    this.shadowRoot.querySelector("#modal-close-btn").addEventListener('click', this._hideModal.bind(this))
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
