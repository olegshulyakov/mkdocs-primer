# Agent instructions

## Track work in GitHub Issues

When you find a bug, notice a problem worth fixing later, or plan a new feature, open a GitHub issue for it. Do not leave it in chat or in a local notes file — the issue is what keeps the history of the problem and the progress on it.

```console
gh issue list --search "keyword"        # look for an existing issue first
gh issue create --title "..." --body "..." --label bug
```

- Title states what is wrong or what should exist. Body gives the steps to reproduce, or what "done" looks like, plus the files involved. `gh issue create` skips the forms in `.github/ISSUE_TEMPLATE/`, so cover the same fields in the body yourself.
- Use the labels that already exist: `bug`, `enhancement`, `documentation`, `accessibility`.
- Record progress on the issue as you go — comment on what you found and what you tried, so the next person does not repeat the investigation.
- Reference the issue from the commit or pull request that fixes it (`Fixes #12`), so it closes together with the change.

`.agents/TODO.md` is a leftover local list, not the tracker. Move anything still listed there into issues and do not add new items to it.
