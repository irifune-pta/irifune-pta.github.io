/* ============================================================
 * 入船小学校 PTA安全活動 — サイト設定ファイル
 * ============================================================
 *
 * 【年度更新時はこのファイルを編集してください】
 *
 * 1. schoolYear  : 年度表示（例：「令和9年度」）
 * 2. formUrl     : 予約・報告用Googleフォームの公開URL
 * 3. siteUrl     : このホームページの公開URL
 * 4. reservationStatusUrl / reservationStatusViewUrl
 *                : スプレッドシート「予約状況」の公開URL
 *                  （スプレッドシート → ファイル → 共有 → ウェブに公開）
 * 5. reportChartUrl / reportChartViewUrl
 *                : 活動実績グラフの公開URL
 *
 * 注意：
 * - スプレッドシートやフォームを年度ごとに新規作成した場合は、
 *   該当URLをすべて新しいものに置き換えてください。
 * - 同じスプレッドシートを使い続ける場合は、URLは変わりません。
 *
 * ============================================================ */

window.CONFIG = {

  // ▼ 年度表示（毎年更新）
  schoolYear: "令和8年度",

  // ▼ ホームページのURL
  siteUrl: "https://irifune-pta.github.io/",

  // ▼ 予約・報告フォーム（短縮URL）
  formUrl: "https://forms.gle/ZjnCw7hAVvPRPzG7A",

  // ▼ 「現在の予約状況」スプレッドシート埋め込みURL
  // ↓ 埋め込み用URL（widget=true&headers=false）
  reservationStatusUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDd70tKmMUTkvLCNe-ZmiVmOD39GNkBXakZplDR04iqVk-4HmNgOTf2Opkm0Cq7b2CZr6C0cho0LOB/pubhtml?gid=441163628&single=true&widget=true&headers=false",
  // ↓ 「全画面で開く」用URL（埋め込みパラメータなし）
  reservationStatusViewUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDd70tKmMUTkvLCNe-ZmiVmOD39GNkBXakZplDR04iqVk-4HmNgOTf2Opkm0Cq7b2CZr6C0cho0LOB/pubhtml?gid=441163628",

  // ▼ 「活動実績」グラフ公開URL
  reportChartUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDd70tKmMUTkvLCNe-ZmiVmOD39GNkBXakZplDR04iqVk-4HmNgOTf2Opkm0Cq7b2CZr6C0cho0LOB/pubchart?oid=1906612166&format=interactive",
  reportChartViewUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDd70tKmMUTkvLCNe-ZmiVmOD39GNkBXakZplDR04iqVk-4HmNgOTf2Opkm0Cq7b2CZr6C0cho0LOB/pubchart?oid=1906612166"

};
