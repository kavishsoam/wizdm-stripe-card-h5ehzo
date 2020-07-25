import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Stripe, CardElement } from './stripe';

@Component({
  selector: 'body',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  host: { 'class': 'mat-typography' }
})
export class AppComponent { 

  public name: string = '';
  public card: CardElement;

  constructor(private stripe: Stripe) { }

  public pay() {

    const clientSecret = '123_secret_456';
    /**  
     * Call on your server to create a payment intent getting back a clientSecret
     * @see https://stripe.com/docs/payments/accept-a-payment
     * 
     *   stripe.paymentIntents.create({
     *     amount: 1099,
     *     currency: 'eur',
     *   }).then( intent => intent.clientSecret );
     * 
     */ 

    //debugger;

    this.stripe.confirmCardPayment( clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: {
          name: this.name
        }
      }
    });
  }
}
