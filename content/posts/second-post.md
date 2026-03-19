---
title: On Building CLIs That Don't Suck
date: 2026-02-10
description: A collection of principles I've picked up from building and using command-line tools over the years.
tags: [cli, go, tooling, dx]
---

# On Building CLIs That Don't Suck

I've built a lot of CLIs — for internal tooling, open-source side projects, and everyday scripts. I've also used a lot of CLIs that made me want to throw my laptop out the window.

Here's what I've learned.

## Principle 1: Fail loudly, fail early

Nothing is worse than a CLI that silently does the wrong thing. If something goes wrong, say so — loudly, with context, and ideally with a hint about how to fix it.

```go
func validateConfig(path string) error {
    if _, err := os.Stat(path); os.IsNotExist(err) {
        return fmt.Errorf("config file not found: %s\n\nRun `mytool init` to create one.", path)
    }
    return nil
}
```

The error message above does three things:
1. States what went wrong (`config file not found`)
2. Shows the actual value (`path`)
3. Suggests a remedy (`mytool init`)

## Principle 2: Respect stdout and stderr

- **stdout** is for output the user might pipe or redirect
- **stderr** is for progress messages, warnings, and errors

If you mix them, you break piping. This is an easy mistake to make:

```go
// BAD — progress on stdout breaks piping
fmt.Println("Processing 42 items...")
fmt.Println(result)

// GOOD — progress on stderr, data on stdout
fmt.Fprintln(os.Stderr, "Processing 42 items...")
fmt.Println(result)
```

## Principle 3: Make `--help` actually helpful

The default help output from most frameworks is mediocre. Write real descriptions. Include examples. Show what the output looks like.

## Principle 4: Support `--dry-run`

Any command that mutates state should have a `--dry-run` flag that shows what *would* happen without doing it. This builds trust and makes debugging trivial.

## Principle 5: Be a good unix citizen

- Exit with code 0 on success, non-zero on failure
- Respect `$NO_COLOR` to disable ANSI codes
- Read from stdin when `-` is passed as a file argument
- Don't print a newline-less final line (always end with `\n`)

---

These aren't revolutionary ideas — they're just the basics that a surprising number of tools get wrong. Build tools you'd want to use yourself.
