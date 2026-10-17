# 參與貢獻

歡迎回報問題與提供修正。請使用 npm，建議開發環境使用 Node.js 22.12 以上，以符合 Vitest 5 的版本需求；函式庫執行期與 CI 測試仍涵蓋 Node.js 20。詳見 README 的工具版本說明。

```sh
npm ci
npm run typecheck
npm test
npm run build
```

開發時可使用 `npm run test:watch`。程式放在 `src/`，測試放在 `test/`，公開 API 從 `src/index.ts` 匯出。

修正驗證規則時，請提供官方規則來源，加入有效、無效與邊界案例，確認檢查碼及格式皆有覆蓋，並同步更新 README。日期變更應測試閏年與範圍邊界。請使用合成測試資料，不要提交真實個資、憑證、權杖、密碼、`.env`、`node_modules/` 或 `dist/`。

提交變更前請完成上述全部檢查。相依套件異動請使用 npm 更新 `package-lock.json`，讓 CI 能使用 `npm ci` 重現安裝。提出變更時，請說明問題、預期行為及測試結果。

貢獻內容依本專案 MIT 授權釋出。

## English

Use npm and preferably Node.js 22.12+ for development to satisfy Vitest 5's engine requirement; the library runtime and CI cover Node.js 20. Run `npm ci`, `npm run typecheck`, `npm test`, and `npm run build` before submitting changes. Include regression tests and official references for checksum changes, update documentation, and keep `package-lock.json` in sync. Use synthetic identifiers and never include personal data or secrets. Contributions are licensed under MIT.
