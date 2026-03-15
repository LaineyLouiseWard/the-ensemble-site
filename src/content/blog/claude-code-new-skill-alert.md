---
title: 'Claude Code: New Skill Alert! (PART I)'
description: |
  From ChatGPT copy-paste to agentic assistants: expanding the kitchen with Claude Code.
pubDate: 'Mar 7 2026'
authors: ['lainey']
track: 'phd-tips'
featured: true
tags: ['AI', 'tools', 'workflow', 'vibe-coding']
---

<br />

Vibe coding, but the vibes had gone sour.

Most people are already doing it. Where you fall just depends on how deeply AI is integrated into your workflow. Some people microdose the vibes by using GitHub Copilot to fill in a few lines, ask for a function when you're stuck. Other people full-send it in ChatGPT, creating projects, attaching 40 files, and sending it chunks of code. Regardless, it tends to be a back-and-forth conversation.

For the longest time, my workflow looked like this: get stuck, open ChatGPT, explain context, paste code, remind it what we were doing, realise it forgot, paste context again, go for a walk. Repeat. Like talking to an elderly friend with Alzheimer's.

The ChatGPT workflow I'd adopted reminded me of those old telephone exchanges from the 1950s, where you couldn't just dial someone directly. You'd have to go through a switchboard operator, explain who you wanted to reach, wait to be connected, and if the line dropped you were calling back and explaining the whole thing again from scratch.

One day, I wondered if I could build my own local ChatGPT, but then I fell into the deep end of LLM integration: Claude Code.

## So What Exactly Is Claude Code?

Claude itself is a family of large language models built by Anthropic, trained on a mixture of publicly available text, licensed data, code repositories, documentation, and discussions (the usual modern LLM diet).

Claude Code is different: it's an agentic assistant that runs in your terminal. It's like a local ChatGPT that can see inside your project repository and gather context itself, not just the snippet you pasted, but the actual structure, the dependencies, the READMEs.

I've been testing it over the last week or two with things to report back on. I tested both the free tier and the paid subscriptions: Pro (~€25) and Max 5x (~€100). Pro wasn't enough for daily usage, and Max 5x hasn't run out of tokens once for me, which is a relief given the price. First though, if you're considering paying for it, understand the currency.

## Tokens

There are two limits to keep in mind. Each chat has a context window of roughly 200k tokens. When it fills up, you can compact the conversation into a summary and continue, but it's not infinite.

There are also session and usage limits. Depending on your plan, there are rolling time-based limits and weekly caps across chats. The difference with Claude Code is that you have more ways to conserve tokens while still giving it access to your full repo context.

## Terminology

You can use base or "vanilla" Claude Code almost immediately in VS Code. If you think of it like a kitchen, the base model is just the chef. The rest are tools you can choose to add depending on how elaborate you want the setup to be.

**Slash commands** are like standard prep steps you don't want to explain every time. Instead of rewriting the same structured prompt, you define it once and reuse it. For example, a `/compact` command can summarise a long chat so you can keep working without hitting the context limit.

**Skills** are written recipes pinned to the wall. They're markdown files that define repeatable workflows: a code review, a documentation check, paper formatting rules. Instead of restating your standards every session, you encode them once and reuse them. There's even a meta-skill that writes skills for you. I used it to create one that tells Claude how to read my repo, check the README and CLAUDE.md files, and keep conventions consistent when I run forecast verification.

**Agents** are closer to specialist chefs you can send off with instructions and a recipe. You equip them with skills, assign the task, and they return with a summary rather than filling your main context with every intermediate step.

**Hooks** are small automations, like setting a timer that triggers something when a condition is met. Plugins are pre-packaged bundles of these tools.

In practice, for research and coding, skills are probably the most useful piece. The rest are worth knowing about so you understand what's possible, even if you rarely need them.

## Summary

Day-to-day research runs on repositories, analysis scripts, reproducibility, rerunning pipelines, and documenting everything properly. On paper, it feels like a perfect fit, so why aren't more researchers using it?

Maybe it's because publishing forces you to be deeply attached to your code. When your name is on a paper, you're accountable for every line. Maybe AI introduces a wedge there, a slight distance between you and "your" work.

Or maybe it's just the slow inertia of academia.

I'm still asking around, trying to figure out why. But the more I use it, the more I realise: once you see how much of your workflow can be vibe coded, you start asking slightly uncomfortable questions.

About authorship.

About ownership.

About what it means to "do the work."

I explore that more in [Claude Code: Moral Dilemma Alert! (PART II)](/blog/claude-code-moral-dilemma).
