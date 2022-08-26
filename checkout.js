LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {
  // Create a new instance of external Payment Option and set its properties.
  const AcmeExternalPaymentOption = PaymentOptions.ExternalPayment({
    // Set the option's unique ID as it is configured on the Payment Provider so they can be related at the checkout.
    id: "mercado_pago_checkout_pro",
    // This parameter renders the billing information form and requires the information to the consumer.
    // fields: {
    //   billing_address: true,
    // },
    // This function handles the order submission event.
    onSubmit: function (callback) {
      // Gather the minimum required information. You should include all the relevant data here.
      let preference = {
        orderId: Checkout.getData("order.cart.id"),
        currency: Checkout.getData("order.cart.currency"),
        total: Checkout.getData("order.cart.prices.total"),
      };

      let generateTokenData = {
        id: Checkout.getData("order.cart.id"),
        token: Checkout.getData("order.cart.hash"),
        storeId: Checkout.getData("storeId"),
      };

      // Use the Checkout HTTP library to post a request to our server and fetch the redirect URL.
      // call token route to authorize token and then call preference route
      Checkout.http({
        url: "https://7ae26f4c-dbf7-463f-be90-0ef1f571fae1.mock.pstmn.io/payment/token",
        method: "post",
        data: generateTokenData,
      })
        .then(function (responseBody) {
          createPreference(responseBody.value, preference);
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

  // Finally, add the Payment Option to the Checkout object so it can be render according to the configuration set on the Payment Provider.
  Checkout.addPaymentOption(AcmeExternalPaymentOption);
});

function createPreference(token, preference) {
  Checkout.http({
    url: "https://7ae26f4c-dbf7-463f-be90-0ef1f571fae1.mock.pstmn.io/payment/preference",
    method: "post",
    data: preference,
    headers: { Authorization: `bearer ${token}` },
  }).then(function (responseBody) {
    callback(responseBody.data);
  });
}
