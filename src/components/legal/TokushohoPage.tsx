import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TokushohoPageProps {
  onBack: () => void
}

export function TokushohoPage({ onBack }: TokushohoPageProps) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-6">
        <ArrowLeft className="mr-1 h-4 w-4" />
        戻る
      </Button>

      <h1 className="mb-8 text-2xl font-bold">特定商取引法に基づく表記</h1>

      <div className="space-y-6 text-sm leading-relaxed">
        <section>
          <h2 className="mb-2 font-semibold text-foreground">販売事業者</h2>
          <p className="text-muted-foreground">保田陸人</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">所在地</h2>
          <p className="text-muted-foreground">請求があった場合に遅滞なく開示いたします。</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">電話番号</h2>
          <p className="text-muted-foreground">請求があった場合に遅滞なく開示いたします。</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">メールアドレス</h2>
          <p className="text-muted-foreground">ricton513@gmail.com</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">運営統括責任者</h2>
          <p className="text-muted-foreground">保田陸人</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">販売URL</h2>
          <p className="text-muted-foreground">
            <a href="https://theme-leon.com" className="underline hover:text-foreground">https://theme-leon.com</a>
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">商品名</h2>
          <p className="text-muted-foreground">Themeleon AI生成クレジット 20回分</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">販売価格</h2>
          <p className="text-muted-foreground">$3.00（USD）/ 20回分</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">商品の引渡し時期</h2>
          <p className="text-muted-foreground">決済完了後、即時にクレジットが付与されます。</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">お支払い方法</h2>
          <p className="text-muted-foreground">クレジットカード（Visa, Mastercard, American Express, JCB）</p>
          <p className="mt-1 text-muted-foreground">決済はStripe Inc.が提供する決済システムを利用しています。</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">返品・キャンセルについて</h2>
          <p className="text-muted-foreground">
            デジタルコンテンツの性質上、購入後の返品・返金は原則としてお受けしておりません。
            ただし、サービスの不具合等により正常にクレジットが付与されなかった場合は、
            上記メールアドレスまでお問い合わせください。
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">追加手数料</h2>
          <p className="text-muted-foreground">表示価格以外の費用はかかりません。</p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold text-foreground">動作環境</h2>
          <p className="text-muted-foreground">最新のWebブラウザ（Chrome, Firefox, Safari, Edge）</p>
        </section>
      </div>
    </div>
  )
}
