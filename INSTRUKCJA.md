# Unity Timer – instrukcja

Paczka zawiera:
- `app/src/main/assets/index.html` – cała strona (ten sam plik możesz wrzucić na Netlify),
- projekt Android Studio, który pakuje stronę w aplikację .apk.

## 1. Baza do wspólnego pokoju

Baza jest już założona i wpisana w aplikację:
`https://timermetin-default-rtdb.europe-west1.firebasedatabase.app`

Wszyscy korzystają z tej jednej bazy; każdy pokój to osobne miejsce w niej.
Użytkownik wpisuje tylko nazwę pokoju: **Menu → Wspólny pokój**.

### Reguły bazy (wklej raz)

Firebase Console → Realtime Database → **Reguły** → wklej zawartość pliku
`database.rules.json` (jest w tym folderze) → **Opublikuj**.

Reguły:
- pozwalają czytać i zapisywać pokój tylko gdy zna się jego nazwę (nie da się wylistować pokoi),
- przyjmują tylko dane timera (respy, czasy, liczniki) w rozsądnym rozmiarze,
- pozwalają na zapis czasu serwera (`clock`), żeby liczniki były zgrane u wszystkich.

### Hasło admina (liczba kanałów)

1. Firebase Console → Realtime Database → zakładka **Dane**.
2. Najedź na główny węzeł (adres bazy) → **+**.
3. Nazwa: `admin`, potem w nim **+** → nazwa `secret`, wartość: twoje hasło (w cudzysłowie, np. `"MojeHaslo123"`). **Dodaj**.

W aplikacji: stuknij 5 razy szybko w napis **METIN TIMER** u góry → Panel admina →
wpisz hasło, wybierz liczbę kanałów (1–10) → Zapisz. Zmiana trafia do wszystkich
(sprawdzają ją przy starcie i co minutę). Hasła nie da się odczytać z bazy.

Darmowy plan Firebase obsługuje do 100 połączeń naraz (jedno otwarte okno/aplikacja = jedno połączenie).

## 2. Strona i aplikacja (GitHub)

Wszystko buduje się samo po każdej zmianie w tym repozytorium:

- **Strona:** https://wronglogin.github.io/metin-timer/
- **Aplikacja (.apk):** https://github.com/wronglogin/metin-timer/releases/latest/download/UnityTimer.apk

Aplikacja wczytuje stronę z internetu, więc zmiany na stronie widać w aplikacji od razu,
bez instalowania nowej wersji. Bez internetu przy starcie otwiera kopię zapisaną w aplikacji.

Instalacja na telefonie: pobierz plik .apk → otwórz go → zgódź się na instalację
z nieznanego źródła (przeglądarki/menedżera plików) → Zainstaluj.

Postęp budowania: zakładka **Actions** w repozytorium.

## Jak działa timer

- Każda mapa ma swoją zakładkę; liczba na zakładce pokazuje linie, a zielona plakietka – ile metinów **stoi**.
- Stuknij linię, gdy zbijesz metina/bossa. Kolory:
  - **niebieski** – czeka do najkrótszego czasu respa,
  - **żółty** – okno respa, odlicza do najdłuższego czasu,
  - **zielony** – stoi; licznik pokazuje, ile minęło od końca okna.
- Alarm dźwiękowy przy wejściu w okno i podwójny, gdy metin już stoi (Menu → Dźwięk).
- **↶ / ↷** – cofnij i ponów (także Ctrl+Z / Ctrl+Y). Działa na zbicia, zerowania, edycje, usuwanie, import i reset.
- **Zeruj** – zatrzymuje licznik jednej linii. **Edytuj** – nazwa, rodzaj, czasy respa, kolor, usunięcie.
- **Menu → Eksportuj respy / Importuj respy** – przenoszenie układu respów. **Globalny reset** – zeruje wszystkie liczniki.
