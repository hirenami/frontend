"use client"

import { useEffect } from 'react';

interface Props {
	productId: string;
  	value: number;
}

export default function PaypalButton( {productId, value}: Props ) {
  useEffect(() => {
    // PayPalのスクリプトをロード
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=ARjiuQWqgbf1HwWctdfY3FaiN5k2U1bBZ8b9A0ijomRguTFgCkxKI4rhY36YubQDSzcVCnGM-OaCvWLW&currency=JPY&components=buttons"; // YOUR_CLIENT_IDを置き換えてください
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
				reference_id: productId, // 商品IDをreference_idとして追加
                amount: {
					value: value.toString(), // 日本円での金額
					currency_code: 'JPY', // 通貨を日本円に設定
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
  }, [ productId, value ]);

  return <div id="paypal-button-container" className="paypal-button-container w-320 h-100 transform scale-75"></div>;
}
