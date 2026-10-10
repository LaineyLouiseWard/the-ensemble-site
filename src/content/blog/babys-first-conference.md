---
title: "Baby's First Conference!"
description: |
  Reflections from my first conference.
pubDate: '2026-10-10'
authors: ['lainey']
track: 'events'
tags: ['EMS', 'conferences', 'posters', 'presentations']
---

I was fortunate enough to attend the European Meteorological Society's Annual Meeting in Utrecht, the Netherlands, alongside around 800 others (+ Boris and Haneen from Maths & Stats!).

Aside from the research itself, the week involved many coffees and a lot of calendar Tetris trying to decide which talks to attend. I also walked away with a better engagement with my own work and a long list of presentation tips to use.

## Networking

I realised that maybe I've been overthinking networking this whole time.

Myself, Boris, and Haneen were having lunch in a restaurant one day, when a stranger came over and asked if he could join us. He admitted that he just wanted to skip the long queue outside, but we ended up getting on and crossing paths several times throughout the conference. I'll want to exercise this minimalist thinking in future.

## Presentations

Throughout the talks, I kept a note of things I liked and things I want to remember for my own:

- Don't rely on presenter notes being available on the day. Don't rely on animations working either.
- A surprising number of talks began with two sentences, followed by panic when the slides wouldn't move, and then the speaker forgetting where they were. Maybe test the clicker before you start.
- I got left behind in abbreviation station in many talks - don't assume everyone can recall them!
- If you have to race through everything, there's probably too much there. I'd rather hear one simple message done well than five rushed ones.
- As per [*Death to the Thank You Slide*](/blog/death-to-the-thank-you-slide/), leave your conclusions up during Q&A as it gives the audience something useful to work from.
- QR codes to papers or repositories work well on the final slide. Some had used a subscription to generate one and the QR had deactivated. Chrome can generate one for free through Share > Create QR code.
- Assume you will be questioned by very senior scientists. I saw some from the ECMWF often ask about the underlying dynamics of the models, why a particular assumption had been made, or what the result actually meant physically.

<figure>
  <img src="/images/blog/babys-first-conference/talk.jpg" alt="A speaker at a laptop on a stage beside a screen showing weather maps" />
</figure>

I also got to see Boris give a brilliant talk, although I was too invested in the second-hand nerves to remember to take a photo.

## Poster

Despite starting mine over a month in advance, I still made my final edit only a week before the conference. By then, I had missed the deadline to have it printed for collection in Utrecht, which resulted in me hiding a poster tube under my trench coat while travelling.

The posters I liked most either let the figures do most of the talking, or literally spelled out the main takeaway.

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;margin:1.5rem 0;">
  <img src="/images/blog/babys-first-conference/liked-poster-1.jpg" alt="A poster on explaining patterns learned by neural networks, with figures across the page" />
  <img src="/images/blog/babys-first-conference/liked-poster-2.jpg" alt="A poster with a green header and large maps and plots" />
  <img src="/images/blog/babys-first-conference/liked-poster-3.jpg" alt="A poster on severe convective storms measured by mobile weather radars, mostly radar maps" />
</div>

<figure>
  <img src="/images/blog/babys-first-conference/not-reading-all-that.jpg" alt="Meme text messages: i ain't reading all that, i'm happy for u tho, or sorry that happened" />
  <figcaption>Posters with the full abstract on them</figcaption>
</figure>

I've left mine below, so you can be the judge of it! I vibe-coded it in HTML after getting fed up with the rigid column sizing of every LaTeX template I had the displeasure of trying. It was handy because I could resize plots without having to manually rescale all the labels and text in Python.

<figure>
  <img src="/images/blog/babys-first-conference/me-and-my-poster.jpg" alt="Lainey giving a thumbs up beside her EMS 2026 poster" />
  <figcaption>Me and my poster: Evaluation of ECMWF Subseasonal Forecasts over Ireland</figcaption>
</figure>

I would still recommend PowerPoint to most people, though. The University of Reading has [a nice template and some tips](https://www.reading.ac.uk/cps/-/media/project/functions/creative-and-print-services/documents/conference-posters.pdf).

## The rise of Gen-AI and ML

I would say roughly a third of the talks I attended mentioned AI or ML in some form. One of my main takeaways was that it is HARD to keep up with all the fine-tuned, downscaled and multi-model forecasting systems.

<figure>
  <img src="/images/blog/babys-first-conference/weathergenerator.jpg" alt="A conference slide titled WeatherGenerator showing a model diagram" />
  <figcaption>WeatherGenerator, one of many ML forecasting systems on show. Slide credit: C. Lessig</figcaption>
</figure>

Quantile Regression Forests and XGBoost came up several times, including in UK Met Office talks, which caught my attention because they have also appeared in my own research.

Gen-AI also made its way into plenty of slides and posters. Some had that very recognisable AI-infographic look, with lots of pills and polished diagrams, but also mistakes baked into the image that clearly hadn't been manually fixed. In this one, for example, I genuinely couldn't work out what area the zoomed-in map was supposed to match.

<figure>
  <img src="/images/blog/babys-first-conference/ai-study-area.jpg" alt="A poster's study area panel with two AI-generated relief maps that do not match each other" />
</figure>

On the flipside, one speaker used an AI-generated image to illustrate Rossby waves, openly acknowledged it, and got a warm response from the audience. A bit of discernment goes a long way.

## Final Thoughts

**All in all,** the time I put into my own poster was tedious, but it forced me to engage more deeply with my work. I came back from EMS with clearer questions and a long list of presentation habits to steal.
