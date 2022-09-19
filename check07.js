const SERVER_URL = "https://api.mercadopago.com/beta/platforms/tienda-nube";
const CHECKOUT_PRO_PAYMENT_ID = "mercado_pago_checkout_pro";
const TRANSPARENT_TICKET_PAYMENT_ID = "mercado_pago_payment_ticket";

LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {
  const checkoutProPaymentOption = PaymentOptions.ExternalPayment({
    id: CHECKOUT_PRO_PAYMENT_ID,
    onSubmit: function (callback) {
      createPreference(Checkout, callback);
    },
  });

  const transparentTicketPaymentOption = PaymentOptions.Transparent.TicketPayment({
    id: TRANSPARENT_TICKET_PAYMENT_ID,
    fields: {
      efectivo_list: [{ name: "Oxxo", code: "oxxo" }],
    },
    onSubmit: function (callback) {
      createTicketPayment(Checkout, callback);
    },
  });

  Checkout.addPaymentOption(checkoutProPaymentOption);
  Checkout.addPaymentOption(transparentTicketPaymentOption);
});

function buildToken(Checkout, callback) {
  try {
    let tokenData = {
      id: Checkout.getData("order.cart.id"),
      store_id: Checkout.getData("storeId"),
      token: Checkout.getData("order.cart.hash"),
    };
    const response = Checkout.http({
      url: `${SERVER_URL}/payment/token`,
      method: "post",
      data: tokenData,
    });
    return response.data.value;
  } catch (err) {
    console.log("ERROR", err);
    callback({
      success: false,
      error_code: "token_processing_error",
    });
  }
}

function createPreference(Checkout, callback) {
  try {
    const token = buildToken(Checkout, callback);
    const preference = {
      id: Checkout.getData("order.cart.id"),
      store_id: Checkout.getData("storeId"),
      callback_urls: Checkout.getData("callbackUrls"),
    };
    const response = Checkout.http({
      url: `${SERVER_URL}/payment/preference`,
      method: "post",
      data: preference,
      headers: { Authorization: token },
    });
    callback(response.data);
  } catch (err) {
    console.log("ERROR", err);
    callback({
      success: false,
      error_code: "preference_processing_error",
    });
  }
}

function createTicketPayment(Checkout, callback) {
  try {
    const token = buildToken(Checkout, callback);
    const ticketPayment = {
      id: Checkout.getData("form.brand"),
      store_id: Checkout.getData("storeId"),
      order_id: Checkout.getData("order.cart.id"),
    };
    const response = Checkout.http({
      url: `${SERVER_URL}/payment/ticket`,
      method: "post",
      data: ticketPayment,
      headers: { Authorization: token },
    });
    callback(response.data);
  } catch (err) {
    console.log("ERROR", err);
    callback({
      success: false,
      error_code: "payment_processing_error",
    });
  }
}
