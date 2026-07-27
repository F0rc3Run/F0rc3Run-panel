## <p align="center">🛡️ | ForceRun-Panel</h1>
<p align="center">
  <strong>Free VPN subscription links for unrestricted internet access</strong><br>
  VLESS, VMess, Trojan and Shadowsocks configs, tested and refreshed automatically every 6 hours.
</p>

<p align="center">
  <a href="https://f0rc3run.github.io/F0rc3Run-panel" target="_blank">🌐 Web Panel</a> •
  <a href="https://t.me/F0rc3Runbot" target="_blank">🤖 Telegram Bot</a> •
  <a href="https://t.me/ForceRunVPN" target="_blank">📢 Telegram Channel</a> •
  <a href="https://github.com/F0rc3Run/F0rc3Run" target="_blank">⭐ GitHub</a>
</p>

---

## 🌍 What is ForceRun-Panel?

ForceRun-Panel is a free VPN subscription service built for people in countries with heavy internet censorship. Instead of static links anyone can scrape, access is verified through a Telegram bot: you get a personal token, log into the web panel with it, pick the servers you want, and get a subscription link your V2Ray or Clash app can import directly.

---

## 🚀 How to get a subscription link

1. Open the bot: **[@F0rc3Runbot](https://t.me/F0rc3Runbot)** and send `/start`
2. Tap **🔑 Get Token** (you'll be asked to join **[@ForceRunVPN](https://t.me/ForceRunVPN)** if you haven't already)
3. Copy the token the bot sends you
4. Open the **[web panel](https://f0rc3run.github.io/F0rc3Run-panel)** and paste it in
5. Filter by protocol, country, port and format (Clash or V2Ray) — a live count shows how many servers match
6. Tap **Get subscription link** and import it into your app

⚠️ You can generate a subscription link only **once per token** — choose your filters carefully. The link then keeps itself up to date automatically as servers refresh every 6 hours, so you never need to generate a new one until the token expires.

---

## ✅ Features

- 🎯 Servers tested and refreshed every 6 hours via GitHub Actions
- 🔐 Protocols: VLESS, VMess, Trojan, Shadowsocks
- 🛡️ **FORCE SHIELD** filter — show only servers that passed full verification
- 📋 Export as Clash (YAML) or V2Ray/Nekoray (base64) subscription
- 🔄 Subscription links stay live — they reflect the newest tested servers automatically, no regeneration needed
- 🚫 Access is tied to your Telegram membership — leaving the required channel/group instantly revokes your token and subscription
- 🆓 100% free

---

## 📱 Recommended apps

The bot's **📱 Recommended Apps** menu links straight to official downloads, picked per platform:

| Platform | Apps |
|---|---|
| Android | [NekoBox](https://github.com/MatsuriDayo/NekoBoxForAndroid/releases), [Karing](https://karing.app/en/download), [Clash Meta for Android](https://github.com/MetaCubeX/ClashMetaForAndroid/releases) |
| iOS | [Karing](https://apps.apple.com/us/app/karing/id6472431552) |
| Windows / macOS / Linux | [Clash Verge Rev](https://github.com/clash-verge-rev/clash-verge-rev/releases), [Karing](https://karing.app/en/download) |

---

## 🛠️ How it's built

```
Go proxy tester  →  GitHub Actions (every 6h)  →  Cloudflare
                                                          │
                                                          ▼
                                      Cloudflare Worker
                                                          │
                                                          ▼
                                              Web panel (login, filters, link)
```

The testing script goes through several stages for every candidate server:

1. **Connect** — a real connection is opened through the proxy itself (not just a ping), so what gets tested is exactly what your app would experience.
2. **Alive check** — confirms the proxy actually passes traffic.
3. **Security checks** — TLS handshake, HTTPS behavior, certificate validity, and an IP/DNS leak test to make sure the proxy doesn't expose your real IP.
4. **Status classification**, based on how many of those checks pass:
   - **✅ VERIFIED** — passes every security check.
   - **⚠️ WARNING** — passes most checks, one or two minor issues.
   - **🚫 RISKY** — fails the leak test, has an invalid certificate, or fails most checks — still listed, just clearly flagged.
5. **Speed test** — only **VERIFIED** servers get a real download-speed measurement, which is also why the FORCE SHIELD filter (VERIFIED-only) tends to show fewer but faster and safer servers.
6. **Location & tagging** — country and ASN are resolved and baked directly into each server's label.

In the panel, servers are split by **protocol** (VLESS/VMess/Trojan/Shadowsocks), **country**, **port**, and **export format** (Clash or V2Ray) — plus the FORCE SHIELD toggle to show VERIFIED-only servers. All of this comes straight from the tags the script itself generates, so what you see in the panel is exactly what was tested.

---

## 📜 License

Licensed under the **FFAL – Free For All License**
🔗 [View License](https://raw.githubusercontent.com/F0rc3Run/F0rc3Run/refs/heads/main/LICENSE)

---
