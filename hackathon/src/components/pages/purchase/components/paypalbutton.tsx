"use client"

import { useEffect, useState } from 'react';

interface Props {
  productId: string;
  value: number;
  isOpen: boolean; // ダイアログが開いているかどうかのフラグ
  onPaymentSuccess: () => void; // 支払いが成功した時のコールバック
}

export default function PaypalButton({ productId, value, isOpen, onPaymentSuccess }: Props) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !isScriptLoaded) {
      // PayPalのスクリプトをロード
      const script = document.createElement('script');
      const scriptId = "paypal-sdk-script";
      script.id = scriptId;
      script.src = "https://www.paypal.com/sdk/js?client-id=AQ1mcAmB8qGUGV4SNlsh7BqTNYafwflLLwYr7pPpx_9qQksBO0dnw0PgIUkGS1l9qZFmAFP1pzB7-7F9&currency=JPY&components=buttons";
      script.async = true;

      script.onload = () => {
        setIsScriptLoaded(true); // スクリプトがロードされたらフラグを立てる
      };

      document.body.appendChild(script);

      // クリーンアップ
      return () => {
        const existingScript = document.getElementById(scriptId);
        if (existingScript) {
          document.body.removeChild(existingScript);
        }
      };
    }
  }, [isOpen, isScriptLoaded]);

  useEffect(() => {
	//@ts-expect-error: Unreachable code error
    if (isOpen && isScriptLoaded && window.paypal) {
		//@ts-expect-error: Unreachable code error
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [{
              reference_id: productId,
              amount: {
                value: value.toString(),
                currency_code: 'JPY',
              },
            }],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
			// 支払いが成功したらコールバックを実行
			onPaymentSuccess();
            alert('Transaction completed by ' + details.payer.name.given_name);
          });
        },
      }).render('#paypal-button-container'); // PayPalボタンを描画
    }
  }, [isOpen, isScriptLoaded]);

  return <div id="paypal-button-container" className="w-full max-h-[600px] overflow-y-auto transform scale-75"></div>;
}
