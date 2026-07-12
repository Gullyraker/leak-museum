# Exhibit 14 — "I deleted it, so it's gone" (it isn't)

This exhibit is built from the repository's own commit history, not just a file.

A file named `leaked_once.txt` containing an API key was added in one commit and
"removed" in a later commit. It is not in the current tree — but it is still in
history:

```bash
git log --oneline -- exhibits/14-still-in-history/leaked_once.txt
git show <the-adding-commit>:exhibits/14-still-in-history/leaked_once.txt
```

## Why this is catastrophic
`git rm` (or deleting and committing) removes a file from the latest snapshot,
not from history. Every clone still carries the secret, and anyone can read it
with a one-line `git show`. This is the single most common way "fixed" leaks
stay exploitable.

## Do this instead
- Treat any committed secret as compromised: rotate it immediately. Rotation,
  not deletion, is the fix.
- To scrub history (after rotating), rewrite it with `git filter-repo` (or BFG),
  then force-push and have everyone re-clone.
- Prevent it up front with a pre-commit secret scanner and push protection.
