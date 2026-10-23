# प्लगइन

ज़्यादातर MkDocs plugins कभी किसी template को छूते ही नहीं, इसलिए वे किसी भी थीम के साथ काम करते हैं। कुछ गिने-चुने ऐसे नहीं हैं: वे उम्मीद करते हैं कि थीम उनकी गणना की हुई कोई चीज़ render करे, या उनके बनाए किसी nav ढाँचे को संभाले। जाँचने लायक यही हैं।

यह साइट ही वह जाँच है। Repository के root में मौजूद `mkdocs.yml` उन plugins को चालू करता है जिन्हें थीम के support की ज़रूरत है, और CI इसे `--strict` के साथ build करता है, ताकि कोई regression चुपचाप किसी पेज को बिगाड़ने के बजाय build ही तोड़ दे। उम्मीदवार plugins [MkDocs catalog](https://github.com/mkdocs/catalog) से लिए गए, लोकप्रियता के क्रम में ऊपर से नीचे।

<a id="plugins-that-need-something-from-the-theme"></a>

## वे plugins जिन्हें थीम से कुछ चाहिए

### mkdocs-section-index

[mkdocs-section-index][section-index] `guide/index.md` को खुद **गाइड** section में मिला देता है, जिससे एक nav item के पास `children` और `url` दोनों आ जाते हैं। जो थीम "children हैं" को एक सादे section label के रूप में render करती है, वह उस index पेज तक sidebar से पहुँचना नामुमकिन बना देती है।

`partials/nav-item.html` `nav_item.url` जाँचता है और अगर वह मौजूद हो तो label को link के रूप में render करता है। यह आप sidebar में देख सकते हैं: **गाइड** और **नेस्टेड** दोनों पर click किया जा सकता है।

!!! note "एक चेतावनी जिसे आप अनदेखा कर सकते हैं"
    यह plugin supported थीमों को template file paths को एक built-in सूची से
    मिलाकर पहचानता है, इसलिए वह यह log करता है

    ```text
    section-index plugin couldn't detect a supported theme to adapt.
    ```

    हर third-party थीम के लिए, इस थीम समेत। यहाँ support native है — कुछ भी
    adapt करने की ज़रूरत नहीं — लेकिन थीम की तरफ़ से इस संदेश को रोका नहीं जा सकता।

### mkdocs-static-i18n

[mkdocs-static-i18n][i18n] `theme.locale` को सिर्फ़ उन थीमों के लिए बदलता है जिनका support उसमें शामिल है, और उनमें third-party थीमें नहीं आतीं। इसलिए सिर्फ़ `theme.locale` पढ़ने से हर अनुवादित पेज पर डिफ़ॉल्ट भाषा का label लग जाता है।

`base.html` उस `i18n_page_locale` variable को प्राथमिकता देता है जो plugin पेज के context में रखता है, और plugin न होने पर `theme.locale` पर लौट आता है:

```html+jinja
{% raw %}<html lang="{{ i18n_page_locale | default(config.theme.locale, true) }}">{% endraw %}
```

`/es/`, `/zh/`, `/hi/`, `/pt/`, `/ru/` और `/fr/` के नीचे के अनुवादित पेजों पर मेल खाता `lang` attribute होता है। जिन पेजों का `*.<locale>.md` अनुवाद नहीं है, वे अपने English source पर लौट आते हैं, जो plugin का डिफ़ॉल्ट व्यवहार है।

जब कम से कम दो configured भाषाओं में `build: true` हो, तो header एक भाषा चुनने वाला control भी render करता है। उसके labels हर भाषा के `name` से आते हैं, और हर entry लक्षित locale में उसी पेज पर रहती है। इसमें वे पेज भी शामिल हैं जिनके लिए plugin डिफ़ॉल्ट भाषा के source पर लौट आता है। यह control `mkdocs-static-i18n` के बिना, एक-भाषा वाले build में, या static 404 पेज पर render नहीं होता।

### mkdocs-git-revision-date-localized

[mkdocs-git-revision-date-localized][git-date] git log पढ़ता है और नतीजा `page.meta.git_revision_date_localized` में रखता है — और `enable_creation_date: true` के साथ `page.meta.git_creation_date_localized` में भी। जब तक थीम इन्हें न माँगे, इनमें से कोई भी दिखता नहीं, इसलिए इन lines के बिना वाली थीम में plugin टूटा हुआ लगता है। `partials/metadata.html` दोनों को print करता है, पेज के title के नीचे वाली metadata line के "निर्मित" और "अंतिम अद्यतन" items के रूप में।

### mkdocs-git-authors

[mkdocs-git-authors][git-authors] का ढाँचा भी वैसा ही है: यह `git_page_authors` को HTML की एक string के रूप में पेज के context में रखता है और उसे दिखाने का काम थीम पर छोड़ देता है। Metadata line इसे तारीख़ों के साथ print करती है।

### mkdocs-rss-plugin

[mkdocs-rss-plugin][rss] `feed_rss_created.xml` और `feed_rss_updated.xml` लिखता है लेकिन कोई markup नहीं जोड़ता, इसलिए पाठक को उन तक कुछ भी नहीं ले जाता। `base.html` `<link rel="alternate">` की जोड़ी जोड़ता है, और filenames को hardcode करने के बजाय plugin के अपने config से लेता है, क्योंकि वे विकल्प हैं।

यह plugin इस साइट पर चालू नहीं है — देखें [ज्ञात plugin टकराव](#known-plugin-conflicts)।

### mike

[mike][mike] दस्तावेज़ के कई संस्करण साथ-साथ रखता है और एक version dropdown जोड़ता है। यह किसी थीम के dropdown assets को `mike.themes` entry point group के ज़रिए ढूँढता है, और जो थीम उसे वहाँ नहीं मिलती, उसके लिए **कोई selector नहीं बनाता और कुछ बताता भी नहीं** — साइट deploy हो जाती है, संस्करण मौजूद होते हैं, और उनके बीच जाने का इकलौता तरीका URL को edit करना रह जाता है।

`pyproject.toml` `mkdocs_primer.mike` को उस group के तहत register करता है, इसलिए mike इस package से `version-select.css` और `version-select.js` उठाकर copy कर लेता है। Selector header में साइट के नाम के बगल में आता है और रंग मोड के साथ चलता है। Aliases अपने असली संस्करण में resolve होते हैं, इसलिए `/latest/` पर खाली control के बजाय `2.0` चुना हुआ दिखता है।

वह script global `base_url` पढ़ती है, जिसे `base.html` बिना किसी शर्त के declare करता है। पहले यह सिर्फ़ तब declare होता था जब `search` plugin चालू हो, जिससे बिना search वाली साइट पर selector टूटा रह जाता।

### mkdocs-print-site

[mkdocs-print-site][print-site] सक्रिय थीम के templates से पूरी साइट को एक पेज के रूप में render करता है, जो यहाँ काम करता है। जो वह नहीं कर सकता, वह है print CSS देना: वह हर उस थीम के लिए एक stylesheet लाता है जिसे वह जानता है, और बाकियों के लिए `Theme 'primer' not yet supported` की चेतावनी देता है।

वैसे भी यह थीम का काम है। `theme.css` में एक `@media print` block है जो header, sidebar और pagination हटा देता है, content column को पूरी चौड़ाई दे देता है, और code blocks और tables को पेजों के बीच बँटने से रोकता है। यह body text को Primer के *हल्के* foreground रंग पर भी तय कर देता है, क्योंकि गहरे मोड में print करने वाले विज़िटर को नहीं तो सफ़ेद काग़ज़ पर हल्का धूसर text मिलता। यह block हर पेज पर लागू होता है, plugin हो या न हो।

### search

Built-in `search` plugin को ज़रूरत है कि थीम एक `search.html` template दे और `search/main.js` को scope में `base_url` के साथ load करे। दोनों थीम में हैं; plugin चालू होने पर header का search box दिखता है और बंद होने पर गायब हो जाता है।

### mkdocstrings

[mkdocstrings][mkdocstrings] `doc-*` classes के साथ अपना markup बनाता है और styling थीम पर छोड़ देता है। यहाँ यह पढ़ने लायक render होता है क्योंकि सब कुछ `.markdown-body` के अंदर आता है और Primer का type scale अपना लेता है, लेकिन थीम में `doc-*` के लिए अलग से कोई नियम नहीं हैं — signatures और parameter tables Primer के डिफ़ॉल्ट इस्तेमाल करते हैं। [रेफ़रेंस](../reference.md) वह पेज है जिसे यह generate करता है।

<a id="plugins-that-just-work"></a>

## वे plugins जो बस काम करते हैं

इन्हें well-formed HTML के अलावा थीम से कुछ नहीं चाहिए। पहला समूह इस साइट पर चालू है, ताकि यह बात सच बनी रहे:

| Plugin | इस साइट पर क्या करता है |
|:---|:---|
| [mkdocs-awesome-nav][awesome-nav] | `nav:` key के बजाय `docs/.nav.yml` से nav बनाता है। |
| [mkdocs-glightbox][glightbox] | [एलिमेंट्स](../elements.md) पर मौजूद images को lightbox में खोलता है। |
| [mkdocs-minify-plugin][minify] | हर पेज का HTML, CSS और JS minify करता है, थीम की inline रंग-मोड script समेत। |
| [mkdocs-redirects][redirects] | `/options/` को [कॉन्फ़िगरेशन](configuration.md) पर redirect करता है। |
| [mkdocs-macros-plugin][macros] | Markdown में Jinja render करता है। यह साइट **{{ config.site_name }}** है, जो `{{ config.theme.name }}` थीम से बनी है — यह वाक्य plugin से आता है, Markdown से नहीं। |

दूसरे समूह को इस साइट में जोड़ने के बजाय एक अलग, अस्थायी build में थीम के साथ जाँचा गया, क्योंकि हर एक को ऐसा fixture content चाहिए जो किसी थीम के दस्तावेज़ में अपनी जगह नहीं कमाता:

| Plugin | जाँचा गया |
|:---|:---|
| [mkdocs-swagger-ui-tag][swagger] | `<swagger-ui>` tag expand होता है, assets copy होते हैं। |
| [mkdocs-include-markdown-plugin][include-markdown] | Snippet inline होता है। |
| [markdown-exec][markdown-exec] | Code execute होता है, output inline होता है। |
| [mkdocs-table-reader-plugin][table-reader] | CSV एक table के रूप में render होता है। |
| [mkdocs-markdownextradata-plugin][extradata] | `extra:` के मान interpolate होते हैं। |
| [mkdocs-autolinks-plugin][autolinks] | सादे `[file.md](file.md)` links resolve होते हैं। |
| [mkdocs-encryptcontent-plugin][encryptcontent] | पेज का body encrypt होता है और HTML में कोई plaintext नहीं बचता, password form render होता है, और उसके आसपास थीम का ढाँचा सही-सलामत रहता है। |
| [mkdocs-monorepo-plugin][monorepo] | Sub-project `!include` के ज़रिए merge होता है। |
| `material/group` | किसी plugin group को चालू या बंद करता है। जब built-in `search` उसके अंदर हो, तो group चालू होने पर थीम का search box सही तरह दिखता है और बंद होने पर गायब हो जाता है। |

Nav और file स्तर के plugins — [mkdocs-literate-nav][literate-nav], [mkdocs-awesome-pages][awesome-pages], [mkdocs-exclude][exclude] — कभी किसी template तक पहुँचते ही नहीं।

<a id="known-plugin-conflicts"></a>

## ज्ञात plugin टकराव

हर खराबी थीम की वजह से नहीं होती। छह ऐसे टकराव जिनके बारे में जानना ज़रूरी है, और सभी किसी भी थीम के साथ दोहराए जा सकते हैं।

इनमें से तीन की वजह से ही यह साइट repository का इकलौता build नहीं है: इनमें शामिल plugins यहाँ पहले से चालू plugins के साथ एक config साझा नहीं कर सकते, इसलिए उन्हें `examples/` के नीचे अपनी अलग साइट मिलती है, जिसे वही CI job `--strict` के साथ build करता है।

[उदाहरण](../examples.md) पेज बताता है कि उनमें से हर एक क्या दिखाता है।

- **mkdocs-rss-plugin के साथ mkdocs-static-i18n** — RSS plugin `on_config` के दौरान
  अपने `date_from_meta.default_time` को string से `datetime` में बदल देता है। i18n plugin `on_config` को हर भाषा के लिए एक बार चलाता है, इसलिए दूसरा pass एक `datetime` को फिर से parse करता है और चेतावनी देता है, जिससे `--strict` build रुक जाता है। इसके बजाय [examples/rss/]({{ config.site_url }}examples/rss/) पर दिखाया गया है।
- **mkdocs-gen-files के साथ mkdocs-static-i18n** — `on_files` के दौरान बनी files
  को i18n plugin वर्गीकृत नहीं करता, जो `Unhandled file case` log करता है और उन्हें build से हटा देता है। इसके बजाय [examples/gen-files/]({{ config.site_url }}examples/gen-files/) पर दिखाया गया है, mkdocs-literate-nav के साथ, जो नहीं तो nav के लिए mkdocs-awesome-nav से होड़ करता।
- **Mermaid के साथ `minify_html`** — Mermaid अपना source line दर line parse करता है, और
  minifier उसके `<div>` के अंदर की newlines को मिटा देता है। Diagram *Syntax error in text* के रूप में render होता है और build कुछ नहीं कहता। इसके बजाय [examples/diagrams/]({{ config.site_url }}examples/diagrams/) पर दिखाया गया है, जो [mkdocs-charts-plugin][charts] को भी कवर करता है और यह भी कि दोनों रंग मोड कैसे अपनाते हैं।
- **`repo_url` के बिना mkdocs-monorepo** — किसी sub-project का पेज build करने पर
  `TypeError: join() missing 1 required positional argument` आता है। `repo_url` और `edit_uri` set करने से यह टल जाता है। Built-in `mkdocs` थीम के साथ भी बिल्कुल ऐसा ही होता है।
- **`search` के साथ ऐसी डिफ़ॉल्ट भाषा जिसे mkdocs-static-i18n सबसे पहले नहीं
  रखता** — i18n plugin हर भाषा के लिए एक build pass चलाता है, डिफ़ॉल्ट भाषा से
  शुरू करके, और फिर `languages` पर चलता है, जिस भाषा को अभी build किया उसे
  छोड़ते हुए। वह हर entry की तुलना डिफ़ॉल्ट भाषा से नहीं बल्कि पिछले pass से
  करता है, इसलिए पहले के अलावा कहीं और रखी गई डिफ़ॉल्ट भाषा दो बार build होती
  है और उसका हर पेज search plugin तक दो बार पहुँचता है। Index इन duplicates को
  search पेज तक ले जाता है, जो हर नतीजे को दो बार दिखाता है। डिफ़ॉल्ट भाषा को
  पहले रखने से यह टल जाता है, लेकिन साइट की इकलौती `404.html` और `search.html`
  आख़िरी pass ही लिखता है — इसलिए यह साइट `en` को आख़िर में रखती है और
  duplicate entries को `hooks.py` में हटा देती है।
- **non-Material थीम के साथ `material/search`** — Material का search plugin
  `partials/language.html` को *सक्रिय* थीम के Jinja environment से render करता है। जो थीम वह template नहीं देती, उसके साथ यह `TemplateNotFound` raise करता है और build रुक जाता है। इसके बजाय built-in `search` plugin इस्तेमाल करें; थीम उसी को ध्यान में रखकर बनाई गई है।

[autolinks]: https://github.com/zachhannum/mkdocs-autolinks-plugin
[awesome-nav]: https://lukasgeiter.github.io/mkdocs-awesome-nav/
[awesome-pages]: https://github.com/lukasgeiter/mkdocs-awesome-pages-plugin
[encryptcontent]: https://github.com/unverbuggt/mkdocs-encryptcontent-plugin
[mike]: https://github.com/jimporter/mike
[charts]: https://timvink.github.io/mkdocs-charts-plugin/
[exclude]: https://github.com/apenwarr/mkdocs-exclude
[extradata]: https://github.com/rosscdh/mkdocs-markdownextradata-plugin
[git-authors]: https://timvink.github.io/mkdocs-git-authors-plugin/
[git-date]: https://timvink.github.io/mkdocs-git-revision-date-localized-plugin/
[glightbox]: https://blueswen.github.io/mkdocs-glightbox/
[i18n]: https://ultrabug.github.io/mkdocs-static-i18n/
[include-markdown]: https://github.com/mondeja/mkdocs-include-markdown-plugin
[literate-nav]: https://github.com/oprypin/mkdocs-literate-nav
[macros]: https://mkdocs-macros-plugin.readthedocs.io/
[markdown-exec]: https://pawamoy.github.io/markdown-exec/
[mermaid2]: https://mkdocs-mermaid2.readthedocs.io/
[minify]: https://github.com/byrnereese/mkdocs-minify-plugin
[mkdocstrings]: https://mkdocstrings.github.io/
[monorepo]: https://github.com/backstage/mkdocs-monorepo-plugin
[print-site]: https://timvink.github.io/mkdocs-print-site-plugin/
[redirects]: https://github.com/mkdocs/mkdocs-redirects
[rss]: https://guts.github.io/mkdocs-rss-plugin/
[section-index]: https://github.com/oprypin/mkdocs-section-index
[swagger]: https://blueswen.github.io/mkdocs-swagger-ui-tag/
[table-reader]: https://timvink.github.io/mkdocs-table-reader-plugin/
