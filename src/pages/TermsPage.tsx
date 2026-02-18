import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon/Icon';
import { GlobalFooter } from '@/components/GlobalFooter/GlobalFooter';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-light-gradient dark:bg-casino-gradient">
      <div className="mx-auto max-w-2xl px-4 py-8">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-amber-700 dark:text-gray-400 dark:hover:text-casino-gold"
        >
          <Icon name="arrow_back" size={16} />
          ホームに戻る
        </Link>

        <h1 className="mb-8 text-2xl font-bold text-amber-700 dark:text-casino-gold">
          利用規約
        </h1>

        <div className="space-y-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <section>
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              第1条（本規約の適用）
            </h2>
            <p>
              本利用規約（以下「本規約」といいます）は、当サイトが提供する「Coin
              Toss
              Game」（以下「本サービス」といいます）の利用に関する条件を定めるものです。ユーザーは本規約に同意のうえ、本サービスをご利用ください。
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              第2条（サービスの内容）
            </h2>
            <p>
              本サービスは、コイントスの表裏を予想して楽しむ無料のブラウザゲームです。スコアはお使いのデバイスのLocalStorageに保存され、サーバーへの送信は行いません。
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              第3条（禁止事項）
            </h2>
            <p>ユーザーは以下の行為を行ってはなりません。</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>本サービスの運営を妨害する行為</li>
              <li>本サービスを通じて不正アクセスを行う行為</li>
              <li>法令または公序良俗に反する行為</li>
              <li>その他、当サイトが不適切と判断する行為</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              第4条（免責事項）
            </h2>
            <p>
              当サイトは、本サービスの利用によって生じたいかなる損害についても責任を負いません。また、本サービスは予告なく内容の変更・停止・終了を行う場合があります。
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              第5条（広告について）
            </h2>
            <p>
              本サービスでは、Google
              AdSenseによる広告を掲載しています。広告の配信にあたり、Googleが提供する情報を利用する場合があります。詳しくは
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-700 dark:hover:text-casino-gold"
              >
                Googleの広告ポリシー
              </a>
              をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              第6条（本規約の変更）
            </h2>
            <p>
              当サイトは、必要に応じて本規約を変更できるものとします。変更後の規約は本ページに掲載した時点で効力を生じます。
            </p>
          </section>

          <p className="pt-4 text-xs text-gray-400 dark:text-gray-600">
            制定日：2026年2月15日
          </p>
        </div>
      </div>
      <GlobalFooter />
    </div>
  );
}
