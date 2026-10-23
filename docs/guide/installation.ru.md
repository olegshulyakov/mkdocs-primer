# Установка

Установите тему из PyPI:

```console
$ pip install mkdocs-primer
```

Затем выберите её в `mkdocs.yml`:

```yaml
theme:
  name: primer
```

Это вся настройка — у каждой опции ниже есть рабочее значение по умолчанию.

Тема так же работает с [ProperDocs](https://properdocs.org/) — продолжением MkDocs 1.x. Установите его через `pip install properdocs` и собирайте сайт командой `properdocs build`. Он читает тот же `mkdocs.yml`.
