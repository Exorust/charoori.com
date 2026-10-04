---
title: I put Muse on a pocket e-ink reader in a day
date: 2026-10-04
description: Meta's Muse Gadget SDK did not support the Xteink X3 or its chip. Seven settings lines and a 52 KB screen buffer later, it does.
---

Meta open-sourced the Muse Gadget SDK on October 2. It lets you flash an ESP32 board and pair it with Muse, so Muse can drive a screen, a button or a sensor on your desk.

I had an Xteink X3 lying around. It is a tiny e-ink reader, about the size of a credit card, with six buttons and a battery. It was not on the supported list. Nothing with its chip was. So I tried.

A day later, Muse writes my priorities onto it and I scroll through them with the page buttons.

<img src="/posts/muse-x3/x3-connected.jpg" alt="The Xteink X3 e-ink reader showing the Muse mascot and the word Connected" width="1050" height="1400" loading="lazy">

<video src="/posts/muse-x3/x3-muse-demo.mp4" controls muted playsinline preload="metadata" poster="/posts/muse-x3/x3-connected.jpg" aria-label="Demo: paging through Priorities, Today, Note and Todo pages on the X3"></video>

## What it does

I ask Muse, in the normal app, "put my priorities on my X3". A page appears on the e-paper. I can ask for my day, a workout, a note. The X3 keeps up to six pages and the up and down buttons move through them. The pages stay on the screen with the power off, because that is how e-paper works.

## The chip was the hard part

The X3 runs on an ESP32-C3. It has 321 KB of RAM in total and no extra memory chip. Every board in the SDK with a real screen had 8 MB of extra RAM. The SDK's own e-paper code wants 384 KB just for one picture.

The first build worked without changing any source code. One settings file was enough to get it paired. But it was close to the edge. With the Muse session connected, 59 KB was free and the largest free block was 11 KB. The log showed the session failing to get its memory four times before the fifth try worked.

The fix was not clever. On this chip, code that is placed in RAM for speed comes out of the same pool as everything else. The SDK defaults put about 90 KB of Wi-Fi and Bluetooth code there. A device that shows a still page does not need fast Wi-Fi. Seven lines in the settings file moved that code back to flash.

Free memory went from 59 KB to 144 KB. The largest block went from 11 KB to 100 KB. The failures stopped.

## A screen in 52 KB

With memory back, the screen fit. The X3 panel is 792 by 528 pixels in black and white, which is 52 KB at one bit per pixel. I draw straight into that one buffer. Pictures are dithered as they arrive, so there is no second copy.

Page turns were the next problem. A full e-paper refresh flashes black and white and takes almost two seconds. A fast refresh needs the previous picture to compare against, and I had no room for a second 52 KB buffer. It turns out the display controller keeps the last picture in its own memory if you do not put it to sleep. So the firmware leaves it awake and a page turn takes 650 ms with no flash.

## Teaching Muse a new trick

The part I like most took the least code. A gadget tells Muse what commands it has, in plain English. I added one called `pages.set` and described it: "use this for things the person comes back to: priorities, today's schedule, a workout, a note or a list." Muse read that and started using it. No app changes, no server changes.

## What is missing

- No sleep yet. It stays on Wi-Fi and drains the battery in hours.
- Only the older X3 screen controller works. Units made after about July 2026 have a different one.
- Flashing replaces the reader firmware. Back it up first. The README has the steps.

## Credits

The screen driver sequences and voltage tables come from the FreeInk SDK, which the CrossPoint Reader community built by reverse engineering this device. I would not have had a picture on the screen without it. I built this with Claude Code doing most of the typing.

If you have an X3, the code and a step-by-step guide are in [the repo](https://github.com/Exorust/muse-gadget-xteink-x3). If you have another ESP32-C3 board, the seven memory lines should work for you too.
