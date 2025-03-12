self.addEventListener("push", (event: Event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || "알림"
  const options = {
    body: data.body || "기본 알림 내용",
    icon: data.icon || "/icon.png",
    badge: data.badge || "/badge.png",
  }

  // self.registration이 정상적으로 인식됨
  event.waitUntil(self.registration.showNotification(title, options))
})
