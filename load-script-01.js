// create and append elements to load GTM
function appendGTMHeadScript() {
  let gtmHeadScript = document.createElement("script");
  gtmHeadScript.innerHTML = `
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s),
        dl = l != "dataLayer" ? "&l=" + l : "";
      j.async = true;
      j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
      f.parentNode.insertBefore(j, f);
    })(window, document, "script", "dataLayer", "GTM-KGTKL3B");
  `;
  document.head.insertAdjacentElement("afterbegin", gtmHeadScript);
}

function appendGtmBodyNoScriptTag() {
  let gtmNoScript = document.createElement("noscript");
  let gtmIframe = document.createElement("iframe");
  gtmIframe.width = 0;
  gtmIframe.height = 0;
  gtmIframe.style = "display: none; visibility: hidden";
  gtmIframe.src = "https://www.googletagmanager.com/ns.html?id=GTM-KGTKL3B";
  gtmNoScript.appendChild(gtmIframe);
  document.body.insertAdjacentElement("afterbegin", gtmNoScript);
}

function appendGtmScriptOnDocument() {
  appendGTMHeadScript();
  appendGtmBodyNoScriptTag();
}

// Create html and script to insert Widget Component
function createScriptElement(src, id) {
  const scriptElement = document.createElement("script");
  scriptElement.id = id;
  scriptElement.src = src;
  scriptElement.type = "module";
  return scriptElement;
}

function createWidgetElement(id) {
  const widgetElement = document.createElement("mercado-pago-widget");
  widgetElement.id = id;
  widgetElement.addEventListener("widget-clicked", function (e) {
    console.log("Widget Clicado", e);
  });
  return widgetElement;
}

function appendWidgetComponent(anchorElement, position, id) {
  const widgetElement = createWidgetElement(id);
  const widgetScript = createScriptElement(
    "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@gtm/web-component-widget.js",
    "mp-widget-script"
  );
  anchorElement.insertAdjacentElement(position, widgetElement);
  anchorElement.insertAdjacentElement(position, widgetScript);
  anchorElement.appendChild(scriptWidget);
}

// Create html and script to insert Modal Component
function createModalComponent(LS) {
  const modalElement = document.createElement("mercado-pago-modal");
  modalElement.id = "mp-modal-component";
  modalElement.addEventListener("cta-link-clicked", function (e) {
    console.log("Link dentro do modal clicado", e);
  });
  let modalScript = createScriptElement(
    "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@gtm/web-component-modal.js",
    "mp-modal-script"
  );
  document.body.insertAdjacentElement("beforeend", modalElement);
  document.body.insertAdjacentElement("beforeend", modalScript);
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
  if (productBuyButtonSelector !== null)
    addToCartButtonElement = productBuyButtonSelector;

  let cartSelector = document.querySelector('[class*="ajax-cart-bottom"]');
  if (cartSelector !== null) cartAnchorElement = cartSelector;

  let productSelector = document.querySelector(
    '[data-store*="product-price-"]'
  );
  if (productSelector !== null) productAnchorElement = productSelector;

  let cardDetailsSelector = document.querySelector('[class="table-subtotal"]');
  if (cardDetailsSelector !== null) checkoutAnchorElement = cardDetailsSelector;
}

// Main file function
function loadMpWebComponent() {
  // Append GTM scripts on page
  appendGtmScriptOnDocument();

  // Check the anchor tags
  setAnchorPoints();

  // If isn't product page doesn't need to fetch data
  if (addToCartButtonElement === null && checkoutAnchorElement === null) return;


  // Check if should append widget components
  if (LS.product && productAnchorElement) {
    console.log("Adicionar widget de produto", productAnchorElement);
    appendWidgetComponent(
      productAnchorElement,
      "beforeend",
      "mp-widget-product"
    );
  }

  if (LS.product && cartAnchorElement) {
    console.log("Adicionar widget do carrinho", cartAnchorElement);
    appendWidgetComponent(cartAnchorElement, "afterbegin", "mp-widget-cart");
  }

  if (checkoutAnchorElement) {
    console.log("Adicionar widget no checkout");
    appendWidgetComponent(
      checkoutAnchorElement,
      "beforebegin",
      "mp-widget-checkout"
    );
  }

  console.log("Adicionar component modal");
  createModalComponent(LS);

  console.log("END script!");

  // Fetch data from API to check widget configurations
  // fetch(
  //   `https://api.mercadopago.com/alpha/platforms/tienda-nube/payment/widgets/${LS.store.id}`
  // )
  //   .then((res) => res.json())
  //   .then((widgetsConfig) => {
  //  console.log("API RESPONSE", widgetsConfig);
  // });
}

loadMpWebComponent();
