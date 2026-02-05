export type Article = {
  id: string;
  title: string;
  date: string;
  summary: string;
  body: string;
};

export const articles: Article[] = [
  {
    id: "1",
    title: "AIhen リリース",
    date: "2026-03-01",
    summary: "AIhen 正式リリースいたしました。どなたでも無料でお試しいただけます。",
    body: "AIhenを正式にリリースいたしました。AIhenはあなたVRChattr専用の改変アシスタントです。\n\nよろしければ会員登録していただき、ぜひフィードバックをお寄せください。今後も機能追加やパフォーマンス改善を継続的に行ってまいります。",
  }
];
