---
title: CUA in Android & what I copied to rebuild Cyclon for 15Mil tokens
subtitle: Survey of the cutting edge CUA in Nov 2026 & my fun attempts 
date: 2026-11-16
description: A survey of current computer-use agent methods (observation, action, verification, planning, memory, test-time scaling, safety, evaluation) and which of them OpenCyclone, an open-source Android agent, adopted, plans to adopt, or skipped.
---

I was sick this weekend so I thought I'd have a bit of fun rebuilding Cyclon (YC-26) for a fraction of the cost instead of waiting for their actual release.

I started off with [OpenCyvis](https://github.com/opencyvis/opencyvis-phone) and forked it. That took care of most of the scaffolding I needed for the CUA. 

What OpenCyvis brought was taking a screenshot, attaching numbered element list with tap-by-number, wait-until-still and read-back checks in code, direct links and MCP tools, and an approval gate. 

## How agents see the screen

There are three camps.

**Pixels only.** Anthropic's computer-use tool, OpenAI's Operator and Google's Gemini computer use all work mainly from screenshots. Anthropic's [current tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool) added a zoom action that looks at one region at full resolution, which helps with small icons.

**Pixels plus the accessibility tree.** On Android, most of the systems at the top of the [AndroidWorld leaderboard](https://github.com/google-research/android_world) send the model a screenshot and the list of on-screen elements that the accessibility service exposes. [V-Droid](https://arxiv.org/abs/2503.15937) goes further: it lists the possible actions from the tree and has a model score them instead of generating actions freely (59.5% on AndroidWorld).

**A separate model for "where to click".** Grounding models such as [GTA1](https://arxiv.org/abs/2507.05791) do one job, finding the target on screen. A planner model decides what to do and the grounding model decides where. Surfer 2 and AgentProg on the AndroidWorld board both pair a large planner with a grounding model.

**What I used:** Each step sends a screenshot plus a numbered list of up to 200 elements with their labels, and the model taps by number ("tap 7"). Coordinates are the fallback for screens with no usable tree, such as some web views and custom-drawn views. By doing this the model stopped trying to compute the centre of a button from pixels. 

I still haven't added a grounding model & the tree covers most native apps.

## How agents act: screen versus API

Tapping through a screen is slow and fragile. A growing line of work sends whatever it can to code or APIs and uses the GUI only for the rest.

[CoAct-1](https://arxiv.org/abs/2508.03923) hands some subtasks to a programmer agent instead of the GUI and reports 60.76% on OSWorld with about a third fewer steps than a GUI-only baseline. A June 2026 study, [Beyond the GUI Paradigm](https://benchmarklist.com/benchmarks/beyond_the_gui_paradigm_do_mobile_agents_need_the_phone_screen/), gave mobile agents a command line instead of the screen and measured 10.7 steps per task against 18.6, with a higher success rate. Google is pushing the same direction on Android with [AppFunctions](https://developer.android.com/ai/appfunctions), where apps expose functions to agents directly.

OpenCyclone already has two non-screen paths. A direct-link action opens a call, a text, an email, a map search or a web page in one step. And the agent can call tools on servers that speak the Model Context Protocol (MCP).

My thoughts on what's next: direct actions for timers, alarms, calendar reads and writes, contact lookup and date arithmetic, using Android APIs with no tapping. I'm not too enthusiastic about AppFunctions, I don't know yet whether our helper process can hold it, and few apps support it.

## Waiting, checking and recovering

A majority of problems with CUA comes up here. 
The agent acts on a screen that is still loading, believes it typed something it didn't, or declares success too early.

[DroidRun](https://droidrun-ai.pages.dev/benchmark/method), which reports 91.4% on AndroidWorld (self-reported), waits after each action until the UI stops changing, and shows the executor both the previous and the current tree so it can see what changed. GTA1 samples several candidate actions per step and has a judge pick one. Minitap's [mobile-use](https://arxiv.org/html/2602.07787v1) measured 9 points of success rate from detecting a dead end and forcing a different strategy.

What I added to OpenCyclone was:

- After each action, wait until the screen stops changing, up to 3 seconds, instead of a fixed sleep.
- Read typed text back from the field.
- Before accepting "finished", take one more look if the screen changed since the model last saw it.
- Detect loops of the same actions across the whole task.
- Stop at 30 steps or a time limit.

Planned: when the gate refuses a target it cannot read, tell the model why and give it 2 more tries by another path, instead of ending the task (the Minitap idea). And skip the extra "finished" look when the screen is identical to the last one the model saw, which saves 5 to 10 seconds on most tasks.

## Planner and executor

Splitting the agent into a planner that tracks progress and an executor that takes one action at a time is now the default in strong systems. DroidRun uses a manager that reassesses after every executor step. [Mobile-Agent-v2](https://arxiv.org/abs/2406.01014) reported over 30% better task completion than a single agent. Minitap measured 21 points from its multi-agent setup, though against weaker single-agent baselines.

I honestly skipped this. It multiplies model calls per step, and on a phone each call is several seconds. The condition that would change my mind is long multi-app tasks failing because the model loses the plan. That is the weak spot the harder benchmarks point at (see the evaluation section), so I expect to revisit it.

## Memory between tasks

Agents that keep nothing between runs repeat the same wrong path in the same app. [Mobile-Agent-E](https://arxiv.org/abs/2501.11733) keeps tips and reusable action sequences from past tasks and gained 6.5 points. [Agent Workflow Memory](https://arxiv.org/abs/2409.07429) gained 12 points on WebArena. [Mobilerun](https://github.com/droidrun/mobilerun) keeps an instruction card for each app.

OpenCyclone inherited two kinds of memory from OpenCyvis: A set of notes inside a task, and a global list of key-value facts that the model or the owner can save, sent with every task. But neither one records how a particular app's screen works. 

What I have planned is after a task with a failed step, one extra model call writes at most two one-sentence lessons about that app's screen, such as "In Clock, the Timer tab is the third icon in the bottom bar". Later tasks in that app get them, with a cap of 5 per app.

Memory is also an injection path. Text on a screen could plant a false lesson that changes later behaviour. So lessons are limited to screen mechanics, a code filter drops anything with a run of 4 or more digits, URLs, "@" or words like approve and password, lessons never reach the gate, and the owner can read and delete every one.

## Training

The open models are trained for this now. [UI-TARS-2](https://arxiv.org/abs/2509.02544) used multi-turn reinforcement learning over millions of rollouts and reports 73.3 on AndroidWorld. GUI-Owl-1.5 ([Mobile-Agent-v3.5](https://arxiv.org/abs/2602.16855)) ships open models from 2B to 235B parameters and reports 71.6 on AndroidWorld.

I was split on this, If I allowed people to bring their own model, that would keep it simple and I didn't have to worry about API costs, but it would be fun to add our own RL model here. 

## Safety and prompt injection

Right now there are published attacks that work & defending them is weak:

- Pop-ups aimed at screen agents [succeeded about 86% of the time](https://arxiv.org/abs/2411.02391), and telling the agent to ignore pop-ups did not help.
- [VPI-Bench](https://arxiv.org/abs/2506.02456) fooled computer-use agents up to 51% of the time and browser agents up to 100%.
- [MIRAGE](https://arxiv.org/abs/2605.28116) hid attacker text in user-generated content on mobile screens and hit 23 to 30% across five agents.

Honestly, OpenAI's [Operator system card](https://cdn.openai.com/operator_system_card.pdf) says the model asked for confirmation 92% of the time it should have, and a separate injection monitor caught 99% of 77 attacks while flagging 46 of 13,704 benign screens. Anthropic [reports](https://www.anthropic.com/research/prompt-injection-defenses) a best-of-N attacker against Claude for Chrome dropping to 1.4% with trained defenses and classifiers. Google's Gemini computer use runs a separate safety service that checks each proposed action, and Gemini's screen automation on Android fills a food-delivery cart but hands checkout back to the user.

The design idea I find most convincing is [CaMeL](https://arxiv.org/abs/2503.18813): the plan comes only from the user's request, so text the agent reads cannot change what it does, and policies check every tool call. It solved 77% of AgentDojo tasks with provable security, against 84% with no defense.

OpenCyclone's version is an approval gate in code that runs before every action:

- A tap on a control whose label reads like a commitment (Send, Pay, Post, Call, Delete, Place order, Install) is held. The owner gets a card with the receiver, the text to be sent, the attachment count and a picture of the target.
- A tap on an icon with no label is held.
- If the gate cannot read the screen, nothing is pressed.
- On approval, the gate reads the screen again and runs the action only if the target, text and count are unchanged.
- Approval needs an unlocked phone. Banking, payment, password and Settings apps are off limits.
- Direct links that would skip a confirmation screen, such as placing a call, are held too.

I'll have to think harder on what I want to add in here.

## Evaluation

I personally found [AndroidWorld](https://github.com/google-research/android_world) (116 tasks across 20 apps, each with a programmatic check) to be saturated. Its leaderboard has several entries at 100% and more above 97%, all self-reported and unverified.

The harder benchmarks are where the gaps show. [MobileWorld](https://arxiv.org/abs/2512.19432) has 201 tasks, 62.2% of them spanning several apps (against 9.5% in AndroidWorld). The best agent framework scores 51.7% and the best single model 20.9%, and some models score under 10% on tasks where the right move is to stop and ask the user. On the desktop, [OSWorld 2.0](https://osworld-v2.xlang.ai/) uses long workflows that take a person about 1.6 hours each, and the top binary scores on its site are around 20%.

So short tasks in one app look close to solved, at least by benchmarks and builders' own numbers. Long tasks across apps, and knowing when to ask, are not.

## Conclusion

It's early software. Short tasks in one app work, and long ones across apps still break. The code is at [github.com/Exorust/opencyclone](https://github.com/Exorust/opencyclone) give it a shot and have some fun! 

Make software your own!
