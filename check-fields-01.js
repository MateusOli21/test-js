const SERVER_URL = "https://api.mercadopago.com/alpha/platforms/tienda-nube";
// const SERVER_URL = "https://api.mercadopago.com/beta/platforms/tienda-nube";
const CARD_TOKEN_URL = "https://api.mercadopago.com/v1/card_tokens";
const CHECKOUT_PRO_PAYMENT_ID = "mercado_pago_checkout_pro";
const TRANSPARENT_TICKET_PAYMENT_ID = "mercado_pago_checkout_ticket";
const TRANSPARENT_CARD_PAYMENT_ID = "mercado_pago_checkout_card";
const TRANSPARENT_PIX_PAYMENT_ID = "mercado_pago_checkout_pix";
const TRANSPARENT_BOLETO_PAYMENT_ID = "mercado_pago_checkout_boleto";
const CREDITS_PAYMENT_ID = "mercado_pago_checkout_credits";

class MpTiendanube {
    getDetails() {
      return {
        version: "1.0.0",
        name: "Teste",
        storeId: 12345678
      }
    }
}

window.MpTiendanube = new MpTiendanube()

LoadCheckoutPaymentContext(function (Checkout, PaymentOptions) {
  let currentCardBin = null;

  const transparentTicketPaymentOption =
    PaymentOptions.Transparent.TicketPayment({
      id: TRANSPARENT_TICKET_PAYMENT_ID,
      fields: {
        efectivo_list: [],
      },
      onLoad: async function () {
        await findTicketOptions(Checkout);
      },
      onSubmit: async function (callback) {
        await createTicketPayment(Checkout, callback);
      },
    });

  const checkoutProPaymentOption = PaymentOptions.ModalPayment({
    id: CHECKOUT_PRO_PAYMENT_ID,
    name: "Mercado Pago Checkout Pro",
    onSubmit: async function (callback) {
      await createPreference(Checkout, callback);
    },
  });

  const creditsPaymentOption = PaymentOptions.ExternalPayment({
    id: CREDITS_PAYMENT_ID,
    name: "Mercado Pago Credits",
    onSubmit: async function (callback) {
      await createCredits(Checkout, callback);
    },
  });

  const transparentCardPaymentOption = PaymentOptions.Transparent.CardPayment({
    id: TRANSPARENT_CARD_PAYMENT_ID,
    fields: { 
        card_holder_id_number: true,
        card_holder_id_types: ["DNI", "Outros"]
    },
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

  const transparentPixPaymentOption = PaymentOptions.Transparent.PixPayment({
    id: TRANSPARENT_PIX_PAYMENT_ID,
    onSubmit: async function (callback) {
      await createPixPayment(Checkout, callback);
    },
  });

  const transparentBoletoPaymentOption =
    PaymentOptions.Transparent.BoletoPayment({
      id: TRANSPARENT_BOLETO_PAYMENT_ID,
      onSubmit: async function (callback) {
        await createBoletoPayment(Checkout, callback);
      },
    });

  Checkout.addPaymentOption(checkoutProPaymentOption);
  Checkout.addPaymentOption(creditsPaymentOption);
  Checkout.addPaymentOption(transparentTicketPaymentOption);
  Checkout.addPaymentOption(transparentCardPaymentOption);
  Checkout.addPaymentOption(transparentPixPaymentOption);
  Checkout.addPaymentOption(transparentBoletoPaymentOption);
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

async function createCredits(Checkout, callback) {
  try {
    const paymentRequest = {
      ...checkoutData.getData(),
      credits: true,
    };
    const response = await Checkout.http({
      url: `${SERVER_URL}/payment/preference`,
      method: "post",
      data: paymentRequest,
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
    const { form, ...checkoutData } = Checkout.getData();
    const paymentRequest = {
      ...checkoutData,
      mercado_pago_device: window.MP_DEVICE_SESSION_ID,
      tn_payment_id: form.brand,
    };
    const response = await Checkout.http({
      url: `${SERVER_URL}/payment/ticket`,
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

async function createPixPayment(Checkout, callback) {
  try {
    const { form, ...checkoutData } = Checkout.getData();
    const paymentRequest = {
      tn_payment_id: "pix",
      mercado_pago_device: window.MP_DEVICE_SESSION_ID,
      ...checkoutData,
    };
    const response = await Checkout.http({
      url: `${SERVER_URL}/payment/pix`,
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

async function createBoletoPayment(Checkout, callback) {
  try {
    const { form, ...checkoutData } = Checkout.getData();
    const paymentRequest = {
      tn_payment_id: "bradesco",
      mercado_pago_device: window.MP_DEVICE_SESSION_ID,
      ...checkoutData,
    };
    const response = await Checkout.http({
      url: `${SERVER_URL}/payment/ticket`,
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

function generateCardNumberBin(Checkout) {
  const cardNumber = Checkout.getData("form.cardNumber");
  return cardNumber.substring(0, 6);
}

function generateCardFirstEightDigits(Checkout) {
  const cardNumber = Checkout.getData("form.cardNumber");
  return cardNumber.substring(0, 8);
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
  const cardNumberBin = generateCardNumberBin(Checkout);
  const response = await Checkout.http({
    url: `${SERVER_URL}/payment/installments?store_id=${Checkout.getData(
      "storeId"
    )}&total_price=${Checkout.getData("totalPrice")}&bin=${cardNumberBin}`,
    method: "get",
  });
  return response.data;
}

async function findTicketOptions(Checkout) {
  const response = await Checkout.http({
    url: `${SERVER_URL}/payment/ticket/${Checkout.getData("storeId")}`,
    method: "get",
  });
  const ticketList = response.data;
  Checkout.updateFields({
    method: TRANSPARENT_TICKET_PAYMENT_ID,
    value: {
      efectivo_list: ticketList,
    },
  });
}

async function findPublicKey(Checkout) {
  const response = await Checkout.http({
    url: `${SERVER_URL}/payment/config/${Checkout.getData("storeId")}`,
    method: "get",
  });
  return response.data.value;
}

function checkForIdentification(Checkout) {
  const availableCountryIdentification = ['AR', 'BR']
  const country = Checkout.getData('country')
  if (!availableCountryIdentification.includes(country)) {
    return { idType: null, idNumber: null }
  }
  let idType = null;
  let idNumber = null;
  if(country === 'BR') {
    idNumber = Checkout.getData("order.billingAddress.id_number");
    if (idNumber && idNumber.length == 14) idType = "CNPJ";
    if (idNumber && idNumber.length == 11) idType = "CPF";
  }
  if(country === 'AR'){
    idNumber = Checkout.getData("form.cardHolderIdNumber");
    //if (idNumber && idNumber.trim() !== '') idType = 'DNI'
  }
  return { idNumber, idType };
}

async function generateCardToken(Checkout, publicKey) {
  const expiration = Checkout.getData("form.cardExpiration");
  const splitExpiration = expiration.split("/");
  const expirationYear = `20${splitExpiration[1]}`;
  const expirationMonth = splitExpiration[0];
  const identification = checkForIdentification(Checkout);
  const cardTokenRequest = {
    card_number: Checkout.getData("form.cardNumber"),
    expiration_year: expirationYear,
    expiration_month: expirationMonth,
    security_code: Checkout.getData("form.cardCvv"),
    cardholder: {
      name: Checkout.getData("form.cardHolderName"),
      identification: {
        number: identification.idNumber,
        type: identification.idType,
      },
    },
  };

  const cardToken = await fetch(`${CARD_TOKEN_URL}?public_key=${publicKey}`, {
    body: JSON.stringify(cardTokenRequest),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  }).then((res) => res.json());
  return cardToken.id;
}

async function createCardPayment(Checkout, callback) {
  try {
    const publicKey = await findPublicKey(Checkout);
    const cardToken = await generateCardToken(Checkout, publicKey);
    const { form, ...checkoutData } = Checkout.getData();
    const paymentRequest = {
      ...checkoutData,
      mercado_pago_card_token: cardToken,
      mercado_pago_eight_digits: generateCardFirstEightDigits(Checkout),
      mercado_pago_device: window.MP_DEVICE_SESSION_ID,
    };
    const response = await Checkout.http({
      url: `${SERVER_URL}/payment/card`,
      method: "post",
      data: paymentRequest,
    });
    callback(response.data);
  } catch (err) {
    console.error('Error processing', err)
    if (err.message === 'Invalid identification number') {
      return callback({
        success: false,
        error_code: 'consumer_id_type_invalid'
      })
    }
    callback({
      success: false,
      error_code: 'payment_processing_error'
    })
  }
}
