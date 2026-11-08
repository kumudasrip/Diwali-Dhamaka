# Diwali Dhamaka

Diwali Dhamaka is a retro 8-bit celebration game built with React, TypeScript, Vite, Tailwind CSS, and HTML Canvas.

Place crackers on the interactive street, equip a sparkler, and watch your character walk beside the cracker, light it, step back while facing it, and enjoy the blast. You can also start a Mega Dhamaka chain reaction, collect coins, unlock achievements, and enjoy pixel-art fireworks with sound effects.

## Features

- Interactive Diwali street with a playable character
- Cracker shop with multiple cracker types
- Individual lighting and Mega Dhamaka chain reactions
- Pixel-art explosions, fountains, rockets, chakras, and spark effects
- Coins, inventory, score, achievements, and celebration screen
- One-time +200 festive bonus coin claim per celebration
- Sound effects with mute controls
- Responsive retro arcade-style interface for desktop and mobile

## Requirements

- Node.js 18 or newer
- npm

## Run locally

1. Install dependencies:

   ```bash
   npm install --legacy-peer-deps
   ```

2. Start the development server:

   ```bash
   npm run dev
   ```

3. Open the local URL shown by Vite, usually `http://localhost:3000`.

No API keys or environment variables are required.

## How to play

1. Select a cracker from the inventory shelf.
2. Click a position on the street to place it.
3. Equip the sparkler. Your character walks beside the selected cracker, lights it, and steps back while continuing to face it.
4. The cracker fuse burns and the cracker blasts.
5. Use **LIGHT ALL** for an immediate chain reaction across all unlit crackers.
6. Visit the shop to buy more crackers. The **+200 BONUS** can be claimed only once per celebration.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the TypeScript compiler without emitting files |
| `npm run clean` | Remove generated build files |

## Project structure

```text
src/
├── components/        React UI and canvas components
├── types/             Shared game types and cracker definitions
├── utils/             Audio and pixel-art rendering helpers
├── App.tsx            Main game state and application flow
├── index.css          Global styles and retro effects
└── main.tsx           React entry point
```

## Production build

Build the app with:

```bash
npm run build
```

The generated files are written to `dist/` and can be served by any static web host.

## License

Copyright © 2026 [Kumuda Sri P](https://github.com/kumudasrip). All rights reserved.

This project is proprietary. The source code, artwork, game design, audio, and other
project assets may not be copied, modified, reused, published, distributed, or
commercially used without prior written permission from the author.
