export const IVA_RATE = 0.1494;

export const roundToFourDecimals = (value) => {
  const numericValue = Number(value || 0);

  return (
    Math.round((numericValue + Number.EPSILON) * 10000) /
    10000
  );
};

export const getProductSubtotalUsd = (product) => {
  const baseQuantity = Number(product?.baseQuantity || 0);
  const priceUsd = Number(product?.priceUsd || 0);

  return roundToFourDecimals(baseQuantity * priceUsd);
};

export const getSectionTotalUsd = (items = []) => {
  const safeItems = Array.isArray(items) ? items : [];

  const total = safeItems.reduce(
    (accumulator, item) =>
      accumulator + Number(item?.amount ?? item?.amountUsd ?? 0),
    0
  );

  return roundToFourDecimals(total);
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

export const calculateImportation = ({
  generalData = {},
  products = [],
  expenses = {},
  additionalCosts = [],
}) => {
  const safeProducts = Array.isArray(products) ? products : [];
  const safeAdditionalCosts = Array.isArray(additionalCosts)
    ? additionalCosts
    : [];

  const officialExchangeRate = Number(
    generalData?.officialExchangeRate || 0
  );

  const totalProductsUsd = roundToFourDecimals(
    safeProducts.reduce(
      (accumulator, product) =>
        accumulator + getProductSubtotalUsd(product),
      0
    )
  );

  const totalFreightsUsd = getSectionTotalUsd(
    expenses?.freights
  );

  const totalInsurancesUsd = getSectionTotalUsd(
    expenses?.insurances
  );

  const totalPortCostsUsd = getSectionTotalUsd(
    expenses?.portCosts
  );

  const totalOtherBaseCostsUsd = getSectionTotalUsd(
    expenses?.otherCosts
  );

  /*
   * Según el flujo actual:
   * Base imponible = productos + fletes + seguros + gastos portuarios.
   * Otros gastos base no se suman al CIF mientras no se confirme
   * expresamente que deben formar parte de él.
   */
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
      totalFreightsUsd *
        officialExchangeRate *
        factor
    );

    const insurancesBs = roundToFourDecimals(
      totalInsurancesUsd *
        officialExchangeRate *
        factor
    );

    const portCostsBs = roundToFourDecimals(
      totalPortCostsUsd *
        officialExchangeRate *
        factor
    );

    const cifBs = roundToFourDecimals(
      productValueBs +
        freightsBs +
        insurancesBs +
        portCostsBs
    );

    const gaPercent = Number(product?.gaPercent || 0);
    const gaRate = gaPercent / 100;

    const gaBs = roundToFourDecimals(cifBs * gaRate);

    const ivaBs = roundToFourDecimals(
      (cifBs + gaBs) * IVA_RATE
    );

    /*
     * Se conserva la misma lógica que venías usando:
     * el IVA se muestra como crédito fiscal, pero no se suma al
     * valor después de impuestos.
     */
    const valueAfterTaxesBs = roundToFourDecimals(
      cifBs + gaBs
    );

    return {
      id: index + 1,
      productId: product?.productId ?? null,
      productCode:
        product?.productCode || "Sin código",
      productName:
        product?.productName || "Sin nombre",
      referenceQuantity: Number(
        product?.referenceQuantity || 0
      ),
      baseQuantity: Number(
        product?.baseQuantity || 0
      ),
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

  const additionalCostRows = safeAdditionalCosts.map(
    (cost) =>
      calculateAdditionalCost(
        cost,
        officialExchangeRate
      )
  );

  const totalAdditionalCosts = additionalCostRows.reduce(
    (accumulator, cost) => ({
      amountUsd: roundToFourDecimals(
        accumulator.amountUsd + cost.amountUsd
      ),
      amountBs: roundToFourDecimals(
        accumulator.amountBs + cost.amountBs
      ),
      fiscalCreditBs: roundToFourDecimals(
        accumulator.fiscalCreditBs +
          cost.fiscalCreditBs
      ),
      netAmountBs: roundToFourDecimals(
        accumulator.netAmountBs +
          cost.netAmountBs
      ),
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
      totalAdditionalCosts.netAmountBs *
        product.factor
    );

    const finalCostBs = roundToFourDecimals(
      product.valueAfterTaxesBs +
        additionalAssignedBs
    );

    const unitCostBs =
      product.referenceQuantity > 0
        ? roundToFourDecimals(
            finalCostBs /
              product.referenceQuantity
          )
        : null;

    return {
      ...product,
      additionalAssignedBs,
      finalCostBs,
      unitCostBs,
    };
  });

  const totalCifBs = roundToFourDecimals(
    productRows.reduce(
      (accumulator, row) =>
        accumulator + row.cifBs,
      0
    )
  );

  const totalGaBs = roundToFourDecimals(
    productRows.reduce(
      (accumulator, row) =>
        accumulator + row.gaBs,
      0
    )
  );

  const totalIvaBs = roundToFourDecimals(
    productRows.reduce(
      (accumulator, row) =>
        accumulator + row.ivaBs,
      0
    )
  );

  const totalValueAfterTaxesBs =
    roundToFourDecimals(
      productRows.reduce(
        (accumulator, row) =>
          accumulator +
          row.valueAfterTaxesBs,
        0
      )
    );

  const totalAdditionalAssignedBs =
    roundToFourDecimals(
      finalRows.reduce(
        (accumulator, row) =>
          accumulator +
          row.additionalAssignedBs,
        0
      )
    );

  const totalFinalCostBs = roundToFourDecimals(
    finalRows.reduce(
      (accumulator, row) =>
        accumulator + row.finalCostBs,
      0
    )
  );

  return {
    officialExchangeRate,

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

      totalCifBs,
      totalGaBs,
      totalIvaBs,
      totalValueAfterTaxesBs,

      totalAdditionalCosts,
      totalAdditionalAssignedBs,
      totalFinalCostBs,
    },

    productRows,
    additionalCostRows,
    finalRows,
  };
};
