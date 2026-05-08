---
title: "How a Metro Vancouver pest control operator replaced a $700-setup, $219/month national pay-per-lead service with custom AI infrastructure"
h1: "How a Metro Vancouver pest control operator replaced a $700-setup, $219/month pay-per-lead service with custom AI infrastructure"
description: "A pest control operator in Metro Vancouver replaced a national pay-per-lead service with a custom AI voice agent and local SEO stack. Here's what the data showed."
publishDate: 2026-05-15
clientLabel: "Metro Vancouver pest control operator"
location: "Metro Vancouver, BC"
tags: ["AI Voice Agent", "Local SEO", "Agentic Workflow"]
---

## Context

A Metro Vancouver pest control operator had been running a national pay-per-lead service for roughly two years. The setup fee was $700. The monthly cost was $219. The leads came in — mostly residential rodent and insect calls from across the region — and converted at a rate typical for cold referral leads: somewhere between "occasionally" and "inconsistently," depending on whether the callback got made within an hour of the lead arriving.

The arrangement isn't unusual. National lead-gen services are the default for local pest control operators who don't have the time or expertise to run their own marketing. You pay for visibility without building it. The problem is the math: you stop paying, the leads stop. You don't own the rankings. You don't own the customer relationship before the booking. You own the work after someone else captures the intent.

What this operator wanted to understand was whether the inbound call volume they were already generating — through their existing GBP presence, some word-of-mouth, and a few years of passive reputation-building — was being converted efficiently. Were calls being missed? Were callers being routed correctly? Were the dispatchers spending time on calls that a qualified intake process could have handled faster?

To answer those questions, we started by analyzing 12 months of call records.

## The problem

We processed 1,346 call records from January through December 2025. Of those, 840 calls contained enough spoken content to identify a primary pest — the specific thing the customer was calling about. The remaining 506 calls either lacked enough transcript content to classify or were non-customer calls (supplier inquiries, sales calls, wrong numbers).

The 840 classified calls broke down as follows:

- **Mice:** 180 calls (21% of classified volume)
- **Rats:** 151 calls (18%)
- **Bed bugs:** 83 calls (10%)
- **Ants:** 78 calls (9%)
- **Raccoons:** 64 calls (8%)
- **Wasps:** 61 calls (7%)
- **Birds/seagulls:** 50 calls (6%)
- **Other:** 173 calls (21%)

Rodents — mice and rats combined — accounted for 39% of all classifiable calls. That alone shaped how we thought about triage design.

The seasonal pattern was clear in the monthly data. Rodent calls peaked in December (56 combined) and January (33) and again in November (44). Wasp calls peaked in July (15) and August (11). This isn't surprising for Metro Vancouver — rodents move indoors when temperatures drop, wasps peak in late summer. But it meant the operator was fielding high call volume in exactly the months where coverage was thinnest: December through February, when crews are reduced and dispatchers are managing the same number of calls with less support.

The misdiagnosis rate was 8%. Out of 840 classified calls, 67 had a mismatch between what the customer described and what the dispatcher diagnosed after talking to them. The most common corrections: mice → rats (17 times) and rats → mice (13 times). This matters for dispatch because treatment protocols differ. An intake process that captures the pest type correctly on the first call reduces the chance of sending the wrong technician or the wrong equipment.

None of this data showed a business in crisis. It showed a business with real call volume, predictable seasonal shape, and a triage process that was being done entirely by humans at a cost in time and attention that a well-built agent could absorb.

## What we built

Three components, each scoped to a specific problem.

**Voice agent for intake and triage.** The agent handles inbound calls outside of business hours and during high-volume windows when dispatchers are occupied. It identifies the pest type, confirms the service area, captures the property type (residential vs. strata vs. commercial), and determines urgency. For the most common call types — rodent exclusion estimates, wasp nest removal, ant treatment quotes — it books the appointment directly into the scheduling system. For calls that require a human — large commercial contracts, active infestations requiring same-day response, callers who want to speak to someone — it flags the call and routes with full context.

The agent's qualification script was built around the call data. Mice and rats account for nearly 40% of call volume, so the rodent intake flow was designed first and tested most heavily. The seasonal variation shaped the routing logic: during peak rodent season (November through February), the booking threshold is tighter — fewer qualification steps before converting to a scheduled appointment — because the conversion cost of a slow intake is higher when call volume is elevated.

**Review request workflow.** After each completed job, the agent reads the job record from the scheduling system and sends a personalized review request from the operator's email. The template varies based on job type — a rodent exclusion follow-up sounds different from a wasp nest removal follow-up — and the send timing is calibrated to avoid requesting reviews on jobs that had complaint notes or scheduling issues. Review velocity improved; the operator's GBP profile had significantly more recent reviews within 90 days of launch.

**Local SEO technical work.** The operator's website had the typical problems of a site that was built to exist rather than to rank: missing schema, thin service pages, no structured internal link architecture, GBP categories that weren't fully optimized. We implemented Organization and LocalBusiness schema with the correct entity linking, rewrote the core service pages around actual customer language (pulled partly from the call transcript data — customers say "get rid of mice in my apartment" more often than they say "rodent exclusion"), and optimized the GBP profile against current quality signals.

## Results

The call data tells the before story. The results are directional rather than definitive — 90 days post-launch is too short for full attribution on organic ranking work, and call volume has natural variation — but several things shifted clearly.

The review velocity improvement was the most immediate and measurable: the GBP profile received more reviews in the first 90 days post-launch than in the prior six months combined. Review count and recency are direct GBP ranking signals, and the profile's local pack visibility for high-intent rodent queries improved within that window.

The intake process for after-hours and high-volume periods now runs without dispatcher involvement for qualifying calls. The jobs that were previously going to voicemail during peak windows — December and January, specifically — have a resolution path that doesn't require a callback the next morning. We don't have a clean counterfactual for how many of those were previously lost, but the operator's own assessment was that voicemail calls converted at a fraction of the rate of answered calls, and the agent eliminated voicemail for those windows.

The misdiagnosis correction rate improved. The agent's structured intake collects pest type, property type, and specific symptoms before any dispatcher involvement, which means the dispatcher who reviews the booking record has more accurate context than a typical phone intake would have captured.

## What we'd do differently

The review request workflow was built to send automatically with no operator review step. For most job types, that worked fine. For a handful of edge cases — jobs where there was a billing dispute, jobs where the technician flagged a problem — an automatic review request went out at the wrong moment. We added a manual hold flag to the workflow in week three, but it should have been in the initial build.

The voice agent's handling of strata and commercial calls was underspecified at launch. Strata jobs often involve a property manager rather than the resident, which changes the intake flow significantly. We had to add a property-type routing branch mid-way through the first month. The qualification conversation now identifies strata properties earlier and routes those calls to a human dispatcher rather than trying to handle the booking in the agent.

Both of these were foreseeable with more thorough edge-case mapping during scoping. The fix in both cases was fast, but it added tuning time in week one and two that could have been avoided.

## Frequently asked questions

**How was the call data analyzed?** We built a classifier that processed call transcripts to identify primary pest type and customer-reported symptoms. The 1,346 calls span all of 2025. The classification results were reviewed for accuracy before being used to inform the agent's triage logic.

**Are call transcripts used for anything other than this analysis?** No. The transcripts were used to map call patterns and customer language for the intake design. They are not stored or used for any other purpose.

**How was the operator anonymized?** The operator requested that their business name, specific location, and identifying details not be published. All data cited here is drawn from their actual call records, and numbers have not been rounded, inflated, or adjusted. The anonymization is in the attribution, not the numbers.

**Can this work for a pest control operator outside Metro Vancouver?** Yes. The call patterns — rodent dominance, seasonal peaks, high misidentification rate between mice and rats — are consistent across North American urban markets. The specific seasonal timing varies by climate zone, but the structural problems are the same.

**What does it cost?** Fixed monthly fee based on call volume and integration complexity. Discussed on the discovery call. [Book here](/book/).
