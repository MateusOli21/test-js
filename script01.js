(function () {
  // Your JavaScript
  window.SDKCheckout.changePaymentBenefit({
    id: 'mercado_pago_checkout_pro',
    value:
      LS.country == 'BR'
        ? `Até ${installmentsWithoutInterest} parcelas sem juros`
        : `Hasta ${installmentsWithoutInterest} meses sin interés`
  })
})();
