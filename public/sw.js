self.addEventListener("push", function (event) {
  const data = event.data ? event.data.json() : {};

  self.registration.showNotification(data.title || "PawSignal Alert 🐾", {
    body: data.body || "A pet was reported nearby",
    icon: "/icon.png",
    badge: "/icon.png",
  });
});
