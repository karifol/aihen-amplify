import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-50 dark:bg-black">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/contact" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300">
          &larr; Contact に戻る
        </Link>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          利用規約
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-zinc-700 dark:text-zinc-300">
          <p>
            この利用規約(以下「本規約」といいます。)は、AIhen(以下「本サービス」といいます。)が提供するAIチャットボットサービスの利用条件を定めるものです。
            ユーザーの皆様(以下「ユーザー」といいます。)は、本規約に同意したうえで、本サービスをご利用ください。
          </p>
          <p className="font-semibold text-blue-600 dark:text-blue-400">
            ※ 本サービスは現在ベータ版として提供されており、予告なく機能の変更や一時的な利用制限が行われる場合があります。
          </p>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第1条（サービス内容）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>本サービスは、Webブラウザ上で動作するAIチャットボットサービスです。</li>
              <li>本サービスは、VRChatというVR空間上のコミュニケーションプラットフォームを利用するユーザーを対象に、3Dアバターの「改変」(表情変更、衣装着用、髪型変更、メイク等)作業の効率化を目的として提供されます。</li>
              <li>本サービスは、Booth.pm 上で公開されている3Dモデル等の情報を、運営者が独自に構築したデータベースをもとに、AIがチャット形式で検索・提示する機能を提供します。</li>
              <li>本サービスが参照する情報は、Booth.pm 上で公開されている情報を対象に、Booth.pm の利用規約およびガイドラインに配慮した方法で収集・構築されたものです。収集にあたっては、サーバーに過度な負荷をかけないよう十分に配慮しています。ただし、これらの情報は、必ずしも最新、完全、正確な内容であることを保証するものではありません。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第2条（利用条件）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>ユーザーは、本規約に同意した場合にのみ、本サービスを利用することができます。</li>
              <li>ユーザーは、自己の責任において本サービスを利用するものとし、本サービスの利用により生じた一切の結果について責任を負うものとします。</li>
              <li>ユーザーは、本サービスの利用にあたり、VRChatおよびBooth.pm の各利用規約・ガイドラインを遵守するものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第3条（禁止事項）</h2>
            <p className="mb-2">ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。</p>
            <ol className="list-decimal list-inside ml-4 space-y-1">
              <li>法令または公序良俗に違反する行為</li>
              <li>本サービスの運営を妨害する行為</li>
              <li>不正アクセス、過度な負荷をかける行為、リバースエンジニアリング等の行為</li>
              <li>本サービスまたはその出力結果を用いた再スクレイピング、体系的なデータ収集行為</li>
              <li>本サービスの内容を不正に改変、複製、転載、再配布する行為</li>
              <li>他者の著作権、商標権、プライバシー権その他の権利を侵害する行為</li>
              <li>本サービスを通じて取得した情報を、権利者の許諾なく商用利用する行為</li>
              <li>AIの出力結果を、誤解を招く形で第三者に提供する行為</li>
              <li>運営者が不適切と判断する行為</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第4条（知的財産権）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>本サービスに関するプログラム、システム、UI、文章、構成、ロゴ等の知的財産権は、運営者または正当な権利者に帰属します。</li>
              <li>本サービスを通じて提示されるBooth.pm 上の3Dモデル情報、商品情報等の著作権は、各出品者または権利者に帰属します。</li>
              <li>ユーザーは、本サービスの出力結果を、個人利用の範囲を超えて利用することはできません。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第5条（AIによる回答について）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>本サービスは、AIを用いて情報の検索および回答を行います。</li>
              <li>AIによる回答内容は、その性質上、誤りや不完全な情報を含む場合があります。</li>
              <li>本サービスの回答内容は、あくまで参考情報として提供されるものであり、その正確性、有用性、完全性を保証するものではありません。</li>
              <li>本サービスの利用に基づく最終的な判断および行動は、ユーザー自身の責任において行うものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第6条（免責事項）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>運営者は、本サービスの内容および提供について、いかなる保証も行いません。</li>
              <li>本サービスにより提示される情報が、実際のBooth.pm 上の販売ページや公式情報と異なる場合があります。ユーザーは、必ず公式情報を確認するものとします。</li>
              <li>本サービスの利用または利用不能によりユーザーに生じた損害について、運営者は一切の責任を負いません。</li>
              <li>運営者は、予告なく本サービスの内容の変更、中断、終了を行うことがあります。</li>
              <li>システム障害、通信回線の不具合、外部サービスの障害等により本サービスが利用できない場合であっても、運営者は責任を負いません。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第7条（外部サービスとの関係）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>本サービスは、Booth.pm および VRChat の公式サービスではありません。</li>
              <li>Booth.pm および VRChat の運営者、関係者は、本サービスの内容および運営について一切の責任を負いません。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第8条（Booth出品者からの削除要請への対応）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>Booth.pm に出品している商品情報について、出品者ご本人から削除要請があった場合、運営者は速やかに対応いたします。</li>
              <li>削除要請は、運営者が指定する連絡先（X等）にて受け付けます。要請の際は、出品者本人であることを確認できる情報をご提供ください。</li>
              <li>削除要請を受理した場合、原則として1ヶ月以内に、該当する商品情報をデータベースから削除いたします。</li>
              <li>削除後も、システムのキャッシュやバックアップ等の技術的理由により、一定期間情報が残存する場合があります。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第9条（個人情報の取扱い）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>本サービスの利用にあたり、ユーザー登録時にメールアドレスの入力が必要となります。</li>
              <li>取得したメールアドレスおよびアクセスログ、利用状況データは、本サービスの提供・運営、本人確認、ユーザーへの連絡、不正利用防止およびサービス改善の目的にのみ利用します。</li>
              <li>運営者は、法令に基づく場合を除き、ユーザーの同意なく個人情報を第三者に開示または提供しません。</li>
              <li>個人情報の詳細な取扱いについては、別途定めるプライバシーポリシーに従うものとします。</li>
            </ol>
          </section>

          <section>
            <h2 className="mb-3 text-lg font-semibold text-zinc-900 dark:text-zinc-50">第10条（利用規約の変更）</h2>
            <ol className="list-decimal list-inside ml-4 space-y-2">
              <li>運営者は、必要と判断した場合、本規約を変更することができます。</li>
              <li>変更後の規約は、本サービス上に表示した時点から効力を生じるものとします。</li>
            </ol>
          </section>

          <p className="text-right text-zinc-500">以上</p>
        </div>
      </div>
    </div>
  )
}
