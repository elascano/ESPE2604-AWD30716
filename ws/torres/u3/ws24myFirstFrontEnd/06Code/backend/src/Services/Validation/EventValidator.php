<?php
declare(strict_types=1);

namespace App\Services\Validation;

final class EventValidator
{
    public function __construct(private readonly FieldValidator $fields)
    {
    }

    /** Validates a professional event before it is stored for B2 dancer work. */
    public function validateProfessionalEvent(array $data): array
    {
        $errors = [];

        foreach ([
            'branch_id' => $this->fields->branchError($data['branch_id'] ?? 0),
            'client_name' => $this->fields->textError($data['client_name'] ?? '', 'Client name', 160),
            'event_type' => $this->fields->textError($data['event_type'] ?? '', 'Event type', 120),
            'event_date' => $this->fields->dateError($data['event_date'] ?? '', 'Event date'),
            'total_amount' => $this->fields->numberRangeError($data['total_amount'] ?? '', 'Total amount', 0, 999999),
        ] as $field => $error) {
            if ($error !== '') {
                $errors[$field] = $error;
            }
        }

        $status = strtolower((string) ($data['status'] ?? 'pending_payment'));
        if (!in_array($status, ['pending_payment', 'paid', 'settled', 'cancelled'], true)) {
            $errors['status'] = 'Status must be pending_payment, paid, settled, or cancelled.';
        }

        return $errors;
    }

    /** Validates dancer payment data for an event assignment. */
    public function validateDancerAssignment(array $data): array
    {
        $errors = [];

        if ((int) ($data['student_id'] ?? 0) <= 0) {
            $errors['student_id'] = 'Student is required.';
        }

        foreach ([
            'gross_amount' => $this->fields->numberRangeError($data['gross_amount'] ?? '', 'Gross amount', 0, 999999),
            'deduction_amount' => $this->fields->numberRangeError($data['deduction_amount'] ?? 0, 'Deduction amount', 0, 999999),
        ] as $field => $error) {
            if ($error !== '') {
                $errors[$field] = $error;
            }
        }

        $grossAmount = is_numeric($data['gross_amount'] ?? null) ? (float) $data['gross_amount'] : 0;
        $deductionAmount = is_numeric($data['deduction_amount'] ?? null) ? (float) $data['deduction_amount'] : 0;
        if ($deductionAmount > $grossAmount) {
            $errors['deduction_amount'] = 'Deduction cannot be greater than gross amount.';
        }

        $reasonError = $this->fields->optionalTextError($data['deduction_reason'] ?? '', 'Deduction reason', 250);
        if ($reasonError !== '') {
            $errors['deduction_reason'] = $reasonError;
        }

        $paymentStatus = strtolower((string) ($data['payment_status'] ?? 'pending'));
        if (!in_array($paymentStatus, ['pending', 'paid'], true)) {
            $errors['payment_status'] = 'Payment status must be pending or paid.';
        }

        return $errors;
    }
}
