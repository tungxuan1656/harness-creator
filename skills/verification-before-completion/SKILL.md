---
name: verification-before-completion
description: Provide optional fresh verification evidence before claiming a result is verified or passing. Evidence before verification assertions.
metadata:
  version: "1.0.0"
  license: MIT
---

# Verification Before Completion

Verification is recommended quality support, not a prerequisite for the feature owner to close work.
The owner may decide a feature is complete based on judgement, self-test, code review, or without a
recorded reason.

## Policy

When verification is selected before reporting a result:

1. Identify the command that proves the claim.
2. Run it fresh.
3. Read the actual output.
4. Report what passed, what failed, or what did not run.

If selected verification cannot run, say so explicitly:

```text
Implemented, but not verified because <reason>. Risk: <what could be wrong>.
```

Do not claim that verification passed when it did not run. A feature may still be closed by its
owner without running verification or recording evidence.

## Optional verification report

```text
Verification:
- Command:
- Result:
- Evidence:
- Not run / reason:
```

## Rules

- Do not infer build success from lint success.
- Do not infer a verification pass from code inspection alone.
- Do not reuse old output as fresh verification evidence.
- If checks are run and fail, say what failed and cite the command; the failure is not a mandatory
  close blocker unless the owner chooses to treat it as one.
