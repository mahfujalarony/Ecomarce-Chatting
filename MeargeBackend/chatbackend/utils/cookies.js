const { getRefreshTokenMaxAgeMs } = require('./token')
const config = require('../config/serviceConfig')

const REFRESH_COOKIE_NAME = config.refreshCookieName

function parseCookies(req) {
  const header = String(req?.headers?.cookie || '')
  if (!header) return {}

  return header.split(';').reduce((acc, item) => {
    const [rawKey, ...rawValueParts] = item.split('=')
    const key = String(rawKey || '').trim()
    if (!key) return acc
    const value = rawValueParts.join('=').trim()
    acc[key] = decodeURIComponent(value)
    return acc
  }, {})
}

function getRefreshCookieOptions(req) {
  const secureOverride = String(config.authCookieSecure || '').trim().toLowerCase()
  const sameSiteOverride = String(config.authCookieSameSite || '').trim().toLowerCase()
  const forwardedProto = String(req?.headers?.['x-forwarded-proto'] || '').trim().toLowerCase()
  const isHttps = req?.secure || forwardedProto === 'https'
  const secure =
    secureOverride === 'true'
      ? true
      : secureOverride === 'false'
        ? false
        : Boolean(isHttps || config.nodeEnv === 'production')

  let sameSite = 'lax'
  if (sameSiteOverride === 'strict' || sameSiteOverride === 'lax' || sameSiteOverride === 'none') {
    sameSite = sameSiteOverride
  } else if (secure) {
    sameSite = 'none'
  }

  return {
    httpOnly: true,
    secure,
    sameSite,
    path: '/',
    maxAge: getRefreshTokenMaxAgeMs(),
  }
}

function setRefreshTokenCookie(res, req, refreshToken) {
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions(req))
}

function clearRefreshTokenCookie(res, req) {
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...getRefreshCookieOptions(req),
    maxAge: undefined,
  })
}

function getRefreshTokenFromRequest(req) {
  const cookies = parseCookies(req)
  return String(cookies[REFRESH_COOKIE_NAME] || '').trim()
}

module.exports = {
  REFRESH_COOKIE_NAME,
  parseCookies,
  getRefreshCookieOptions,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  getRefreshTokenFromRequest,
}
