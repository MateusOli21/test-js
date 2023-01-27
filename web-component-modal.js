const template = document.createElement("template");

template.innerHTML = `
<style>
    .modal-wrapper {
        display: none; 
        position: fixed; 
        z-index: 10000; 
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
        background-color: #fefefe;
        box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19);
        border-radius: 8px;
        padding: 0px 24px 16px;
        text-align: center;
    }

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    
    .modal-content h2 {
      line-height: 100%;
    }

    .modal-content h3 {
      line-height: 100%;
      margin: 48px 0 16px 0;
    }

    .modal-content span {
      color: #6b6b6b;
      font-weight: 500;
    }

    .credits-steps {
      display: flex;
      gap: 24px;
      margin-bottom: 24px;
    }

    .credits-step-item {
      text-align: center;
    }

    .close-btn {
      cursor: pointer;
    }

    .disclaimer {
      font-size: 12px;
      color: #c2c2c2;
      font-weight: 500;
      line-height: 150%;
      text-align: center;
    }

    .animate-top {
        position: relative;
        animation: animatetop 0.5s;
    }

    @keyframes animatetop {
        from { top:-100%; opacity:0 }
        to { top:0; opacity:1 }
    }
</style>

<div id="mp-modal" class="modal-wrapper">
    <div class="modal-content animate-top">
      <div class="modal-header">
        <img src="https://www.mercadopago.com/v1/platforms/tienda-nube/assets/logos/logo-mp-160x100.png"></img>
      
        <svg id="modal-close-btn" class="close-btn" width="26" height="27" viewBox="0 0 26 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 13.5303C25 20.1577 19.6274 25.5303 13 25.5303C6.37258 25.5303 1 20.1577 1 13.5303C1 6.90286 6.37258 1.53027 13 1.53027C19.6274 1.53027 25 6.90286 25 13.5303Z" stroke="#18223D" stroke-width="2" stroke-linecap="round"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M7.95348 8.53136C8.34216 8.13899 8.97532 8.136 9.36768 8.52468L18.0397 17.1151C18.432 17.5038 18.435 18.1369 18.0463 18.5293C17.6577 18.9217 17.0245 18.9247 16.6321 18.536L7.96016 9.94556C7.5678 9.55688 7.56481 8.92372 7.95348 8.53136Z" fill="#18223D"></path>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0589 8.50312C18.4482 8.89487 18.4462 9.52803 18.0544 9.91733L9.35528 18.5621C8.96353 18.9514 8.33037 18.9494 7.94107 18.5577C7.55177 18.1659 7.55376 17.5328 7.9455 17.1435L16.6447 8.49869C17.0364 8.10939 17.6696 8.11137 18.0589 8.50312Z" fill="#18223D"></path>
        </svg>
      </div>

      <h2>Pague com Mercado Credits</h2>
      <span>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati reprehenderit enim natus dignissimos hic esse aperiam, consectetur praesentium eos harum delectus sint quo ullam odio</span>
      <p id="product-name">Nome do produto: </p>

      <h3>Como funciona?</h3>
      <div class="credits-steps">
        <div class="credits-step-item">
          <p>1. Lorem ipsum dolor sit amet</p>
        </div>
        <div class="credits-step-item">
          <p>2. Lorem ipsum dolor sit amet</p>
        </div>
        <div class="credits-step-item">
          <p>3. Lorem ipsum dolor sit amet</p>
        </div>
      </div>

      <p class="disclaimer">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati reprehenderit enim natus dignissimos hic esse aperiam, 
        consectetur praesentium eos harum delectus sint quo ullam odio nemo quos mollitia perferendis facere.
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Obcaecati reprehenderit enim natus dignissimos hic esse aperiam.
      </p>

    <div>
</div>
`;

class MercadoPagoModal extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["display", "product-name"];
  }

  get modalDisplay() {
    return this.getAttribute("display");
  }

  get productName() {
    return this.getAttribute("product-name");
  }

  connectedCallback() {
    this.shadowRoot
      .querySelector("#modal-close-btn")
      .addEventListener("click", this._hideModal.bind(this));
  }

  disconnectedCallback() {
    this.shadowRoot
      .querySelector("#modal-close-btn")
      .removeEventListener("click", this._hideModal);
  }

  attributeChangedCallback(attribute, oldValue, newValue) {
    this._toggleModalDisplay(attribute, newValue)
    this._insertProductName(attribute)
  }

  _hideModal() {
    this.setAttribute("display", "none");
  }

  _toggleModalDisplay(attribute, newValue) {
     if (this.modalDisplay && this.shadowRoot && attribute === "display") {
      if (newValue === "block") {
        this.shadowRoot.querySelector("#mp-modal").style.display = "block";
      } else {
        this.shadowRoot.querySelector("#mp-modal").style.display = "none";
      }
    }
  }

  _insertProductName(attribute) {
    if(this.productName && this.shadowRoot && attribute === "product-name") {
      let element = this.shadowRoot.querySelector("#product-name")
      let text = document.createTextNode(this.productName)
      element.appendChild(text);
    }
  }
}

window.customElements.define("mercado-pago-modal", MercadoPagoModal);
