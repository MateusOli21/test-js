function loadMpWebComponent() {
  let htmlWidget = `
        <mercado-pago-widget></mercado-pago-widget>
    `;

  console.log("adicionado html widget");
  const widgetScript = document.createElement("script");
  widgetScript.src = "https://cdn.jsdelivr.net/gh/MateusOli21/test-js@main/mp-web-com.js";
  widgetScript.type = "text/script";
  widgetScript.id = "mp-widget-script";

  console.log("adicionado script widget");
  let priceHolderElement = document.getElementsByClassName("price-holder");
  priceHolderElement[0].appendChild(htmlWidget);
  priceHolderElement[0].appendChild(widgetScript);
  
  console.log("finalizado script de carregamento");
}

loadMpWebComponent();
