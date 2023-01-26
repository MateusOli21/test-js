const template = document.createElement("template");

template.innerHTML = `
<style>
    .mp-button-cta {
        width: fit-content;
        padding: 8px 12px;
        border-radius: 8px;
        background-color: #5386E4;
    }

    .mp-button-cta p {
        font-weight: bold;
        color: #fff;
    }
</style>

<div class="mp-button-cta">
    <p>Compre com Mercado Credits</p>
</div>
`;

class MercadoPagoWidget extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }
}

Window.customElements.define("mercado-pago-widget", MercadoPagoWidget);
