# उदाहरण

Repository में `examples/` के नीचे तीन पूरी साइटें हैं। हर एक इस साइट वाले CI job
में ही `--strict` के साथ build होती है और इसके साथ ही publish होती है, इसलिए आप
जो देखते हैं वह वही है जो नीचे दिया configuration बनाता है।

ये इसलिए हैं क्योंकि इनमें इस्तेमाल हुए plugins उन plugins के साथ एक config साझा
नहीं कर सकते जो यह साइट पहले से इस्तेमाल करती है — [प्लगइन](guide/plugins.md)
हर मामले में बताता है कि क्या टूटता है। लेकिन इन्हें उसके नतीजे की तरह नहीं,
बल्कि थीम की तीन क्षमताओं की तरह पढ़ें: feed वाली साइट, ऐसी साइट जिसके पेज एक
script लिखती है, और diagrams वाली साइट।

<a id="a-site-with-a-feed"></a>

## Feed वाली साइट

[**examples/rss/**]({{ config.site_url }}examples/rss/)
[mkdocs-rss-plugin](https://guts.github.io/mkdocs-rss-plugin/) चलाती है, जो
`feed_rss_created.xml` और `feed_rss_updated.xml` लिखता है और बस वहीं रुक जाता है।
थीम `<link rel="alternate">` जोड़ी emit करती है जो browser या reader को उन फ़ाइलों
तक ले जाती है, और filenames को hardcode करने के बजाय plugin के अपने configuration
से लेती है — वहाँ पेज का source देखें, दोनों `<head>` में मिलेंगे।

उसी साइट पर `git-authors` चालू है, इसलिए footer थीम के "इस पृष्ठ को सुधारें"
link के साथ यह भी दिखाता है कि पेज को आखिरी बार किसने बदला।

<a id="pages-that-do-not-exist-on-disk"></a>

## ऐसे पेज जो disk पर मौजूद नहीं हैं

[**examples/gen-files/**]({{ config.site_url }}examples/gen-files/) अपना
`Generated` section build के समय बनाती है: `gen_pages.py`
[mkdocs-gen-files](https://oprypin.github.io/mkdocs-gen-files/) के ज़रिए Markdown
लिखती है, और [mkdocs-literate-nav](https://github.com/oprypin/mkdocs-literate-nav)
navigation को एक `SUMMARY.md` से लेता है जिसमें वह section शामिल है। `generated/`
के नीचे का कुछ भी repository में नहीं है।

API reference आम तौर पर इसी combination से बनता है, और यहाँ देखने वाली चीज़
sidebar है: वह nest होता है, और उसका section label एक link है, क्योंकि
`section-index` ने generated index पेज को section में ही मिला दिया है।

<a id="diagrams-and-charts"></a>

## Diagrams और charts

[**examples/diagrams/**]({{ config.site_url }}examples/diagrams/) Mermaid
diagrams को [mkdocs-mermaid2](https://mkdocs-mermaid2.readthedocs.io/) से और
Vega-Lite charts को [mkdocs-charts-plugin](https://timvink.github.io/mkdocs-charts-plugin/)
से render करती है।

दोनों browser में draw होते हैं, इसलिए दोनों को बताना पड़ता है कि पेज किस color
mode में है — वरना dark लेख में diagram एक सफ़ेद card बनकर रह जाता है। Mermaid
उस साइट की `mkdocs.yml` में लिखे एक JavaScript expression के ज़रिए थीम का
`data-color-mode` attribute पढ़ता है; charts plugin इसके बजाय Material का attribute
ढूँढता है, और वहाँ का पेज बताता है कि इससे आपके पास क्या बचता है। Header toggle
इस्तेमाल करने पर दोनों में से कोई फिर से draw नहीं होता, इसीलिए थीम उस पेज के लिए
`primer:color-mode-change` event fire करती है जो इसे संभालना चाहे।

<a id="building-them-yourself"></a>

## इन्हें खुद build करना

हर उदाहरण की अपनी `mkdocs.yml` है और वह `site/examples/<name>/` में लिखता है।
पहले मुख्य साइट build करें: `mkdocs build` `site/` को साफ़ कर देता है, और उसके साथ
examples भी मिट जाएँगे।

```console
$ mkdocs build --strict
$ mkdocs build --strict -f examples/rss/mkdocs.yml
$ mkdocs build --strict -f examples/gen-files/mkdocs.yml
$ mkdocs build --strict -f examples/diagrams/mkdocs.yml
```
