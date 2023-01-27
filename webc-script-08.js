// Create html and script to insert Widget Component
const widgetScript = createScriptElement(
  "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@main/web-component-widget.js",
  "mp-widget-script"
);

function createScriptElement(src, id) {
  const scriptElement = document.createElement("script");
  scriptElement.id = id;
  scriptElement.src = src;
  scriptElement.type = "module";
  return scriptElement;
}

function createWidgetHtml(id) {
  return `<mercado-pago-widget id="${id}"></mercado-pago-widget>`;
}

// Create html and script to insert Modal Component
function createModalComponent(LS) {
  let modalHTML;
  if (checkoutAnchorElement !== null) {
    modalHTML = `<mercado-pago-modal id="mp-modal-comp"></mercado-pago-modal>`;
  } else {
    modalHTML = `
      <mercado-pago-modal id="mp-modal-comp" product-name="${LS.product.name}"></mercado-pago-modal>
    `;
  }
  let modalScript = createScriptElement(
    "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@main/web-component-modal.js",
    "mp-modal-script"
  );
  document.body.insertAdjacentHTML("beforeend", modalHTML);
  document.body.append(modalScript);
}

// This will indicate if is product page or not
let addToCartButtonElement = null;

// This is where we get the parent node to append the widgets
let checkoutAnchorElement = null;
let productAnchorElement = null;
let cartAnchorElement = null;

function setAnchorPoints() {
  let productBuyButtonSelector = document.querySelector(
    '[data-store="product-buy-button"]'
  );
  console.log("ProductBuyButton", productBuyButtonSelector);
  if (productBuyButtonSelector !== null)
    addToCartButtonElement = productBuyButtonSelector;

  let cartSelector = document.querySelector('[class="ajax-cart-bottom"]');
  console.log("CartSelector", cartSelector);
  if (cartSelector !== null) cartAnchorElement = cartSelector;

  let productSelector = document.querySelector(
    '[data-store*="product-price-"]'
  );
  console.log("poductSelector", productSelector);
  if (productSelector !== null) productAnchorElement = productSelector;

  let cardDetailsSelector = document.querySelector(
    '[class="table-subtotal"]'
  );
  console.log("cartDetailsSelector", productSelector);
  if (cardDetailsSelector !== null) checkoutAnchorElement = cardDetailsSelector;
}

function appendWidgetComponent(anchorElement, position, id) {
  anchorElement.insertAdjacentElement(position, widgetScript);
  anchorElement.insertAdjacentHTML(position, createWidgetHtml(id));
}

function loadMpWebComponent() {
  console.log("Start script!");
  setAnchorPoints();

  // If isn't product page doesn't need to fetch data
  if (addToCartButtonElement === null && checkoutAnchorElement === null) return;

  // Fetch data from API to check widget configurations
  fetch(
    `https://api.mercadopago.com/alpha/platforms/tienda-nube/payment/widgets/${LS.store.id}`
  )
    .then((res) => res.json())
    .then((widgetsConfig) => {
      {
        console.log("API RESPONSE", widgetsConfig);

        if (widgetsConfig.product && LS.product) {
          console.log("Adicionar widget de produto", productAnchorElement);
          appendWidgetComponent(productAnchorElement, "beforeend", "mp-widget-product");
        }

        if (widgetsConfig.cart && LS.product) {
          console.log("Adicionar widget do carrinho", cartAnchorElement);
          appendWidgetComponent(cartAnchorElement, "beforebegin", "mp-widget-cart");
        }

        if (widgetsConfig.checkout && checkoutAnchorElement) {
          console.log("Adicionar widget no checkout");
          appendWidgetComponent(checkoutAnchorElement, "beforebegin", "mp-widget-checkout");
        }

        console.log("Adicionar component modal");
        createModalComponent(LS);

        console.log("END script!");
      }
    });
}

loadMpWebComponent();
