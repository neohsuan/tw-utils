# tw-utils

臺灣常用資料驗證與民國日期轉換工具。以 TypeScript 撰寫，提供 ESM 與型別宣告，無執行期相依套件。支援 Node.js 20 以上。

## 安裝與使用

套件以 `@neohsuan/tw-utils` 發布於 GitHub Packages。先在專案的 `.npmrc` 指定 registry（需具 `read:packages` 權限的 GitHub token）：

```sh
echo "@neohsuan:registry=https://npm.pkg.github.com" >> .npmrc
npm install @neohsuan/tw-utils
```

```ts
import {
  isValidBusinessNumber,
  isValidMobileBarcode,
  isValidCitizenDigitalCertificate,
  isValidNationalId,
  isValidResidentCertificate,
  rocToGregorianYear,
  gregorianToRocYear,
  rocToGregorianDate,
  gregorianToRocDate,
} from '@neohsuan/tw-utils';

isValidBusinessNumber('04595252'); // true，2023 新制
isValidMobileBarcode('/0AZ.+-9'); // true
isValidCitizenDigitalCertificate('AB12345678901234'); // true
isValidNationalId('A123456789'); // true
isValidResidentCertificate('AB12345677'); // true，舊式
isValidResidentCertificate('A812345671'); // true，2021 新式

rocToGregorianYear(113); // 2024
gregorianToRocYear(2024); // 113
rocToGregorianDate('113/01/05'); // '2024/01/05'
gregorianToRocDate('2024-1-5'); // '113-01-05'
```

## 驗證 API

所有驗證函式接受 `unknown`，回傳 `boolean`。非字串、空白、小寫英文字母、全形字元或多餘字元皆回傳 `false`，不自動修正輸入，也不拋出例外。證號請使用字串，以保留開頭的零。

| 函式 | 規則 |
| --- | --- |
| `isValidBusinessNumber(value)` | 8 碼數字；依序乘上 1、2、1、2、1、2、4、1，各乘積的十位與個位相加後加總，以 5 整除。第七碼為 7 時，總和或總和加 1 任一可被 5 整除即通過。 |
| `isValidMobileBarcode(value)` | `/` 開頭加上 7 個 `0-9A-Z.+-` 字元。僅驗格式。 |
| `isValidCitizenDigitalCertificate(value)` | 2 碼大寫英文字母加上 14 碼數字。僅驗格式。 |
| `isValidNationalId(value)` | 1 碼大寫英文字母、性別碼 1 或 2、8 碼數字，並通過檢查碼。 |
| `isValidResidentCertificate(value)` | 自動辨識舊式（大寫區域字母 + A–D + 8 碼數字）與新式（大寫區域字母 + 8 或 9 + 8 碼數字），並驗證檢查碼。 |

身分證、新式居留證的首碼依官方地區碼轉為兩位數字，展開後以權重 `1,9,8,7,6,5,4,3,2,1,1` 加總，須可被 10 整除。舊式居留證第二個字母轉碼後僅取個位數，再套用相同權重。

驗證通過僅表示格式／檢查碼符合規則，不代表號碼已核發、仍有效或屬於特定人士；統編亦不額外檢查登記狀態或配號範圍。

## 日期 API

| 函式 | 輸入 → 輸出 |
| --- | --- |
| `rocToGregorianYear(year: number): number` | 民國 1–8088 → 西元 1912–9999 |
| `gregorianToRocYear(year: number): number` | 西元 1912–9999 → 民國 1–8088 |
| `rocToGregorianDate(value: string): string` | `113/01/05` → `2024/01/05` |
| `gregorianToRocDate(value: string): string` | `2024/01/05` → `113/01/05` |

年份差為 1911。不支援民國前、民國零年。年份必須是指定範圍內的整數。日期接受 `/` 或 `-`，同一字串須使用相同分隔符；民國年可為 1–4 碼，西元年必須為 4 碼，月日可為 1–2 碼。輸出保留分隔符，月日補齊 2 碼，民國年不補零。

日期會檢查月日、閏年與世紀年規則，例如 `113/02/29` 合法，`112/02/29`、`189/02/29` 不合法。不使用 `Date` 解析，因此不受時區影響；不接受時間、空白或中文年月日。錯誤型別拋出 `TypeError`，無效年份、格式或日期拋出 `RangeError`。

## 開發

```sh
npm ci
npm run typecheck
npm test
npm run build
```

`npm run test:watch` 啟用 Vitest 監看模式。`tsc` 將 ESM 與 `.d.ts` 輸出至 `dist/`。GitHub Actions 在 Node.js 20 執行相同檢查。

本函式庫執行期支援 Node.js 20 以上。開發工具固定使用 Vitest 5.0.3 與 Vite 6.4.4；Vitest 官方宣告需要 Node.js 22.12 以上，因此建議開發環境使用 Node.js 22.12 以上。此組測試亦已在 Node.js 20.19.2 執行通過；Node.js 20 安裝開發相依套件時會出現 `EBADENGINE` 警告，啟用 `engine-strict` 的環境會拒絕安裝。

## 規則參考

- [財政部財政資訊中心：營利事業統一編號檢查碼邏輯修正說明](https://www.fia.gov.tw/singlehtml/3?cntId=c4d9cff38c8642ef8872774ee9987283)
- [行政院公報：統一編號與證號檢查方法](https://gazette2.nat.gov.tw/EG_FileManager/eguploadpub/eg029234/ch04/type2/gov30/num6/images/Eg01.pdf)
- [財政部稅務入口網：外僑統一證號編排方式](https://www.etax.nat.gov.tw/etwmain/tax-info/understanding/tax-q-and-a/national/individual-income-tax/alien-tax-question/other/781zJ3Y)

## English

`tw-utils` is a dependency-free TypeScript library for Taiwan identifiers and ROC (Minguo) dates. It ships ESM and TypeScript declarations and supports Node.js 20+.

It validates business numbers using the 2023 modulo-5 checksum (including the seventh-digit-7 exception), mobile invoice carrier barcodes, citizen digital certificate barcodes, national IDs, and both old and 2021 resident certificate numbers. Validators accept `unknown` and return a boolean; inputs must match strictly, including uppercase ASCII letters. Validation does not verify issuance or ownership.

Use `rocToGregorianYear` / `gregorianToRocYear` for numeric years and `rocToGregorianDate` / `gregorianToRocDate` for date strings such as `113/01/05`. Supported years are ROC 1–8088 / Gregorian 1912–9999. Dates preserve `/` or `-` separators, pad month/day, and check leap years without timezone-dependent parsing. Invalid types throw `TypeError`; invalid formats, ranges or calendar dates throw `RangeError`.

Published to GitHub Packages as `@neohsuan/tw-utils`: add `@neohsuan:registry=https://npm.pkg.github.com` to your `.npmrc` (with a GitHub token that has `read:packages`), then `npm install @neohsuan/tw-utils`. Run `npm test` and `npm run typecheck` for verification. The runtime library supports Node.js 20+. For development, Node.js 22.12+ is recommended because Vitest 5 declares that minimum; the pinned toolchain also passed these tests on Node.js 20.19.2, with an engine warning during installation. Engine-strict installations require a supported Vitest Node.js version. Contributions are described in [CONTRIBUTING.md](CONTRIBUTING.md).

## 授權 / License

[MIT](LICENSE) © 2026 neohsuan
