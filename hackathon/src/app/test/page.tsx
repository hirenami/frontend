"use client"

import { useEffect } from 'react';

export default function PaypalButton() {
  useEffect(() => {
    // PayPalのスクリプトをロード
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=ARjiuQWqgbf1HwWctdfY3FaiN5k2U1bBZ8b9A0ijomRguTFgCkxKI4rhY36YubQDSzcVCnGM-OaCvWLW"; // YOUR_CLIENT_IDを置き換えてください
    script.async = true;

    script.onload = () => {
		//@ts-expect-error: Unreachable code error
      if (window.paypal) {
		//@ts-expect-error: Unreachable code error
        window.paypal.Buttons({
          // ボタンの設定や処理をここに記述
		  
          createOrder: (data:any,actions:any) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: '0.01', // 設定する金額
                },
              }],
            });
          },
          onApprove: (data:any,actions:any) => {
            return actions.order.capture().then((details: any) => {
              alert('Transaction completed by ' + details.payer.name.given_name);
            });
          },
        }).render('#paypal-button-container'); // レンダリング先の要素ID
      }
    };

    document.body.appendChild(script);

    // クリーンアップ
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return <div id="paypal-button-container"></div>;
}
