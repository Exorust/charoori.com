---
title: Weight-space programming, but for SQL
subtitle: I asked a frontier model to fix a small model's weights by hand. It found a bypass.
date: 2026-11-07
description: An independent test of MIT's weight-space programming claim on a text-to-SQL loop in Qwen3.5-0.8B, with Claude Fable 5.1 as the editor. The edit works, transfers, and is worth one template flag.
---
Last week MIT CSAIL published a report called "Sparks of Weight-Space Programming". The claim is simple and strange: give a frontier model the raw weights of a small model, a Python kernel, and a budget of forward passes, and it can find why the small model misbehaves and fix it by editing the weights directly. No training. No gradients. The headline result: GPT-6 Astra edited 0.016% of Qwen3.5-0.8B's weights and its MATH-500 score went from 8% to 48%, because the small model had been stuck in a loop and the edit removed the loop.

I wanted to know what that method actually does when it works. So I rebuilt the setup, pointed it at a different problem, used a different editor, and kept every hypothesis the editor wrote down. Here is what happened.

## The setup

The small model is the same one, Qwen3.5-0.8B. The task is text-to-SQL: here is a database schema, here is a question in English, write the query. The answer is graded by running it.

The bug is the same kind of bug the report fixed. With thinking mode on, the model starts writing "Thinking Process: 1. Analyze the Request... 2. Analyze the Schema..." and then repeats schema bullets until it hits the 8,192-token limit. On a held-out benchmark, BIRD Mini-Dev, 91% of answers loop and 0.7% are correct. The report's own math edit, applied to this model, barely helps: the cut-off rate drops from 99% to 87%. So the editor has to find this loop on its own.

The editor is Claude Fable 5.1, called with no tools, no memory, and nothing but the task prompt. It gets the same deal the report gave Astra: a sandboxed Python kernel over the weights, 300 code runs, 25 forward passes. A forward pass either generates answers to practice questions (graded, paired original versus edited) or runs the model teacher-forced and returns log-probabilities, hidden states, MLP activations and attention. Every 40 turns the conversation restarts with the editor's own notes. The benchmark it is judged on is never shown to it.

![The harness](/posts/weight-space-programming-sql/f1_setup.png)

## What the editor did

The session ran 9.8 hours on my laptop: 328 turns, 299 code runs, 25 passes. Three attempts.

![Three attempts](/posts/weight-space-programming-sql/f2_session.png)

**Attempt 1.** The editor generated answers for 128 practice questions, confirmed the loop, and teacher-forced two loop transcripts with attention saved. It found induction heads, attention heads that look one repetition back and copy: layer 15 head 7 with 0.26 of its attention mass on the previous period, then layer 11 head 1, layer 23 head 5, layer 19 head 5. It measured that the loop is "soft": at each bullet the copied token wins by only 1 to 2 nats. It zeroed the output columns of those four heads. Paired test on 40 fresh questions: still 100% cut off. The edit was dropped.

Layer 15 head 7 is, by the way, exactly the head the report's 25-pass run zeroed for math. Here it did nothing.

**Attempt 2.** The editor took the model's own loop transcripts and recorded MLP activations in layers 16 to 23. It asked a sharper question: at each blank line the model chooses between "add another indented bullet" and "write the next section number". It found seven neurons in the last layer that fire when a digit is coming and push that exact digit down by about 3 nats, one neuron per digit. That is a real, specific finding. It zeroed those seven columns and rescaled four more. Paired test on 48 fresh questions: still 100% cut off. Dropped.

The editor's note at that point: "The looping is distributed and not fixable at one site."

**Attempt 3.** It changed the question. Instead of "why does the loop continue" it asked "why does the model enter this mode at all". At the very first thinking token, right after `<think>`, the closing tag `</think>` is already a plausible next token, rank 6 to 8, log-probability minus 6.9. The MLPs of layers 16 to 23 push against it, diffusely. Then it searched for neurons that fire only at that position and found four, one each in layers 17, 18, 19 and 20. Their activations are 1.2 to 2.7 there and below 0.7 everywhere else at the 99.9th percentile. A clean "start of thinking" detector.

The edit: add to each of those four neurons' output columns a scaled copy of the direction the output layer reads as `</think>`. Four scalars, 0.20, 0.20, 0.25, 0.15. 4,083 weight entries change out of 800 million.

![The mechanism](/posts/weight-space-programming-sql/f3_mechanism.png)

Effect: `</think>` goes from log-probability minus 6.9 to minus 0.1 at the first position. The model closes its thinking immediately and writes SQL. The editor then spent its remaining passes confirming this on seven independent sets of 64 fresh questions: original 1.1% correct, edited 28%. Every set was 19 to 31 points up. 122 questions went from wrong to right, 2 from right to wrong.

## Held out

On BIRD Mini-Dev, which the editor never saw, the same 150 questions as the baseline:

| | correct | cut off | looping |
|---|---|---|---|
| base model, thinking on | 0.7% | 98.7% | 90.7% |
| base model, thinking off via the chat template | 7.3% | 12.0% | 11.3% |
| the report's math edit | 3.3% | 87.3% | 82.0% |
| Fable's edit | 6.0% | 27.3% | 26.0% |
| same edit, moved to random neurons, 5 draws | 0 to 2% | 100% | 90 to 98% |
| gradient descent on the same 4,083 entries | 4.7% | 30.7% | 29.3% |

Three things to read off that table.

The edit transfers. On a benchmark with longer prompts and a different format it still removes the thinking loop. 9 questions went wrong to right, 1 right to wrong.

The neuron choice mattered. Take the same four change vectors and apply them to randomly chosen neurons in the same four layers, and nothing happens. Fable picked four neurons out of 14,336 and the pick was not interchangeable.

One more row: ordinary gradient descent, allowed to touch only the same 4,083 entries and trained to emit `</think>` then the gold SQL, lands in the same place, 4.7% correct and every answer opening with `</think>`, by a direction nearly orthogonal to Fable's. Given the four neurons, an optimiser finds the bypass too. What the editor contributed that the optimiser did not is the choice of which four neurons.

And the edit is worth exactly one setting. The chat template has a flag that disables thinking by inserting an empty `<think></think>` block. The base model with that flag scores 7.3%. The edit makes the model emit the closing tag by itself, and scores 6.0%. The editor rebuilt a template flag inside the weights.

## What I take from this

The method works, in the sense that matters for the report: a frontier model read activations, found a handle, and wrote a change that fixed the behaviour on held-out data, with 4,083 entries and no gradient. The random-location control says it was not luck. That is the real part.

But look at what it found and what it did not. Twice the editor produced a mechanistic explanation of the loop, with specific heads, specific neurons, measured effects in nats, and a precise edit that followed from the explanation. Twice the edit did nothing. The explanation that worked was not about the loop at all; it was about the gate into the mode that loops. The editor did not repair the loop. It routed around it, and said so in its own words: "skip the degenerate Thinking Process loop and answer directly".

So on this evidence the claim "a frontier model can understand why a small model misbehaves and fix the cause" is not shown. The claim "a frontier model can find a small lever that changes the behaviour" is. Those are different claims, and the second one is already what activation steering and a few other methods do. The interesting question for the report's math result is the same one: did Astra remove the loop, or did it find a lever that avoids it? The controls that answer that are cheap and I will run them next.

## What is next

A second Fable run, to see if it finds the same four neurons or a different lever. Two runs with GPT-6 Astra, the report's own editor. And an ablation map: switch off every attention head and every block of MLP neurons one at a time and measure the loop rate, to find out whether a single-site repair exists at all. If no editor finds a repair and the map says none exists, that settles it one way; if one editor does, the other way.

Everything is released: the four edit files, which total 16 KB, all 328 turns, the editor's notes, the harness, and the evaluation scripts. Applying the edit and rerunning the BIRD numbers takes about 20 minutes on a laptop. Code, logs and the paper draft: [github.com/Exorust/wsp-sql](https://github.com/Exorust/wsp-sql). Interactive version of this post: [wsp-sql.vercel.app](https://wsp-sql.vercel.app). The arXiv version follows once the repeat runs are in.
