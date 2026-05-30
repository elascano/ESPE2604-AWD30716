namespace TaxProblem.Web.Services;

/// <summary>
/// Implementación del servicio de cálculo de impuestos
/// Calcula IVA al 15% (Ecuador)
/// </summary>
public class TaxCalculatorService : ITaxCalculatorService
{
    // Porcentaje de IVA para Ecuador: 15%
    private const decimal IVA_RATE = 0.15m;

    /// <summary>
    /// Calcula: Subtotal = Precio × Cantidad
    ///          IVA = Subtotal × 0.15
    ///          Total = Subtotal + IVA
    /// </summary>
    public (decimal Subtotal, decimal IVA, decimal Total) CalculateTax(decimal price, int quantity)
    {
        if (price < 0)
            throw new ArgumentException("El precio no puede ser negativo", nameof(price));

        if (quantity <= 0)
            throw new ArgumentException("La cantidad debe ser mayor a cero", nameof(quantity));

        decimal subtotal = price * quantity;
        decimal iva = decimal.Round(subtotal * IVA_RATE, 2);
        decimal total = subtotal + iva;

        return (subtotal, iva, total);
    }

    public decimal GetIVARate()
    {
        return IVA_RATE * 100; // Retorna 15 (para mostrar "15%")
    }
}
