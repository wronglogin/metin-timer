# Unity Timer – instrukcja

Timer respawnu metinów i bossów w Metin2 dla naszej gildii: wspólne pokoje na żywo, kanały CH1–CH10,
cofanie i ponawianie, Wiki, radio z Watch2Gether i gry.

- **Strona:** https://wronglogin.github.io/metin-timer/
- **Aplikacja na Androida:** [UnityTimer.apk](https://github.com/wronglogin/metin-timer/releases/latest/download/UnityTimer.apk)

> Chcesz postawić własny, osobny timer (własna baza, własny serwer Discord, GitHub Pages albo Netlify)?
> Zobacz [WLASNY-PROJEKT.md](WLASNY-PROJEKT.md).

---

## 1. Wejście

1. Otwórz stronę albo aplikację → **Zaloguj przez Discord** → zatwierdź na Discordzie.
   Wejść mogą tylko osoby z naszego serwera Discord. Nick w timerze = Twój nick z serwera.
2. Wpisz **nazwę pokoju** i kliknij **Połącz**.
   - Jeśli pokój już istnieje i ma hasło – podasz je raz, potem timer Cię pamięta.
   - Jeśli pokoju jeszcze nie ma – zakładasz go i ustawiasz mu hasło, które podasz reszcie.
3. Logowanie jest ważne 7 dni, potem timer poprosi o nie jeszcze raz.

Pokój zmienisz albo opuścisz w **Menu → Wspólny pokój**. Tam jest też **Twoje konto** (nick i Twój identyfikator).

## 2. Timer

- Każda mapa ma swoją zakładkę. Każdy resp ma kanały **CH1…CH10** (liczbę kanałów ustawia admin).
- **Stuknij kanał, gdy zbijesz metina/bossa** – zaczyna się odliczanie. Kolory:
  - **zielony** – nie zaznaczony (nikt nie zbijał),
  - **czerwony** – odlicza do respu,
  - **żółty** – ostatnie 4 minuty,
  - **niebieski** – na minusie (resp już powinien stać; licznik pokazuje, ile minęło).
  - **fioletowy** (opcjonalny, włączasz w Menu → „Fioletowe timery”) – licznik jest na minusie dłużej niż różnica max i min respu mapy z Wiki (np. Czerwony Las: od -12), więc metin raczej już stoi. Jeśli nikt nie kliknie, timer zmienia się dalej na zmianę: tyle samo minut fioletowy, potem czas timera mapy niebieski.
- Pole **min** przy respie to czas odliczania w minutach (domyślnie minutę krócej niż resp z Wiki,
  żeby być na miejscu przed respem).
- **↶ / ↷** – cofnij i ponów (przy respie albo na górze dla całego pokoju; także Ctrl+Z / Ctrl+Y).
- **Wszystkie liczniki zerują się codziennie o 01:00** (czas polski).
- Zegar pod tytułem pokazuje zawsze **czas polski**, zsynchronizowany z serwerem – nie zależy od zegara w telefonie.
- Wszystko, co zmienisz, widzą od razu wszyscy w pokoju. Jeśli zapis się nie uda (np. brak internetu),
  zobaczysz komunikat **„Nie zapisano – sprawdź internet, odśwież stronę i kliknij jeszcze raz.”**,
  a timer wróci do stanu, który widzą wszyscy.

### Custom mapy
Na końcu paska map jest **+ Custom Mapa** – mapa dla całego pokoju. Podajesz nazwę i (opcjonalnie) resp minimalny
i maksymalny metinów i bossów. Czasy możesz uzupełnić później przyciskiem **Edytuj mapę**.

### Wiki
Przycisk **Wiki** na górze: czasy respu na mapach i przepisy na róże.

## 3. Menu – przycisk ⚙ (ustawienia tylko na Twoim urządzeniu)

- **Widok:** *Kompaktowy* (mało miejsca, np. okno obok gry) i/lub *Tabletowy* (kilka kolumn na szerokim ekranie).
- **Rozmiar respów** – suwak powiększenia.
- **Dźwięk alarmu** – kilka dźwięków albo własny plik (do 1 MB) + **głośność**.
- **Komunikaty głosowe** – np. „Czerwony Las 2, kanał 3, stoi”.
- **Widoczne mapy** – ukryte mapy znikają z zakładek i nie dają alarmów.
- **Gry** – włączone / wyłączone (wyłączone = nie widzisz gier i nikt Cię do nich nie doda).
- **Nie wygaszaj ekranu** (na stronie).
- **Eksportuj / Importuj respy** i **Reset timerów w pokoju** (zeruje liczniki w tym pokoju – u wszystkich w pokoju).
- **Aplikacja na Androida** – informacja o wersji i przycisk pobrania.

## 4. Radio i Watch2Gether (na stronie)

Ikona kolejki przy radiu na górze strony → wklej link i **Dodaj**. Wszyscy w pokoju słyszą to samo, w tym samym momencie.

- Obsługiwane linki: **YouTube** (filmik albo cała playlista), **Twitch** (nagranie albo kanał na żywo),
  **Vimeo**, **SoundCloud**, **TikTok** (pełny link `tiktok.com/@nick/video/…`, nie skrócony z aplikacji).
- Przy każdej pozycji widać, **kto ją dodał**. Kolejność zmieniasz przeciągając (⠿), kliknięcie pozycji ją puszcza.
- **Okienko radia** (małe, w rogu) możesz przesunąć, łapiąc pasek na jego górze. Dwuklik w pasek = z powrotem w rogu.
- **Watch2Gether** (opcjonalnie): zaznacz przy dodawaniu albo kliknij 📺 przy pozycji w kolejce.
  Gdy przyjdzie jej kolej, film otwiera się w dużym oknie pod timerami – wszyscy oglądają ten sam moment.
  - **Nie oglądam** – chowa duże okno tylko u Ciebie (dźwięk gra dalej; wycisz przyciskiem radia),
  - **Pełny ekran** (Esc – wyjście), **Następny** – dalej dla wszystkich,
  - rozmiar zmieniasz, ciągnąc pomarańczowy narożnik filmu (dwuklik = domyślny rozmiar).
  - Po filmie radio wraca do zwykłej muzyki.
- Radio i Watch2Gether działają w przeglądarce (także na telefonie), nie w aplikacji na Androida.

## 5. Misje tygodniowe

Przycisk **Misje Tygodniowe** na górze (po zalogowaniu przez Discord; działa też w aplikacji). Trzy obozy – **Góra Sohan,
Pustynia, Wężowe Pole** – dają każdej postaci jedną misję na tydzień.

- **Dodaj postać** (nick po lewej), a przy niej trzy pola – po jednym na obóz. Zaznacz pole, gdy postać zrobi misję:
  pokaże, za ile i kiedy dokładnie (dzień i godzina) misja będzie znowu dostępna, i **odznaczy się samo po 7 dniach**.
- **Przedmioty ▾** przy postaci: wpisz, co trzeba kupić na misję w każdym obozie (nazwa i ilość).
  Przy wpisywaniu timer podpowiada nazwy przedmiotów (ulepszacze, mikstury, ryby, ekwipunek…) i sam poprawia pisownię,
  żeby te same przedmioty zawsze się sumowały.
- **Kolor i para:** kółko przed nickiem otwiera wybór koloru postaci i listę „Para z” – dwie połączone postacie
  stoją zawsze obok siebie w ramce „Para”.
- **Do kupienia – razem** na dole: suma przedmiotów wszystkich postaci, z podziałem na obozy.
  Liczy tylko misje jeszcze niezrobione (chyba że zaznaczysz „licz też misje już zrobione”).
- Lista jest **prywatna** – przypisana do Twojego konta Discord, nie do pokoju. **Udostępnij** daje wybranym osobom
  pełny dostęp (widzą listę u siebie w Misjach Tygodniowych i mogą ją edytować); dostęp można w każdej chwili zabrać,
  a osoba z dostępem może sama „Opuścić tę listę”.

## 6. Gry

Przycisk **Gry**: kości, rzut monetą, refleks, zgadnij liczbę, kamień-papier-nożyce, wyścig konny (2D i 3D) i ruletka.
Stawki w **kk yang** (od 1kk do 1000kk) albo **Darmowa gra**. Wygrane i przegrane zapisują się jako **długi**
(kto → komu) w oknie **Rozliczenia**. Wygrane i przegrane między dwiema osobami się znoszą; spłatę zaznacza osoba,
której dług się należy.

## 7. Aplikacja na Androida

1. Pobierz [UnityTimer.apk](https://github.com/wronglogin/metin-timer/releases/latest/download/UnityTimer.apk)
   (albo **Menu → Pobierz UnityTimer.apk**).
2. Otwórz plik → zgódź się na instalację z nieznanego źródła → **Zainstaluj**.
   Nowa wersja instaluje się na starą – nic się nie gubi, nie trzeba się logować od nowa.

Aplikacja wczytuje stronę z internetu, więc **nowości na stronie widać w niej od razu**, bez instalowania.
Nowe APK jest potrzebne tylko przy zmianach w samej aplikacji (np. ikona, nazwa).

**Bezpieczeństwo:** pobieraj APK tylko z linku powyżej / z Menu. Aplikacja ma tylko uprawnienie do internetu –
nie ma dostępu do zdjęć, plików, kontaktów ani lokalizacji.

## 8. Aktualizacje

Otwarte strony same sprawdzają, czy jest nowa wersja (co kilka minut i przy powrocie do karty) i odświeżają się,
gdy nic nie robisz. Jeśli jesteś w trakcie (piszesz, masz otwarte okno albo grę), na górze pojawi się pasek
**„Jest nowa wersja timera”** – odświeży się sam, gdy skończysz, albo kliknij **Odśwież teraz**.
Odświeżenie nie wylogowuje i nie zmienia timerów.

---

## 9. Dla adminów

Przycisk z **tarczą** obok Menu (⚙) (widzą go tylko właściciel i admini; wymaga hasła admina, pamiętanego 48 h na urządzeniu).
Panel jest podzielony na części:

- **Ustawienia:** liczba kanałów (dla wszystkich), przesunięcie zegara względem gry.
- **Pokoje:** zarządzanie pokojami (hasło, a pod „Więcej ▾”: zerowanie timerów, reset do domyślnych, blokada,
  usunięcie, czyszczenie długów – niebezpieczne akcje wymagają wpisania nazwy pokoju), osoby w pokoju,
  zalogowani we wszystkich pokojach, długi we wszystkich pokojach.
- **Użytkownicy:** administratorzy (dodaje i usuwa tylko właściciel), wszyscy, którzy kiedykolwiek się logowali
  (tu można zbanować każdego), zbanowani, **Odśwież stronę u wszystkich**, **Wyloguj wszystkich**.
- **Historia:** dziennik akcji adminów z ostatnich 48 h.

**Właściciel** jest ustawiony w konsoli Firebase (`adminuids/<identyfikator> = true`) – nikt nie może go zmienić
z poziomu strony. Admini dodani w panelu mają ten sam panel, ale nie mogą dodawać ani usuwać adminów.

**Ktoś wyrzucony z Discorda** ma jeszcze ważne logowanie (do 7 dni) – zbanuj go w panelu albo użyj „Wyloguj wszystkich”.

### Baza danych (Firebase)

- Adres: `https://timermetin-default-rtdb.europe-west1.firebasedatabase.app`
- **Reguły:** po zmianach w kodzie, które tego wymagają, wklej zawartość `database.rules.discord.json`
  w Firebase → Realtime Database → **Reguły** → **Opublikuj**.
- **Hasło admina** jest w bazie w `admin/secret` (nie da się go odczytać ze strony). Zmienisz je w panelu admina.
- **Kopie zapasowe:** darmowy plan ich nie robi. Co jakiś czas: Realtime Database → ⋮ → **Eksportuj JSON**.
- **Limity darmowego planu:** 10 GB pobierania na miesiąc, 1 GB danych, 100 połączeń naraz.
  Zużycie: Realtime Database → zakładka **Użycie**. Muzyka i filmy z radia nie idą przez bazę.

### Budowanie

Po każdej zmianie w repozytorium GitHub sam buduje aplikację (zakładka **Actions**), publikuje ją w **Releases**
i aktualizuje stronę (GitHub Pages).
