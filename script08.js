
  // Your JavaScript
  var installmentsWithoutInterest = 12

function insertListener() {
  let scriptElement = document.createElement('script')
  scriptElement.id = 'installments-event'
  scriptElement.innerHTML = `
    window.addEventListener('installments', function (e) {
        console.log("PEGUEI O EVENTO", event)   
    })
  `

  document.querySelector('#iFrameResizer0').appendChild(scriptElement)
  
}

  // const test = document.querySelector('#iFrameResizer0')
  // test.addEventListener("installments", (event) => {
  //   console.log("PEGUEI O EVENTO", event)
    // installmentsWithoutInterest = event.details.card.supportedPaymentMethods.credit_card.max_installments_without_interest
    
    // window.SDKCheckout.changePaymentBenefit({
    // id: 'mercado_pago_checkout_pro',
    // value:
    //   LS.country == 'BR'
    //     ? `Até ${installmentsWithoutInterest} parcelas sem juros`
    //     : `Hasta ${installmentsWithoutInterest} meses sin interés`
    // })  
  // })
  