(function () {
  // Your JavaScript
  iframe = document.querySelector("#iFrameResizer0")
  iframe.contentWindow.postMessage('test-event', '*')
  
  // window.document.addEventListener('installments', handleEvent, false)
  // function handleEvent(e) {
  //   console.log("EVENTO DO IFRAME", e)
  // }
  // window.SDKCheckout.changePaymentBenefit({
  //   id: 'mercado_pago_checkout_pro',
  //   value:
  //     LS.country == 'BR'
  //       ? `Até ${installmentsWithoutInterest} parcelas sem juros`
  //       : `Hasta ${installmentsWithoutInterest} meses sin interés`
  // })
})();
