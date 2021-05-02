import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item-display',
  templateUrl: './item-display.component.html',
  styleUrls: ['./item-display.component.css']
})
export class ItemDisplayComponent implements OnInit {

  sku: string;
  name: string;
  description: string;
  price: number;
  picture: string;
  comments: string[];
  deleted: boolean;

  constructor() {
    this.sku = '57-AB32';
    this.name = 'Berries mix';
    this.description = 'This is a mix of Berries for you';
    this.price = 35.55;
    this.picture = '../../../assets/images/berry.jpg';
    this.comments = ['I love it ',   ' It is delicious',  ' Yummy'];
    this.deleted = false;
  }
  getComments(): string [] {
    return this.comments;
  }
  removeItem(): void {
    this.deleted = true;
  }

  ngOnInit() {
  }

}
