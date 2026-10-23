# कॉन्फ़िगरेशन

<a id="theme-options"></a>

## थीम विकल्प

| विकल्प | डिफ़ॉल्ट | विवरण |
|:---|:---|:---|
| `logo` | `null` | साइट के नाम के बगल में दिखने वाली image, `docs_dir` के सापेक्ष। |
| `favicon` | `img/favicon.svg` | साइट का icon। |
| `icon` | `octicons` | थीम के controls का icon set: `octicons` या `lucide`। |
| `font.text` | `null` | इंटरफ़ेस और prose के लिए CSS `font-family` मान। |
| `font.code` | `null` | inline और block code के लिए CSS `font-family` मान। |
| `font.source` | `null` | कोई बाहरी stylesheet URL या `docs_dir` के अंदर की local stylesheet। |
| `locale` | `en` | थीम के अपने text की भाषा। Catalogs `en`, `es`, `fr`, `hi`, `pt`, `ru` और `zh` के लिए आते हैं। |
| `direction` | `ltr` | दस्तावेज़ की दिशा: `ltr` या `rtl`। |
| `include_sidebar` | `true` | navigation sidebar render करें। |
| `show_footer` | `true` | footer bar render करें। |
| `show_footer_generator` | `true` | footer में "mkdocs-primer और MkDocs से बनाया गया" दिखाएँ। |
| `social` | `[]` | footer में दिखने वाले icon links। |
| `show_metadata` | `true` | पेज के title के नीचे metadata line render करें। |
| `show_metadata_created` | `true` | बनने की तारीख़ दिखाएँ। |
| `show_metadata_updated` | `true` | अंतिम अद्यतन की तारीख़ दिखाएँ। |
| `show_metadata_reading_time` | `true` | पढ़ने का अनुमानित समय दिखाएँ। |
| `show_metadata_authors` | `true` | लेखक दिखाएँ। |
| `toc` | `auto` | "विषय सूची" की रूपरेखा: `auto`, `expanded`, `collapsed` या `hidden`। |
| `offline` | `false` | एक service worker register करें, जिसे साइट का build खुद generate करे। |
| `color_mode` | `auto` | शुरुआती रंग मोड: `auto`, `light` या `dark`। |
| `light_theme` | `light` | हल्के मोड में इस्तेमाल होने वाली Primer थीम। |
| `dark_theme` | `dark` | गहरे मोड में इस्तेमाल होने वाली Primer थीम। |

`color_mode` सिर्फ़ *शुरुआती* मोड तय करता है। विज़िटर इसे header के toggle से बदल सकते हैं, और उनकी पसंद `localStorage` में सहेजी जाती है।

`toc` तय करता है कि मौजूदा पेज की headings से बनी रूपरेखा कहाँ जाए। `auto` उसे दाईं rail में रखता है जब window तीसरे column के लिए पर्याप्त चौड़ी हो, और नहीं तो पेज के title के नीचे — वहाँ वह एक disclosure है जिसे पाठक खुद खोलता है, न कि title और पहले पैराग्राफ़ के बीच खड़ी कोई सूची। `expanded` उसे flow में रखता है और rail से बाहर, `collapsed` उसे ऐसा disclosure बनाता है जिसे पाठक खोलता है, और `hidden` — या `false` — उसे हटा देता है।

<a id="metadata-line"></a>

## मेटाडेटा लाइन

पेज के title के ठीक नीचे, prose से ऊपर, थीम मौजूदा पेज के बारे में तथ्यों की एक byline दिखा सकती है: पेज कब बना, आखिरी बार कब बदला, पढ़ने में कितना समय लगता है, और किसने लिखा। हर item तभी दिखता है जब उसका अपना विकल्प चालू हो *और* उसके पीछे डेटा मौजूद हो, और अगर चारों में से कोई भी कुछ न दिखाए तो पूरी line ही हटा दी जाती है।

```yaml
theme:
  name: primer
  show_metadata: true # the line's own switch; false hides all four items
  show_metadata_created: true
  show_metadata_updated: true
  show_metadata_reading_time: true
  show_metadata_authors: true
```

`show_metadata` नीचे के fields चाहे जो हों, पूरी line बंद कर देता है। हर field को अलग से भी बंद किया जा सकता है — मान लीजिए किसी साइट को तारीख़ें चाहिए पर पढ़ने के समय का अनुमान नहीं।

`show_metadata_reading_time` पेज के rendered शब्दों की गिनती से 265 शब्द प्रति मिनट की दर पर — जो एक वयस्क की औसत पढ़ने की गति है — पढ़ने के मिनटों का अनुमान लगाता है, और जिस पेज का अपना कोई content नहीं होता, जैसे section index, उस पर यह नहीं दिखता।

दोनों तारीख़ें [mkdocs-git-revision-date-localized](https://github.com/timvink/mkdocs-git-revision-date-localized-plugin) से आती हैं:

```yaml
plugins:
  - git-revision-date-localized:
      enable_creation_date: true # also required for the "created" date
```

वह plugin चालू न हो तो कोई भी तारीख़ नहीं दिखती, और बनने की तारीख़ के लिए खास तौर पर `enable_creation_date: true` चाहिए — plugin का अपना डिफ़ॉल्ट इसे बंद रखता है।

लेखक [mkdocs-git-authors](https://github.com/timvink/mkdocs-git-authors-plugin) से आते हैं, और वह plugin चालू न हो तो वे भी नहीं दिखते।

<a id="footer"></a>

## फ़ुटर

हर पेज के निचले हिस्से में, पूरे layout के नीचे, एक bar। इसमें एक तरफ़ text की दो lines होती हैं और दूसरी तरफ़ icon links की एक पंक्ति, और जब उसमें रखने को कुछ न हो तो वह पूरी तरह हटा दिया जाता है। `show_footer: false` उसे हटा देता है, बाकी कॉन्फ़िगरेशन चाहे जो हो।

Bar का हर link दस्तावेज़ से बाहर ले जाता है, इसलिए उनमें से हर एक अपने अलग tab में खुलता है।

पहली line copyright है और यह कि पेज का source कहाँ मिलेगा — उसके लिए [एडिट लिंक](#edit-links) देखें। Copyright MkDocs का अपना `copyright` है, जो थीम का विकल्प नहीं बल्कि top-level key है:

```yaml
copyright: Copyright &copy; 2026 Your Name
```

दूसरी line बताती है कि साइट किससे बनी है। इसे `show_footer_generator: false` से बंद करें:

```yaml
theme:
  name: primer
  show_footer_generator: false
```

<a id="social-links"></a>

### सोशल लिंक

`social` links की एक सूची है जो copyright के सामने वाली तरफ़ icons के रूप में दिखती है:

```yaml
theme:
  name: primer
  social:
    - service: github
      link: https://github.com/you/your-project
    - service: mastodon
      link: https://fosstodon.org/@you
      name: Follow the project on Mastodon
```

`service` थीम के साथ आने वाले marks में से किसी एक का नाम है। `name` वैकल्पिक है: यह link का accessible name है — जो screen reader पढ़कर सुनाता है — और डिफ़ॉल्ट रूप से service का अपना नाम होता है, इसलिए जब भी सिर्फ़ "GitHub" से यह पता न चले कि link कहाँ ले जाता है, तब इसे दें।

Services ये हैं:

`bitbucket`, `bluesky`, `codeberg`, `devdotto`, `discord`, `docker`, `facebook`, `forgejo`, `github`, `githubsponsors`, `gitlab`, `instagram`, `kofi`, `mastodon`, `matrix`, `medium`, `npm`, `opencollective`, `patreon`, `pypi`, `reddit`, `rss`, `stackoverflow`, `substack`, `telegram`, `twitch`, `x`, `youtube`, `zulip`.

किसी और चीज़ के लिए, `service` का नाम देने के बजाय `icon` को `docs_dir` के अंदर किसी SVG पर point करें:

```yaml
theme:
  name: primer
  social:
    - icon: img/linkedin.svg
      link: https://www.linkedin.com/company/your-company
      name: Your Company on LinkedIn
```

ऐसा mark `<img>` के रूप में बनता है, इसलिए built-in marks के उलट यह आसपास के text का रंग नहीं लेता बल्कि अपने रंग बनाए रखता है। LinkedIn और Slack के लिए यही रास्ता है: दोनों ने उस icon set से हटाए जाने का अनुरोध किया था जिससे थीम icons लेती है, इसलिए दोनों में से कोई भी उसके साथ नहीं आता।

ये marks [Simple Icons](https://github.com/simple-icons/simple-icons) हैं, जो CC0-1.0 के तहत जारी हुए हैं। जिन brands को वे दर्शाते हैं, वे नहीं: हर brand अपने मालिक का trademark बना रहता है, और उसे अपने footer में लगाने से उनसे किसी संबंध या समर्थन का दावा नहीं होता।

<a id="icons"></a>

## आइकन

Header navigation, रंग मोड का control, "ऊपर जाएँ" बटन और code block पर कॉपी बटन एक ही icon set के inline SVG इस्तेमाल करते हैं। `octicons` डिफ़ॉल्ट है; Lucide icons इस तरह चुनें:

```yaml
theme:
  name: primer
  icon: lucide
```

दोनों sets थीम में शामिल हैं, इसलिए कोई भी विकल्प CDN request नहीं जोड़ता। Icon का चुनाव सिर्फ़ थीम के HTML controls पर लागू होता है। भाषा चुनने वाला control हमेशा Octicon का globe इस्तेमाल करता है। Markdown की icon syntax और मनचाहे third-party icon packs जानबूझकर supported नहीं हैं।

<a id="fonts"></a>

## फ़ॉन्ट

Fonts opt-in हैं: थीम डिफ़ॉल्ट रूप से किसी font CDN से request नहीं करती। Text और code के families अलग-अलग set करें, फिर `source` को किसी बाहरी stylesheet या `docs_dir` में मौजूद CSS file पर point करें:

```yaml
theme:
  name: primer
  font:
    text: 'Inter, sans-serif'
    code: '"JetBrains Mono", monospace'
    source: https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=JetBrains+Mono&display=swap
```

Self-hosted साइट के लिए font files और एक stylesheet `docs_dir` में रखें, फिर relative source path इस्तेमाल करें:

```yaml
theme:
  name: primer
  font:
    text: 'Atkinson Hyperlegible, sans-serif'
    code: 'Atkinson Hyperlegible Mono, monospace'
    source: fonts/fonts.css
```

```css title="docs/fonts/fonts.css"
@font-face {
  font-family: "Atkinson Hyperlegible";
  src: url("AtkinsonHyperlegible-Regular.woff2") format("woff2");
  font-display: swap;
}
```

Browser उन files को सामान्य रूप से cache करता है। Self-hosting से third-party request नहीं होती, और assets cache हो जाने के बाद साइट offline भी इस्तेमाल की जा सकती है।

<a id="language"></a>

## भाषा

थीम का अपना text — `Search`, `Back to top`, `Previous`/`Next`, footer के labels — एक gettext catalog से आता है, उस भाषा से अलग जिसमें आपके पेज लिखे गए हैं। `locale` से एक चुनें:

```yaml
theme:
  name: primer
  locale: ru
```

Catalogs `en`, `es`, `fr`, `hi`, `pt`, `ru` और `zh` के लिए आते हैं। सूची में न दिया गया locale build को fail करने के बजाय English पर लौट आता है।

!!! note "बहुभाषी साइटों में हर भाषा के लिए `locale` देना ज़रूरी है"
    mkdocs-static-i18n `theme.locale` अपने-आप सिर्फ़ उन थीमों के लिए set करता है
    जो MkDocs के साथ आती हैं, इसलिए third-party थीम को यह साफ़-साफ़ बताना पड़ता
    है। इसे हर भाषा में जोड़ें, वरना हर locale का chrome English में render होगा:

    ```yaml
    plugins:
      - i18n:
          languages:
            - locale: en
              default: true
              build: true
              theme:
                locale: en
            - locale: ru
              build: true
              theme:
                locale: ru
    ```

!!! warning "डिफ़ॉल्ट भाषा को सबसे आख़िर में रखें"
    Plugin हर भाषा के लिए एक build pass चलाता है, और जो पेज पूरी साइट के लिए
    एक ही बार होते हैं — `404.html` और `search.html` — उन्हें हर pass दोबारा
    लिखता है। इसलिए वे दोनों उसी भाषा में निकलते हैं जो सूची में **आख़िर** में
    है। डिफ़ॉल्ट भाषा को आख़िर में रखें ताकि वे उसी में बनें। थीम भाषा चुनने
    वाले control को खुद sort करती है, इसलिए इससे विज़िटरों को दिखने वाला क्रम
    नहीं बदलता।

कोई भाषा जोड़ने या सुधारने के लिए `mkdocs_primer/locales/<locale>/LC_MESSAGES/messages.po` edit करें और फिर से compile करें — देखें [`RELEASING.md`](https://github.com/olegshulyakov/mkdocs-primer/blob/main/RELEASING.md)।

<a id="right-to-left-layouts"></a>

## दाएँ-से-बाएँ लेआउट

दाएँ-से-बाएँ दस्तावेज़ के लिए `direction: rtl` set करें। थीम root HTML element पर `dir="rtl"` लगाती है और logical CSS properties की मदद से अपने header, sidebar, mobile navigation, pagination, footer, menus और controls को mirror करती है। Code और diagrams जानबूझकर बाएँ-से-दाएँ ही रहते हैं।

```yaml
theme:
  name: primer
  direction: rtl
```

दिशा पूरी साइट की setting है; थीम इसे किसी पेज या भाषा के locale से अंदाज़ा लगाकर तय नहीं करती।

!!! warning "`light_theme` और `dark_theme` अभी सिर्फ़ `light` और `dark` स्वीकार करते हैं"
    Primer चौदह थीमें प्रकाशित करता है (`dark_dimmed`, `light_high_contrast`,
    `dark_tritanopia` वगैरह), लेकिन यह थीम उनमें से सिर्फ़ दो के color tokens
    साथ लाती है — पूरा set एक megabyte से कहीं ज़्यादा CSS जोड़ देता। किसी और
    थीम का नाम देने पर error नहीं आता, बल्कि बिना किसी रंग का पेज render होता है।
    ज़्यादा थीमों का support भविष्य में जोड़ने के लिए track किया जा रहा है।

<a id="heading-anchors"></a>

## हेडिंग एंकर

हर heading के बगल में GitHub जैसा hover anchor पाने के लिए, `toc` extension को leading permalink के साथ चालू करें जिस पर Primer की `anchor` class हो:

```yaml
markdown_extensions:
  - toc:
      permalink: ""
      permalink_class: anchor
      permalink_leading: true
      permalink_title: Permanent link
```

Octicon थीम खुद बनाती है, इसलिए `permalink` को सामान्य `true` के बजाय खाली string पर set किया जाता है। यह सिर्फ़ दिखावट की बात नहीं है: MkDocs का search plugin permalink glyphs को नहीं हटाता, इसलिए नहीं तो आपके search results में `¶` दिखाई देता।

इस config के बिना भी permalink काम करता है, बस octicon के बजाय एक सादे glyph के रूप में render होता है।

<a id="syntax-highlighting"></a>

## सिंटैक्स हाइलाइटिंग

Code के रंग Primer के `prettylights` variables से आते हैं, इसलिए वे अपने-आप सक्रिय रंग मोड के साथ चलते हैं। कोई Pygments style चुनने की ज़रूरत नहीं है:

```yaml
markdown_extensions:
  - pymdownx.highlight
  - pymdownx.superfences
```

`.highlight` और `.codehilite` दोनों wrappers styled हैं, इसलिए `codehilite` भी काम करता है।

थीम हर Pygments `.highlight` block में एक कॉपी बटन जोड़ती है। यह दिखने वाला source कॉपी करता है और बताता है कि clipboard का operation सफल हुआ या नहीं। Plugins द्वारा render किए गए blocks, जैसे Mermaid और Vega-Lite, जानबूझकर बाहर रखे गए हैं।

<a id="navigation-controls"></a>

## नेविगेशन कंट्रोल

400 pixels scroll करने के बाद पेज के नीचे दाईं ओर "ऊपर जाएँ" बटन दिखाई देता है। यह विज़िटर को दस्तावेज़ की शुरुआत पर वापस ले जाता है और keyboard focus को site-title link पर ले आता है। अगर विज़िटर ने reduced motion माँगा है तो यह तुरंत, बिना animation के, होता है।

<a id="offline-support"></a>

## ऑफ़लाइन सपोर्ट

`offline: true` हर पेज में एक ही चीज़ जोड़ता है: एक script जो साइट के root से `service-worker.js` register करती है। थीम वह file नहीं लिखती, और MkDocs में ऐसा कुछ नहीं है जो उसे लिखे — उसे generate करना एक step है जो आपके अपने build को `mkdocs build` के बाद चलाना होगा:

```yaml
theme:
  name: primer
  offline: true
```

```console
$ mkdocs build
$ npx workbox generateSW workbox-config.cjs
```

Service worker ही बनी हुई साइट को precache करता है, ताकि जो विज़िटर एक बार साइट पर आ चुका है, वह उसे बिना network के फिर से पढ़ सके। `offline` को `false` पर छोड़ दें तो कोई registration नहीं जुड़ता, और बिना इस build step वाली साइट को यही चाहिए — जो पेज ऐसी `service-worker.js` माँगता है जिसे किसी ने generate नहीं किया, वह हर visit पर 404 log करता है।

दो चीज़ें यह नहीं कर सकता। Secure context के बाहर service workers मना कर दिए जाते हैं, इसलिए साइट HTTPS पर या `localhost` से serve होनी चाहिए; `file://` से खोला गया folder इनमें से किसी भी चीज़ से offline-capable नहीं बनता। और precaching *दूसरी* visit से शुरू होती है — पहली visit ही cache भरती है।

इस repository की अपनी `workbox-config.cjs` और उसका `npm run build:offline` एक पूरा, काम करता हुआ उदाहरण हैं।

<a id="markdown-extensions"></a>

## Markdown एक्सटेंशन

इनमें से कोई भी ज़रूरी नहीं है, लेकिन थीम ऐसी styling के साथ आती है जिसका फ़ायदा इन्हें चालू करने पर ही मिलता है:

```yaml
markdown_extensions:
  - admonition   # !!! note blocks, colored with Primer's alert palette
  - def_list
  - footnotes
  - tables
  - pymdownx.highlight
  - pymdownx.superfences
  - pymdownx.tilde
```

`admonition` खास तौर पर ध्यान देने लायक है: यह extension markup बनाता है पर अपनी कोई CSS नहीं देता, और `@primer/css` में भी इसके लिए कोई नियम नहीं है, इसलिए बिना style वाला admonition अक्सर चौंका देता है। थीम यह कमी पूरी करती है — देखें [उदाहरण](../elements.md#admonitions)।

<a id="custom-css-and-javascript"></a>

## कस्टम CSS और JavaScript

`extra_css` थीम की हर stylesheet के बाद load होती है, इसलिए आपके नियम `!important` के बिना ही जीतते हैं:

```yaml
extra_css:
  - css/overrides.css
extra_javascript:
  - js/site.js
  # MkDocs 1.5+ also takes the mapping form.
  - path: js/chart.js
    type: module
```

[स्टाइलिंग](../styling.md) बताता है कि इसमें क्या रखें: थीम के अपने layout variables, और यह कि Primer के किसी color token का `:root` override क्यों छोड़ दिया जाता है जबकि वही नियम दो attribute selectors के नीचे लागू हो जाता है।

`extra_javascript` `<body>` के आख़िर में, थीम की अपनी scripts के बाद, जोड़ी जाती है।

!!! note "अपने assets खुद inject करने वाले plugins"
    जो plugin `extra_css` में जोड़ने के बजाय पेज के HTML में `<link>` tags लिखता
    है — mkdocs-glightbox ऐसा ही एक है — वह आपके overrides के *बाद* आता है। ऐसी
    चीज़ों को क्रम पर निर्भर रहने के बजाय ज़्यादा specific selector से style करें।

<a id="edit-links"></a>

## एडिट लिंक

जब `repo_url` और `edit_uri` set हों, तो [footer](#footer) पेज की अपनी source file का link देता है:

```yaml
repo_url: https://github.com/you/your-project
edit_uri: edit/main/docs/
```

अगर `repo_url` है पर `edit_uri` नहीं, तो हर पेज के लिए link बनाने का कोई आधार नहीं होता, और footer उसकी जगह repository का नाम देता है — ताकि पाठक साइट पर कहीं से भी source तक पहुँच सके।
