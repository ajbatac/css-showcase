# CSS Showcase Studio

Here’s a short PRD for the concept you described, shaped around a mobile-first interactive demo page and grounded in common PRD structure plus responsive/device-frame reference patterns.atlassian+2

Overview

Build a single-page showcase that demonstrates modern CSS features through clickable, live examples, with each example showing a working demo above its code snippet. The flagship example lets users switch a skeleton app window between desktop, iPad, and mobile views using pure modern CSS, optimized primarily for a 9:16 screen and small mobile devices.figma+3

Problem

CSS feature demos are often fragmented, overly technical, or not designed for mobile viewing, which makes them harder to browse quickly on a phone. This page should make CSS feel immediate and visual by pairing a realistic app-like skeleton preview with concise code in the same viewport.jhildenbiddle.github+2

Goals

Show one polished live CSS demo at a time, with the demo preview visible before the code.jhildenbiddle.github

Make the primary experience feel excellent on 9:16 mobile screens, with desktop as a secondary enhancement.atlassian

Use pure modern CSS for the device-switching example, relying on responsive layout, aspect-ratio, container queries, and smooth state transitions where appropriate.github+1

User story

As a developer browsing on mobile, I want to tap between device modes and instantly see how a skeleton app adapts, so I can understand the CSS pattern without reading a long explanation first. As a second step, I want the code directly below the preview so I can inspect or copy the technique quickly.figma+1

Scope

In scope

One responsive page with a vertical, mobile-first layout.atlassian

A hero/title area and one featured demo card.figma

Featured demo includes:

Live skeleton app preview.

Toggle buttons for Desktop, iPad, Mobile.

Pure CSS layout adaptation.

Code panel directly beneath preview.

Short annotation of which CSS features are being demonstrated.github+1

Out of scope

Full code editor functionality.

Multiple complex demos in v1.

JavaScript-heavy animation systems.

Real app data or backend integration.atlassian+1

Functional requirements

The page must load as a single self-contained experience with one featured interactive demo visible near the top.figma

The demo must include three clickable viewport/device states: desktop, iPad, and mobile.github+1

The preview must resemble a real app using skeleton UI blocks such as header, sidebar/nav, cards, charts, and content rows, without needing real data.jhildenbiddle.github

The device change effect should be implemented with modern CSS techniques first, using minimal JavaScript only for state switching if needed.github+1

The code block must appear below the live preview and reflect the exact demo being shown.figma

On mobile, the layout priority is: title, demo preview, device toggles, code, notes.atlassian

Tap targets must be comfortable on phones, and the preview should remain legible inside a 9:16-oriented viewport.atlassian

Non-functional requirements

Mobile-first responsive design, optimized for 375px to 430px widths and 9:16 framing.atlassian

Fast load, minimal dependencies, and static-page friendly architecture.atlassian

Accessible controls with clear labels, visible active states, and keyboard support.figma

Clean visual design that emphasizes clarity over decoration.atlassian

UX notes

The preview should feel like a miniature product mockup, not a generic box demo, because realistic skeleton structure makes the CSS behavior easier to understand at a glance. The interface should keep everything in one scroll flow, with the live example always preceding the code so the visual payoff comes first.jhildenbiddle.github+1

Success criteria

A user can understand the purpose of the demo within a few seconds of landing on the page.atlassian

A user can switch between the three device states with one tap and clearly see the layout change.github+1

The page remains easy to use and visually balanced on a phone in portrait orientation.atlassian

Suggested v1 structure

SectionRequirementHeaderTitle, one-line explanation, optional theme toggle.figmaFeatured demoSkeleton app preview in a framed viewport with Desktop / iPad / Mobile toggle.github+1Code panelRead-only formatted HTML/CSS snippet below preview.figmaCSS notesShort bullets naming features used, such as container queries, aspect-ratio, custom properties, and grid.jhildenbiddle.github

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fd4bbd00-959e-42c6-bfd5-8b1593c45c3c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
