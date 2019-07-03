# bobril-features

Porovnani jednotlivych zpusobu zapisu v bobrilu

## Objektovy zapis vs TSX

TSX:

- ++ kratsi zapis
- +/~ blize vyslednemu html
- ~/- v tsx nejde pouzit pretypovani pomoci `<X>x`, ale jen `x as X`

## Zapis komponent

- komponentovy
  - k komponentovemu nodu se pristupuje jinak nez k children (`me.tag`, `me.children`)
  - nutnost vytvaret Ctx, i kdyz ho v realu nepouzijeme
- classovy
  - default `id` z nazvu classy
  - misto Ctx pouzivame classu -> mene kodu
  - do podfunkci nemusime predavat `ctx`, ke kontextu pristupujeme pres `this`
  - moznost pouziti observable primo na class property
  - pri vetsi komponente mozno oddelit data do store
- funkcionalni

  - default `id` z nazvu funkce
  - piseme toho tak malo, ze kdyz potrebujeme advanced funkcionalitu nemame ji kam napsat, takze potrebujeme hooky
  - hooky casto dokazi vyjadrit myslenku lepe + s mene kodu
  - nicmene hooky jsou dost velky mind-shift, clovek si na ne musi zvykat

## State management

- bobflux

  - jedno misto, kde je stav cele aplikace
  - spousta boiler plate kodu
  - musime udrzovat bobfluxgen, aby zvladal nove styly zapisu mporty, tsx, ..)
  - horsi ucici krivka
  - zavadi dobre zvyky (stav se meni jen pres akce, ...)
  - renderuje se vzdy cely vDOM (shouldUpdate se pouziva minimalne, i kvuli 'zkratkam')
  - hodne se lisi, jestli mame stav globalni nebo lokalni v komponente
  - poskytuje nejake dalsi vyhody (jediny objekt reprezentujici stav cele aplikace, jednoduchou moznost undo, ..) ktere jsme ale mimo jine i kvuli trvale persistenci na BE nedokazli za ty roky vyuzit
  - https://github.com/keeema/bobril-samples/blob/master/articles/02_bobril-bobflux.md

- bobx
  - stav je roztristen do vice malych storu
  - mene kodu (nejsou potreba zadne generatory)
  - relativne intuitivni
  - zavadi magii (= dela veci za vas, ale kdyz je neudela, hur se dohledava proc)
    - invalidate
    - cachovani hodnot
    - renderuji se jen komponenty, kterym se zmenily data
  - temer neni rozdil, jestli je stav lokalni (store je ulozeny v komponente) nebo globalni (store je ulozeny v globale)
  - https://github.com/keeema/bobril-samples/blob/master/articles/06_bobril-bobx.md
  - https://github.com/bobril/bobx/tree/master/example

## Hooks

- `useState`
  - vrati `IProp` nebo `currentValue` a `setter`, o perzistenci mezi rendery se stara bobril
  - pro immutable hodnoty, idealne primo value typy
  - pro slozitejsi inicializaci nabizi callback (provola se pouze pokud bude potreba)
- `useEffect`
  - zavola funkci po kazdem renderu - az po kompletnim vykresleni browserem
  - lze dodat destruktor, ktery se zavola tesne pred pristim zavolanim nebo destrukci komponenty
  - lze si tim napr 'odlozit' vypocetne narocnejsi praci mimo render
  - pokud jako druhy parametr dodame seznam hodnot, funkce se bude provolavat pouze po jejich zmene
  - `[]` nam tedy efektivne vytvari `init` / `destroy`
- `useLayoutEffect`
  - to same co `useEffect`, ale zavola se jeste pred vykreslenim updatovaneho DOMu browserem - lze tedy dobre pouzit na update DOMu
  - pokud v ramci nej zinvalidujeme, prerendruje se jeste v ramci stejneho animation frame
  - existuje obecne pravidlo, ze nejdrive pouzit `useEffect` a pouze pokud dela problemy, pouzit `useLayoutEffect`
- `useStore`
  - zpusob jak pouzit story ve funkcionalnim zapisu
  - "`useState`" pro mutabilni hodnoty
- `useRef`
  - vysledek lze pouzit jako ref a nasledne v `.current` dostaneme posledni hodnotu
  - nemusi se pouzivat jen na nody, lze persistovat libovolnou hodnotu
- `useObservable` (bobx)
  - vrati `IProp`, podobna `useState`, ale je to rovnou hluboce observovatelna hodnota/objekt.
- `useComputed` (bobx)
  - memoizovana funkce ktera se automaticky prepocitava pokud se zmeni pouzite observable hodnoty ci funkce.

podrobnejsi popis: https://reactjs.org/docs/hooks-reference.html
