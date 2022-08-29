const serverUrl = "https://cbfee712-ac19-445d-83b3-4e6c3d76f617.mock.pstmn.io";

LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {
  // Create a new instance of external Payment Option and set its properties.
  const checkoutProPaymentOption = PaymentOptions.ExternalPayment({
    // Set the option's unique ID as it is configured on the Payment Provider so they can be related at the checkout.
    id: "mercado_pago_checkout_pro",
    onSubmit: function (callback) {
      let generateTokenData = {
        id: Checkout.getData("order.cart.id"),
        storeId: Checkout.getData("storeId"),
        token: Checkout.getData("order.cart.hash"),
      };

      Checkout.http({
        url: `${serverUrl}/payment/token`,
        method: "post",
        data: generateTokenData,
      })
        .then(function (res) {
          const token = res.data.value;
          createPreference(Checkout, callback, token);
        })
        .catch(function () {
          // Handle a potential error in the HTTP request.
          callback({
            success: false,
            error_code: "payment_processing_error",
          });
        });
    },
  });

  Checkout.addPaymentOption(checkoutProPaymentOption);
});

function createPreference(Checkout, callback, token) {
  const preference = {
    id: Checkout.getData("order.cart.id"),
    storeId: Checkout.getData("storeId"),
    callbackUrls: Checkout.getData("callbackUrls"),
  };

  Checkout.http({
    url: `${serverUrl}/payment/preference`,
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
