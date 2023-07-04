(function () {
  // Your JavaScript
  var installmentsWithoutInterest = 12

  window.addEventListener("installments", (e) => {
    installmentsWithoutInterest = e.card.supportedPaymentMethods.credit_card.max_installments_without_interest
  })
  
  window.SDKCheckout.changePaymentBenefit({
    id: 'mercado_pago_checkout_pro',
    value:
      LS.country == 'BR'
        ? `Até ${installmentsWithoutInterest} parcelas sem juros`
        : `Hasta ${installmentsWithoutInterest} meses sin interés`
  })
})();
