const webpush = require('web-push')
const config = require('../config/serviceConfig')

const VAPID_PUBLIC_KEY = config.vapidPublicKey
const VAPID_PRIVATE_KEY = config.vapidPrivateKey
const VAPID_SUBJECT = config.vapidSubject

const pushEnabled = Boolean(VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY)

if (pushEnabled) {
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY)
}

function isPushEnabled() {
  return pushEnabled
}

function getVapidPublicKey() {
  return VAPID_PUBLIC_KEY
}

async function sendPushNotification(subscription, payload) {
  if (!pushEnabled) return { skipped: true, reason: 'vapid_not_configured' }
  return webpush.sendNotification(subscription, JSON.stringify(payload), {
    TTL: 45,
    urgency: 'high',
  })
}

module.exports = {
  isPushEnabled,
  getVapidPublicKey,
  sendPushNotification,
}
