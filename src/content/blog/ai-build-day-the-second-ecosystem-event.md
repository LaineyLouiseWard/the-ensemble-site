---
title: 'Learning to Build with AI (+ a Sceptical Team)'
description: |
  The second iScholars Ecosystem event, with AI broadcaster Jonathan McCrea.
pubDate: 'Jul 3 2026 10:00'
authors: ['lainey']
track: 'events'
featured: true
tags: ['AI', 'Claude Code', 'iScholars', 'science communication']
coverCaption: 'Carer vulnerability by Census small area, from the map we built (carer-map-ireland.vercel.app)'
---

The second Ecosystem event was an AI Build Day, hosted by broadcaster <a href="https://www.newstalk.com/shows/futureproof-234909" target="_blank" rel="noopener noreferrer">Jonathan McCrea</a> of Newstalk's Futureproof. He doesn't have a science degree, but he's used AI to help him help scientists communicate, and now runs AI training for organisations off the back of it. It's a thread I keep noticing in the communicators and innovators who come in to talk to us.

Each group was asked to arrive with a problem they wanted to solve. Across three sessions, Jonathan walked us through using AI to attack that problem and building a platform to show it off.

## The Split in the Room

There was an interesting divide between the very pro-AI and the anti-AI, and I was teamed with the latter. That made sense. My teammates work in healthcare-adjacent fields, so they're well primed in ethics and the handling of highly sensitive data. I'm so caught up in my own agentic workflows and Decarb-AI bubble that I forget not everyone is. Some of my team were surprised you can talk to ChatGPT out loud and have it talk back, the way Jonathan does when he's prepping for a talk, waiting in the car to collect his kids.

Some of their caution was well-founded, and working with sensitive health data earns you a bit of scepticism. But I noticed a pattern in how the tools get judged. When they fail, it's taken as proof that AI is bad, rather than user error or the tool being pushed past what it can do. Most of that comes down to not having spent time on how they work and how to use them. Not everyone knew you can hand NotebookLM a set of papers and have it answer only from those. Hallucination came up too, and Jonathan's answer was that you're absolutely responsible for verifying everything you then write down and claim is true.

## The Build

We each had a role. I was technical lead, the person who turns the team's ideas into working code. We also had a UX designer, a communications lead, a science lead, and a data lead.

Then came the Claude Code session. In a large, ambitious room of iScholars and innovators it's hard not to get ahead of ourselves and aim for far more than a few hours allows. I was sweating in the final 60 seconds when the deploy to Vercel, where the site is hosted, failed to launch just as we were called up to present.

What we built is the <a href="https://carer-map-ireland.vercel.app" target="_blank" rel="noopener noreferrer">Carer Vulnerability Map of Ireland</a>. Almost 300,000 people in Ireland provide unpaid care (Census 2022), many of them older, poorer, or isolated themselves. The map folds four need signals into a single vulnerability score, shown at three levels: 8 regions, all 18,919 Census small areas, and the 20 HSE areas that care providers plan around. Real support services are overlaid on top, so you can see where need and supply don't meet. I spent the two days after the event ironing out the details we couldn't get to on the day.

![The map cycling through its three geography levels: regions, small areas, and HSE areas](/images/blog/ai-build-day-the-second-ecosystem-event/demo.gif)

The <a href="https://github.com/LaineyLouiseWard/carer-map-ireland" target="_blank" rel="noopener noreferrer">repository</a> is public, and worth a look beyond the map itself. The CLAUDE.md and README are the two files that matter most for a healthy Claude Code setup.
