// self.addEventListener("push", (event) => {
//   const data = event.data ? event.data.json() : {}
//   const title = data.title || "알림"
//   const options = {
//     body: data.body || "기본 알림 내용",
//     icon: data.icon || "/icon.png",
//     badge: data.badge || "/badge.png",
//   }

//   event.waitUntil(self.registration.showNotification(title, options))
// })
