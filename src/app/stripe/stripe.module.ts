import { APP_INITIALIZER, PLATFORM_ID, NgModule, ModuleWithProviders, Inject, Optional, forwardRef } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StripeConfig, StripeConfigToken, loadStripeJS, stripeFactory  } from './stripe-factory';
import { Elements } from './stripe-definitions/element';
import { Stripe } from './stripe-definitions';
import { StripeControl } from './stripe-control';
import { StripeMaterial } from './stripe-material';
import { StripeCard } from './stripe-card';

@NgModule({
  imports: [ /*CommonModule*/ ],
  declarations: [ StripeControl, StripeMaterial, StripeCard ],
  exports: [ StripeControl, StripeMaterial, StripeCard ]
})
export class StripeModule {

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if( !isPlatformBrowser(platformId) ) {
      throw new Error('StripeModule package supports Browsers only');
    }
  }

  static init(config: StripeConfig): ModuleWithProviders<StripeModule> {
    return {
      ngModule: StripeModule,
      providers: [
        /** Loads the Stripe.js script during app initialization */
        { provide: APP_INITIALIZER, useValue: loadStripeJS, multi: true },
        /** Provides the global StripeConfig object */
        { provide: StripeConfigToken, useValue: config },
        /** Provides Stripe as an injectable service. Stripe has been definid as an abstract class to 
         * be purposely used as a valid token while stripeFactory() provides a stripe instance configured
         * according to the global StripeConfig object. */
        { provide: Stripe,
          useFactory: stripeFactory, 
          deps: [ [ new Optional(), new Inject(StripeConfigToken) ] ] },
        /** Provide Stripe.elements() as an injectable service. Elements has been purposely definied 
         * as an abstract class to be used as a valid token. while the factory is inlined here to call 
         * upon the stripe instance and returning the Elements instance configured accoridg to the global
         * StripeConfig object. */
        { provide: Elements,
          useFactory: (stripe: Stripe, config: StripeConfig) => stripe.elements(config && config.elementsOptions),
          deps: [ forwardRef(() => Stripe), [  new Optional(), new Inject(StripeConfigToken) ] ] }
      ]
    };
  } 
}