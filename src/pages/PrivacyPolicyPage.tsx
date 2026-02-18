import { Link } from 'react-router-dom';
import { Icon } from '@/components/Icon/Icon';
import { GlobalFooter } from '@/components/GlobalFooter/GlobalFooter';

export function PrivacyPolicyPage() {
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
          プライバシーポリシー
        </h1>

        <div className="space-y-6 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            当サイトは、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。本プライバシーポリシーでは、当サイトが運営する「Coin
            Toss
            Game」（以下「本サービス」）における情報の取り扱いについて説明します。
          </p>

          <section>
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              1. 収集する情報
            </h2>
            <p>本サービスでは、以下の情報を取り扱います。</p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                <span className="font-medium">LocalStorage データ：</span>
                ゲームスコアおよびアプリの設定（ダークモード・サウンド設定）をお使いのデバイスのLocalStorageに保存します。このデータはサーバーに送信されず、外部に共有されることはありません。
              </li>
              <li>
                <span className="font-medium">
                  広告配信に関するデータ（Google AdSense）：
                </span>
                本サービスではGoogle
                AdSenseを利用した広告を掲載しています。Googleは広告配信のためにCookieを使用し、ユーザーの興味に基づいた広告を表示する場合があります。
              </li>
            </ul>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              2. Cookieについて
            </h2>
            <p>
              本サービス自体はCookieを使用しません。ただし、Google
              AdSenseによる広告配信においてCookieが利用される場合があります。Cookieの利用を無効化したい場合は、ブラウザの設定から変更することができます。
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              3. 第三者へのデータ提供
            </h2>
            <p>
              当サイトは、法令に基づく場合を除き、ユーザーの情報を第三者に提供することはありません。なお、Google
              AdSenseの利用に関するデータについては、Googleのプライバシーポリシーに従います。
            </p>
            <p className="mt-2">
              Google のプライバシーポリシーについては
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-amber-700 dark:hover:text-casino-gold"
              >
                こちら
              </a>
              をご確認ください。
            </p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              4. アクセス解析
            </h2>
            <p>本サービスでは現在、アクセス解析ツールは使用していません。</p>
          </section>

          <section>
            <h2 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">
              5. プライバシーポリシーの変更
            </h2>
            <p>
              当サイトは、必要に応じて本プライバシーポリシーを変更する場合があります。変更後のポリシーは本ページに掲載した時点で効力を生じます。
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
