# Superpowers for GitHub Copilot Chat

This file configures GitHub Copilot Chat to use Superpowers skills automatically.

## CRITICAL RULE

**Before ANY response or action, check if a skill applies.** Even a 1% chance means you must invoke the relevant skill.

IF A SKILL APPLIES, YOU MUST USE IT. This is not negotiable.

---

## Available Skills

You have access to these Superpowers skills (read from the skills folder):

### Core Workflow
- **brainstorming** (`skills/brainstorming/SKILL.md`) - ALWAYS invoke before writing new feature code
- **writing-plans** (`skills/writing-plans/SKILL.md`) - After design approval, create detailed plans
- **executing-plans** (`skills/executing-plans/SKILL.md`) - Execute plans in batches with checkpoints
- **subagent-driven-development** (`skills/subagent-driven-development/SKILL.md`) - Two-stage review workflow

### Development
- **test-driven-development** (`skills/test-driven-development/SKILL.md`) - RED-GREEN-REFACTOR for ALL code
- **systematic-debugging** (`skills/systematic-debugging/SKILL.md`) - 4-phase root cause analysis for bugs
- **verification-before-completion** (`skills/verification-before-completion/SKILL.md`) - Verify fixes work

### Collaboration
- **requesting-code-review** (`skills/requesting-code-review/SKILL.md`) - Pre-review checklist
- **receiving-code-review** (`skills/receiving-code-review/SKILL.md`) - Respond to feedback
- **dispatching-parallel-agents** (`skills/dispatching-parallel-agents/SKILL.md`) - Parallel subagents

### Git Workflow
- **using-git-worktrees** (`skills/using-git-worktrees/SKILL.md`) - Parallel branch development
- **finishing-a-development-branch** (`skills/finishing-a-development-branch/SKILL.md`) - Merge/PR decisions

### Meta
- **writing-skills** (`skills/writing-skills/SKILL.md`) - Create new skills
- **using-superpowers** (`skills/using-superpowers/SKILL.md`) - System introduction

---

## Mandatory Workflow

1. User asks to build something → **Invoke brainstorming FIRST**
2. Design approved → **Invoke writing-plans**
3. Writing ANY code → **Invoke test-driven-development**
4. Bug appears → **Invoke systematic-debugging**
5. Claiming "done" → **Invoke verification-before-completion**

---

## Red Flags - STOP and Invoke Skills

If you think any of these thoughts, STOP - you're rationalizing:

| Thought | Reality |
|---------|---------|
| "This is just a simple question" | Questions are tasks. Check for skills. |
| "I need more context first" | Skill check comes BEFORE clarifying. |
| "Let me explore the codebase first" | Skills tell you HOW. Check first. |
| "This doesn't need a formal skill" | If a skill exists, USE IT. |
| "I'll just do this one thing first" | Check BEFORE doing anything. |

---

## How to Use Skills

When a skill applies:

1. **Read the skill file** from the path shown above
2. **Announce**: "Using [skill] to [purpose]"  
3. **Follow the skill EXACTLY** - don't summarize or adapt away discipline
4. **If it has a checklist**, work through each item
5. **Use reference files** in the skill's folder if needed

---

## Example Triggers

| User Request | First Action |
|--------------|--------------|
| "Build a login feature" | Read and follow `skills/brainstorming/SKILL.md` |
| "Fix this bug" | Read and follow `skills/systematic-debugging/SKILL.md` |
| "Write this function" | Read and follow `skills/test-driven-development/SKILL.md` |
| "Review my code" | Read and follow `skills/requesting-code-review/SKILL.md` |

---

## Priority Order

1. **User's explicit instructions** (highest priority)
2. **Superpowers skills** (override default behavior)
3. **Default Copilot behavior** (lowest priority)

If the user explicitly says "skip TDD", then skip it. User instructions always win.

---

## Skill Invocation Process

```
User message
    ↓
Check: Does ANY skill apply? (even 1% chance)
    ↓
YES → Read the skill file → Follow it exactly
NO → Proceed with response
```

---

**Skills folder location**: `./skills/` (relative to this file's parent directory)
