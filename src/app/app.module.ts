import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { StripeModule } from './stripe/stripe.module';
import { AppComponent } from './app.component';

@NgModule({
  imports:      [   
    BrowserModule, 
    BrowserAnimationsModule, 
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    StripeModule.init({
      publicKey: 'pk_test_ScThoGfGM6uXJgQPt0D3R1r400FyDt2uRD', 
      //options: { locale: 'it' },
      elementsOptions: {
        fonts: [
          { cssSrc: 'https://fonts.googleapis.com/css?family=Ubuntu:400,700' }
        ]
      },
      elementOptions: {
        style: {
          base: {
            fontFamily: 'Ubuntu, sans-serif'
          }
        }
      }
    })
  ],
  
  declarations: [ 
    AppComponent
  ],
  
  bootstrap: [ AppComponent ]
})
export class AppModule { }
