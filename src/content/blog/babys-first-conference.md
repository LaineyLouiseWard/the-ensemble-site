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

Aside from the research itself, the week involved many coffees and a lot of calendar Tetris trying to optimise my attendance. I came home with a better feel for my own work and a long list of conference tips, especially for presenting.

## Networking

Myself, Boris, and Haneen were having lunch in a restaurant one day, when a stranger came over and asked if he could join us. He admitted that he just wanted to skip the long queue outside, but we ended up getting on and crossing paths several times throughout the conference. I want to apply this kind of minimalist thinking when networking in future.

## Presentations

I made a conscious effort to write down what I liked and didn't like about the talks, for when I eventually give my own:

- Don't rely on presenter notes or animations working on the day.
- Nerves are real, and a clicker that won't cooperate makes them worse. I watched a few speakers lose their thread when the slides wouldn't move, so I'll be testing mine before I start.
- I got left behind in abbreviation station in a lot of talks. There are only a small number I can process at once!
- If you have to race through everything, there's probably too much there. I'd rather hear one simple message done well than five rushed ones.
- I loved it when people left their conclusions and a QR code to their paper up as the final slide. It gave everyone plenty to work with in the Q&A. Some skipped straight to a blank thank-you slide instead (see [*Death to the Thank You Slide*](/blog/death-to-the-thank-you-slide/)).
- Chrome makes QR codes for free through Share > Create QR code. A few people had used a subscription generator and their codes had since deactivated.
- A lot of the questions were about the underlying dynamics of the models, why a particular assumption had been made, or what a result actually meant physically. Worth having answers ready for those.

<figure>
  <img src="/images/blog/babys-first-conference/talk.jpg" alt="A speaker at a laptop on a stage beside a screen showing weather maps" />
  <figcaption>A weather forecasting demonstration</figcaption>
</figure>

I also got to see Boris give a brilliant talk, although I was too invested in the second-hand nerves to remember to take a photo :(

## Poster

Despite starting mine over a month in advance, I still made my final edit only a week before the conference. By then, I had missed the deadline to have it printed for collection in Utrecht, which resulted in me hiding a poster tube under my trench coat on the flight. It was Aer Lingus, but years of Ryanair have left me terrified of the bag sizer.

The posters I liked most either let the figures do most of the talking, or literally spelled out the main takeaway. My top three are below. The first went out of its way to annotate every figure. For the second, the presenter had drawn a bespoke illustration and explained it really well when talking us through it. The third was so visual it drew me straight in.

<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;margin:1.5rem 0;">
  <img src="/images/blog/babys-first-conference/liked-poster-1.jpg" alt="A poster on explaining patterns learned by neural networks, with figures across the page" />
  <img src="/images/blog/babys-first-conference/liked-poster-2.jpg" alt="A poster with a green header and large maps and plots" />
  <img src="/images/blog/babys-first-conference/liked-poster-3.jpg" alt="A poster on severe convective storms measured by mobile weather radars, mostly radar maps" />
</div>

<figure>
  <img src="/images/blog/babys-first-conference/not-reading-all-that.jpg" alt="Meme text messages: i ain't reading all that, i'm happy for u tho, or sorry that happened" />
  <figcaption>Me @ posters which are half-abstract</figcaption>
</figure>

I've left mine below, so you can be the judge of it! I vibe-coded it in HTML after getting fed up with the rigid column sizing of every LaTeX template I had the displeasure of trying. It was handy because I could resize plots without having to manually rescale all the labels and text in Python.

<figure>
  <img src="/images/blog/babys-first-conference/me-and-my-poster.jpg" alt="Lainey giving a thumbs up beside her EMS 2026 poster" style="max-width:min(100%,420px);margin-inline:auto;display:block;" />
  <figcaption>Me and my poster: Evaluation of ECMWF Subseasonal Forecasts over Ireland</figcaption>
</figure>

If coding a poster isn't your thing, PowerPoint does the job well. The University of Reading has [a nice template and some tips](https://www.reading.ac.uk/cps/-/media/project/functions/creative-and-print-services/documents/conference-posters.pdf).

## The rise of Gen-AI and ML

I would say roughly a third of the talks I attended mentioned AI or ML in some form. One of my main takeaways was that it is HARD to keep up with all the fine-tuned, downscaled and multi-model forecasting systems.

<figure>
  <img src="/images/blog/babys-first-conference/weathergenerator.jpg" alt="A conference slide titled WeatherGenerator showing a model diagram" />
  <figcaption>WeatherGenerator, one of many ML forecasting systems on show</figcaption>
</figure>

Quantile Regression Forests and XGBoost came up several times, including in UK Met Office talks, which caught my attention because they have also appeared in my own research.

Gen-AI also made its way into plenty of slides and posters. Some had that very recognisable AI-infographic look, with lots of pills and polished diagrams, but also mistakes baked into the image that clearly hadn't been manually fixed. In this one, for example, I genuinely couldn't work out what area the zoomed-in map was supposed to match.

<figure>
  <img src="/images/blog/babys-first-conference/ai-study-area.jpg" alt="A poster's study area panel with two AI-generated relief maps that do not match each other" />
</figure>

On the flipside, one speaker used an AI-generated image to illustrate Rossby waves, openly acknowledged it, and got a warm response from the audience. A bit of discernment goes a long way.

## Final Thoughts

**All in all,** the time I put into my own poster was tedious, but it forced me to engage more deeply with my work. I came back from EMS with clearer questions and a long list of presentation habits to steal.
