---
title: "The Quote That Sits for Three Days"
description: "Most service businesses lose more revenue to unfollowed quotes than to bad leads. An agentic workflow fixes the gap between sending a number and closing the job."
publishDate: 2026-05-16
cluster: agentic-workflows
---

A plumber I worked with last year sent out 142 quotes in a month. He closed 38 of them. When I asked what happened to the other 104, he shrugged. Some were tire-kickers. Some went with a competitor. Most, though, he just never heard back from.

I asked him when he followed up. He said he meant to.

This is the gap an agentic workflow is built for. Not replacing the trade work. Not pretending to be a salesperson. Just doing the part that nobody on the team has time to do consistently.

The quote follow-up problem looks small until you do the math. If a quote averages $1,800 and you close one out of every three you actually follow up on, every untouched quote in the inbox is roughly a $600 expected value sitting there. Multiply by 104 and the number gets uncomfortable.

## What a follow-up agent actually does

Forget the marketing copy. Here is the actual sequence for the plumber I mentioned, running on his existing stack (Jobber, Twilio, Gmail):

1. Quote gets sent from Jobber. The workflow picks up the event.
2. Twenty-four hours later, if there is no response, an SMS goes out. Not from a fake name. From the same number the customer already has in their phone, in the owner's voice, with a question they can actually answer: "Hey, this is Dave. Wanted to make sure the quote came through ok. Want me to schedule it, or do you have any questions first?"
3. If the customer responds, the agent routes the reply. Booking requests go into Jobber as a draft job for human confirmation. Questions get summarized and pushed to Dave's inbox with the original quote attached.
4. If there is still no response after three days, a different message goes out. Shorter. Slightly more direct. Then one more, a week later, and then it stops.

That is it. No AI voice, no fancy LLM-generated personalization. The reasoning happens in two narrow spots: deciding whether an inbound reply is a booking, a question, or a no, and writing a one-sentence summary for the human.

## Where the AI actually earns its keep

People hear "agentic workflow" and picture something autonomous and impressive. In practice, the AI is doing two things:

1. Classifying inbound messages so the right thing happens next.
2. Writing follow-ups that sound like a person who knows the job, not a template.

Everything else is plumbing. Webhooks, queues, retries, conditional logic. The kind of stuff that has worked for thirty years.

This matters because it tells you what you are actually paying for and where it can go wrong. The risk is not the AI hallucinating a price. The agent never quotes anything. The risk is in classification: misreading "I need to check with my wife" as a decline, or missing a question buried in a long reply. Those failure modes are real, but they are testable and bounded. You can hold the agent to a clear rule: when in doubt, escalate to Dave.

## What this is not

It is not a chatbot. The customer is texting a real number that a human can take over at any moment. If Dave wants to jump in halfway through the thread, he just replies and the agent steps back.

It is not lead generation. This works on quotes you already sent, to customers who already asked.

It is not a magic close rate fix. If your quotes are too high, badly written, or going to people who never had budget, no follow-up will save them. The agent will just confirm that faster.

## What changed for the plumber

Three months in, his close rate on followed-up quotes was 41 percent. His total close rate moved from 27 to 38. He stopped manually nagging customers, which he hated doing anyway. Two jobs in the first month came from quotes that were over a month old when the agent reached out, ones he had mentally written off.

The work that paid for the whole system was not the new stuff. It was the work that was already done, just left to rot in the inbox.

That is the part nobody talks about with agentic workflows. The best ones do not invent revenue. They stop the revenue you already earned from leaking out.
