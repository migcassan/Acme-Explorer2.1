import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { ItemListComponent } from './components/item/item-list/item-list.component';
import { ItemDisplayComponent } from './components/item/item-display/item-display.component';
import { HeaderComponent } from './components/master/header/header.component';
import { RegisterComponent } from './components/security/register/register.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslatableComponent } from './components/shared/translatable/translatable.component';
import { LoginComponent } from './components/security/login/login.component';
import { FooterComponent } from './components/master/footer/footer.component';
import { LocalizedDataPipe } from './components/shared/localized-data.pipe';
import { registerLocaleData } from '@angular/common';
import locales from '@angular/common/locales/es';
import { AppRoutingModule } from './app-routing.module';

// Initialize firebase
export const firebaseConfig = {
  apiKey: 'AIzaSyC0ibseZxetzW7lnBo34TQSOd2ZRelcRFQ',
  authDomain: 'acme-explorer-2-1.firebaseapp.com',
  projectId: 'acme-explorer-2-1',
  storageBucket: 'acme-explorer-2-1.appspot.com',
  messagingSenderId: '854437962798',
  appId: '1:854437962798:web:2169135e07b830fafeabbf',
  measurementId: 'G-M7QL9JTYCC'
};

registerLocaleData(locales, 'es');

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    ItemListComponent,
    ItemDisplayComponent,
    HeaderComponent,
    RegisterComponent,
    TranslatableComponent,
    LoginComponent,
    FooterComponent,
    LocalizedDataPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    AngularFireModule.initializeApp(firebaseConfig),
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),
    AppRoutingModule

  ],
  providers: [AngularFireAuth],
  bootstrap: [AppComponent]
})
export class AppModule { }
