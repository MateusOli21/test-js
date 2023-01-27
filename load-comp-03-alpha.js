// Create html and script to insert Widget Component
let productWidgetHTML = `<mercado-pago-widget id="mp-widget-product"></mercado-pago-widget>`;
let cartWidgetHTML = `<mercado-pago-widget id="mp-widget-cart"></mercado-pago-widget>`;
const widgetScript = createScriptElement(
  "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@main/widget-component.js",
  "mp-widget-script"
);

// Create html and script to insert Modal Component
let modalHTML = `<mercado-pago-modal id="mp-modal-comp"></mercado-pago-modal>`;
const modalScript = createScriptElement(
  "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@main/modal-component.js",
  "mp-modal-script"
);

function createScriptElement(src, id) {
  const scriptElement = document.createElement("script");
  scriptElement.id = id;
  scriptElement.src = src;
  scriptElement.type = "module";
  return scriptElement;
}

// This is where we get the parent node to append the widgets
let productAnchorElement = null;
let cartAnchorElement = null;
let addToCartButtonElement = null;

function setAnchorPoints() {
  let productBuyButtonSelector = document.querySelector('[data-store="product-buy-button"]');
  console.log("ProductBuyButton", productBuyButtonSelector);

  let cartSelector = document.querySelector("#ajax-cart-submit-div");
  console.log("CartSelector", cartSelector);

  let productSelector = document.querySelector('[data-store*="product-price-"]');
  console.log("poductSelector", productSelector);

  if (cartSelector !== null) cartAnchorElement = cartSelector;
  if (productSelector !== null) productAnchorElement = productSelector;
  if (productBuyButtonSelector !== null) addToCartButtonElement = productBuyButtonSelector;
}

function loadMpWebComponent() {
  console.log("Start script!");
  setAnchorPoints();

  // Fetch data from API to check configurations
  fetch(
    `https://api.mercadopago.com/alpha/platforms/tienda-nube/payment/widgets/${LS.store.id}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("API RESPONSE", data);

      if (addToCartButtonElement !== null) {
        console.log("Adicionar component modal");
        document.body.insertAdjacentHTML("beforeend", modalHTML);
        document.body.append(modalScript);

        if (data.product && LS.product) {
          console.log("Adicionar widget de produto", productAnchorElement);
          productAnchorElement.insertAdjacentHTML("beforeend", productWidgetHTML);
          productAnchorElement.appendChild(widgetScript);
        }

        if (data.cart && LS.product) {
          console.log("Adicionar widget do carrinho", cartAnchorElement);
          cartAnchorElement.insertAdjacentHTML("beforeend", cartWidgetHTML);
          cartAnchorElement.appendChild(widgetScript);
        }
      }
    });

  console.log("END script!");
  // let priceHolderElement = document.getElementsByTagName("h3");
  // let priceHolder = priceHolderElement[0];
  // priceHolder.insertAdjacentHTML("beforeend", widgetHTML);
  // priceHolder.appendChild(widgetScript);
  // priceHolder.insertAdjacentHTML("beforeend", modalHTML);
  // priceHolder.appendChild(modalScript);
}

loadMpWebComponent();
