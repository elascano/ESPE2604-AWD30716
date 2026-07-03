<?php
/**
 * ATS Express XML Generator Microservice
 * Compatible with PHP 8.x
 * 
 * This script accepts an HTTP POST request with a JSON payload representing the transactional data (informant, purchases, sales,
 * sales by establishment, annulled), validates the data according to Ecuador SRI technical standards, and generates a valid ATS XML.
 */

// Set JSON header response
header('Content-Type: application/json; charset=utf-8');

// Disable internal XML errors warning and enable error handling
libxml_use_internal_errors(true);

// 1. HTTP Method Validation
if (php_sapi_name() !== 'cli' && ($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method Not Allowed. Only POST requests are accepted.'
    ]);
    exit;
}

// 2. Read and Decode Request Body
$rawInput = file_get_contents(php_sapi_name() === 'cli' ? 'php://stdin' : 'php://input');
$input = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid JSON payload. ' . json_last_error_msg()
    ]);
    exit;
}

// 3. Validation Logic
$errors = [];

// Validate Informant Header Block
if (!isset($input['informant']) || !is_array($input['informant'])) {
    $errors[] = "The 'informant' block is required and must be an object.";
} else {
    $inf = $input['informant'];
    
    // Validate informantId (RUC) - Must be exactly 13 digits and numeric
    if (empty($inf['informantId'])) {
        $errors[] = "The 'informant.informantId' is required.";
    } elseif (!preg_match('/^\d{13}$/', $inf['informantId'])) {
        $errors[] = "The 'informant.informantId' must be exactly 13 digits (Ecuadorian RUC).";
    }

    // Validate informantIdType (Defaults to 'R' for RUC)
    if (empty($inf['informantIdType'])) {
        $input['informant']['informantIdType'] = 'R';
    }

    // Validate companyName (razonSocial)
    if (empty($inf['companyName'])) {
        $errors[] = "The 'informant.companyName' (razonSocial) is required.";
    }

    // Validate year (Anio) - 4-digit number
    if (empty($inf['year'])) {
        $errors[] = "The 'informant.year' is required.";
    } elseif (!preg_match('/^\d{4}$/', $inf['year'])) {
        $errors[] = "The 'informant.year' must be a 4-digit number.";
    }

    // Validate month (Mes) - 2-digit representation (01 - 12)
    if (empty($inf['month'])) {
        $errors[] = "The 'informant.month' is required.";
    } else {
        $monthVal = intval($inf['month']);
        if ($monthVal < 1 || $monthVal > 12) {
            $errors[] = "The 'informant.month' must be between 01 and 12.";
        } else {
            // Force 2-digit month padding
            $input['informant']['month'] = str_pad($monthVal, 2, '0', STR_PAD_LEFT);
        }
    }

    // Validate establishmentsCount (numEstabRuc) - Defaults to '001'
    if (empty($inf['establishmentsCount'])) {
        $input['informant']['establishmentsCount'] = '001';
    } else {
        $input['informant']['establishmentsCount'] = str_pad(intval($inf['establishmentsCount']), 3, '0', STR_PAD_LEFT);
    }

    // Validate totalSales
    if (!isset($inf['totalSales'])) {
        $errors[] = "The 'informant.totalSales' is required.";
    } elseif (!is_numeric($inf['totalSales'])) {
        $errors[] = "The 'informant.totalSales' must be a numeric value.";
    }

    // Validate operationalCode (codigoOperativo)
    if (empty($inf['operationalCode'])) {
        $input['informant']['operationalCode'] = 'IVA';
    }
}

// Check validation errors before parsing details
if (!empty($errors)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Validation failed: ' . implode(' | ', $errors)
    ]);
    exit;
}

// 4. Initialize DOMDocument
$dom = new DOMDocument('1.0', 'UTF-8');
$dom->formatOutput = true;

// Create Root Element <iva>
$root = $dom->createElement('iva');
$dom->appendChild($root);

// Add Header elements
$inf = $input['informant'];
$root->appendChild(createSafeNode($dom, 'TipoIDInformante', $inf['informantIdType']));
$root->appendChild(createSafeNode($dom, 'IdInformante', $inf['informantId']));
$root->appendChild(createSafeNode($dom, 'razonSocial', $inf['companyName']));
$root->appendChild(createSafeNode($dom, 'Anio', $inf['year']));
$root->appendChild(createSafeNode($dom, 'Mes', $inf['month']));
$root->appendChild(createSafeNode($dom, 'numEstabRuc', $inf['establishmentsCount']));
$root->appendChild(createSafeNode($dom, 'totalVentas', formatDecimal($inf['totalSales'])));
$root->appendChild(createSafeNode($dom, 'codigoOperativo', $inf['operationalCode']));

// 5. Append Purchases Block (<compras>)
if (isset($input['purchases']) && is_array($input['purchases']) && count($input['purchases']) > 0) {
    $comprasNode = $dom->createElement('compras');
    
    foreach ($input['purchases'] as $p) {
        $detNode = $dom->createElement('detalleCompras');
        
        $detNode->appendChild(createSafeNode($dom, 'codSustento', $p['taxSustenanceCode'] ?? ''));
        $detNode->appendChild(createSafeNode($dom, 'tpIdProv', $p['providerIdType'] ?? ''));
        $detNode->appendChild(createSafeNode($dom, 'idProv', $p['providerId'] ?? ''));
        $detNode->appendChild(createSafeNode($dom, 'tipoComprobante', $p['receiptType'] ?? ''));
        
        if (isset($p['providerType'])) {
            $detNode->appendChild(createSafeNode($dom, 'tipoProv', $p['providerType']));
        }
        if (isset($p['providerName'])) {
            $detNode->appendChild(createSafeNode($dom, 'denoProv', $p['providerName']));
        }
        
        $detNode->appendChild(createSafeNode($dom, 'parteRel', $p['relatedParty'] ?? 'NO'));
        $detNode->appendChild(createSafeNode($dom, 'fechaRegistro', $p['registrationDate'] ?? ''));
        $detNode->appendChild(createSafeNode($dom, 'establecimiento', str_pad($p['establishment'] ?? '001', 3, '0', STR_PAD_LEFT)));
        $detNode->appendChild(createSafeNode($dom, 'puntoEmision', str_pad($p['emissionPoint'] ?? '001', 3, '0', STR_PAD_LEFT)));
        $detNode->appendChild(createSafeNode($dom, 'secuencial', str_pad($p['sequential'] ?? '1', 9, '0', STR_PAD_LEFT)));
        $detNode->appendChild(createSafeNode($dom, 'fechaEmision', $p['emissionDate'] ?? ''));
        $detNode->appendChild(createSafeNode($dom, 'autorizacion', $p['authorizationNumber'] ?? ''));
        
        $detNode->appendChild(createSafeNode($dom, 'baseNoGraIva', formatDecimal($p['nonTaxableBase'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'baseImponible', formatDecimal($p['taxableBaseZero'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'baseImpGrav', formatDecimal($p['taxableBaseGrav'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'baseImpExe', formatDecimal($p['exemptBase'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'montoIce', formatDecimal($p['iceAmount'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'montoIva', formatDecimal($p['ivaAmount'] ?? 0)));
        
        $detNode->appendChild(createSafeNode($dom, 'valRetBien10', formatDecimal($p['valRetBien10'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'valRetServ20', formatDecimal($p['valRetServ20'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'valorRetBienes', formatDecimal($p['retentionGoods30'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'valRetServ50', formatDecimal($p['valRetServ50'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'valorRetServicios', formatDecimal($p['retentionServices70'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'valRetServ100', formatDecimal($p['retentionServices100'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'valorRetRenta', formatDecimal($p['totalIncomeTaxRetention'] ?? 0)));
        
        // Append pagoExterior element
        $pagoExtNode = $dom->createElement('pagoExterior');
        $locExt = $p['paymentLocExt'] ?? '01';
        $pagoExtNode->appendChild(createSafeNode($dom, 'pagoLocExt', $locExt));
        
        if ($locExt === '02') {
            if (isset($p['regimeType'])) {
                $pagoExtNode->appendChild(createSafeNode($dom, 'tipoRegi', $p['regimeType']));
            }
            $pagoExtNode->appendChild(createSafeNode($dom, 'paisEfecPago', $p['paymentCountry'] ?? ''));
            $pagoExtNode->appendChild(createSafeNode($dom, 'aplicConvDobTrib', $p['doubleTaxAgreement'] ?? 'NO'));
            $pagoExtNode->appendChild(createSafeNode($dom, 'pagExtSujRetNorLeg', $p['subjectToRetention'] ?? 'NO'));
        } else {
            $pagoExtNode->appendChild(createSafeNode($dom, 'paisEfecPago', 'NA'));
            $pagoExtNode->appendChild(createSafeNode($dom, 'aplicConvDobTrib', 'NA'));
            $pagoExtNode->appendChild(createSafeNode($dom, 'pagExtSujRetNorLeg', 'NA'));
        }
        $detNode->appendChild($pagoExtNode);
        
        // Append formasDePago element
        if (isset($p['paymentMethods']) && is_array($p['paymentMethods'])) {
            $formasPagoNode = $dom->createElement('formasDePago');
            foreach ($p['paymentMethods'] as $method) {
                $formasPagoNode->appendChild(createSafeNode($dom, 'formaPago', $method));
            }
            $detNode->appendChild($formasPagoNode);
        }
        
        // Append air element
        if (isset($p['incomeTaxRetentions']) && is_array($p['incomeTaxRetentions'])) {
            $airNode = $dom->createElement('air');
            foreach ($p['incomeTaxRetentions'] as $r) {
                $detAirNode = $dom->createElement('detalleAir');
                $detAirNode->appendChild(createSafeNode($dom, 'codRetAir', $r['retentionCode'] ?? ''));
                $detAirNode->appendChild(createSafeNode($dom, 'baseImpAir', formatDecimal($r['taxableBase'] ?? 0)));
                $detAirNode->appendChild(createSafeNode($dom, 'porcentajeAir', formatDecimal($r['percentage'] ?? 0)));
                $detAirNode->appendChild(createSafeNode($dom, 'valRetAir', formatDecimal($r['retentionValue'] ?? 0)));
                $airNode->appendChild($detAirNode);
            }
            $detNode->appendChild($airNode);
        }
        
        $comprasNode->appendChild($detNode);
    }
    
    $root->appendChild($comprasNode);
}

// 6. Append Sales Block (<ventas>)
if (isset($input['sales']) && is_array($input['sales']) && count($input['sales']) > 0) {
    $ventasNode = $dom->createElement('ventas');
    
    foreach ($input['sales'] as $s) {
        $detNode = $dom->createElement('detalleVentas');
        
        $detNode->appendChild(createSafeNode($dom, 'tpIdCliente', $s['clientIdType'] ?? ''));
        $detNode->appendChild(createSafeNode($dom, 'idCliente', $s['clientId'] ?? ''));
        
        if (isset($s['clientType'])) {
            $detNode->appendChild(createSafeNode($dom, 'tipoCliente', $s['clientType']));
        }
        if (isset($s['clientName'])) {
            $detNode->appendChild(createSafeNode($dom, 'denoCli', $s['clientName']));
        }
        
        $detNode->appendChild(createSafeNode($dom, 'parteRel', $s['relatedParty'] ?? 'NO'));
        $detNode->appendChild(createSafeNode($dom, 'tipoComprobante', $s['receiptType'] ?? ''));
        $detNode->appendChild(createSafeNode($dom, 'tipoEmision', $s['emissionType'] ?? 'E'));
        $detNode->appendChild(createSafeNode($dom, 'numeroComprobantes', intval($s['receiptsCount'] ?? 1)));
        
        $detNode->appendChild(createSafeNode($dom, 'baseNoGraIva', formatDecimal($s['nonTaxableBase'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'baseImponible', formatDecimal($s['taxableBaseZero'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'baseImpGrav', formatDecimal($s['taxableBaseGrav'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'montoIva', formatDecimal($s['ivaAmount'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'montoIce', formatDecimal($s['iceAmount'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'valorRetIva', formatDecimal($s['retentionIvaAmount'] ?? 0)));
        $detNode->appendChild(createSafeNode($dom, 'valorRetRenta', formatDecimal($s['retentionRentaAmount'] ?? 0)));
        
        // Append formasDePago element if present
        if (isset($s['paymentMethods']) && is_array($s['paymentMethods'])) {
            $formasPagoNode = $dom->createElement('formasDePago');
            foreach ($s['paymentMethods'] as $method) {
                $formasPagoNode->appendChild(createSafeNode($dom, 'formaPago', $method));
            }
            $detNode->appendChild($formasPagoNode);
        }
        
        $ventasNode->appendChild($detNode);
    }
    
    $root->appendChild($ventasNode);
}

// 7. Append Sales by Establishment Block (<ventasEstablecimiento>)
if (isset($input['salesByEstablishment']) && is_array($input['salesByEstablishment']) && count($input['salesByEstablishment']) > 0) {
    $estNode = $dom->createElement('ventasEstablecimiento');
    
    foreach ($input['salesByEstablishment'] as $e) {
        $ventaEstNode = $dom->createElement('ventaEst');
        
        $ventaEstNode->appendChild(createSafeNode($dom, 'codEst', str_pad($e['establishmentCode'] ?? '001', 3, '0', STR_PAD_LEFT)));
        $ventaEstNode->appendChild(createSafeNode($dom, 'ventasEst', formatDecimal($e['salesAmount'] ?? 0)));
        $ventaEstNode->appendChild(createSafeNode($dom, 'iva', formatDecimal($e['ivaAmount'] ?? 0)));
        
        $estNode->appendChild($ventaEstNode);
    }
    
    $root->appendChild($estNode);
}

// 8. Append Annulled Block (<anulados>)
if (isset($input['annulled']) && is_array($input['annulled']) && count($input['annulled']) > 0) {
    $anulNode = $dom->createElement('anulados');
    
    foreach ($input['annulled'] as $a) {
        $detAnulNode = $dom->createElement('detalleAnulados');
        
        $detAnulNode->appendChild(createSafeNode($dom, 'tipoComprobante', $a['receiptType'] ?? ''));
        $detAnulNode->appendChild(createSafeNode($dom, 'establecimiento', str_pad($a['establishment'] ?? '001', 3, '0', STR_PAD_LEFT)));
        $detAnulNode->appendChild(createSafeNode($dom, 'puntoEmision', str_pad($a['emissionPoint'] ?? '001', 3, '0', STR_PAD_LEFT)));
        $detAnulNode->appendChild(createSafeNode($dom, 'secuencialInicio', str_pad($a['sequentialStart'] ?? '1', 9, '0', STR_PAD_LEFT)));
        $detAnulNode->appendChild(createSafeNode($dom, 'secuencialFin', str_pad($a['sequentialEnd'] ?? '1', 9, '0', STR_PAD_LEFT)));
        $detAnulNode->appendChild(createSafeNode($dom, 'autorizacion', $a['authorizationNumber'] ?? '9999999999'));
        
        $anulNode->appendChild($detAnulNode);
    }
    
    $root->appendChild($anulNode);
}

// 9. Save XML file to Server
$tempDir = __DIR__ . '/temp';
if (!is_dir($tempDir)) {
    if (!mkdir($tempDir, 0755, true)) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to create temp directory on server.'
        ]);
        exit;
    }
}

// Cleanup garbage collection: delete temp files older than 24 hours
$files = glob($tempDir . '/ats_*.xml');
$now = time();
foreach ($files as $f) {
    if (is_file($f) && ($now - filemtime($f) > 86400)) {
        @unlink($f);
    }
}

$xmlContent = $dom->saveXML();
$filename = 'ats_' . $inf['informantId'] . '_' . $inf['year'] . $inf['month'] . '_' . time() . '.xml';
$filePath = $tempDir . '/' . $filename;

if (file_put_contents($filePath, $xmlContent) === false) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to write ATS XML file on server.'
    ]);
    exit;
}

// Determine Public URI (relative or URL schema)
$publicUri = 'temp/' . $filename;

// 10. Success Response
http_response_code(200);
echo json_encode([
    'success' => true,
    'message' => 'ATS XML exported successfully.',
    'uri' => $publicUri,
    'base64' => base64_encode($xmlContent)
]);
exit;


// ==========================================
// Helper Functions
// ==========================================

/**
 * Creates an XML node securely escaping any character sequences to prevent parsing issues.
 */
function createSafeNode(DOMDocument $dom, string $name, $value): DOMElement {
    $element = $dom->createElement($name);
    // Securely set content using textNode to prevent injection and escaping bugs
    $text = $dom->createTextNode((string)$value);
    $element->appendChild($text);
    return $element;
}

/**
 * Formats financial values to 2 decimal places as required by the SRI.
 */
function formatDecimal($value): string {
    if ($value === null || $value === '') {
        return '0.00';
    }
    return number_format((float)$value, 2, '.', '');
}
