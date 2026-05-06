/* ==========================================================================
   SharkHub Dashboard — Client Booking Wizard
   Card selection, time slots, step navigation
   ========================================================================== */

'use strict'

/**
 * Select a card within a wizard step (barber or service).
 * Removes selection from siblings and marks the clicked card.
 */
function selectCard(element, step) {
    var container = element.parentElement
    container.querySelectorAll('.selection-card').forEach(function (card) {
        card.classList.remove('selected')
    })
    element.classList.add('selected')
}

/**
 * Select a time slot. Ignores disabled slots.
 */
function selectTime(element) {
    if (element.classList.contains('disabled')) return

    var container = element.parentElement
    container.querySelectorAll('.time-slot').forEach(function (slot) {
        slot.classList.remove('selected')
    })
    element.classList.add('selected')
}

/**
 * Navigate to the next wizard step.
 */
function nextStep(step) {
    document.querySelectorAll('.wizard-panel').forEach(function (p) {
        p.classList.remove('active')
    })
    document.getElementById('panel-' + step).classList.add('active')

    document.getElementById('step-ind-' + (step - 1)).classList.remove('active')
    document.getElementById('step-ind-' + (step - 1)).classList.add('completed')
    document.getElementById('step-ind-' + step).classList.add('active')
}

/**
 * Navigate to the previous wizard step.
 */
function prevStep(step) {
    document.querySelectorAll('.wizard-panel').forEach(function (p) {
        p.classList.remove('active')
    })
    document.getElementById('panel-' + step).classList.add('active')

    document.getElementById('step-ind-' + (step + 1)).classList.remove('active')
    document.getElementById('step-ind-' + step).classList.remove('completed')
    document.getElementById('step-ind-' + step).classList.add('active')
}
