
function loadMpWebComponent() {
    let htmlWidget = `<mercado-pago-widget></mercado-pago-widget>`;
  
    const widgetScript = document.createElement("script");
    widgetScript.src = "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@main/mp-web-com.js";
    widgetScript.type = "text/script";
    widgetScript.id = "mp-widget-script";
    
    let priceHolderElement = document.getElementsByClassName("price-holder");
    console.log("adicionando html widget");
    priceHolderElement[0].insertAdjacentHTML('beforeend', htmlWidget);
    console.log("adicionando script widget");
    // priceHolderElement[0].appendChild(widgetScript);
    document.head.append(widgetScript);
    
    console.log("finalizado script de carregamento");
  }
  
  loadMpWebComponent();
