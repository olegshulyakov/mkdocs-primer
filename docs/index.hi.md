# MkDocs Primer थीम

[MkDocs](https://www.mkdocs.org/) के लिए एक थीम, जो [GitHub के Primer design
system](https://primer.style/) पर बनी है — ऐसा documentation जो देखने में
GitHub का ही हिस्सा लगे।

यह साइट खुद इसी थीम से render हुई है। आप जो लेख पढ़ रहे हैं, उसकी styling
GitHub के अपने `.markdown-body` नियमों से आती है, और उसके आसपास का सब कुछ —
header, navigation tree, breadcrumb trail, दाईं ओर की rail में outline — वही है
जो आपकी अपनी साइट को configuration की दो लाइनों से मिलता है।

<a id="install"></a>

## इंस्टॉल करें

```console
$ pip install mkdocs-primer
```

```yaml
# mkdocs.yml
theme:
  name: primer
```

बस इतना ही setup है: हर विकल्प का एक काम करने वाला default है, और थीम वही
`nav` render करती है जो MkDocs पहले ही बना चुका होता है। देखें [इंस्टॉलेशन](guide/installation.md)।

<a id="what-you-get"></a>

## आपको क्या मिलता है

- **लेख का वैसा ही rendering जैसा GitHub पर होता है** — github.com पर किसी
  README जैसी typography, tables, code chrome और hover anchors। Primer CSS
  package में vendored है, इसलिए थीम इंस्टॉल करने के लिए Node toolchain नहीं चाहिए।
- **Light और dark**, Primer के color primitives से। Header का control तब तक
  operating system के हिसाब से चलता है जब तक visitor खुद कोई mode न चुने, और
  उसके बाद वह चुनाव याद रखता है। Syntax highlighting भी उसी के साथ बदलती है।
- **बड़ी साइट पर भी चलने वाला navigation** — असीमित nesting वाला sidebar, जो
  उसी section तक खुला रहता है जिसमें पाठक है, साथ में breadcrumb trail,
  previous/next links, एक search पेज और एक 404 पेज।
- **GitHub के alerts जैसे दिखने वाले admonitions।** `admonition` extension कोई
  CSS नहीं देता और `@primer/css` में उसके लिए कोई नियम नहीं है, इसलिए ज़्यादातर
  थीम में `!!! note` बिना किसी styling के render होता है।
- थीम के अपने टेक्स्ट के लिए **सात भाषाएँ** — English, Spanish, French,
  Hindi, Portuguese, Russian और Chinese — और right-to-left layouts।
- **उन plugins का support जिन्हें थीम की मदद चाहिए**: section index पेज,
  अनुवादित साइटें, revision dates और authors, RSS autodiscovery, और mike का
  version selector।

<a id="where-to-go-next"></a>

## आगे कहाँ जाएँ

[गाइड](guide/index.md)

:   इंस्टॉलेशन, थीम का हर विकल्प, और वे plugins जिनके साथ यह थीम परखी
    गई है।

[एलिमेंट्स](elements.md)

:   लेख के अंदर हर वह block जिसे थीम style करती है, एक-एक बार — admonitions,
    quotes, code, tables, images।

[स्टाइलिंग](styling.md)

:   अपनी stylesheet में set करने वाले variables, और Primer token का वह एक
    override जो वैसे काम नहीं करता जैसा लगता है कि करना चाहिए।

[उदाहरण](examples.md)

:   तीन पूरी साइटें, जो दिखाती हैं कि थीम feeds, generated पेजों और diagrams
    के साथ क्या करती है।

[रेफ़रेंस](reference.md)

:   थीम package का अपना documentation, जिसे mkdocstrings render करता है।
