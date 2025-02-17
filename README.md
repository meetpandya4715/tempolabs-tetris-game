# Tempolabs Tetris Game

This project is a classic implementation of Tetris built with React, TypeScript, and Vite. It leverages fast refresh (HMR), Tailwind CSS for modern styling, and ESLint for maintaining code quality to deliver an engaging gaming experience.

## Getting Started
1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   ```

3. **Build for production:**
   ```bash
   npm run build
   ```

4. **Preview the production build:**
   ```bash
   npm run preview
   ```

## Gameplay

Control the falling Tetris blocks using the following keys:
- **Move Left:** ←
- **Move Right:** →
- **Rotate Clockwise:** ↑
- **Soft Drop:** ↓
- **Hard Drop:** Space
- **Pause Game:** P

Strategically arrange the blocks to clear lines and earn points!

## Official Plugins

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh.
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh.

## Expanding the ESLint Configuration

If you are developing a production application or extending this game, we recommend updating the configuration to enable type-aware lint rules:

- Configure the top-level `parserOptions` property like this:

  ```js
  export default {
    // other rules...
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      project: ['./tsconfig.json', './tsconfig.node.json'],
      tsconfigRootDir: __dirname,
    },
  }
  ```

- Replace `plugin:@typescript-eslint/recommended` with `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`.
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`.
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list.

## Additional Recommendations
- **TypeScript Configuration:** Ensure your `tsconfig.json` is properly configured for React and TypeScript support.
- **Vite Configuration:** Refer to the [Vite documentation](https://vitejs.dev) for advanced configuration options and plugin support.
- **ESLint Best Practices:** Regularly update your ESLint configuration to incorporate new best practices for React and TypeScript development.

## Project Structure

- **src/components:** Contains UI and game-specific components (e.g., GameBoard, GameOverModal, SidePanel, ControlsHint).
- **src/lib:** Contains game logic (collision detection, line clearing, scoring, etc.).
- **src/types:** Contains TypeScript definitions for game state and blocks.
- **src/styles:** Contains Tailwind CSS configuration and global styles.

## Available Scripts
- `npm run dev` - Starts the development server with hot module replacement.
- `npm run build` - Builds the app for production.
- `npm run preview` - Serves the production build locally.
- `npm run lint` - Runs ESLint to detect potential issues in the code.

Happy coding and enjoy playing Tetris!
