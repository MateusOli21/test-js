const serverUrl = "https://cbfee712-ac19-445d-83b3-4e6c3d76f617.mock.pstmn.io";

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
      let preferenceData = {
        orderId: Checkout.getData("order.cart.id"),
        currency: Checkout.getData("order.cart.currency"),
        total: Checkout.getData("order.cart.prices.total"),
      };

      let generateTokenData = {
        id: Checkout.getData("order.cart.id"),
        storeId: Checkout.getData("storeId"),
        callbackUrls: Checkout.getData("callbackUrls"),
      };

      // Use the Checkout HTTP library to post a request to our server and fetch the redirect URL.
      // call token route to authorize token and then call preference route
      Checkout.http({
        url: `${serverUrl}/payment/token`,
        method: "post",
        data: generateTokenData,
      })
        .then(function (res) {
          const token = res.data.value;
          createPreference(Checkout, callback, token, preferenceData);
        })
        .catch(function (err) {
          // Handle a potential error in the HTTP request.
          console.log(err);
          callback({
            success: false,
            error_code: "error on first catch block",
          });
        });
    },
  });

  // Finally, add the Payment Option to the Checkout object so it can be render according to the configuration set on the Payment Provider.
  Checkout.addPaymentOption(AcmeExternalPaymentOption);
});

function createPreference(Checkout, callback, token, preference) {
  Checkout.http({
    url: `${serverUrl}/payment/preference`,
    method: "post",
    data: preference,
    headers: { Authorization: `bearer ${token}` },
  }).then(function (response) {
    console.log(`PREFERENCE RESP - ${response}`);
    callback(response.data);
  });
}
