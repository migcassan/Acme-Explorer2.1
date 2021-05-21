import { Component, OnInit } from '@angular/core';
import { TranslatableComponent } from '../shared/translatable/translatable.component';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent extends TranslatableComponent implements OnInit {

  public showSuccess: boolean;
  public showCancel: boolean;
  public showError: boolean;
  private payPalConfig: PayPalConfig;

  constructor(private translateService: TranslateService,
    private route: ActivatedRoute,
    private router: Router) {
    super(translateService);
    }

  ngOnInit() {
    this.initConfig();
  }

  initConfig() {
    const total = this.route.snapshot.queryParams['price'];
    console.log (total);
    this.payPalConfig = new PayPalConfig ({
      currency: 'EUR',
      clientId: 'AcYYvVQ9rTjnGhWhhzXq7kE-ap-5H3X7N6_R1mLs40KrQ6bXNLSkOsOf90g7pOaA1ADns_n5eJvBhDm0',
      createOrder: (data) => < ICreateOrderRequest > {
        intent: 'CAPTURE',
        purchase_units: [ {
          amount: {
            currency_code: 'EUR',
            value: total,
          },
        }]
      },
      advanced: {
        updateOrderDetails: {
          commit: true
        }
      },
      style: {
        label: 'paypal',
        layout: 'vertical'
      },

      onApprove: (data, actions) => {
        console.log ('Transaction was approved, but not authorized yet', data, actions);
        actions.order.get().then(details => {
          console.log ('Order details:', details);
        });
      },

      onClientAuthorization: (data) => {
        alert(this.translateService.instant('order.placed'));
        this.router.navigateByUrl('/trips');
      },
      onCancel: (data, actions) => {
        console.log ('OnCancel', data, actions);
      },
      onError: err => {
        console.log ('OnError', err);
      },
      onClick: () => {
        console.log('onClick');
      },
    });
  }
}
