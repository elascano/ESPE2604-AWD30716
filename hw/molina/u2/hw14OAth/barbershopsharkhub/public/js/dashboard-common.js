/* ==========================================================================
   SharkHub Dashboard — Common JavaScript
   Visible URI tab navigation without full page reload
   ========================================================================== */

'use strict'

let dashboardSupabaseClientPromise = null

const tabRoutes = {
    // Barber
    '/barber/dashboard': 'agenda',
    '/barber/dashboard/agenda': 'agenda',
    '/barber/dashboard/services': 'services',
    '/barber/dashboard/products': 'products',
    
    // Owner
    '/owner/dashboard': 'dashboard',
    '/owner/dashboard/dashboard': 'dashboard',
    '/owner/dashboard/barbershop-info': 'barbershop-info',
    '/owner/dashboard/manage-barbers': 'manage-barbers',
    '/owner/dashboard/global-agenda': 'global-agenda',
    
    // Customer
    '/customer/dashboard': 'my-appointments',
    '/customer/dashboard/my-appointments': 'my-appointments',
    '/customer/dashboard/book-appointment': 'book-appointment',
    '/customer/dashboard/profile': 'profile',
}

function switchTab(tabId, targetUrl = null) {
    document.querySelectorAll('.sidebar .nav-link').forEach(function (link) {
        link.classList.remove('active')
    })

    const activeLink = document.querySelector(`.sidebar .nav-link[data-tab="${tabId}"]`)

    if (activeLink) {
        activeLink.classList.add('active')
    }

    document.querySelectorAll('.content-section').forEach(function (section) {
        section.classList.remove('active')
    })

    const targetSection = document.getElementById(tabId)

    if (targetSection) {
        targetSection.classList.add('active')
    }

    if (targetUrl) {
        const nextUrl = new URL(targetUrl, window.location.origin)

        if (window.location.pathname !== nextUrl.pathname) {
            window.history.pushState({ tabId: tabId }, '', nextUrl.pathname)
        }
    }

    const sidebar = document.querySelector('.sidebar')

    if (sidebar && window.innerWidth <= 991) {
        sidebar.classList.remove('open')
    }
}

function getCurrentTab() {
    return tabRoutes[window.location.pathname] || null
}

function activateTabFromCurrentUrl() {
    const tabId = getCurrentTab()

    if (tabId) {
        switchTab(tabId)
    }
}

function configureDashboardLinks() {
    document.querySelectorAll('.sidebar .nav-link[data-tab]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault()

            const tabId = link.dataset.tab
            const targetUrl = link.getAttribute('href')

            switchTab(tabId, targetUrl)
        })
    })
}

async function getDashboardSupabaseClient() {
    if (dashboardSupabaseClientPromise) {
        return dashboardSupabaseClientPromise
    }

    if (!window.supabase) {
        return null
    }

    dashboardSupabaseClientPromise = fetch('/api/auth/supabase-config', {
        headers: {
            'Accept': 'application/json',
        },
        credentials: 'same-origin',
    })
        .then(function (response) {
            if (!response.ok) {
                throw new Error('No se pudo obtener la configuración de Supabase.')
            }

            return response.json()
        })
        .then(function (config) {
            return window.supabase.createClient(config.url, config.anonKey, {
                auth: {
                    persistSession: true,
                    autoRefreshToken: true,
                    detectSessionInUrl: true,
                },
            })
        })

    return dashboardSupabaseClientPromise
}

function clearSupabaseStorage() {
    const storages = [window.localStorage, window.sessionStorage]

    storages.forEach(function (storage) {
        if (!storage) {
            return
        }

        Object.keys(storage).forEach(function (key) {
            if (key.startsWith('sb-') || key.toLowerCase().includes('supabase')) {
                storage.removeItem(key)
            }
        })
    })
}

async function closeSupabaseSession() {
    try {
        const supabaseClient = await getDashboardSupabaseClient()

        if (supabaseClient) {
            await supabaseClient.auth.signOut()
        }
    } catch (error) {
        console.warn('No se pudo cerrar la sesión local de Supabase.', error)
    } finally {
        clearSupabaseStorage()
    }
}

async function performDashboardLogout(event) {
    event.preventDefault()

    const logoutLink = event.currentTarget
    const originalContent = logoutLink.innerHTML

    logoutLink.classList.add('disabled')
    logoutLink.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Cerrando sesión'

    try {
        await closeSupabaseSession()

        await fetch('/api/auth/logout', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            credentials: 'same-origin',
        })

        window.location.replace('/customer/login')
    } catch (error) {
        console.error(error)
        window.location.replace('/auth/logout')
    } finally {
        logoutLink.innerHTML = originalContent
        logoutLink.classList.remove('disabled')
    }
}

function configureDashboardLogout() {
    document.querySelectorAll('[data-logout]').forEach(function (logoutLink) {
        logoutLink.addEventListener('click', performDashboardLogout)
    })
}

function configureSidebarToggle() {
    const toggleBtn = document.querySelector('.sidebar-toggle')
    const sidebar = document.querySelector('.sidebar')

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('open')
        })
    }
}

document.addEventListener('DOMContentLoaded', function () {
    configureSidebarToggle()
    configureDashboardLinks()
    configureDashboardLogout()
    activateTabFromCurrentUrl()
})

window.addEventListener('popstate', function () {
    activateTabFromCurrentUrl()
})

window.switchTab = switchTab