---
title: I turned my Pixel into a dumb phone without buying a dumb phone
subtitle: Device owner mode, patched apps and a plain launcher
date: 2026-11-02
description: How I locked down a stock Pixel with Déchaîner and ReVanced so Shorts and Reels are gone but everything useful still works.
---

I was tired of doom scrolling and I realised I had [claude code](https://claude.com/claude-code) on my side. 

I've been a dumb phone fanatic. I ran with the CAT S22 for 2 years, but it always has so many issues and I have to break out the actual phone to do anything. 

So instead of hardware locks, I just used software. 

This is my 3 month journey. 

## My first step: What is my problem?

Seriously. What is it?

1. Doomscrolling reels. 
2. Excessive usage of social media apps (X)



## Just uninstall and never reinstall? 

Bad news, Android has no "never install this app" switch. 
There is no per-app install blocklist. 


## Ask claude what to do next?

So, I did the simple thing, just got claude to search github for solutions. 

I found 3. 

### 1. [Dechainer](https://github.com/warleysr/dechainer). 

It sets Android into a device owner mode meant for company phones. One app gets admin control over the whole device: it can block app installs, factory reset, safe mode, adding new users, and a few dozen other things. 

How does it restrict everything else? It uses a 16-character recovery code to keep you out.If you lose the code, there is a forced-removal option that takes 48 hours, which is long enough for an impulse to pass.

It also does per-app time limits, allowed time windows, a reopen cooldown, grayscale schedules you can't turn off while they're active, and blocking individual screens inside an app by class name. That last feature is where I thought Shorts would be easy.

### 2. Patch irritating apps with Revanced

[ReVanced](https://revanced.app) takes an app's APK and rewrites it with a set of patches. You end up with your own build of the app, signed with your own key.

This was a piece of cake. Two commands and I don't have to worry about youtube or instagram. 

**YouTube.** 
I just disabled Shorts. 

**Instagram.** 

This one turned out better. I hid everything except the messages. So I can text my friends, but that's it! 

### 3. Custom Launcher that's simple

I took [OLauncher](https://github.com/tanujnotes/Olauncher) and tweaked the code to make my own version that had grayscale mode built in. 
Then had a bit of fun with it and made it look like Ratio. 


## Three months later, where am I? 

This was god damn epic.
Yes, certain apps are older and didn't get patches. 

But my screen time was way down, I haven't watched brain rot in a while and I'm actually much happier than with a hardware swap. 

## Tools

- [Déchaîner](https://github.com/warleysr/dechainer) (Apache-2.0)
- [Shizuku](https://shizuku.rikka.app)
- [ReVanced CLI](https://github.com/ReVanced/revanced-cli) 6.0.0, patches 6.2.1 (patches now at api.revanced.app)
- [ReVanced GmsCore](https://github.com/ReVanced/GmsCore)
- [OLauncher](https://github.com/tanujnotes/Olauncher)
- adb, apksigner, zipalign from the [Android SDK](https://developer.android.com/tools)
