export type Article = {
  id: string;
  title: string;
  date: string;
  summary: string;
  body: string;
};

export const articles: Article[] = [
  {
    id: "2",
    title: "Personal AI Coordinator 機能追加",
    date: "2026-02-21",
    summary: "アバターのコーディネート画像をAIが自動生成できる「Personal AI Coordinator」機能をリリースしました。ログイン不要でお試しいただけます。",
    body: "Personal AI Coordinator 機能をリリースしました。\n\nお気に入りのアバターを選び、ファッションの好みを入力するだけで、AIがBoothのアイテムを検索してコーディネートを提案し、画像として生成します。\n\n生成したコーディネート画像はXでシェアすることもできます。\n\nログインなしでもお試しいただけます。会員登録いただくと、チャット履歴から好みを自動生成する機能や過去のコーディネート結果の閲覧など、より便利にご利用いただけます。",
  },
  {
    id: "1",
    title: "AIhen リリース",
    date: "2026-02-14",
    summary: "AIhen 正式リリースいたしました。どなたでも無料でお試しいただけます。",
    body: "AIhenを正式にリリースいたしました。AIhenはあなたVRChatter専用の改変アシスタントです。\n\nよろしければ会員登録していただき、ぜひフィードバックをお寄せください。今後も機能追加やパフォーマンス改善を継続的に行ってまいります。",
  },
];
