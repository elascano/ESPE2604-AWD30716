namespace TaxProblem.Web.Services;

/// <summary>
/// Servicio para calcular impuestos (IVA) y totales de productos
/// Single Responsibility: solo realiza cálculos de impuestos
/// </summary>
public interface ITaxCalculatorService
{
    /// <summary>
    /// Calcula subtotal, IVA (15%) y total para un producto
    /// </summary>
    /// <param name="price">Precio unitario del producto</param>
    /// <param name="quantity">Cantidad de unidades</param>
    /// <returns>Tupla con (subtotal, iva, total)</returns>
    (decimal Subtotal, decimal IVA, decimal Total) CalculateTax(decimal price, int quantity);

    /// <summary>
    /// Obtiene el porcentaje de IVA configurado
    /// </summary>
    /// <returns>Porcentaje de IVA (ej: 15 para 15%)</returns>
    decimal GetIVARate();
}
