# Themeleon — サービスプラン & 実装状況

## サービス概要

**Themeleon** (Theme + Chameleon) — VS Code テーマをAIで生成し、手動で細かく調整できるWebアプリ。変幻自在にテーマを作れる。

## コア体験フロー

```
初回訪問 → プロンプト入力（v0/Figma Makeスタイル）→ AI生成 → エディタで調整 → エクスポート
```

- ランディングページ: チャットファーストの大きなプロンプト入力欄
- テーマ一覧は「マイテーマ」としてサブビュー
- AI再生成ダイアログに前回プロンプトプリフィル

## マネタイズ（クレジット制・買い切り）

| 対象 | 料金 |
|------|------|
| テンプレート作成・手動カラー編集・エクスポート | **完全無料** |
| AI生成（無料枠） | **5回**（有効期限なし） |
| AI生成（追加クレジット） | **$3 / 20回**（買い切り・有効期限なし） |

### なぜ月額課金ではないか

- テーマ作成は低頻度（ユーザーは1〜3回で満足）
- 月額はチャーンが高すぎる
- 買い切りがユーザー心理に合致

### クレジット管理の仕組み

| 状態 | 保存先 | 備考 |
|------|--------|------|
| 未ログイン | localStorage + IPレートリミット | 改ざン可能だがコスト小 |
| ログイン済み | Supabase DB (`user_credits`) | 永続的・cross-device |

### ユーザージャーニー

1. **初回訪問**: プロンプト入力 → AI生成（残り5回表示）→ エディタで調整
2. **無料枠消費中**: カウンター表示（控えめ）。手動編集中は非表示
3. **無料枠超過**: UpgradeModal表示 → ログイン推奨 → クレジット購入誘導
4. **ログイン後**: テーマはクラウド保存。クレジットはSupabase DB管理
5. **購入後**: 20回分追加。残りが少なくなったら追加購入を控えめに案内

## 技術スタック

| 要素 | 技術 |
|------|------|
| フロント | React + TypeScript + Vite + Tailwind CSS + shadcn/ui + Zustand |
| ホスティング | Cloudflare Pages |
| バックエンド | Cloudflare Functions (Gemini API) |
| 認証 | Supabase Auth (Google OAuth) |
| DB | Supabase (user_credits, themes, generation_log) |
| 決済 | Lemon Squeezy（未実装） |

## リポジトリ & デプロイ

- **GitHub**: https://github.com/Rikuto-des/editorthemecreator
- **本番**: https://theme-leon.com (Cloudflare Pages: editorthemecreator.pages.dev)
- **Supabase**: プロジェクトID `nfclpcjssetzyazsifda`

## DB設計

```sql
-- ユーザークレジット（新規ユーザー登録時に自動作成）
user_credits (
  user_id     uuid PK → auth.users
  free_used   int default 0
  paid_balance int default 0
  created_at  timestamptz
  updated_at  timestamptz  -- 自動更新トリガー
)

-- テーマ保存（ログインユーザー用）
themes (
  id          uuid PK
  user_id     uuid → auth.users
  name        text
  type        text  -- 'dark' | 'light'
  colors      jsonb
  token_colors jsonb
  created_at  timestamptz
  updated_at  timestamptz  -- 自動更新トリガー
)

-- AI生成ログ（分析・不正利用検知用）
generation_log (
  id          uuid PK
  user_id     uuid nullable → auth.users
  prompt      text
  ip_address  text
  created_at  timestamptz
)
```

- 全テーブルRLS有効
- `on_auth_user_created` トリガーで `user_credits` 自動作成

## 実装状況

### ✅ 完了

- [x] チャットファーストランディングページ (PromptLanding)
- [x] App.tsx: ビュー遷移リファクタ (home → editor → themes → guide)
- [x] ThemeListをテーマ管理専用に簡素化
- [x] AI再生成ダイアログ: 前回プロンプトプリフィル + カーソル文末
- [x] Supabaseプロジェクト復活 + DBテーブル・RLS・トリガー作成
- [x] Supabase client + .env設定
- [x] AuthProvider + useAuth (Google OAuthフロー)
- [x] useCreditsフック (localStorage/Supabaseハイブリッド)
- [x] UserMenuコンポーネント (ログイン/アバター/クレジット残高)
- [x] UpgradeModal (無料枠超過時のログイン誘導 + 購入誘導)
- [x] App.tsxにAI生成前クレジットチェック統合
- [x] PromptLandingにクレジットカウンター表示
- [x] GitHubリポジトリ作成 + 初回commit/push
- [x] Cloudflare Pagesデプロイ

### ⏳ 未実装

- [ ] **Google OAuth設定** — Google Cloud Console でOAuth Client作成 → Supabase DashboardでProvider有効化（手動設定）
- [ ] **テーマのクラウド保存** — ログイン時はSupabase DBに保存、未ログイン時はlocalStorage
- [ ] **ログイン時localStorageテーマのDBマイグレーション** — 確認モーダル付き
- [ ] **Lemon Squeezy決済連携** — クレジット購入フロー（Webhook → Cloudflare Function → Supabase）

## Google OAuth設定手順（手動）

### 1. Google Cloud Console

1. https://console.cloud.google.com/ → API & Services → Credentials
2. OAuth 2.0 Client ID を作成（Web Application）
3. Authorized redirect URIs: `https://nfclpcjssetzyazsifda.supabase.co/auth/v1/callback`
4. Client ID と Client Secret をコピー

### 2. Supabase Dashboard

1. https://supabase.com/dashboard/project/nfclpcjssetzyazsifda/auth/providers
2. Google を有効化 → Client ID / Secret を入力
3. Authentication → URL Configuration:
   - Site URL: `https://theme-leon.com`
   - Redirect URLs: `https://theme-leon.com`, `https://editorthemecreator.pages.dev`, `http://localhost:5173`
