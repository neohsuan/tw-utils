# Changelog

## 1.0.2 - 2026-10-17

- 新增 CommonJS 支援：同時提供 ESM（`dist/index.js`）與 CJS（`dist/index.cjs`）建置，`exports` 加入 `import` / `require` 條件與對應型別（`.d.ts` / `.d.cts`），`require('@hsuan741220/tw-utils')` 可正常使用。
- Added CommonJS support: dual ESM + CJS build via tsup, `exports` map with `import`/`require` conditions and matching type declarations. Fixes `ERR_PACKAGE_PATH_NOT_EXPORTED` when using `require()`.
- 新增測試驗證建置後套件可同時被 `require` 與 `import` 載入 / Added tests that load the built package via both `require` and `import`.

## 1.0.1 - 2026-10-17

- 首次發布至 npm：`@hsuan741220/tw-utils` / First npm release as `@hsuan741220/tw-utils`.

## 1.0.0 - 2026-10-17

- 首次正式版 / First stable release.
