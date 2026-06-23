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
  // ↓ 自前テーブル描画用のCSV出力URL（pub?...&output=csv）。1行目・日付列の固定表示に使用
  reservationStatusCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDd70tKmMUTkvLCNe-ZmiVmOD39GNkBXakZplDR04iqVk-4HmNgOTf2Opkm0Cq7b2CZr6C0cho0LOB/pub?gid=441163628&single=true&output=csv",
  // ↓ 「全画面で開く」用URL（埋め込みパラメータなし）
  reservationStatusViewUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDd70tKmMUTkvLCNe-ZmiVmOD39GNkBXakZplDR04iqVk-4HmNgOTf2Opkm0Cq7b2CZr6C0cho0LOB/pubhtml?gid=441163628",

  // ▼ 予約状況テーブルの見出し表示名（スプレッドシートは変えず、サイトの表示だけ変更）
  //   「左：スプレッドシートの元の列名」→「右：サイトに表示したい名前」
  //   ・右側を短くしたい名前に書き換えてください（左側＝元の列名は変えない）
  //   ・記載のない列はそのまま表示されます。空欄("")にすると見出しを非表示にできます
  reservationHeaderLabels: {
    "活動予定日": "活動予定日",
    "クラス": "クラス",
    "a シンボルロード交差点": "aシンボル",
    "b 中央エステート側交差点": "b中央",
    "c エアレジ側交差点": "cエア",
    "d 西エステート前": "d西エス",
    "e 若潮歩道橋 小学校側": "e歩道橋(小)",
    "f 若潮歩道橋 今川側": "f歩道橋(今)",
    "g 東エステート横": "g東エス",
    "今川地区 (①〜④)": "今川",
    "入船A (⑤〜⑨)": "入船A",
    "入船B (⑩〜⑭)": "入船B",
    "入船C (⑮〜⑲)": "入船C"
  },

  // ▼ 予約状況テーブルの列の色分け（元の列名で指定）
  //   flag   : 登校時 旗振り → ブルー系
  //   patrol : 放課後 安全パトロール → グリーン系
  reservationColumnGroups: {
    flag: [
      "a シンボルロード交差点",
      "b 中央エステート側交差点",
      "c エアレジ側交差点",
      "d 西エステート前",
      "e 若潮歩道橋 小学校側",
      "f 若潮歩道橋 今川側",
      "g 東エステート横"
    ],
    patrol: [
      "今川地区 (①〜④)",
      "入船A (⑤〜⑨)",
      "入船B (⑩〜⑭)",
      "入船C (⑮〜⑲)"
    ]
  },

  // ▼ 「活動実績」グラフ公開URL
  reportChartUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDd70tKmMUTkvLCNe-ZmiVmOD39GNkBXakZplDR04iqVk-4HmNgOTf2Opkm0Cq7b2CZr6C0cho0LOB/pubchart?oid=1906612166&format=interactive",
  reportChartViewUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vQDd70tKmMUTkvLCNe-ZmiVmOD39GNkBXakZplDR04iqVk-4HmNgOTf2Opkm0Cq7b2CZr6C0cho0LOB/pubchart?oid=1906612166"

};
