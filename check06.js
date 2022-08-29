const serverUrl = "https://cbfee712-ac19-445d-83b3-4e6c3d76f617.mock.pstmn.io";
const checkoutProPaymentId = "mercado_pago_checkout_pro";

LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {
  const checkoutProPaymentOption = PaymentOptions.ExternalPayment({
    // Set the option's unique ID as it is configured on the Payment Provider so they can be related at the checkout.
    id: checkoutProPaymentId,
    onSubmit: function (callback) {
      buildTokenAndCreatePreference(Checkout, callback);
    },
  });

  Checkout.addPaymentOption(checkoutProPaymentOption);
});

function buildTokenAndCreatePreference(Checkout, callback) {
  let tokenData = {
    id: Checkout.getData("order.cart.id"),
    storeId: Checkout.getData("storeId"),
    token: Checkout.getData("order.cart.hash"),
  };

  Checkout.http({
    url: `${serverUrl}/payment/token`,
    method: "post",
    data: tokenData,
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
}

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
