export function sanitizeInput(input) {
  if (typeof input !== 'string') return input
  return input.replace(/[<>]/g, '').trim()
}

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(String(email).toLowerCase())
}

export function validateRequiredFields(fields, data) {
  const missing = fields.filter(field => !data[field] || data[field].toString().trim() === '')
  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`)
  }
  return true
}