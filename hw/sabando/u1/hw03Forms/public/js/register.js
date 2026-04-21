import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

const response = await fetch('../../config.json')
const config = await response.json()

const supabase = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_ANON_KEY
)

const form = document.getElementById('registerForm')

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const name = document.getElementById('name').value.trim()
  const lastname = document.getElementById('lastname').value.trim()
  const username = document.getElementById('username').value.trim()
  const ruc = document.getElementById('ruc').value.trim()
  const email = document.getElementById('email').value.trim()
  const password = document.getElementById('password').value
  const confirmPassword = document.getElementById('confirmPassword').value

  if (password !== confirmPassword) {
    alert("Passwords do not match")
    return
  }

  if (password.length < 2) {
    alert("Password must be at least 2 characters")
    return
  }

  if (!email.includes("@")) {
    alert("Invalid email format")
    return
  }

  try {
    const { error } = await supabase
      .from('users')
      .insert([
        {
          name,
          lastname,
          username,
          ruc,
          email,
          password
        }
      ])

    if (error) throw error

    alert("User registered successfully")
    form.reset()

  } catch (error) {
    console.error(error)
    alert("Error registering user")
  }
})