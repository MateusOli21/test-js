// Create html and script to insert Widget Component
const widgetScript = createScriptElement(
  "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@test01/webc-widget.js",
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
  let modalHTML = `
    <mercado-pago-modal id="mp-modal-comp" product-name="${LS.product.name}">
    </mercado-pago-modal>
  `;
  let modalScript = createScriptElement(
    "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@test01/webc-modal.js",
    "mp-modal-script"
  );

  document.body.insertAdjacentHTML("beforeend", modalHTML);
  document.body.append(modalScript);
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
        createModalComponent(LS);

        if (data.product && LS.product) {
          console.log("Adicionar widget de produto", productAnchorElement);
          productAnchorElement.insertAdjacentHTML("beforeend", createWidgetHtml("mp-widget-product"));
          productAnchorElement.appendChild(widgetScript);
        }

        if (data.cart && LS.product) {
          console.log("Adicionar widget do carrinho", cartAnchorElement);
          cartAnchorElement.insertAdjacentHTML("beforeend", createWidgetHtml("mp-widget-cart"));
          cartAnchorElement.appendChild(widgetScript);
        }

        if(data.checkout) {
          console.log("CHECKOUT")
        }
      }
    });

  console.log("END script!");
}

loadMpWebComponent();
