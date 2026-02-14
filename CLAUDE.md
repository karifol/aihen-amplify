# AIhen Amplify - プロジェクト設定メモ

## APIプロキシ設定

フロントエンドからのAPIリクエストは `/api/...` の相対パスでプロキシしている。

### ローカル開発
`next.config.ts` の `rewrites` で自動的にプロキシされる。

### 本番 (AWS Amplify)
Amplifyコンソールでリライトルールの設定が必要。

**アプリ → ホスティング → リライトとリダイレクト → ルールを管理** で以下を追加:

| Source | Target | Type |
|--------|--------|------|
| `/api/chat/<*>` | `https://lgz099nfc3.execute-api.ap-northeast-1.amazonaws.com/Prod/<*>` | 200 (Rewrite) |
| `/api/coordinator/<*>` | `https://unkxcv7v41.execute-api.ap-northeast-1.amazonaws.com/Prod/<*>` | 200 (Rewrite) |
| `/api/items/<*>` | `https://poqzffs5v8.execute-api.ap-northeast-1.amazonaws.com/prod/<*>` | 200 (Rewrite) |

- タイプは必ず **200 (Rewrite)** を選ぶ
- SPAフォールバックルール (`/<*>` → `/index.html`) がある場合、APIルールをその**上**に配置する
