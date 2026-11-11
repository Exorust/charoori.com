---
title: "When AI debugs AI: repair or bypass?"
subtitle: I gave a frontier model the raw weights of a small model and asked it to fix a bug by hand. It did. Then I looked at what it had changed.
date: 2026-11-07
description: An independent test of MIT's weight-space programming claim. Claude Fable 5.1 edited four neurons of Qwen3.5-0.8B and cured a thinking loop on text-to-SQL. The cure is a bypass, not a repair, and one count tells the two apart.
---
<style>
.prose .wsp-stats{display:grid;grid-template-columns:repeat(2,1fr);gap:0;border:1px solid var(--ink);margin:0 0 2em}
.prose .wsp-stats div{padding:14px 16px;border-top:1px solid var(--ink)}
.prose .wsp-stats div:nth-child(-n+2){border-top:0}
.prose .wsp-stats div:nth-child(odd){border-right:1px solid var(--ink)}
.prose .wsp-stats b{display:block;font-size:clamp(1.8rem,4vw,2.6rem);line-height:1;letter-spacing:-.03em;font-weight:500}
.prose .wsp-stats span{font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--dim)}
@media(min-width:640px){.prose .wsp-stats{grid-template-columns:repeat(4,1fr)}.prose .wsp-stats div{border-top:0;border-right:1px solid var(--ink)}.prose .wsp-stats div:last-child{border-right:0}}
.prose .wsp-term{border:1px solid var(--ink);padding:14px 16px;font-family:var(--font-mono);font-size:13px;line-height:1.5;white-space:pre-wrap;margin:1.5em 0;position:relative;overflow:hidden}
.prose .wsp-term .r1{opacity:.75}.prose .wsp-term .r2{opacity:.5}.prose .wsp-term .r3{opacity:.3}.prose .wsp-term .r4{opacity:.15}
.prose .wsp-term .tag{position:absolute;top:10px;right:12px;font-size:11px;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--ink);padding:2px 6px;background:var(--paper)}
.prose .wsp-steps{list-style:none;padding:0;margin:1.5em 0;counter-reset:s}
.prose .wsp-steps li{display:grid;grid-template-columns:2.6em 1fr auto;gap:12px;padding:16px 0;border-top:1px solid var(--ink);counter-increment:s;align-items:start}
.prose .wsp-steps li:last-child{border-bottom:1px solid var(--ink)}
.prose .wsp-steps li::before{content:"0" counter(s);font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;padding-top:.35em;color:var(--dim)}
.prose .wsp-steps p{margin:0}.prose .wsp-steps p+p{margin-top:.5em;color:var(--dim);font-size:.94em}
.prose .wsp-steps em{font-style:normal;font-weight:500}
.prose .wsp-steps .v{font-family:var(--font-mono);font-size:11px;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--ink);padding:3px 7px;white-space:nowrap}
.prose .wsp-steps .v.ok{background:var(--ink);color:var(--paper)}
.prose .wsp-video video{max-width:none;margin:1.5em 0 .6em}
.prose .wsp-cap{font-family:var(--font-mono);font-size:12px;letter-spacing:.04em;color:var(--dim);margin:0 0 2em}
.prose .wsp-vs{display:grid;grid-template-columns:1fr 1fr;border:1px solid var(--ink);margin:1.5em 0}
.prose .wsp-vs>div{padding:16px}.prose .wsp-vs>div:first-child{border-right:1px solid var(--ink)}
.prose .wsp-vs h4{margin:0 0 .5em;font-size:1.1rem;font-weight:500;letter-spacing:-.02em}
.prose .wsp-vs p{margin:0 0 .6em;font-size:.94em}.prose .wsp-vs .n{font-family:var(--font-mono);font-size:12px;color:var(--dim);letter-spacing:.04em}
@media(max-width:480px){.prose .wsp-vs{grid-template-columns:1fr}.prose .wsp-vs>div:first-child{border-right:0;border-bottom:1px solid var(--ink)}}
.prose .wsp-quote{margin:2em 0;padding:0 0 0 1em;border-left:2px solid var(--ink);font-size:1.25rem;line-height:1.3;letter-spacing:-.02em}
.prose .wsp-quote small{display:block;margin-top:.6em;font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--dim)}
.prose .wsp-links{display:flex;flex-wrap:wrap;gap:10px;margin:1.5em 0}
.prose .wsp-links a{font-family:var(--font-mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;border:1px solid var(--ink);padding:8px 12px;text-decoration:none}
.prose .wsp-links a:hover{background:var(--ink);color:var(--paper)}
</style>

<div class="wsp-stats">
<div><b>4</b><span>neurons changed</span></div>
<div><b>4,083</b><span>of 800M weights</span></div>
<div><b>0</b><span>gradient steps</span></div>
<div><b>28%</b><span>correct, up from 1%</span></div>
</div>

MIT CSAIL published a report this month called "Sparks of Weight-Space Programming". The claim: hand a frontier model the raw weights of a small model, a Python kernel and a budget of forward passes, and it will find why the small model misbehaves and fix it by editing the weights directly. No training. Their editor, GPT-6 Astra, changed 0.016% of Qwen3.5-0.8B and took its math score from 8% to 48%.

I wanted to see the method work on something it had not been tuned for. So I rebuilt the setup, pointed it at a different bug, used a different editor, and kept every hypothesis the editor wrote down.

## The bug

Qwen3.5-0.8B writes SQL badly, but that is not the bug. The bug is what happens when you let it think first. On BIRD Mini-Dev, a text-to-SQL benchmark, 91% of its answers never arrive. The model starts a tidy "Thinking Process", lists the tables, and then re-reads the schema until it runs out of room at 8,192 tokens. This is question 806, about superheroes. The model restarts the same list 626 times.

<div class="wsp-term"><span class="tag">626 repeats</span>2.  **Analyze the Schema:**
    *   `superhero` table:
        *   `id` (primary key)
        *   `full_name` (default NULL)
        *   `eye_colour_id` (default NULL)
    *   Wait, let's re-read the schema provided in the prompt carefully.
<span class="r1">    *   `superhero` table:
        *   `id` (primary key)
        *   `full_name` (default NULL)
    *   Wait, let's re-read the schema provided in the prompt carefully.</span>
<span class="r2">    *   `superhero` table:
        *   `id` (primary key)
    *   Wait, let's re-read the schema provided in the prompt carefully.</span>
<span class="r3">    *   `superhero` table:
    *   Wait, let's re-read the schema provided in the prompt carefully.</span>
<span class="r4">    *   Wait, let's re-read the schema provided in the prompt carefully.</span></div>

Score with thinking on: 0.7% correct. This is the same kind of bug the MIT report fixed on math, so it is a fair test. Their own math edit, applied here, barely moves it.

## The deal

The editor is Claude Fable 5.1, with no tools, no memory and no internet. It gets what the report gave Astra: a sandboxed Python kernel over the weights, 300 code runs, and 25 forward passes. A forward pass either answers practice questions (graded by running the SQL, original model against edited, side by side) or runs the model on a fixed text and hands back activations. It never sees the benchmark it is judged on. Then it is left alone for 9.8 hours.

## Three attempts

<ol class="wsp-steps">
<li><div><p><em>Cut the copy heads.</em> The editor generated 128 answers, confirmed the loop, and recorded attention over two loop transcripts. It found the heads that look one repetition back and copy, with layer 15 head 7 doing most of the work. It zeroed all four.</p><p>Layer 15 head 7 is the exact head the MIT run zeroed for math. Here it changed nothing. Still 100% cut off.</p></div><span class="v">failed</span></li>
<li><div><p><em>Silence the digit neurons.</em> At each blank line the model chooses between "another indented bullet" and "next section number". Seven neurons in the last layer push the digit down by about 3 nats, one neuron per digit. The editor zeroed them.</p><p>A real, specific mechanism. Still 100% cut off. The editor wrote: "The looping is distributed and not fixable at one site."</p></div><span class="v">failed</span></li>
<li><div><p><em>Ask a different question.</em> Not "why does the loop continue" but "why does the model enter this mode at all". At the very first thinking token, the closing tag <code>&lt;/think&gt;</code> is already a plausible next word. The editor found four neurons, one each in layers 17 to 20, that fire only at that position. It added to each a scaled copy of the direction the output layer reads as <code>&lt;/think&gt;</code>.</p><p>Four scalars. 4,083 weights. On seven fresh sets of 64 practice questions: 1.1% correct before, 28% after.</p></div><span class="v ok">worked</span></li>
</ol>

## What it changed

Every MLP neuron writes one fixed direction into the model's running state when it fires. So you can place each neuron by that direction and watch which ones move.

<div class="wsp-video"><video src="/posts/weight-space-programming-sql/neurons.mp4" autoplay muted loop playsinline preload="metadata" poster="/posts/weight-space-programming-sql/neurons_poster.jpg" width="1080" height="1080" aria-label="Turning cloud of the model's neurons by layer. Four edited neurons in layers 17 to 20 move far out toward the end-of-thinking token. The 128 neurons of the MIT edit stay in the cloud."></video></div>
<p class="wsp-cap">Each dot is one neuron (300 per layer). Height is the layer. Sideways is alignment with the direction Fable added. Pink: Fable's four. Blue: the MIT math edit. <a href="https://wsp-sql.vercel.app/neurons">Turn it yourself.</a></p>

The four edits are one vector. Between any two of them the cosine is 1.0. Fable wrote the same push, toward <code>&lt;/think&gt;</code>, into four different neurons, and they leave the cloud: from a cosine near zero to 0.44 to 0.69, where 98% of the model's neurons sit between -0.07 and 0.07.

The MIT math edit, in blue, changes 128 neurons and they do not move on this axis at all. They turn, but somewhere else.

That difference is the whole story.

## Repair or bypass

There are two ways to make a loop go away. Fix the reasoning so that it ends: a repair. Or make the model write <code>&lt;/think&gt;</code> at once and skip reasoning: a bypass. The model's chat template already has a flag for the second one. One count tells them apart: how much the model writes before the closing tag.

<div class="wsp-vs">
<div><h4>Fable's edit</h4><p>Closes thinking on 150 of 150 held-out questions. Reasoning before the tag: 0 characters, every time.</p><p class="n">BIRD, thinking on: 6.0% correct</p><p class="n">Template flag, no edit: 7.3% correct</p></div>
<div><h4>MIT's math edit</h4><p>Closes thinking on 22 of 150. Where it works, the model reasons first: a median of 5,768 characters.</p><p class="n">On math, beats the flag: 50.2% vs 45.8%</p><p class="n">A repair, by this count</p></div>
</div>

So the edit did not teach the model to stop looping. It taught the model to stop thinking, and it scores a point below the flag that does the same thing. A second Fable session, with no shared notes, reached the same place through different neurons (5.3% against 6.0%). Gradient descent, allowed to touch only the same 4,083 weights, lands there too, by a direction nearly orthogonal to Fable's. Same four neurons moved to random locations: nothing happens. The pick was real. The fix was a bypass.

<blockquote class="wsp-quote">skip the degenerate Thinking Process loop and answer directly<small>Claude Fable 5.1, final notes, session 1</small></blockquote>

## What I take from this

The method works in the sense that matters for the report. A frontier model read activations, found a handle four neurons wide, and changed held-out behaviour with no gradient. The random-location control says it was not luck.

But twice the editor produced a specific, measured, mechanistic account of the loop, with named heads, named neurons and effect sizes in nats, and a precise edit that followed from it. Twice the edit did nothing. The explanation that worked was not about the loop. It was about the door into the room where the loop happens, and the editor closed the door.

"A frontier model can find a small lever that changes the behaviour" is shown. "A frontier model can understand why a small model misbehaves and fix the cause" is not, at least not here. The MIT edit, by the same count, is a repair. So the open question is what made the difference: the editor, or the task.

## Next

Two runs with GPT-6 Astra, the report's own editor, on this SQL task. An ablation map, switching off every head and every block of neurons one at a time, to learn whether a single-site repair exists at all. And a robustness check borrowed from MaxxBench: run the edits on Dr.Spider, which pairs each Spider question with a minimally changed twin. A bypass should do no better there than the flag. A repair might.

<div class="wsp-links">
<a href="https://wsp-sql.vercel.app">Interactive version</a>
<a href="https://wsp-sql.vercel.app/neurons">3D neuron view</a>
<a href="https://github.com/Exorust/wsp-sql">Code, logs, both edits</a>
</div>

Everything is released: both edit files (19 KB and 10 KB), every turn of both sessions, the editor's notes, the harness and the evaluation scripts. Applying an edit and rerunning the BIRD numbers takes about 20 minutes on a laptop. The arXiv version follows once the Astra runs are in. The neuron view is inspired by Levi Foster's [circuit grafts](https://x.com/cybermynd/status/2119238247633096978), which add new neurons to a 135M model instead of changing old ones.
