export const IVA_RATE = 0.1494;
export const ITF_RATE = 0.003;

export const roundToFourDecimals = (value) => {
  return Math.round((Number(value || 0) + Number.EPSILON) * 10000) / 10000;
};

export const getProductSubtotalUsd = (product) => {
  const baseQuantity = Number(product?.baseQuantity || 0);
  const priceUsd = Number(product?.priceUsd || 0);
  return roundToFourDecimals(baseQuantity * priceUsd);
};

export const getSectionTotalUsd = (items = []) => {
  const safeItems = Array.isArray(items) ? items : [];
  return roundToFourDecimals(
    safeItems.reduce(
      (total, item) =>
        total + Number(item?.amount ?? item?.amountUsd ?? 0),
      0
    )
  );
};

export const calculateBankPayments = ({
  payments = [],
  officialExchangeRate = 0,
}) => {
  const safePayments = Array.isArray(payments) ? payments : [];
  const officialRate = Number(officialExchangeRate || 0);
  const rows = safePayments.map((payment, index) => {
    const amountUsd = Number(payment?.amountUsd || 0);
    const bankExchangeRate = Number(payment?.bankExchangeRate || 0);
    const commissionUsd = Number(payment?.commissionUsd || 0);
    const itfEntryUsd = Number(payment?.itfEntryUsd || 0);
    const paymentAmountBs = roundToFourDecimals(
      amountUsd * bankExchangeRate
    );

    /* la comisión en dólares es convertida a bolivianos usando el tipo de cambio oficial */
    const commissionBs = roundToFourDecimals(
      commissionUsd * officialRate
    );

    /* El ITF de salida está consistente: monto del pago USD × 0,3 % */
    const itfExitUsd = roundToFourDecimals(amountUsd * ITF_RATE);

    /*
     * El ITF de entrada se registra según el comprobante
     * Ambos ITF son convertidos a Bs con el tipo de cambio del pago
     */
    const itfEntryBs = roundToFourDecimals(
      itfEntryUsd * bankExchangeRate
    );

    const itfExitBs = roundToFourDecimals(
      itfExitUsd * bankExchangeRate
    );

    const totalItfUsd = roundToFourDecimals(
      itfEntryUsd + itfExitUsd
    );

    const totalItfBs = roundToFourDecimals(
      itfEntryBs + itfExitBs
    );

    const totalBankCostUsd = roundToFourDecimals(
      commissionUsd + totalItfUsd
    );

    const totalOperationUsd = roundToFourDecimals(
      amountUsd + totalBankCostUsd
    );

    const totalOperationBs = roundToFourDecimals(
      paymentAmountBs +
        commissionBs +
        itfEntryBs +
        itfExitBs
    );

    return {
      id: index + 1,
      paymentType: payment?.paymentType || "PAYMENT",
      date: payment?.date || "",
      bankName: payment?.bankName || "",
      amountUsd,
      bankExchangeRate,
      paymentAmountBs,
      commissionUsd,
      commissionBs,
      itfEntryUsd,
      itfExitUsd,
      itfEntryBs,
      itfExitBs,
      totalItfUsd,
      totalItfBs,
      totalBankCostUsd,
      totalOperationUsd,
      totalOperationBs,
    };
  });

  const totals = rows.reduce(
    (accumulator, row) => ({
      totalPaymentUsd: roundToFourDecimals(
        accumulator.totalPaymentUsd + row.amountUsd
      ),
      totalPaymentBs: roundToFourDecimals(
        accumulator.totalPaymentBs + row.paymentAmountBs
      ),
      totalCommissionUsd: roundToFourDecimals(
        accumulator.totalCommissionUsd + row.commissionUsd
      ),
      totalCommissionBs: roundToFourDecimals(
        accumulator.totalCommissionBs + row.commissionBs
      ),
      totalItfEntryUsd: roundToFourDecimals(
        accumulator.totalItfEntryUsd + row.itfEntryUsd
      ),
      totalItfExitUsd: roundToFourDecimals(
        accumulator.totalItfExitUsd + row.itfExitUsd
      ),
      totalItfUsd: roundToFourDecimals(
        accumulator.totalItfUsd + row.totalItfUsd
      ),
      totalItfBs: roundToFourDecimals(
        accumulator.totalItfBs + row.totalItfBs
      ),
      totalBankCostsUsd: roundToFourDecimals(
        accumulator.totalBankCostsUsd + row.totalBankCostUsd
      ),
      totalOperationUsd: roundToFourDecimals(
        accumulator.totalOperationUsd + row.totalOperationUsd
      ),
      totalOperationBs: roundToFourDecimals(
        accumulator.totalOperationBs + row.totalOperationBs
      ),
    }),
    {
      totalPaymentUsd: 0,
      totalPaymentBs: 0,
      totalCommissionUsd: 0,
      totalCommissionBs: 0,
      totalItfEntryUsd: 0,
      totalItfExitUsd: 0,
      totalItfUsd: 0,
      totalItfBs: 0,
      totalBankCostsUsd: 0,
      totalOperationUsd: 0,
      totalOperationBs: 0,
    }
  );
  return {
    rows,
    totals,
  };
};

export const calculateAdditionalCost = (
  cost,
  officialExchangeRate
) => {
  const amount = Number(cost?.amount || 0);
  const creditRate = Number(
    cost?.creditRate ?? cost?.fiscalCreditPercent ?? 0
  );

  const currency = String(cost?.currency || "BS").toUpperCase();

  const amountUsd =
    currency === "USD"
      ? roundToFourDecimals(amount)
      : officialExchangeRate > 0
        ? roundToFourDecimals(amount / officialExchangeRate)
        : 0;

  const amountBs =
    currency === "BS"
      ? roundToFourDecimals(amount)
      : roundToFourDecimals(amount * officialExchangeRate);

  const fiscalCreditBs = cost?.hasFiscalCredit
    ? roundToFourDecimals(amountBs * (creditRate / 100))
    : 0;

  const netAmountBs = roundToFourDecimals(
    amountBs - fiscalCreditBs
  );

  return {
    concept: cost?.concept || "Sin concepto",
    source: cost?.source || "MANUAL",
    currency,
    originalAmount: amount,
    amountUsd,
    amountBs,
    hasFiscalCredit: Boolean(cost?.hasFiscalCredit),
    creditRate,
    fiscalCreditBs,
    netAmountBs,
  };
};

export const buildBankAdditionalCosts = (
  bankPayments,
  officialExchangeRate
) => {
  const bankCalculation = calculateBankPayments({
    payments: bankPayments,
    officialExchangeRate,
  });

  return [
    {
      concept: "Comisiones Bancarias DÓLARES",
      amount: bankCalculation.totals.totalCommissionUsd,
      currency: "USD",
      hasFiscalCredit: false,
      creditRate: 0,
      source: "BANK",
      locked: true,
    },
    {
      concept: "ITF USD",
      amount: bankCalculation.totals.totalItfUsd,
      currency: "USD",
      hasFiscalCredit: false,
      creditRate: 0,
      source: "BANK",
      locked: true,
    },
  ];
};

export const calculateImportation = ({
  generalData = {},
  products = [],
  expenses = {},
  bankPayments = [],
  additionalCosts = [],
}) => {
  const safeProducts = Array.isArray(products) ? products : [];

  const officialExchangeRate = Number(
    generalData?.officialExchangeRate || 0
  );

  const bankCalculation = calculateBankPayments({
    payments: bankPayments,
    officialExchangeRate,
  });

  /* Las filas bancarias se construyen automáticamente */
  const manualAdditionalCosts = (
    Array.isArray(additionalCosts) ? additionalCosts : []
  ).filter((cost) => cost?.source !== "BANK");

  const bankAdditionalCosts = buildBankAdditionalCosts(
    bankPayments,
    officialExchangeRate
  );

  const allAdditionalCosts = [
    ...manualAdditionalCosts,
    ...bankAdditionalCosts,
  ];

  const totalProductsUsd = roundToFourDecimals(
    safeProducts.reduce(
      (accumulator, product) =>
        accumulator + getProductSubtotalUsd(product),
      0
    )
  );

  const totalFreightsUsd = getSectionTotalUsd(expenses?.freights);
  const totalInsurancesUsd = getSectionTotalUsd(expenses?.insurances);
  const totalPortCostsUsd = getSectionTotalUsd(expenses?.portCosts);
  const totalOtherBaseCostsUsd = getSectionTotalUsd(expenses?.otherCosts);

  const totalBaseExpensesUsd = roundToFourDecimals(
    totalFreightsUsd +
      totalInsurancesUsd +
      totalPortCostsUsd
  );

  const totalProductsBs = roundToFourDecimals(
    totalProductsUsd * officialExchangeRate
  );

  const totalFreightsBs = roundToFourDecimals(
    totalFreightsUsd * officialExchangeRate
  );

  const totalInsurancesBs = roundToFourDecimals(
    totalInsurancesUsd * officialExchangeRate
  );

  const totalPortCostsBs = roundToFourDecimals(
    totalPortCostsUsd * officialExchangeRate
  );

  const totalOtherBaseCostsBs = roundToFourDecimals(
    totalOtherBaseCostsUsd * officialExchangeRate
  );

  const totalBaseExpensesBs = roundToFourDecimals(
    totalBaseExpensesUsd * officialExchangeRate
  );

  const productRows = safeProducts.map((product, index) => {
    const subtotalUsd = getProductSubtotalUsd(product);

    const factor =
      totalProductsUsd > 0
        ? subtotalUsd / totalProductsUsd
        : 0;

    const productValueBs = roundToFourDecimals(
      subtotalUsd * officialExchangeRate
    );

    const freightsBs = roundToFourDecimals(
      totalFreightsUsd * officialExchangeRate * factor
    );

    const insurancesBs = roundToFourDecimals(
      totalInsurancesUsd * officialExchangeRate * factor
    );

    const portCostsBs = roundToFourDecimals(
      totalPortCostsUsd * officialExchangeRate * factor
    );

    const cifBs = roundToFourDecimals(
      productValueBs +
        freightsBs +
        insurancesBs +
        portCostsBs
    );

    const gaPercent = Number(product?.gaPercent || 0);
    const gaBs = roundToFourDecimals(cifBs * (gaPercent / 100));
    const ivaBs = roundToFourDecimals((cifBs + gaBs) * IVA_RATE);
    const valueAfterTaxesBs = roundToFourDecimals(cifBs + gaBs);

    return {
      id: index + 1,
      productId: product?.productId ?? null,
      productCode: product?.productCode || "Sin código",
      productName: product?.productName || "Sin nombre",
      referenceQuantity: Number(product?.referenceQuantity || 0),
      baseQuantity: Number(product?.baseQuantity || 0),
      priceUsd: Number(product?.priceUsd || 0),
      subtotalUsd,
      factor,
      productValueBs,
      freightsBs,
      insurancesBs,
      portCostsBs,
      cifBs,
      gaPercent,
      gaBs,
      ivaBs,
      valueAfterTaxesBs,
    };
  });

  const additionalCostRows = allAdditionalCosts.map((cost) =>
    calculateAdditionalCost(cost, officialExchangeRate)
  );

  const totalAdditionalCosts = additionalCostRows.reduce(
    (accumulator, cost) => ({
      amountUsd: roundToFourDecimals(accumulator.amountUsd + cost.amountUsd),
      amountBs: roundToFourDecimals(accumulator.amountBs + cost.amountBs),
      fiscalCreditBs: roundToFourDecimals(accumulator.fiscalCreditBs + cost.fiscalCreditBs),
      netAmountBs: roundToFourDecimals(accumulator.netAmountBs + cost.netAmountBs),
    }),
    {
      amountUsd: 0,
      amountBs: 0,
      fiscalCreditBs: 0,
      netAmountBs: 0,
    }
  );

  const finalRows = productRows.map((product) => {
    const additionalAssignedBs = roundToFourDecimals(
      totalAdditionalCosts.netAmountBs * product.factor
    );

    const finalCostBs = roundToFourDecimals(
      product.valueAfterTaxesBs + additionalAssignedBs
    );

    const unitCostBs =
      product.referenceQuantity > 0
        ? roundToFourDecimals(
            finalCostBs / product.referenceQuantity
          )
        : null;

    return {
      ...product,
      additionalAssignedBs,
      finalCostBs,
      unitCostBs,
    };
  });

  const sumRows = (field, rows = productRows) =>
    roundToFourDecimals(
      rows.reduce(
        (total, row) => total + Number(row?.[field] || 0),
        0
      )
    );

  return {
    officialExchangeRate,
    bankCalculation,
    allAdditionalCosts,

    totals: {
      totalProductsUsd,
      totalProductsBs,
      totalFreightsUsd,
      totalFreightsBs,
      totalInsurancesUsd,
      totalInsurancesBs,
      totalPortCostsUsd,
      totalPortCostsBs,
      totalOtherBaseCostsUsd,
      totalOtherBaseCostsBs,
      totalBaseExpensesUsd,
      totalBaseExpensesBs,
      totalCifBs: sumRows("cifBs"),
      totalGaBs: sumRows("gaBs"),
      totalIvaBs: sumRows("ivaBs"),
      totalValueAfterTaxesBs: sumRows("valueAfterTaxesBs"),
      totalAdditionalCosts,
      totalAdditionalAssignedBs: sumRows("additionalAssignedBs", finalRows),
      totalFinalCostBs: sumRows("finalCostBs", finalRows),
    },

    productRows,
    additionalCostRows,
    finalRows,
  };
};
