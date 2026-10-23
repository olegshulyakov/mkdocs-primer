# स्टाइलिंग

Stylesheets पेज तक एक तय क्रम में पहुँचती हैं: `@primer/primitives` के design
tokens, GitHub का `@primer/css`, Pygments के रंग, इस थीम की अपनी
`theme.css`, और आखिर में वह सब जो `extra_css` में दिया गया है। आखिर में आने की
वजह से ही आपके नियम `!important` के बिना जीतते हैं — लेकिन सिर्फ़ उतने ही वज़न
वाले नियमों के सामने, और इस पेज का असली जाल यहीं है।

चीज़ें इस क्रम में आज़माएँ: अगर कोई [थीम विकल्प](guide/configuration.md) उसे
संभालता है तो वह, फिर नीचे दिया कोई variable, फिर कोई Primer token, और उसके बाद
ही markup पर अपना खुद का नियम।

<a id="the-themes-layout-variables"></a>

## थीम के layout variables

ये पाँच variables थीम `:root` में declare करती है, और इन्हें set करने के लिए ही
बनाया गया है:

| Variable | Default | क्या नियंत्रित करता है |
| --- | --- | --- |
| `--primer-sidebar-width` | `288px` | navigation column, उसकी padding समेत |
| `--primer-rail-width` | `256px` | तीसरा column, जब window में उसके लिए जगह हो |
| `--primer-article-max` | `720px` | prose ज़्यादा से ज़्यादा कितना चौड़ा हो सकता है |
| `--primer-gutter` | `var(--base-size-16)` | window के किनारे से, और navigation से दूरी |
| `--primer-header-height` | `56px` | header, और sticky columns को उससे कितना नीचे रहना है |

आपकी अपनी stylesheet में एक `:root` block काफ़ी है, क्योंकि इन्हें और कोई
declare नहीं करता:

```css
/* docs/css/overrides.css, named in extra_css */
:root {
  --primer-article-max: 880px;
  --primer-sidebar-width: 240px;
}
```

जिन चौड़ाइयों पर layout अपना आकार बदलता है, वे इनमें शामिल नहीं हैं: sidebar
1012px पर column बनता है और outline 1280px पर rail में जाता है, दोनों media
queries में लिखे हैं, और media query कोई custom property नहीं पढ़ सकती। इसलिए
sidebar को पतला करने से वह पतला होता है, जल्दी नहीं दिखता।

<a id="primers-tokens"></a>

## Primer के tokens

रंग, साइज़ और typography सब `@primer/primitives` से आते हैं, जो
`mkdocs_primer/css/vendor/` में vendored है। नाम और उनके अर्थ Primer के हैं, और
उन्हें देखने की जगह [उनका documentation](https://primer.style/product/primitives/)
है; [एलिमेंट्स](elements.md) इस साइट की कुछ surfaces दिखाता है और बताता है कि
हर एक को कौन-सा token रंगता है।

किसी token को override करना वह जगह है जहाँ क्रम वाला नियम काफ़ी नहीं रहता:

```css
/* Does nothing. */
:root {
  --fgColor-default: #24292f;
}

/* Works. */
[data-color-mode][data-light-theme] {
  --fgColor-default: #24292f;
}
```

हर color token attribute selectors की एक जोड़ी पर declare होता है —
`[data-color-mode="light"][data-light-theme="light"]` और उसके variants, इसी तरह
एक stylesheet दोनों color modes रख पाती है। वह जोड़ी `:root` से ऊपर रहती है,
चाहे कोई भी फ़ाइल आखिर में आई हो, इसलिए `:root` वाला override चुपचाप छोड़ दिया
जाता है। वही दो attributes match करें, तो फ़ैसला फिर से क्रम से होता है, आपके पक्ष में।

साइज़ और typography अलग हैं: `primitives-base.css` उन्हें `:root` में declare
करती है, इसलिए `--base-size-16` और उसके जैसे variables सीधे `:root` override से बदल जाते हैं।

`light_theme` या `dark_theme` से पूरा palette एक साथ बदलना आज संभव नहीं है —
थीम सिर्फ़ `light` और `dark` के tokens vendor करती है, जैसा कि
[कॉन्फ़िगरेशन](guide/configuration.md) में चेतावनी दी गई है।

<a id="what-not-to-reach-for"></a>

## किन चीज़ों पर भरोसा न करें

`primer-*` class names वह तरीका हैं जिससे stylesheet खुद से बात करती है, कोई
public interface नहीं। Layout बदलने पर इनके नाम और काम बदलते रहते हैं: हाल की
releases में `.primer-toc-summary` को `<summary>` से हटाकर एक button पर ले जाया
गया, `.primer-nav-section-label` किसे चिह्नित करता है यह बदला गया, और language
control से `.btn-octicon` हटाया गया। इनमें से किसी पर लिखा आपका अपना नियम किसी
version को pin करने लायक वजह है।

थीम के दो और variables settings नहीं, बल्कि flags हैं।
`--primer-toc-rail` से stylesheet scripts को बताती है कि window rail के लिए काफ़ी
चौड़ी है या नहीं, और `--primer-nav-depth` वह nesting level है जो navigation
template हर row पर लगाता है ताकि उससे indent निकाला जा सके।
इनमें से किसी को भी बाहर से set करने से कुछ चालू नहीं होता; बस उसे पढ़ने वाला
code गुमराह होता है।

Color mode को style करने के बजाय script से संभालने के लिए, थीम `document` पर
`primer:color-mode-change` event fire करती है, जिसका इस्तेमाल
[diagrams उदाहरण](examples.md) फिर से draw करने के लिए करता है।
