export class XmlService {
  /**
   * Parsea un contenido CSV de forma robusta teniendo en cuenta comillas dobles y comas internas.
   */
  public parseCsv(csvContent: string): string[][] {
    const result: string[][] = [];
    let row: string[] = [];
    let inQuotes = false;
    let currentVal = '';

    for (let i = 0; i < csvContent.length; i++) {
      const char = csvContent[i];
      const nextChar = csvContent[i + 1];

      if (char === '\\') {
        currentVal += nextChar || '';
        i++;
        continue;
      }

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentVal += '"';
          i++; // saltar la siguiente comilla
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(currentVal.trim());
        currentVal = '';
      } else if ((char === '\r' || char === '\n') && !inQuotes) {
        if (char === '\r' && nextChar === '\n') {
          i++;
        }
        row.push(currentVal.trim());
        if (row.length > 0 && row.some(cell => cell !== '')) {
          result.push(row);
        }
        row = [];
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    
    if (currentVal || row.length > 0) {
      row.push(currentVal.trim());
      if (row.some(cell => cell !== '')) {
        result.push(row);
      }
    }
    
    return result;
  }

  private escapeXml(unsafe: any): string {
    if (unsafe === undefined || unsafe === null) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  /**
   * Convierte un string de contenido CSV en un string XML estructurado.
   */
  public convertCsvToXml(csvContent: string): string {
    const rows = this.parseCsv(csvContent);
    if (rows.length === 0) return '';
    
    const headers = rows[0].map(h => h.replace(/^"|"$/g, '').trim());
    const invoices: any[] = [];
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const invoice: any = {};
      headers.forEach((header, index) => {
        // Remover comillas externas que puedan haber quedado
        let cellVal = row[index] || '';
        if (cellVal.startsWith('"') && cellVal.endsWith('"')) {
          cellVal = cellVal.substring(1, cellVal.length - 1);
        }
        invoice[header] = cellVal;
      });
      invoices.push(invoice);
    }

    let totalSalesTaxBase = 0;
    let totalSalesIva = 0;
    let totalSalesAmount = 0;
    let totalExpensesTaxBase = 0;
    let totalExpensesIva = 0;
    let totalExpensesAmount = 0;
    
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<ats>\n';
    xml += '  <invoices>\n';

    for (const inv of invoices) {
      const type = (inv.type || 'COMPRA').toUpperCase();
      const subtotalVal = parseFloat(inv.subtotal) || 0;
      const iva = parseFloat(inv.iva) || 0;
      const total = parseFloat(inv.total) || 0;

      if (type === 'VENTA') {
        totalSalesTaxBase += subtotalVal;
        totalSalesIva += iva;
        totalSalesAmount += total;
      } else {
        totalExpensesTaxBase += subtotalVal;
        totalExpensesIva += iva;
        totalExpensesAmount += total;
      }

      xml += '    <invoice>\n';
      xml += `      <id>${this.escapeXml(inv.id)}</id>\n`;
      xml += `      <type>${this.escapeXml(type)}</type>\n`;
      xml += `      <number>${this.escapeXml(inv.number)}</number>\n`;
      xml += `      <date>${this.escapeXml(inv.customerDate)}</date>\n`;
      xml += '      <issuer>\n';
      xml += `        <name>${this.escapeXml(inv.issuerName)}</name>\n`;
      xml += `        <tradeName>${this.escapeXml(inv.issuerCommercialName)}</tradeName>\n`;
      xml += `        <address>${this.escapeXml(inv.issuerAddress)}</address>\n`;
      xml += `        <ruc>${this.escapeXml(inv.issuerRuc)}</ruc>\n`;
      xml += '      </issuer>\n';
      xml += `      <authorizationNumber>${this.escapeXml(inv.authorizationNumber)}</authorizationNumber>\n`;
      xml += `      <emissionType>${this.escapeXml(inv.emissionType || 'Normal')}</emissionType>\n`;
      xml += `      <accessKey>${this.escapeXml(inv.accessKey)}</accessKey>\n`;
      xml += '      <client>\n';
      xml += `        <name>${this.escapeXml(inv.customerName)}</name>\n`;
      xml += `        <identification>${this.escapeXml(inv.customerId)}</identification>\n`;
      xml += `        <address>${this.escapeXml(inv.customerAddress)}</address>\n`;
      xml += `        <phone>${this.escapeXml(inv.customerPhone)}</phone>\n`;
      xml += `        <email>${this.escapeXml(inv.customerEmail)}</email>\n`;
      xml += '      </client>\n';
      
      xml += '      <details>\n';
      if (inv.products) {
        try {
          const products = typeof inv.products === 'string' ? JSON.parse(inv.products) : inv.products;
          if (Array.isArray(products)) {
            for (const prod of products) {
              xml += '        <product>\n';
              xml += `          <code>${this.escapeXml(prod.code)}</code>\n`;
              xml += `          <description>${this.escapeXml(prod.description)}</description>\n`;
              xml += `          <quantity>${prod.quantity}</quantity>\n`;
              xml += `          <unitPrice>${prod.unitPrice}</unitPrice>\n`;
              xml += `          <total>${prod.total}</total>\n`;
              xml += '        </product>\n';
            }
          }
        } catch (e) {
          xml += `        <!-- Error al parsear productos: ${this.escapeXml(String(e))} -->\n`;
        }
      }
      xml += '      </details>\n';

      xml += '      <financials>\n';
      xml += `        <subtotal>${subtotalVal.toFixed(2)}</subtotal>\n`;
      xml += `        <iva>${iva.toFixed(2)}</iva>\n`;
      xml += `        <total>${total.toFixed(2)}</total>\n`;
      xml += '      </financials>\n';
      xml += '    </invoice>\n';
    }

    xml += '  </invoices>\n';
    xml += '  <summary>\n';
    xml += `    <invoiceCount>${invoices.length}</invoiceCount>\n`;
    xml += '    <sales>\n';
    xml += `      <subtotal>${totalSalesTaxBase.toFixed(2)}</subtotal>\n`;
    xml += `      <iva>${totalSalesIva.toFixed(2)}</iva>\n`;
    xml += `      <total>${totalSalesAmount.toFixed(2)}</total>\n`;
    xml += '    </sales>\n';
    xml += '    <expenses>\n';
    xml += `      <subtotal>${totalExpensesTaxBase.toFixed(2)}</subtotal>\n`;
    xml += `      <iva>${totalExpensesIva.toFixed(2)}</iva>\n`;
    xml += `      <total>${totalExpensesAmount.toFixed(2)}</total>\n`;
    xml += '    </expenses>\n';
    xml += '  </summary>\n';
    xml += '</ats>';

    return xml;
  }
}
