/* ==========================================================================
   SharkHub Dashboard — Common JavaScript
   Tab switching + mobile sidebar toggle
   ========================================================================== */

'use strict'

/**
 * Switch between dashboard content sections.
 * Updates both the nav-link active state and section visibility.
 */
function switchTab(tabId) {
    // Update nav links
    document.querySelectorAll('.sidebar .nav-link').forEach(function (link) {
        link.classList.remove('active')
    })

    if (event && event.currentTarget) {
        event.currentTarget.classList.add('active')
    }

    // Update content sections
    document.querySelectorAll('.content-section').forEach(function (section) {
        section.classList.remove('active')
    })

    var target = document.getElementById(tabId)
    if (target) {
        target.classList.add('active')
    }

    // Close sidebar on mobile after tab switch
    var sidebar = document.querySelector('.sidebar')
    if (sidebar && window.innerWidth <= 991) {
        sidebar.classList.remove('open')
    }
}

/**
 * Mobile sidebar toggle
 */
document.addEventListener('DOMContentLoaded', function () {
    var toggleBtn = document.querySelector('.sidebar-toggle')
    var sidebar = document.querySelector('.sidebar')

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('open')
        })
    }
})
