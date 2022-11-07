const SERVER_URL = "https://api.mercadopago.com/beta/platforms/tienda-nube";
const CARD_TOKEN_URL = "https://api.mercadopago.com/v1/card_tokens";
const CHECKOUT_PRO_PAYMENT_ID = "mercado_pago_checkout_pro";
const TRANSPARENT_TICKET_PAYMENT_ID = "mercado_pago_checkout_ticket";
const TRANSPARENT_CARD_PAYMENT_ID = "mercado_pago_checkout_card";

LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {
  let currentCardBin = null;

  const checkoutProPaymentOption = PaymentOptions.ModalPayment({
    id: CHECKOUT_PRO_PAYMENT_ID,
    onSubmit: async function (callback) {
      await createPreference(Checkout, callback);
    },
  });

  const transparentTicketPaymentOption =
    PaymentOptions.Transparent.TicketPayment({
      id: TRANSPARENT_TICKET_PAYMENT_ID,
      fields: {
        efectivo_list: [{ name: "Oxxo", code: "oxxo" }],
      },
      onSubmit: async function (callback) {
        await createTicketPayment(Checkout, callback);
      },
    });

  const transparentCardPaymentOption = PaymentOptions.Transparent.CardPayment({
    id: TRANSPARENT_CARD_PAYMENT_ID,
    onDataChange: Checkout.utils.throttle(async function () {
      if (mustRefreshInstallments(Checkout, currentCardBin)) {
        await refreshInstallments(Checkout);
        currentCardBin = generateCardNumberBin(Checkout);
      } else if (!generateCardNumberBin(Checkout)) {
        Checkout.setInstallments(null);
        currentCardBin = null;
      }
    }),
    onSubmit: async function (callback) {
      await createCardPayment(Checkout, callback);
    },
  });

  Checkout.addPaymentOption(checkoutProPaymentOption);
  Checkout.addPaymentOption(transparentTicketPaymentOption);
  Checkout.addPaymentOption(transparentCardPaymentOption);
});

async function createPreference(Checkout, callback) {
  try {
    const response = await Checkout.http({
      url: `${SERVER_URL}/payment/preference`,
      method: "post",
      data: Checkout.getData(),
    });
    callback(response.data);
  } catch (err) {
    callback({
      success: false,
      error_code: "preference_processing_error",
    });
  }
}

async function createTicketPayment(Checkout, callback) {
  try {
    const response = await Checkout.http({
      url: `${SERVER_URL}/payment/ticket`,
      method: "post",
      data: Checkout.getData(),
    });
    callback(response.data);
  } catch (err) {
    callback({
      success: false,
      error_code: "payment_processing_error",
    });
  }
}

function generateCardNumberBin(Checkout) {
  const cardNumber = Checkout.getData("form.cardNumber");
  return cardNumber.substring(0, 6);
}

function mustRefreshInstallments(Checkout, currentCardBin) {
  let currentTotalPrice = Checkout.getData("order.cart.prices.total");
  const cardBin = generateCardNumberBin(Checkout);
  const hasValidCardBin = cardBin && cardBin.length === 6;
  const hasPrice = Boolean(Checkout.getData("totalPrice"));
  const changedCardBin = cardBin !== currentCardBin;
  const changedPrice = Checkout.getData("totalPrice") !== currentTotalPrice;
  return hasValidCardBin && hasPrice && (changedPrice || changedCardBin);
}

async function refreshInstallments(Checkout) {
  const installments = await findInstallments(Checkout);
  Checkout.setInstallments(installments);
}

async function findInstallments(Checkout) {
  const storeId = Checkout.getData("storeId");
  const orderId = Checkout.getData("order.cart.id");
  const cardNumberBin = generateCardNumberBin(Checkout);
  const response = await Checkout.http({
    url: `${SERVER_URL}/payment/installments?store_id=${storeId}&order_id=${orderId}&bin=${cardNumberBin}`,
    method: "get",
  });
  return response.data;
}

async function findPublicKey(Checkout) {
  const response = await Checkout.http({
    url: `${SERVER_URL}/payment/config/${Checkout.getData("storeId")}`,
    method: "get",
  });
  return response.data.value;
}

async function generateTokenCard(Checkout, publicKey) {
  const expiration = Checkout.getData("form.cardExpiration");
  const splitExpiration = expiration.split("/");
  const expirationYear = `20${splitExpiration[1]}`;
  const expirationMonth = splitExpiration[0];
  const tokenCardRequest = {
    card_number: Checkout.getData("form.cardNumber"),
    expiration_year: expirationYear,
    expiration_month: expirationMonth,
    security_code: Checkout.getData("form.cardCvv"),
    cardholder: {
      name: Checkout.getData("form.cardHolderName"),
    },
  };
  const tokenCard = await fetch(`${CARD_TOKEN_URL}?public_key=${publicKey}`, {
    body: JSON.stringify(tokenCardRequest),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
  return tokenCard.id;
}

async function createCardPayment(Checkout, callback) {
  try {
    const teste = await Checkout.http({
      url: `http://localhost:8080/payment/card`,
      method: "post",
      data: Checkout.getData,
    });
    const publicKey = await findPublicKey(Checkout);
    const tokenCard = await generateTokenCard(Checkout, publicKey);
    const paymentRequest = {
      data: Checkout.getData(),
      token_card: tokenCard,
    };
    const response = await Checkout.http({
      url: `${SERVER_URL}/payment/card`,
      method: "post",
      data: paymentRequest,
    });
    callback(response.data);
  } catch (err) {
    callback({
      success: false,
      error_code: "payment_processing_error",
    });
  }
}
