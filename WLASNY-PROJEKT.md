# Jak postawić własny Unity Timer

Ta instrukcja jest dla kogoś, kto chce uruchomić **własną, osobną kopię** timera: z własną bazą, własnym
logowaniem przez Discord (dla swojego serwera) i własną stroną. Nic tu nie łączy się z oryginalnym timerem –
to będzie zupełnie niezależny projekt.

Wszystko da się zrobić na darmowych planach. Zajmie to około godziny.

## Co będzie potrzebne

| Usługa | Do czego | Konto |
|---|---|---|
| **GitHub** | kopia kodu, budowanie aplikacji na Androida, (opcjonalnie) strona | darmowe |
| **Firebase** (Google) | baza danych na żywo (pokoje, timery, radio, gry) | darmowe (plan Spark) |
| **Cloudflare Workers** | mały serwer logowania przez Discord | darmowe |
| **Discord Developer Portal** | „aplikacja” Discorda do logowania | darmowe |
| **Netlify** *(opcjonalnie)* | strona zamiast GitHub Pages | darmowe |

Kolejność ma znaczenie, bo kolejne kroki potrzebują adresów z poprzednich:
**1. GitHub → 2. Firebase → 3. Discord → 4. Cloudflare → 5. zmiany w kodzie → 6. strona (GitHub Pages albo Netlify) → 7. aplikacja na Androida → 8. pierwsze uruchomienie.**

Zapisuj sobie po drodze w notatniku: adres bazy, `apiKey`, adres Workera, adres strony, ID serwera Discord.

> **Sekrety.** W trakcie dostaniesz trzy tajne rzeczy: plik klucza serwisowego Firebase (JSON), sekret klienta
> Discorda i hasło do klucza podpisu aplikacji. **Nigdy nie wrzucaj ich do repozytorium** ani nikomu nie wysyłaj –
> trafiają tylko do ustawień Cloudflare i do ukrytych sekretów GitHuba. Wszystko inne (adres bazy, `apiKey`,
> adres Workera) jest jawne z założenia i może być w kodzie.

---

## 1. Kopia repozytorium (GitHub)

1. Zaloguj się na GitHubie i otwórz repozytorium oryginalnego timera.
2. Kliknij **Fork** (prawy górny róg) → **Create fork**. Masz teraz własną kopię `twoj-login/metin-timer`.
   *(Możesz zmienić nazwę repozytorium w Settings → General → Repository name – wtedy zmieni się też adres strony.)*
3. Wejdź w **Settings → Actions → General**:
   - *Actions permissions*: **Allow all actions and reusable workflows**,
   - *Workflow permissions*: **Read and write permissions** → **Save**.
4. W zakładce **Actions** kliknij przycisk, który włącza workflowy w forku (*I understand my workflows, go ahead and enable them*).

Najważniejsze pliki:

| Plik | Co to jest |
|---|---|
| `app/src/main/assets/index.html` | **cała strona** w jednym pliku (HTML + CSS + JavaScript) |
| `app/src/main/assets/version.txt` | numer wersji strony (do automatycznego odświeżania u użytkowników) |
| `app/src/main/assets/icon-192.png` | ikona strony |
| `app/src/main/java/.../MainActivity.java` | aplikacja na Androida (okno, które wczytuje stronę) |
| `app/src/main/res/mipmap-*/ic_launcher.png` | ikona aplikacji |
| `database.rules.discord.json` | **reguły bazy** – wklejasz je do Firebase |
| `discord-worker/worker.js` | serwer logowania przez Discord – wklejasz go do Cloudflare |
| `.github/workflows/build.yml` | automatyczne budowanie .apk i strony po każdej zmianie |

---

## 2. Baza danych (Firebase)

### 2.1 Projekt i baza
1. Wejdź na **https://console.firebase.google.com** → **Utwórz projekt** (Create project).
   Nazwa dowolna, Google Analytics możesz wyłączyć.
2. W menu po lewej: **Kompilacja (Build) → Realtime Database → Utwórz bazę danych**.
   - Lokalizacja: najlepiej **Belgia (europe-west1)** dla graczy z Europy.
   - Tryb: **zablokowany** (locked mode) – i tak za chwilę wkleisz własne reguły.
3. Skopiuj adres bazy z góry zakładki *Dane*, np.
   `https://twoj-projekt-default-rtdb.europe-west1.firebasedatabase.app` → **to jest `DB_URL`**.

### 2.2 Reguły
1. Realtime Database → zakładka **Reguły**.
2. Usuń wszystko i wklej całą zawartość pliku **`database.rules.discord.json`** z repozytorium → **Opublikuj**.

Reguły wpuszczają do bazy tylko osoby zalogowane przez Twój serwer logowania (czyli tylko członków Twojego
serwera Discord) i pilnują, żeby zapisywane dane miały właściwy kształt.

### 2.3 Logowanie (Authentication)
1. **Kompilacja → Authentication → Rozpocznij** (Get started).
   Nie musisz włączać żadnego dostawcy (Google, e-mail itd.) – timer loguje „biletem” od Twojego Workera,
   a do tego wystarczy, że Authentication jest włączone.

### 2.4 Klucz `apiKey` (aplikacja internetowa)
1. Ikona zębatki obok *Przegląd projektu* → **Ustawienia projektu** → zakładka **Ogólne**.
2. Na dole *Twoje aplikacje* → ikona **`</>`** (Web) → nazwa dowolna → **Zarejestruj aplikację**
   (Firebase Hosting **nie** zaznaczaj).
3. Z pokazanego kodu skopiuj tylko wartość **`apiKey`** (zaczyna się od `AIza…`) → **to jest `apiKey`**.

### 2.5 Klucz serwisowy (TAJNY)
1. **Ustawienia projektu → Konta usługi** (Service accounts) → **Wygeneruj nowy klucz prywatny** → pobierze się plik JSON.
2. Z tego pliku będą potrzebne dwie wartości: `client_email` i `private_key`. Wkleisz je w kroku 4.
3. **Trzymaj ten plik w bezpiecznym miejscu i nigdzie go nie wrzucaj.** Kto go ma, ma pełny dostęp do Twojego projektu.

---

## 3. Aplikacja Discorda

1. Wejdź na **https://discord.com/developers/applications** → **New Application** → nazwa (np. „Mój Timer”) → **Create**.
2. Zakładka **OAuth2**:
   - skopiuj **Client ID** → `DISCORD_CLIENT_ID`,
   - kliknij **Reset Secret** i skopiuj **Client Secret** → `DISCORD_CLIENT_SECRET` (**tajne**),
   - w sekcji **Redirects** dodaj adres – uzupełnisz go dokładnie po kroku 4.1, będzie wyglądał tak:
     `https://NAZWA-WORKERA.TWOJ-LOGIN.workers.dev/callback` → **Save Changes**.
3. **ID Twojego serwera Discord:** w Discordzie *Ustawienia użytkownika → Zaawansowane → Tryb dewelopera* (włącz),
   potem prawy klik na ikonę serwera → **Kopiuj ID serwera** → `GUILD_ID`.

Do timera wejdą tylko osoby, które są członkami tego serwera.

---

## 4. Serwer logowania (Cloudflare Worker)

### 4.1 Utworzenie Workera
1. Załóż konto na **https://dash.cloudflare.com** (wystarczy darmowe).
2. **Compute (Workers) → Workers & Pages → Create → Create Worker** (szablon *Hello World*) →
   nazwa, np. `moj-timer-auth` → **Deploy**.
3. Adres Workera, np. `https://moj-timer-auth.twoj-login.workers.dev` → **to jest adres Workera**.
   Wróć teraz do Discorda (krok 3.2) i dodaj Redirect: ten adres + `/callback`.
4. Kliknij **Edit code**, usuń przykładowy kod, wklej całą zawartość pliku **`discord-worker/worker.js`** → **Deploy**.

### 4.2 Zmienne i sekrety
Worker → **Settings → Variables and Secrets → Add**. Dodaj 7 pozycji (typ *Text* albo *Secret* jak w tabeli):

| Nazwa | Typ | Wartość |
|---|---|---|
| `DISCORD_CLIENT_ID` | Text | Client ID z kroku 3 |
| `DISCORD_CLIENT_SECRET` | **Secret** | Client Secret z kroku 3 |
| `GUILD_ID` | Text | ID serwera Discord |
| `SITE_URL` | Text | adres Twojej strony **z ukośnikiem na końcu**, np. `https://twoj-login.github.io/metin-timer/` albo `https://moj-timer.netlify.app/` (patrz krok 6) |
| `DB_URL` | Text | adres bazy z kroku 2.1 (bez ukośnika na końcu) |
| `FB_CLIENT_EMAIL` | **Secret** | `client_email` z pliku JSON (krok 2.5) |
| `FB_PRIVATE_KEY` | **Secret** | `private_key` z pliku JSON – cały tekst od `-----BEGIN PRIVATE KEY-----` do `-----END PRIVATE KEY-----` (z `\n` w środku tak jak w pliku – Worker sam je zamieni) |

Zapisz (**Deploy**). Jeśli później zmienisz adres strony, zmień tylko `SITE_URL`.

Sprawdzenie: otwórz adres Workera w przeglądarce – powinien pokazać krótką stronę „To jest serwer logowania…”.

---

## 5. Zmiany w kodzie strony

Otwórz w swoim repozytorium plik **`app/src/main/assets/index.html`** (na GitHubie: kliknij plik → ikona ołówka).
Plik jest duży – użyj wyszukiwania (Ctrl+F) i podmień te linie:

```js
const RELEASE_API = "https://api.github.com/repos/TWOJ-LOGIN/NAZWA-REPO/releases/latest";
const APK_URL = "https://github.com/TWOJ-LOGIN/NAZWA-REPO/releases/latest/download/UnityTimer.apk";
const DB_URL = "https://twoj-projekt-default-rtdb.europe-west1.firebasedatabase.app";
const DISCORD = {worker: "https://moj-timer-auth.twoj-login.workers.dev", apiKey: "AIza...twoj-klucz..."};
```

Opcjonalnie w tym samym pliku:
- **nazwa na stronie:** wyszukaj `Unity Timer` (tytuł karty jest w `<title>`, nagłówek – w znaczniku `class="brand"`),
- **godzina codziennego zerowania liczników:** `const RESET_HOUR = 1, RESET_TZ = "Europe/Warsaw";`,
- **mapy i domyślne czasy respu:** tablica `const BASE_MAPS = [ ... ]`,
- **ikona strony:** podmień `app/src/main/assets/icon-192.png` (kwadrat 192×192 px, PNG, może mieć przezroczystość).

**Numer wersji – ważne przy każdej zmianie strony.** Strona sama się odświeża u wszystkich, gdy wykryje nowszą
wersję. Działa to tak: w `index.html` jest linia `const BUILD = "1794179227";`, a w `version.txt` ten sam numer.
Po każdej zmianie w `index.html` **zwiększ ten numer w obu miejscach na taki sam** (najprościej wpisać aktualny czas
w sekundach, np. z https://www.unixtimestamp.com). Jeśli zapomnisz, nic się nie zepsuje – po prostu otwarte
karty nie odświeżą się same.

Zapisz zmiany (**Commit changes**).

---

## 6. Strona – wybierz JEDNĄ z dwóch wersji

### Wersja A: GitHub Pages (najprościej, wszystko w jednym miejscu)

Workflow `.github/workflows/build.yml` po każdej zmianie sam publikuje folder `app/src/main/assets` na gałąź `gh-pages`.

1. Poczekaj, aż w zakładce **Actions** pierwszy przebieg skończy się na zielono
   (najpierw zrób krok 7.1 – bez klucza podpisu workflow zatrzyma się na błędzie i strona się nie opublikuje).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: `gh-pages` / `/ (root)` → Save.**
3. Po 1–2 minutach strona działa pod adresem `https://twoj-login.github.io/nazwa-repo/`.
4. Upewnij się, że dokładnie ten adres (z `/` na końcu) jest w `SITE_URL` w Cloudflare.

> Repozytorium musi być publiczne – darmowe konto GitHub nie publikuje stron z prywatnych repozytoriów.

### Wersja B: Netlify

Strona to zwykłe pliki (bez budowania), więc Netlify tylko je serwuje. Są dwa sposoby:

**B1 – połączenie z GitHubem (polecane: każda zmiana w repo sama trafia na stronę)**
1. Załóż konto na **https://app.netlify.com** (najwygodniej przez *Sign up with GitHub*).
2. **Add new site → Import an existing project → GitHub** → wybierz swoje repozytorium.
3. Ustawienia budowania:
   - *Branch to deploy*: `main`,
   - *Base directory*: **puste**,
   - *Build command*: **puste**,
   - *Publish directory*: **`app/src/main/assets`**
   → **Deploy**.
4. Strona dostanie adres w stylu `https://losowa-nazwa-123.netlify.app`. Zmień go w
   **Site configuration → Change site name** (np. `moj-timer` → `https://moj-timer.netlify.app`).

**B2 – bez GitHuba (ręcznie, „przeciągnij i upuść”)**
1. Pobierz z repozytorium folder `app/src/main/assets` (pliki `index.html`, `version.txt`, `icon-192.png`).
2. Wejdź na **https://app.netlify.com/drop** i przeciągnij ten folder na stronę.
3. Przy każdej zmianie przeciągasz folder jeszcze raz (w zakładce *Deploys* swojej strony).

**Po wybraniu Netlify:**
- wpisz adres Netlify (z `/` na końcu, np. `https://moj-timer.netlify.app/`) w `SITE_URL` w Cloudflare,
- wpisz ten sam adres w aplikacji na Androida (krok 7.2),
- publikowanie na GitHub Pages możesz zostawić (nie przeszkadza) albo usunąć z `build.yml` ostatni krok
  *„Strona (GitHub Pages)”*.

---

## 7. Aplikacja na Androida

Aplikacja to okno, które wczytuje Twoją stronę z internetu. Buduje się sama na GitHubie po każdej zmianie
i pojawia w zakładce **Releases** jako `UnityTimer.apk`.

### 7.1 Klucz podpisu (jednorazowo, TAJNY)
Android instaluje tylko podpisane aplikacje, a aktualizacje muszą mieć **ten sam** podpis – dlatego klucz robisz
raz i trzymasz go na zawsze.

1. Na komputerze z zainstalowaną Javą (np. z Android Studio) uruchom w terminalu:
   ```
   keytool -genkeypair -v -keystore release.jks -alias metin -keyalg RSA -keysize 2048 -validity 10000
   ```
   Podaj hasło (zapamiętaj je!), resztę pytań możesz przeklikać. Alias musi zostać **`metin`**
   (albo zmień `keyAlias` w `app/build.gradle`). Hasło do klucza = hasło do magazynu (Enter, gdy zapyta o osobne).
2. Zamień plik na tekst base64:
   - Windows (PowerShell): `[Convert]::ToBase64String([IO.File]::ReadAllBytes("release.jks")) | Set-Clipboard`
   - Linux/macOS: `base64 -w0 release.jks` (na macOS: `base64 -i release.jks`)
3. GitHub → repozytorium → **Settings → Secrets and variables → Actions → New repository secret**:
   - `KEYSTORE_BASE64` = ten długi tekst,
   - `KEYSTORE_PASSWORD` = hasło z punktu 1.
4. Plik `release.jks` schowaj w bezpiecznym miejscu (bez niego nie wydasz aktualizacji, które zainstalują się
   na starą wersję). **Nie wrzucaj go do repozytorium.**

### 7.2 Adres strony i nazwa aplikacji
1. `app/src/main/java/pl/metintimer/app/MainActivity.java` – podmień adres:
   ```java
   static final String SITE = "https://twoj-login.github.io/nazwa-repo/";
   ```
   (albo adres Netlify). **Ukośnik na końcu jest ważny** – linki spoza tego adresu aplikacja otwiera w przeglądarce.
2. `app/build.gradle` – zmień identyfikator, żeby Twoja aplikacja nie kolidowała z oryginalną na tym samym telefonie:
   ```
   applicationId 'pl.twojanazwa.timer'
   ```
3. `app/src/main/AndroidManifest.xml` – nazwa pod ikoną: `android:label="Mój Timer"`.
4. Ikona: podmień pliki `app/src/main/res/mipmap-*/ic_launcher.png`
   (rozmiary: mdpi 48, hdpi 72, xhdpi 96, xxhdpi 144, xxxhdpi 192 px).
5. Zapisz zmiany. W **Actions** zbuduje się nowa wersja, a w **Releases** pojawi się `UnityTimer.apk`.

Instalacja na telefonie: pobierz `.apk` → otwórz → zgódź się na instalację z nieznanego źródła → Zainstaluj.

*(Radio i Watch2Gether są celowo wyłączone w aplikacji – działają na stronie, także w przeglądarce na telefonie.)*

---

## 8. Pierwsze uruchomienie i ustawienie admina

1. Otwórz swoją stronę → **Zaloguj przez Discord** → zatwierdź na Discordzie.
   Jeśli zobaczysz „Brak dostępu”, sprawdź `GUILD_ID` i czy jesteś na tym serwerze.
2. Po zalogowaniu wpisz nazwę pokoju i kliknij **Połącz** – nowy pokój tworzy się sam, a jego twórca ustawia hasło do pokoju.
3. **Twój identyfikator:** **Menu → Wspólny pokój → Twoje konto** – napis *„Twój identyfikator: d123456789…”*. Skopiuj go.
4. Firebase → Realtime Database → zakładka **Dane** – dodaj dwa wpisy (przycisk **+** przy głównym węźle):
   - **hasło admina:** węzeł `admin` → w nim `secret` = `"TwojeHasloAdmina"` (tekst, w cudzysłowie),
   - **właściciel (Ty):** węzeł `adminuids` → w nim nazwa = Twój identyfikator (np. `d123456789…`), wartość = `true`
     (bez cudzysłowu – to ma być prawda/fałsz, nie tekst).
5. Odśwież stronę – obok **Menu** pojawi się przycisk **⚙ Admin**. Wejście wymaga hasła admina z punktu 4
   (pamiętane 48 h na danym urządzeniu).
6. W panelu admina możesz m.in. ustawić liczbę kanałów, przesunięcie zegara względem gry, dodawać kolejnych adminów
   (osoby, które choć raz się zalogowały), zarządzać pokojami i banami.

Gotowe. 🎉

---

## Rozwiązywanie problemów

| Objaw | Co sprawdzić |
|---|---|
| Po kliknięciu „Zaloguj przez Discord” błąd *redirect_uri* | Redirect w Discordzie musi być dokładnie `adres-workera/callback` |
| Wraca na stronę, ale dalej każe się logować | `SITE_URL` w Cloudflare = dokładny adres strony z `/`; `apiKey` w `index.html`; Authentication włączone (2.3) |
| „Błąd logowania” na stronie Workera | `FB_CLIENT_EMAIL` / `FB_PRIVATE_KEY` (cały klucz), `DB_URL` |
| Zalogowany, ale „Nie zapisano” / nic się nie wczytuje | reguły z `database.rules.discord.json` wklejone i opublikowane; `DB_URL` w `index.html` |
| Nie ma przycisku ⚙ Admin | `adminuids/<identyfikator>` musi mieć wartość `true` (boolean), nie tekst `"true"` |
| Workflow w Actions na czerwono przy „Klucz podpisu” | brak sekretów `KEYSTORE_BASE64` / `KEYSTORE_PASSWORD` (krok 7.1) |
| Strona GitHub Pages pokazuje 404 | Settings → Pages → gałąź `gh-pages`; poczekaj 1–2 min po zielonym przebiegu |
| Aplikacja otwiera stronę w przeglądarce zamiast w sobie | `SITE` w `MainActivity.java` musi być dokładnie adresem strony z `/` na końcu |
| Ktoś został wyrzucony z Discorda, a dalej wchodzi | logowanie jest ważne 7 dni – zbanuj go w panelu admina albo użyj „Wyloguj wszystkich” |

## Limity darmowych planów (w skrócie)

- **Firebase Spark:** 1 GB danych w bazie, 10 GB pobierania na miesiąc, 100 połączeń naraz.
  Dla grupy ok. 20 osób to wystarcza. Zużycie: Realtime Database → zakładka *Użycie*.
  Po przekroczeniu baza nie nalicza opłat, tylko przestaje działać do nowego miesiąca.
- **Cloudflare Workers:** 100 000 zapytań dziennie – logowanie zużywa 2–3 zapytania na osobę.
- **GitHub / Netlify:** strona to kilka plików, ruch jest znikomy.
- **Kopie zapasowe:** darmowy Firebase ich nie robi. Co jakiś czas: Realtime Database → ⋮ → **Eksportuj JSON**.

Muzyka i filmy w radiu (YouTube, Twitch, Vimeo, SoundCloud, TikTok) lecą prosto z tych serwisów do przeglądarek –
nie obciążają bazy.
