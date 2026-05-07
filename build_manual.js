// Generate the PTA安全活動 運営マニュアル.docx
const fs = require('fs');
const path = '/tmp/node_modules/docx';
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, PageOrientation, LevelFormat,
  TabStopType, TabStopPosition,
  HeadingLevel, BorderStyle, WidthType, ShadingType,
  PageBreak, ExternalHyperlink, PageNumber
} = require(path);

// ===== Color palette =====
const C_BLUE = "0E5C9E";
const C_BLUE_LIGHT = "E3F4FB";
const C_GREEN = "5DAA2F";
const C_CORAL = "C2410C";
const C_YELLOW_BG = "FFF6D1";
const C_LINE = "D0D5DD";
const C_INK = "2D3748";
const C_INK_SOFT = "5A6478";

// ===== Common font =====
const F_JP = "Yu Gothic";

// Helpers
const P = (text, opt = {}) => new Paragraph({
  children: text instanceof Array ? text : [new TextRun({ text, font: F_JP, ...opt.run })],
  spacing: opt.spacing || { before: 80, after: 80 },
  ...opt.para
});

const H1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text, font: F_JP, color: C_BLUE })],
  spacing: { before: 360, after: 200 },
});

const H2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text, font: F_JP, color: C_BLUE })],
  spacing: { before: 280, after: 140 },
});

const H3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text, font: F_JP, color: C_CORAL })],
  spacing: { before: 200, after: 100 },
});

const B = (text, opt = {}) => new TextRun({ text, font: F_JP, bold: true, ...opt });
const T = (text, opt = {}) => new TextRun({ text, font: F_JP, ...opt });
const RED = (text) => new TextRun({ text, font: F_JP, color: "C2410C", bold: true });
const BLUE = (text) => new TextRun({ text, font: F_JP, color: C_BLUE, bold: true });

// Bullet
const BULLET = (text, opt = {}) => new Paragraph({
  numbering: { reference: "bullets", level: 0 },
  children: text instanceof Array ? text : [new TextRun({ text, font: F_JP, ...opt.run })],
  spacing: { before: 40, after: 40 },
});

// Numbered
const NUM = (text, opt = {}) => new Paragraph({
  numbering: { reference: "numbers", level: 0 },
  children: text instanceof Array ? text : [new TextRun({ text, font: F_JP, ...opt.run })],
  spacing: { before: 60, after: 60 },
});

// Code/inline tech
const CODE = (text) => new TextRun({
  text, font: "Consolas", color: "C2410C",
  shading: { fill: "F5F5F5", type: ShadingType.CLEAR }
});

// Callout box (single-cell table)
const CALLOUT = (children, fillColor, borderColor) => new Table({
  width: { size: 9026, type: WidthType.DXA },
  columnWidths: [9026],
  rows: [new TableRow({
    children: [new TableCell({
      width: { size: 9026, type: WidthType.DXA },
      shading: { fill: fillColor, type: ShadingType.CLEAR },
      borders: {
        top:    { style: BorderStyle.SINGLE, size: 4, color: borderColor },
        bottom: { style: BorderStyle.SINGLE, size: 4, color: borderColor },
        left:   { style: BorderStyle.SINGLE, size: 24, color: borderColor },
        right:  { style: BorderStyle.SINGLE, size: 4, color: borderColor },
      },
      margins: { top: 160, bottom: 160, left: 240, right: 240 },
      children
    })]
  })]
});

// 2-col table (label | value)
const KVTABLE = (rows) => {
  const border = { style: BorderStyle.SINGLE, size: 1, color: C_LINE };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [3000, 6026],
    rows: rows.map(([label, value], i) => new TableRow({
      children: [
        new TableCell({
          borders,
          width: { size: 3000, type: WidthType.DXA },
          shading: { fill: i === 0 ? C_BLUE_LIGHT : "F8FAFC", type: ShadingType.CLEAR },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: [new Paragraph({ children: [B(label)] })]
        }),
        new TableCell({
          borders,
          width: { size: 6026, type: WidthType.DXA },
          margins: { top: 100, bottom: 100, left: 140, right: 140 },
          children: Array.isArray(value)
            ? value.map(v => new Paragraph({ children: typeof v === 'string' ? [T(v)] : v }))
            : [new Paragraph({ children: typeof value === 'string' ? [T(value)] : value })]
        })
      ]
    }))
  });
};

// 3-col table for troubleshooting / file lists
const TBL3 = (header, rows, widths = [2500, 2500, 4026]) => {
  const border = { style: BorderStyle.SINGLE, size: 1, color: C_LINE };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: widths,
    rows: [
      new TableRow({
        tableHeader: true,
        children: header.map((h, i) => new TableCell({
          borders,
          width: { size: widths[i], type: WidthType.DXA },
          shading: { fill: C_BLUE, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [new TextRun({ text: h, font: F_JP, bold: true, color: "FFFFFF" })]
          })]
        }))
      }),
      ...rows.map((row, ri) => new TableRow({
        children: row.map((cell, i) => new TableCell({
          borders,
          width: { size: widths[i], type: WidthType.DXA },
          shading: { fill: ri % 2 === 0 ? "FFFFFF" : "F8FAFC", type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 120, right: 120 },
          children: [new Paragraph({
            children: typeof cell === 'string' ? [T(cell)] : cell
          })]
        }))
      }))
    ]
  });
};

// ===== Build content =====
const docChildren = [];
const add = (...items) => items.forEach(i => docChildren.push(i));

// ----- Cover page -----
add(
  new Paragraph({ spacing: { before: 1800 }, children: [] }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: "入船小学校", font: F_JP, size: 28, color: C_BLUE })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 200 },
    children: [new TextRun({ text: "PTA 安全活動", font: F_JP, size: 56, bold: true, color: C_BLUE })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 100, after: 600 },
    children: [new TextRun({ text: "ホームページ 運営マニュアル", font: F_JP, size: 40, bold: true, color: C_INK })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 1400 },
    children: [new TextRun({ text: "公開URL：", font: F_JP, size: 22, color: C_INK_SOFT })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new ExternalHyperlink({
      link: "https://irifune-pta.github.io/",
      children: [new TextRun({ text: "https://irifune-pta.github.io/", font: F_JP, size: 24, color: C_BLUE, underline: {} })]
    })]
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200 },
    children: [new TextRun({ text: "PTA 安全指導部", font: F_JP, size: 22, color: C_INK_SOFT })]
  }),
  new Paragraph({ children: [new PageBreak()] })
);

// ----- 0. はじめに -----
add(
  H1("はじめに"),
  P("このマニュアルは、入船小学校PTA 安全活動 ホームページの「運営者向けガイド」です。"),
  P("年度更新やトラブル対応など、運営に必要な情報を、できるだけ専門用語を使わず、エンジニアでない方でも読める形でまとめています。"),
  P("項目によっては技術的な作業が必要なものもあります。難しいと感じたら、無理せず前任者・経験者・学校の情報担当の方にご相談ください。"),

  CALLOUT([
    new Paragraph({ children: [B("💡 まずはここから")] }),
    new Paragraph({ children: [T("年度更新を行うには「")] , spacing: { before: 60 } }),
    new Paragraph({ children: [T("　・第3章 「年度更新の手順」（5つのステップ）")] }),
    new Paragraph({ children: [T("　・第8章 「引継ぎチェックリスト」")] }),
    new Paragraph({ children: [T("の2か所をご覧ください。")] }),
  ], C_BLUE_LIGHT, C_BLUE),

  new Paragraph({ children: [new PageBreak()] })
);

// ----- 1. このサイトについて -----
add(
  H1("1. このサイトについて"),
  H2("1-1. 目的"),
  P("入船小学校PTA安全活動の案内・予約・実績公開を行うためのウェブサイトです。"),
  BULLET("年間予定表・クラス別の担当期間"),
  BULLET("登校時の安全指導（朝の旗振り）の場所マップと注意点"),
  BULLET("放課後の安全パトロールのチェックポイントと注意点"),
  BULLET("活動の予約・実績報告（Googleフォーム）"),
  BULLET("予約状況・活動実績のリアルタイム公開"),

  H2("1-2. 公開のしくみ"),
  P([T("ホームページは "), B("GitHub Pages "), T("という無料サービスで公開されています。GitHub上のファイルを更新すると、1〜2分で公開URLに反映されます。")]),

  KVTABLE([
    ["公開URL", "https://irifune-pta.github.io/"],
    ["リポジトリ", "https://github.com/irifune-pta/irifune-pta.github.io（仮）"],
    ["ホスティング", "GitHub Pages（無料）"],
    ["利用ツール", "Googleフォーム / Googleスプレッドシート"],
    ["コスト", "0円"]
  ]),

  H2("1-3. 検索エンジンへの非掲載"),
  P("このサイトは保護者向けの限定公開を意図しているため、Google検索などの検索エンジンには表示されない設定になっています。リンクを直接知っている方だけがアクセスできる状態です。"),

  new Paragraph({ children: [new PageBreak()] })
);

// ----- 2. ファイル構成 -----
add(
  H1("2. ファイル構成"),
  P("リポジトリ（または手元のフォルダ）には以下のファイルがあります。"),

  TBL3(
    ["ファイル", "役割", "更新タイミング"],
    [
      ["index.html", "メインページ（HTML本体）", "クラス別表記の更新時など"],
      ["config.js", "年度・URL設定", "毎年（年度更新時）"],
      ["schedule.js", "クラス担当期間データ", "毎年（年度更新時）"],
      ["README.md", "GitHub上の簡易説明", "随時"],
      ["robots.txt", "検索除外設定", "基本的に変更しない"],
      ["images/", "画像（地図・写真など）", "マップ変更時"]
    ],
    [2400, 3500, 3126]
  ),

  P({ run: { color: C_INK_SOFT, italics: true, size: 20 } }),

  H2("2-1. images/ フォルダの中身"),
  TBL3(
    ["ファイル名", "内容", "備考"],
    [
      ["school-emblem.png", "校章", "ナビ・フッターの校章マーク"],
      ["安全活動年間予定表.png", "年間予定表", "ファイル名そのまま上書き推奨"],
      ["A.登校時安全指導.png", "登校時マップ", "ファイル名そのまま上書き推奨"],
      ["B.放課後安全パトロール.png", "放課後マップ", "ファイル名そのまま上書き推奨"],
      ["image3〜image7", "安全旗ケース等の写真", "差し替えがあれば同名で上書き"]
    ],
    [3200, 2400, 3426]
  ),

  new Paragraph({ children: [new PageBreak()] })
);

// ----- 3. 年度更新の手順 -----
add(
  H1("3. 年度更新の手順（毎年やること）"),
  P("年度が変わるたびに以下の5つのステップで更新します。それぞれ10〜30分程度の作業です。"),

  CALLOUT([
    new Paragraph({ children: [B("📋 年度更新ステップ概要")] }),
    new Paragraph({ children: [T("Step 1：config.js の年度・URLを更新")], spacing: { before: 80 } }),
    new Paragraph({ children: [T("Step 2：schedule.js のクラス担当期間を更新")] }),
    new Paragraph({ children: [T("Step 3：index.html の「クラス別 担当期間」表示を更新")] }),
    new Paragraph({ children: [T("Step 4：マップ画像を差し替え（必要な場合のみ）")] }),
    new Paragraph({ children: [T("Step 5：GitHubにアップロード")] }),
  ], C_YELLOW_BG, "F4C430"),

  H2("Step 1：config.js を編集"),
  P([T("テキストエディタ（Windowsならメモ帳、Macならテキストエディット）で "), CODE("config.js"), T(" を開きます。以下の項目を新年度の値に書き換えます。")]),
  TBL3(
    ["項目", "説明", "例"],
    [
      ["schoolYear", "年度の表示文字列", '"令和9年度"'],
      ["siteUrl", "ホームページのURL", '"https://irifune-pta.github.io/"'],
      ["formUrl", "予約・報告フォームのURL", '"https://forms.gle/XXXXXXXX"'],
      ["reservationStatusUrl", "予約状況シート埋め込みURL", "（後述の取得方法）"],
      ["reportChartUrl", "活動実績グラフのURL", "（後述の取得方法）"]
    ],
    [3200, 3200, 2626]
  ),
  P({ run: { size: 18 } }),
  P([B("⚠ 注意："), T(' 値を編集する際は "ダブルクォート" で囲まれた中身だけを書き換えてください。クォートやカンマを消すと動作しなくなります。')]),

  H3("スプレッドシートの公開URLの取得方法"),
  NUM("該当のスプレッドシートを開く"),
  NUM("メニューの「ファイル」→「共有」→「ウェブに公開」を選択"),
  NUM("「埋め込む」を選択して、公開ボタンを押す"),
  NUM([T("表示されるiframeコードの "), CODE('src="..."'), T(" の中身が「埋め込みURL」（reservationStatusUrl など）")]),
  NUM([T("そのURLから "), CODE("&single=true&widget=true&headers=false"), T(" を除いたものが「全画面URL」（reservationStatusViewUrl）")]),

  H2("Step 2：schedule.js を編集"),
  P([T("同じく "), CODE("schedule.js"), T(" を開いて、各クラスの "), CODE("periods"), T(" の日付（YYYY-MM-DD形式）を新年度の値に書き換えます。")]),
  P([T("例："), CODE('"6年1組": { periods: [["2026-07-01", "2026-07-15"]] },')]),
  P([T("　　　　　　　　　　　　 ↑ 開始日 　　　　 ↑ 終了日")]),
  P({ run: { size: 18 } }),
  P([B("複数の期間に分かれる場合（夏休みを挟むなど）：")]),
  P([CODE('"6年2組": {')]),
  P([CODE('  periods: [')]),
  P([CODE('    ["2026-07-16", "2026-07-21"],')]),
  P([CODE('    ["2026-09-01", "2026-09-15"]')]),
  P([CODE('  ],')]),
  P([CODE('  note: "夏季休業期間を除く"')]),
  P([CODE('},')]),

  H2("Step 3：index.html の「クラス別 担当期間」表示を更新"),
  CALLOUT([
    new Paragraph({ children: [RED("⚠ 重要：")] }),
    new Paragraph({ children: [T("schedule.js だけ更新しても、画面上の日付表示は更新されません。"), B("画面の日付表示は index.html 内のテキストを使っているため、こちらも合わせて修正が必要です。")], spacing: { before: 60 } }),
  ], "FFE4E1", "C2410C"),

  P([T("index.html を開いて、各クラスの "), CODE("class-period"), T(" 行を新年度の日付に書き換えます。")]),
  P([T("例（17クラス分すべて）：")]),
  P([CODE('<div class="class-row" data-cls="6年1組">')]),
  P([CODE('  <span class="class-name">6年1組</span>')]),
  P([CODE('  <div class="class-period">7月1日(水) 〜 7月15日(水)</div>  ← この日付を編集')]),
  P([CODE('</div>')]),

  H2("Step 4：マップ画像の差し替え（変更がある場合のみ）"),
  P([T("通学路や放課後のチェックポイントに変更があれば、")]),
  BULLET("images/A.登校時安全指導v2.png"),
  BULLET("images/B.放課後安全パトロールv2.png"),
  BULLET("images/安全活動年間予定表v2.png"),
  P([T("を ")]),
  P({ run: { size: 18 } }),
  P([B("ファイル名を変えると面倒です。同名で上書きするのが一番楽です。")]),

  H2("Step 5：GitHubにアップロード"),
  NUM("ブラウザでリポジトリページを開く"),
  NUM("編集したファイルをクリック → 鉛筆アイコン（Edit）で内容を書き換えるか、「Upload files」でドラッグ&ドロップ"),
  NUM("画面下の「Commit changes」ボタンを押して保存"),
  NUM("1〜2分待つと公開URLに反映される"),

  CALLOUT([
    new Paragraph({ children: [B("💡 反映されない場合のチェック")] }),
    new Paragraph({ children: [T("・ブラウザを ")], spacing: { before: 60 } }),
    new Paragraph({ children: [T("・Actions タブでデプロイログにエラーが出ていないか確認")] }),
    new Paragraph({ children: [T("・GitHub Pages の設定（Settings → Pages）が "), CODE("main"), T(" ブランチになっているか確認")] }),
  ], C_BLUE_LIGHT, C_BLUE),

  new Paragraph({ children: [new PageBreak()] })
);

// ----- 4. その他の更新 -----
add(
  H1("4. その他の更新方法"),

  H2("4-1. 緊急連絡先の電話番号変更"),
  P([T("index.html 内の "), CODE('<a href="tel:047-353-8503">'), T(" を直接編集します。同じ電話番号が画面上に表示されている部分も合わせて修正してください。")]),

  H2("4-2. Googleフォームの内容を変更したい"),
  P([B("Googleフォーム自体を編集"), T(" してください。フォームURLが変わらない限り、サイト側の変更は不要です。")]),
  P([T("もし新しいフォームを作り直した場合は、")]),
  BULLET([B("config.js"), T(" の "), CODE("formUrl"), T(" を新URLに更新")]),

  H2("4-3. スプレッドシートを差し替えたい"),
  P("新しいスプレッドシートを「ウェブに公開」設定にして、得られたURLで以下を更新します。"),
  BULLET([B("config.js"), T(" の "), CODE("reservationStatusUrl"), T(" / "), CODE("reservationStatusViewUrl")]),
  BULLET([B("config.js"), T(" の "), CODE("reportChartUrl"), T(" / "), CODE("reportChartViewUrl")]),

  H2("4-4. お知らせ文の変更"),
  P([T("index.html の "), CODE('<section id="notice">'), T(" の中を直接編集します。")]),

  H2("4-5. 校章を変更"),
  P([T("校章は index.html 内に "), B("base64形式で埋め込まれている"), T("ため、画像ファイルを差し替えるだけでは反映されません。")]),
  P("再エンコードが必要なため、技術的に難しい場合は前任者・経験者・学校の情報担当の方にご相談ください。"),

  new Paragraph({ children: [new PageBreak()] })
);

// ----- 5. デプロイ -----
add(
  H1("5. デプロイ（公開）の仕組み"),
  P("このサイトは GitHub Pages という GitHub の標準サービスで公開されています。"),

  H2("5-1. 流れ"),
  NUM("ローカルでファイルを編集"),
  NUM("GitHub にコミット（Upload files / Commit changes）"),
  NUM("GitHub Pages が自動的にデプロイ（1〜2分）"),
  NUM("公開URL（https://irifune-pta.github.io/）に反映"),

  H2("5-2. 注意事項"),
  CALLOUT([
    new Paragraph({ children: [RED("⚠ リポジトリは public（公開）設定です")] }),
    new Paragraph({ children: [T("中身（HTMLや設定ファイル）は誰でも閲覧できます。氏名・電話番号などの個人情報をリポジトリに含めないでください。")], spacing: { before: 60 } }),
    new Paragraph({ children: [T("緊急連絡先の電話番号（学校・警察署など）は公開情報なので問題ありません。")] }),
  ], C_YELLOW_BG, "F4C430"),

  new Paragraph({ children: [new PageBreak()] })
);

// ----- 6. トラブルシューティング -----
add(
  H1("6. トラブルシューティング"),

  TBL3(
    ["症状", "原因の可能性", "対処方法"],
    [
      ["画像が表示されない", "ファイル名違い", "ファイル名（v2の有無、全角/半角）を確認"],
      ["文字化け", "文字コード違い", "ファイルがUTF-8で保存されているか確認"],
      ["カレンダー登録が動かない", "schedule.js の構文エラー", "カンマ・括弧の対応を確認"],
      ["URLが古いまま表示", "ブラウザキャッシュ", "Ctrl+F5で強制再読み込み"],
      ["iframeが表示されない", "公開設定が無効", "スプレッドシートのウェブ公開設定を確認"],
      ["GitHubで反映されない", "デプロイ処理中", "1〜5分待つ／Actionsログ確認"],
      ["古い校章が出る", "base64キャッシュ", "ブラウザの強制再読み込み"]
    ],
    [2200, 2700, 4126]
  ),

  new Paragraph({ children: [new PageBreak()] })
);

// ----- 7. 用語 -----
add(
  H1("7. 用語"),
  TBL3(
    ["用語", "意味", "備考"],
    [
      ["年度", "4月〜翌年3月の1年間", "「令和8年度」=2026年4月〜2027年3月"],
      ["登校時安全指導 (A)", "朝の通学路で見守り", "旗振りなど"],
      ["放課後安全パトロール (B)", "放課後の街区を巡回", "腕章着用で徒歩"],
      ["GitHub", "ファイル管理サービス", "リポジトリ単位で管理"],
      ["GitHub Pages", "GitHubの無料ホスティング", "リポジトリの内容をそのまま公開"],
      ["コミット", "GitHubに変更を保存する操作", ""],
      ["デプロイ", "ファイルを公開する処理", "GitHub Pagesは自動"],
      ["iframe", "別ページを埋め込む仕組み", "スプレッドシート表示などに使用"],
      ["base64", "画像をテキストに変換した形式", "HTMLに直接画像を埋め込める"],
      ["UTF-8", "日本語に対応した文字コード", "保存時にこれを選ぶ"]
    ],
    [2700, 3200, 3126]
  ),

  new Paragraph({ children: [new PageBreak()] })
);

// ----- 8. 引継ぎチェックリスト -----
add(
  H1("8. 引継ぎチェックリスト"),
  P("新しいPTA安全指導部の担当者へ引き継ぐ際に、このリストをチェックしながら進めてください。"),

  H2("8-1. アカウント・権限"),
  BULLET("☐ GitHubアカウントを作成（既にお持ちなら不要）"),
  BULLET("☐ リポジトリの管理者権限を引き継ぐ（前任者からCollaborator追加）"),
  BULLET("☐ Googleフォーム・スプレッドシートの編集権限を引き継ぐ"),

  H2("8-2. 引継ぎ前の確認"),
  BULLET("☐ このマニュアルを通読する"),
  BULLET("☐ 公開URL（https://irifune-pta.github.io/）が表示されることを確認"),
  BULLET("☐ Googleフォームに試しに入力してみる（テスト送信）"),
  BULLET("☐ スプレッドシートが正しく更新されることを確認"),

  H2("8-3. 年度更新の作業"),
  BULLET("☐ config.js の年度・URLを新年度に更新"),
  BULLET("☐ schedule.js の担当期間を新年度の日付に更新"),
  BULLET("☐ index.html の「クラス別 担当期間」表示を更新（17クラス分）"),
  BULLET("☐ Googleフォームの内容を確認（必要なら作り直し）"),
  BULLET("☐ スプレッドシートを新年度用にリセット（または新規作成）"),
  BULLET("☐ マップ画像に変更があれば差し替え"),

  H2("8-4. 動作確認"),
  BULLET("☐ 試しに index.html を変更してGitHubにアップロード→反映確認"),
  BULLET("☐ 全クラスのカレンダー登録ボタンが動くか確認"),
  BULLET("☐ Googleフォームから予約→自動でスプレッドシートに反映される確認"),
  BULLET("☐ スマホ・PC両方で表示確認"),

  H2("8-5. 周知"),
  BULLET("☐ 保護者向けに新URLを案内（変わっていない場合は通常の連絡で再周知）"),
  BULLET("☐ 学校・PTA本部に新担当者を共有"),

  new Paragraph({ children: [new PageBreak()] })
);

// ----- 9. 困ったとき -----
add(
  H1("9. 困ったとき"),
  P("技術的に分からないことがあれば、以下の順で相談してください。"),
  NUM("前任者または経験のあるPTA安全指導部メンバー"),
  NUM("学校の情報担当の先生"),
  NUM("学校PTA本部"),
  P({ run: { size: 18 } }),
  P("また、このマニュアルで扱っていない高度な編集（HTML/CSS/JavaScriptの構造変更など）が必要な場合は、技術に明るい保護者の方にご協力をお願いするか、外部の専門家への依頼を検討してください。"),
  P({ run: { size: 18 } }),
  P([B("最終更新："), T("令和8年度（2026年）")]),
  P([B("作成："), T("PTA安全指導部")]),
);

// ===== Build the document =====
const doc = new Document({
  creator: "PTA 安全指導部",
  title: "入船小学校 PTA 安全活動 ホームページ運営マニュアル",

  styles: {
    default: {
      document: { run: { font: F_JP, size: 22 } } // 11pt default
    },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: F_JP, color: C_BLUE },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0,
          border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: C_BLUE, space: 4 } } } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: F_JP, color: C_BLUE },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 } },
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: F_JP, color: C_CORAL },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ]
  },

  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 270 } } } }] },
      { reference: "numbers",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.",
          alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 540, hanging: 360 } } } }] },
    ]
  },

  sections: [{
    properties: {
      page: {
        size: {
          width: 11906,   // A4 width
          height: 16838,  // A4 height
          orientation: PageOrientation.PORTRAIT
        },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 }
      }
    },
    headers: {
      default: undefined
    },
    footers: {
      default: new (require(path).Footer)({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "入船小学校 PTA 安全活動 ホームページ運営マニュアル — ページ ", font: F_JP, size: 18, color: C_INK_SOFT }),
            new TextRun({ children: [PageNumber.CURRENT], font: F_JP, size: 18, color: C_INK_SOFT })
          ]
        })]
      })
    },
    children: docChildren
  }]
});

Packer.toBuffer(doc).then(buf => {
  const out = "/sessions/serene-confident-rubin/mnt/outputs/PTA安全活動_ホームページ運営マニュアル.docx";
  fs.writeFileSync(out, buf);
  console.log("OK:", out, buf.length, "bytes");
}).catch(e => {
  console.error("Error:", e);
  process.exit(1);
});
