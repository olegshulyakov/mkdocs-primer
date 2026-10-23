# एलिमेंट्स

लेख के अंदर हर वह block जिसे थीम style करती है, एक-एक बार। Markdown जो कुछ
बनाता है, उसका ज़्यादातर हिस्सा `@primer/css` संभाल लेता है; यहाँ बाकी का हिस्सा
इकट्ठा है — जो थीम उसके ऊपर जोड़ती है, और जिसे थीम में बदलाव करते समय बिना
ध्यान दिए तोड़ देना आसान है। पेज के आसपास का chrome तो हर पेज पर होता ही है।

हर admonition type का stylesheet में अपना selector है, इसलिए नीचे हर alias को
prose की एक लाइन के बजाय अपना अलग block मिला है: जिस type को कोई लिखकर नहीं
दिखाता, उसके गायब होने पर किसी का ध्यान भी नहीं जाता।

<a id="admonitions"></a>

## एडमोनिशन

`admonition` extension markup बनाता है पर CSS नहीं देता, और `@primer/css` में भी
`.admonition` के लिए कोई नियम नहीं है, इसलिए नीचे का सब कुछ थीम से आता है।
इनका आकार GitHub के alerts जैसा है — हल्के रंग वाला background, बाईं ओर रंगीन
रेखा, रंगीन title और उस type का octicon।[^alerts]

!!! note
    `note` को Primer का accent नीला रंग और `info` octicon मिलता है। Inline code —
    `mkdocs.yml` — अपना अर्ध-पारदर्शी background रखता है, जो tint के ऊपर परत की
    तरह चढ़ता है, उसमें धूसर छेद नहीं करता।

!!! tip
    `tip` को success हरा रंग और `light-bulb` octicon मिलता है।

!!! hint "hint"
    `tip` का alias, हाथ से लिखे title के साथ ताकि यहाँ दोनों को अलग पहचाना
    जा सके।

!!! important
    `important` को वह बैंगनी रंग मिलता है जिसे Primer "done" कहता है, और `report` octicon।

!!! warning
    `warning` को attention पीला रंग और `alert` octicon मिलता है।

!!! attention "attention"
    `warning` का alias।

!!! caution "caution"
    `warning` का दूसरा alias।

!!! danger
    `danger` को danger लाल रंग और `stop` octicon मिलता है।

!!! error "error"
    `danger` का alias।

!!! bug "bug"
    `danger` का दूसरा alias।

!!! example
    जिस type के लिए GitHub में कोई alert नहीं है, उसे neutral fill और neutral
    रेखा मिलती है, और कोई icon नहीं — न रंगीन title, न icon की जगह खाली जगह।

!!! note "आपका अपना title, जिसमें `code` है"
    Type का रंग पूरे title पर चढ़ता है, और inline code के अपने background के
    साथ यह जोड़ी 4.5:1 से नीचे चली जाती है — इसलिए title में code को text का
    default रंग ही दिया जाता है।

!!! warning "शीर्षक वाला ब्लॉक, जिसके नीचे कुछ नहीं"

<a id="quotes"></a>

## कोट्स

> Quote को neutral fill मिलता है, admonition की आधी padding के साथ: उसे alert
> से शांत दिखना चाहिए, alert का कोई और प्रकार नहीं।
>
> दो paragraphs, यह दिखाने के लिए कि fill आखिरी paragraph के नीचे बंद होता है,
> पहले के नीचे नहीं।

<a id="code"></a>

## कोड

Fenced blocks को Pygments highlight करता है और उनके रंग Primer के
`prettylights` variables से आते हैं, इसलिए वे color mode के साथ बदलते हैं। हर
block के कोने में एक copy button होता है।

```python
from mkdocs_primer import __version__


def greet(name: str = "world") -> str:
    """Docstrings, keywords, strings and numbers all take separate colors."""
    return f"hello {name} from {__version__}"
```

जिस block की लाइनें column से लंबी हों, वह wrap होने या पेज को फैलाने के बजाय
बगल की ओर scroll होता है:

```console
$ mkdocs build --strict -f examples/rss/mkdocs.yml && mkdocs build --strict -f examples/gen-files/mkdocs.yml && mkdocs build --strict -f examples/diagrams/mkdocs.yml
```

Diffs का अपना अलग treatment है। Hunk header वाली लाइन पर ध्यान दें: यही एक जगह
है जहाँ highlighting GitHub के palette से हटती है, क्योंकि GitHub वहाँ जो रंग
इस्तेमाल करता है वह dark mode में code background के सामने 4.5:1 से नीचे चला जाता है।

```diff
--- a/mkdocs.yml
+++ b/mkdocs.yml
@@ -1,3 +1,3 @@
 theme:
-  name: mkdocs
+  name: primer
```

<a id="tables"></a>

## टेबल

Primer बारी-बारी की rows में stripes लगाता है और header को bold करता है; थीम
सिर्फ़ यह जोड़ती है कि जब table फ़िट न हो तब क्या हो। Column से चौड़ी table पेज
को फैलाने के बजाय बगल की ओर scroll होती है — और क्योंकि `table` focusable नहीं
होती, थीम उसे तब तक tab stop बना देती है जब तक वह overflow करती है, ताकि किनारे
से बाहर लटका हिस्सा pointer के बिना भी पहुँचा जा सके। ऊपर वाली लंबी command को
भी बिल्कुल यही treatment मिलता है, और वह इसे दिखाने लायक चौड़ी है।

इस पेज की surfaces `@primer/primitives` से आती हैं, और इसी वजह से वे थीम के
नियमों का दूसरा set रखे बिना color mode के साथ बदलती हैं:

| Token | Light | Dark | कहाँ दिखता है |
| --- | --- | --- | --- |
| `--bgColor-default` | `#ffffff` | `#0d1117` | लेख, और उसके पीछे का पेज |
| `--bgColor-inset` | `#f6f8fa` | `#010409` | header और sidebar |
| `--bgColor-muted` | `#f6f8fa` | `#151b23` | quotes, और वह admonition जिसका GitHub में कोई समकक्ष नहीं |
| `--bgColor-attention-muted` | `#fff8c5` | `#bb800926` | `!!! warning` के पीछे का fill |
| `--button-default-bgColor-rest` | `#f6f8fa` | `#212830` | इस पेज के नीचे के prev/next cards |
| `--underlineNav-borderColor-active` | `#fd8c73` | `#f78166` | sidebar में मौजूदा पेज का निशान |

<a id="definition-lists"></a>

## डेफ़िनिशन लिस्ट

`def_list` extension नीचे दिए raw HTML से सरल syntax लेता है:

`docs_dir`

:   वह directory जहाँ से MkDocs Markdown पढ़ता है।

`site_dir`

:   वह directory जहाँ MkDocs HTML लिखता है।

दोनों Primer तक एक ही `<dl>` के रूप में पहुँचते हैं, और इन्हें साथ दिखाने का यही
मकसद है — एक के लिए लिखा गया नियम दूसरे पर भी लागू होता है:

<dl>
<dt>नाम</dt>
<dd>Godzilla</dd>
<dt>जन्म</dt>
<dd>1952</dd>
<dt>जन्मस्थान</dt>
<dd>जापान</dd>
</dl>

<a id="images"></a>

## इमेज

Column की चौड़ाई थीम तय करती है — `.primer-content` में वह सीमा है जो prose को
130 अक्षरों की लाइन तक जाने से रोकती है — इसलिए उस column से चौड़ी image पेज पर
रखने लायक है। उसे layout को बगल में धकेलने के बजाय column के अंदर ही रहना चाहिए।

साइट पर content images सिर्फ़ यही हैं, इसलिए [mkdocs-glightbox](guide/plugins.md)
के पास काम करने के लिए भी सिर्फ़ यही हैं — किसी पर click करें और वह lightbox में
खुलेगी।

![Octocat](https://github.githubassets.com/images/icons/emoji/octocat.png)

![GitHub repository में branching](https://docs.github.com/assets/images/help/repository/branching.png)

<a id="headings"></a>

## हेडिंग

दाईं ओर की rail में outline इसी पेज के headings से बनता है, और हर heading में
एक permalink होता है जो hover करने पर दिखता है — एक octicon, जिसे थीम `toc`
extension के बनाए anchor के ऊपर draw करती है।

<a id="a-third-level"></a>

### तीसरा स्तर

Nested headings outline में अंदर की ओर खिसकते हैं, इसलिए यह heading वहाँ
**हेडिंग** के नीचे दिखता है।

<a id="a-fourth-level"></a>

#### चौथा स्तर

इतना गहरा कि दिख जाए कि outline अंदर की ओर खिसकता रहता है, और rail में इतनी
अंदर की entry के text के लिए भी जगह बची रहती है।

[^alerts]: GitHub अपने alerts को `.markdown-alert` class के साथ render करता है, जिसे
    `@primer/css` publish नहीं करता, इसलिए थीम extension के `.admonition`
    markup को सीधे style करती है। यही footnote `footnotes` extension को भी
    परखता है।
