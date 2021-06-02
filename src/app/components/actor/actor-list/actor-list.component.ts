import { Component, OnInit } from '@angular/core';
import { Actor } from '../../../models/actor.model';
import { FormBuilder } from '@angular/forms';
import { ApplicationService } from 'src/app/services/application.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ActorService } from 'src/app/services/actor.service';

@Component({
  selector: 'app-actor-list',
  templateUrl: './actor-list.component.html',
  styleUrls: ['./actor-list.component.css']
})
export class ActorListComponent implements OnInit {

  data: Actor[];

  constructor(private fb: FormBuilder,
    private actorservice: ActorService,
    private router: Router,
    private translateservice: TranslateService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.actorservice.getActors()
    .then ((val) => {
      this.data = val;
      console.log('Listado de actores:' + this.data);
    })
    .catch((err) => console.error(err.message));
  }
  }

