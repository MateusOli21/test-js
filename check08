const SERVER_URL = "https://api.mercadopago.com/beta/platforms/tienda-nube";
const CHECKOUT_PRO_PAYMENT_ID = "mercado_pago_checkout_pro";

LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {
  const checkoutProPaymentOption = PaymentOptions.ExternalPayment({
    // Set the option's unique ID as it is configured on the Payment Provider so they can be related at the checkout.
    id: CHECKOUT_PRO_PAYMENT_ID,
    onSubmit: function (callback) {
      console.log("COMEÇOU A EXECUÇÃO")
      buildTokenAndCreatePreference(Checkout, callback);
    },
  });

  Checkout.addPaymentOption(checkoutProPaymentOption);
});

function buildTokenAndCreatePreference(Checkout, callback) {
  console.log("ENTROU NO BUILD TOKEN")
  let tokenData = {
    id: Checkout.getData("order.cart.id"),
    storeId: Checkout.getData("storeId"),
    token: Checkout.getData("order.cart.hash"),
  };
  console.log(`TOKEN DATA -> ${tokenData}`)

  Checkout.http({
    url: `${SERVER_URL}/payment/token`,
    method: "post",
    data: tokenData,
  })
    .then(function (res) {
      console.log("CAIU NA FUNÇÃO THEN")
      const token = res.data.value;
      console.log(`PEGOU O TOKEN --> ${token}`)
      createPreference(Checkout, callback, token);
    })
    .catch(function () {
      // Handle a potential error in the HTTP request.
      callback({
        success: false,
        error_code: "payment_processing_error",
      });
    });
}

function createPreference(Checkout, callback, token) {
  console.log("CAIU NA CREATE PREFERENCE")
  const preference = {
    id: Checkout.getData("order.cart.id"),
    storeId: Checkout.getData("storeId"),
    callbackUrls: Checkout.getData("callbackUrls"),
  };
  console.log(`CRIOU A PREFERENCE --> ${preference}`)

  Checkout.http({
    url: `${SERVER_URL}/payment/preference`,
    method: "post",
    data: preference,
    headers: { Authorization: token },
  })
    .then(function (response) {
      callback(response.data);
    })
    .catch(function () {
      callback({
        success: false,
        error_code: "preference_processing_error",
      });
    });
}
