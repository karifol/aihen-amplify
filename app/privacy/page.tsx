import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">
          &larr; Contact に戻る
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          プライバシーポリシー
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>
            AIhen（以下「本サービス」といいます。）は、ユーザーの個人情報の保護を重要な責務と考え、以下のとおりプライバシーポリシー（以下「本ポリシー」といいます。）を定め、個人情報の適切な取扱いおよび保護に努めます。
          </p>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第1条（取得する情報）</h2>
            <p className="mb-3">本サービスは、サービスの提供および運営にあたり、以下の情報を取得します。</p>

            <div className="ml-4 mb-4">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">ユーザーが直接提供する情報</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>メールアドレス（ユーザー登録時）</li>
                <li>パスワード（暗号化された形式で保存されます）</li>
                <li>お問い合わせ時に入力された情報</li>
              </ul>
            </div>

            <div className="ml-4">
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">サービス利用に伴い自動的に取得される情報</h3>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>チャット履歴および入力内容</li>
                <li>IPアドレス</li>
                <li>ブラウザの種類、OS、端末情報</li>
                <li>アクセス日時、利用履歴</li>
                <li>Cookieおよび類似技術により取得される情報</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第2条（情報の利用目的）</h2>
            <p className="mb-2">取得した情報は、以下の目的の範囲内で利用します。</p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>本サービスの提供、運営、維持および改善のため</li>
              <li>ユーザー認証、ログイン管理およびアカウント管理のため</li>
              <li>ユーザーからのお問い合わせ対応およびサポート対応のため</li>
              <li>不正利用の防止、セキュリティ確保およびシステムの安定運用のため</li>
              <li>利用状況の分析、統計データの作成およびサービス品質向上のため</li>
              <li>重要なお知らせ、機能変更等の通知のため</li>
              <li>AIチャットボットの応答品質向上および機能改善のため（個人を特定できない形で利用する場合を含みます）</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第3条（第三者提供および外部サービスの利用）</h2>
            <p className="mb-2">運営者は、以下の場合を除き、ユーザーの個人情報を第三者に提供しません。</p>
            <ul className="list-disc list-inside ml-4 space-y-1 mb-4">
              <li>ユーザーの同意がある場合</li>
              <li>法令に基づく場合</li>
              <li>人の生命、身体または財産の保護のために必要がある場合</li>
              <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
              <li>国の機関または地方公共団体等から法令に基づく協力要請があった場合</li>
            </ul>
            <p className="mb-2">本サービスは、以下の外部サービスを利用しています。これらのサービスにおいては、各サービス提供者のプライバシーポリシーに基づき情報が取り扱われます。</p>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>AWS Cognito（ユーザー認証・アカウント管理）</li>
              <li>Google Gemini（AI機能の提供）</li>
              <li>AWS Lambda、API Gateway、その他 AWS クラウドサービス（システム運用）</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第4条（情報の管理および安全対策）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>運営者は、取得した個人情報について、不正アクセス、紛失、漏洩、改ざん等を防止するため、合理的な安全管理措置を講じます。</li>
              <li>パスワードは暗号化された状態で保存され、運営者を含む第三者が平文で確認することはできません。</li>
              <li>チャット履歴および利用ログは、サービス提供に必要な期間保存し、不要となった場合には適切な方法で削除します。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第5条（Cookieおよび類似技術）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>本サービスは、利便性向上および利用状況分析のため、Cookieおよび類似技術を使用することがあります。</li>
              <li>ユーザーは、ブラウザの設定によりCookieの使用を無効にすることができますが、その場合、本サービスの一部機能が利用できなくなることがあります。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第6条（個人情報の開示・訂正・削除）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>ユーザーは、自己の個人情報について、開示、訂正、利用停止または削除を求めることができます。</li>
              <li>これらの請求を行う場合、運営者は本人確認を行ったうえで、合理的な範囲で速やかに対応します。</li>
              <li>アカウント削除を希望する場合は、本サービス内のお問い合わせフォームよりご連絡ください。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第7条（保存期間）</h2>
            <p className="ml-4">
              運営者は、個人情報を利用目的の達成に必要な期間のみ保持し、その期間経過後または利用目的が不要となった場合には、適切な方法で削除または匿名化します。
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第8条（プライバシーポリシーの変更）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>運営者は、法令の改正、サービス内容の変更等に応じて、本ポリシーを変更することがあります。</li>
              <li>変更後のプライバシーポリシーは、本サービス上に表示した時点から効力を生じるものとします。</li>
              <li>重要な変更がある場合には、本サービス上で適切な方法により通知します。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第9条（お問い合わせ）</h2>
            <p className="ml-4">
              本ポリシーに関するお問い合わせは、本サービス内のお問い合わせフォームまたは運営者が指定する連絡手段（X（旧Twitter）のDM等）よりご連絡ください。
            </p>
          </section>

          <p className="text-zinc-500">制定日: 2026年1月25日</p>
        </div>
      </div>
    </div>
  )
}
