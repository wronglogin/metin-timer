/* Metin Timer – Discord login (Cloudflare Worker)

   /login?state=…[&app=1]  → sends you to Discord to approve the login
   /callback               → Discord sends you back here; the Worker checks that you are a member of our
                             Discord server and, if so, makes a Firebase sign-in ticket (a "custom token")
                             with your server nick in it.
       browser: redirects to the site with the ticket in the address fragment (#dct=…&dst=…)
       app:     leaves the ticket at authpending/<state> in the database; the app picks it up

   Settings (Cloudflare → the Worker → Settings → Variables and Secrets):
     DISCORD_CLIENT_ID      text    Discord Developer Portal → your application → OAuth2 → Client ID
     DISCORD_CLIENT_SECRET  secret  same page → Client Secret
     GUILD_ID               text    your Discord server ID (Developer Mode → right-click the server → Copy Server ID)
     SITE_URL               text    https://wronglogin.github.io/metin-timer/
     DB_URL                 text    https://timermetin-default-rtdb.europe-west1.firebasedatabase.app
     FB_CLIENT_EMAIL        secret  "client_email" from the Firebase service account key (JSON file)
     FB_PRIVATE_KEY         secret  "private_key" from the same file (the whole -----BEGIN PRIVATE KEY----- … text)
*/
const STATE = /^[A-Za-z0-9_-]{16,64}$/;

export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    try {
      if (url.pathname === "/login") return login(url, env);
      if (url.pathname === "/callback") return await callback(url, env);
      return page("Metin Timer", "To jest serwer logowania Metin Timera.", env);
    } catch (e) {
      return page("Błąd logowania", "Coś poszło nie tak: " + esc(e.message || String(e)), env, 500);
    }
  },
};

function login(url, env) {
  const st = url.searchParams.get("state") || "", app = url.searchParams.get("app") === "1";
  if (!STATE.test(st)) return page("Błąd logowania", "Zły link logowania. Wróć na stronę i kliknij „Zaloguj przez Discord” jeszcze raz.", env, 400);
  const q = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID, redirect_uri: url.origin + "/callback", response_type: "code",
    scope: "identify guilds.members.read", state: (app ? "a" : "w") + st, prompt: "none",
  });
  return Response.redirect("https://discord.com/oauth2/authorize?" + q, 302);
}

async function callback(url, env) {
  const code = url.searchParams.get("code"), state = url.searchParams.get("state") || "";
  const mode = state[0], st = state.slice(1);
  if (!code || !"aw".includes(mode) || !STATE.test(st)) return page("Logowanie przerwane", "Nie udało się zalogować (anulowano albo zły link). Wróć na stronę i spróbuj jeszcze raz.", env, 400);
  // 1. trade Discord's one-time code for an access token
  const tr = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST", headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: new URLSearchParams({client_id: env.DISCORD_CLIENT_ID, client_secret: env.DISCORD_CLIENT_SECRET, grant_type: "authorization_code", code, redirect_uri: url.origin + "/callback"}),
  });
  const tok = await tr.json().catch(() => ({}));
  if (!tok.access_token) return page("Błąd logowania", "Discord nie potwierdził logowania. Spróbuj jeszcze raz.", env, 400);
  // 2. are you on our server? (404 = not a member)
  const mr = await fetch(`https://discord.com/api/users/@me/guilds/${env.GUILD_ID}/member`, {headers: {Authorization: "Bearer " + tok.access_token}});
  if (mr.status === 404) return page("Brak dostępu", "Nie jesteś na naszym serwerze Discord, więc nie możesz wejść do timera. Poproś kogoś z gildii o zaproszenie.", env, 403);
  if (!mr.ok) return page("Błąd logowania", "Discord nie odpowiedział (" + mr.status + "). Spróbuj za chwilę.", env, 502);
  const m = await mr.json(), u = m.user || {};
  const name = String(m.nick || u.global_name || u.username || "Discord").replace(/[\u0000-\u001f]/g, "").trim().slice(0, 20) || "Discord";
  // 3. a Firebase sign-in ticket for this Discord account
  const ct = await customToken(env, "d" + u.id, {dn: name});
  if (mode === "a") {
    const r = await fetch(`${env.DB_URL}/authpending/${st}.json`, {method: "PUT", body: JSON.stringify({ct, at: {".sv": "timestamp"}})});
    if (!r.ok) return page("Błąd logowania", "Nie udało się przekazać logowania do aplikacji (" + r.status + ").", env, 500);
    return page("Zalogowano", `Cześć <b>${esc(name)}</b>! Możesz zamknąć tę kartę i wrócić do aplikacji Metin Timer.`, env);
  }
  return Response.redirect(`${env.SITE_URL}#dct=${encodeURIComponent(ct)}&dst=${st}`, 302);
}

// Firebase custom token: a JWT signed with the service account's private key (RS256), valid for an hour
async function customToken(env, uid, claims) {
  const pem = String(env.FB_PRIVATE_KEY).replace(/\\n/g, "\n");
  const der = Uint8Array.from(atob(pem.replace(/-----[^-]+-----/g, "").replace(/\s+/g, "")), c => c.charCodeAt(0));
  const key = await crypto.subtle.importKey("pkcs8", der, {name: "RSASSA-PKCS1-v1_5", hash: "SHA-256"}, false, ["sign"]);
  const now = Math.floor(Date.now() / 1000);
  const part = o => b64url(new TextEncoder().encode(JSON.stringify(o)));
  const head = part({alg: "RS256", typ: "JWT"});
  const body = part({
    iss: env.FB_CLIENT_EMAIL, sub: env.FB_CLIENT_EMAIL,
    aud: "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
    iat: now, exp: now + 3600, uid, claims,
  });
  const sig = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", key, new TextEncoder().encode(head + "." + body));
  return head + "." + body + "." + b64url(new Uint8Array(sig));
}
function b64url(bytes) {
  let s = ""; for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"}[c]));
function page(title, text, env, status = 200) {
  const back = env && env.SITE_URL ? `<p><a href="${esc(env.SITE_URL)}">Wróć do Metin Timera</a></p>` : "";
  return new Response(`<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><style>body{font:16px system-ui,sans-serif;background:#0f1417;color:#e8ecef;display:grid;place-items:center;min-height:100vh;margin:0;padding:16px}
main{max-width:420px;background:#182026;border:1px solid #2a343c;border-radius:12px;padding:20px 22px}h1{font-size:20px;margin:0 0 10px}a{color:#e0a96d}</style></head>
<body><main><h1>${esc(title)}</h1><p>${text}</p>${back}</main></body></html>`, {status, headers: {"Content-Type": "text/html; charset=utf-8"}});
}
