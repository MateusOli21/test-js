let script02 = document.createElement('script')
script02.innerHTML = `
  (function(h,o,u,n,d) {
    h=h[d]=h[d]||{q:[],onReady:function(c){h.q.push(c)}}
    d=o.createElement(u);d.async=1;d.src=n
    n=o.getElementsByTagName(u)[0];n.parentNode.insertBefore(d,n)
  })(window,document,'script','https://www.datadoghq-browser-agent.com/datadog-rum-v4.js','DD_RUM')
  DD_RUM.onReady(function() {
    DD_RUM.init({
      clientToken: 'pub21eddc5ac414818d12770b96d35e419e',
      applicationId: '9d61f39e-3bfb-4ef2-88f3-e1c192166319',
      site: 'us5.datadoghq.com',
      service: 'js-components',
      
      // Specify a version number to identify the deployed version of your application in Datadog 
      // version: '1.0.0',
      sessionSampleRate: 100,
      premiumSampleRate: 100,
      trackUserInteractions: true,
      defaultPrivacyLevel: 'mask-user-input',
    });
    DD_RUM.startSessionReplayRecording();
  })
`

document.head.appendChild(script02)

// Create html and script to insert Widget Component
const widgetScript = createScriptElement(
  "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@credits/web-component-widget.js",
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
    "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@credits/web-component-modal.js",
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
  if (productBuyButtonSelector !== null)
    addToCartButtonElement = productBuyButtonSelector;

  let cartSelector = document.querySelector('[class*="ajax-cart-bottom"]');
  if (cartSelector !== null) cartAnchorElement = cartSelector;

  let productSelector = document.querySelector('[data-store*="product-price-"]');
  if (productSelector !== null) productAnchorElement = productSelector;

  let cardDetailsSelector = document.querySelector('[class="table-subtotal"]');
  if (cardDetailsSelector !== null) checkoutAnchorElement = cardDetailsSelector;
}

function appendWidgetComponent(anchorElement, position, id) {
  anchorElement.insertAdjacentHTML(position, createWidgetHtml(id));
  anchorElement.insertAdjacentElement(position, widgetScript);
  
  let scriptWidget = document.createElement('script');
  scriptWidget.id = `${id}-event`;
  scriptWidget.innerHTML = `
    document.querySelector("#${id}").addEventListener('widget-clicked', function (e) {
      console.log("aqui!!", e)
    })
  `;
  anchorElement.appendChild(scriptWidget);
}

function loadMpWebComponent() {
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

        if (widgetsConfig.product && LS.product && productAnchorElement) {
          console.log("Adicionar widget de produto", productAnchorElement);
          appendWidgetComponent(productAnchorElement, "beforeend", "mp-widget-product");
        }

        if (widgetsConfig.cart && LS.product && cartAnchorElement) {
          console.log("Adicionar widget do carrinho", cartAnchorElement);
          appendWidgetComponent(cartAnchorElement, "afterbegin", "mp-widget-cart");
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
