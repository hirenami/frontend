"use client"

import { useEffect, useState } from 'react';

interface Props {
  productId: string;
  value: number;
  isOpen: boolean; // ダイアログが開いているかどうかのフラグ
}

export default function PaypalButton({ productId, value, isOpen }: Props) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  useEffect(() => {
    if (isOpen && !isScriptLoaded) {
      // PayPalのスクリプトをロード
      const script = document.createElement('script');
      const scriptId = "paypal-sdk-script";
      script.id = scriptId;
      script.src = "https://www.paypal.com/sdk/js?client-id=ARjiuQWqgbf1HwWctdfY3FaiN5k2U1bBZ8b9A0ijomRguTFgCkxKI4rhY36YubQDSzcVCnGM-OaCvWLW&currency=JPY&components=buttons";
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
            alert('Transaction completed by ' + details.payer.name.given_name);
          });
        },
      }).render('#paypal-button-container'); // PayPalボタンを描画
    }
  }, [isOpen, isScriptLoaded, productId, value]);

  return <div id="paypal-button-container" className="w-full max-h-[600px] overflow-y-auto transform scale-75"></div>;
}
