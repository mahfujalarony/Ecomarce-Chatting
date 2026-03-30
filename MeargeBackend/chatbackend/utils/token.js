const jwt = require('jsonwebtoken')
const config = require('../config/serviceConfig')

const ACCESS_TOKEN_EXPIRES_IN = config.accessTokenExpiresIn
const REFRESH_TOKEN_EXPIRES_IN = config.refreshTokenExpiresIn
const ACCESS_TOKEN_SECRET = config.accessTokenSecret
const REFRESH_TOKEN_SECRET = config.refreshTokenSecret || ACCESS_TOKEN_SECRET

function parseDurationMs(value, fallbackMs) {
  const raw = String(value || '').trim().toLowerCase()
  if (!raw) return fallbackMs

  const exactMs = Number(raw)
  if (Number.isFinite(exactMs) && exactMs > 0) return exactMs

  const match = raw.match(/^(\d+)\s*(ms|s|m|h|d)$/)
  if (!match) return fallbackMs

  const amount = Number(match[1])
  const unit = match[2]
  const multipliers = {
    ms: 1,
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  }
  return amount * (multipliers[unit] || 1)
}

function signAccessToken(userId) {
  return jwt.sign({ userId, type: 'access' }, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  })
}

function signRefreshToken(userId) {
  return jwt.sign({ userId, type: 'refresh' }, REFRESH_TOKEN_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  })
}

function verifyAccessToken(token) {
  const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET)
  if (decoded?.type && decoded.type !== 'access') {
    throw new Error('Invalid access token')
  }
  return decoded
}

function verifyRefreshToken(token) {
  const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET)
  if (decoded?.type !== 'refresh') {
    throw new Error('Invalid refresh token')
  }
  return decoded
}

function getRefreshTokenMaxAgeMs() {
  return parseDurationMs(REFRESH_TOKEN_EXPIRES_IN, 30 * 24 * 60 * 60 * 1000)
}

module.exports = {
  signToken: signAccessToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshTokenMaxAgeMs,
}
