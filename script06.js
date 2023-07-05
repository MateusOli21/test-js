(function () {
  // Your JavaScript
  var installmentsWithoutInterest = 12
  var testInstallments = 12

  const test = document.querySelector('#iFrameResizer0')
  test.addEventListener("installments", (event) => {
    alert(JSON.stringify(event))
    testInstallments = event.details.card.supportedPaymentMethods.credit_card.max_installments_without_interest
  })
  
  window.SDKCheckout.changePaymentBenefit({
    id: 'mercado_pago_checkout_pro',
    value:
      LS.country == 'BR'
        ? `Até ${installmentsWithoutInterest} parcelas sem juros`
        : `Hasta ${installmentsWithoutInterest} meses sin interés`
  })
})();
