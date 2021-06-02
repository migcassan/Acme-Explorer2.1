/// <reference path="../../../../../node_modules/@types/googlemaps/index.d.ts" />

import { Component, OnInit, ViewChild, NgZone, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Actor } from 'src/app/models/actor.model';
import { TranslatableComponent } from '../../shared/translatable/translatable.component';
import { AuthService } from 'src/app/services/auth.service';
import { ActorService } from 'src/app/services/actor.service';
import { ValidateURLOptional } from '../../shared/optionalUrl.validator';
import { existingPhoneNumValidator } from '../../shared/existingPhone.validator';
import { MouseEvent, MapsAPILoader } from '@agm/core';
import { marker} from '../../../models/marker.model';
import { Picture } from 'src/app/models/picture.model';
import { CanComponentDeactivate } from 'src/app/services/can-deactivate.service';
import { Observable } from 'rxjs';

declare var google: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent extends TranslatableComponent implements OnInit, CanComponentDeactivate {

  profileForm: FormGroup;
  formModel: Actor;
  actor: Actor;
  langs = ['en', 'es'];
  photoChanged: Boolean;
  picture: string;
  zoom = 10;
  lat = 37.3753501;
  lng = -6.0250983;
  markers: marker[] = [];
  autocomplete: any;

  private updated: boolean;
  private cancelChanges = false;

  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private actorService: ActorService,
    private translateService: TranslateService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone) {
    super(translateService);
    this.updated = false;
  }

  ngOnInit() {
    this.photoChanged = false;
    this.createForm();

    this.mapsAPILoader.load().then(() => {

      this.autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });
      this.autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place = this.autocomplete.getPlace();

          this.profileForm.value.address = place.formatted_address;

          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          this.zoom = 16;

          this.markers = [];
          this.markers.push({
            lat: this.lat,
            lng: this.lng,
            draggable: true
          });
        });
      });
    }).catch(err => console.log(err));
  }

  // Método donde creamos el formulario, es decir donde definimos los campos de los que consta el formulario creando un grupo con "group"
  createForm() {
    this.profileForm = this.formBuilder.group
    ({
      id: [''],
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: [''],
      password: [''],
      phone: ['', [Validators.pattern('[0-9]+')], [existingPhoneNumValidator(this.actorService, this.authService)]],
      address: ['', Validators.maxLength(50)],
      preferredLanguage: [''],
      photo: [''],
      // ValidateURLOptional],
      picture: [''],
      role: ['']
    });

    const currentActor = this.authService.getCurrentActor();
    if (currentActor) {
      const idActor = this.authService.getCurrentActor().id;
      this.actorService.getActor(idActor).then((actor) => {
        this.actor = actor;
        console.log('createForm');
        console.log(JSON.stringify(actor));
        if (actor) {
          this.profileForm.controls['id'].setValue(actor.id);
          this.profileForm.controls['name'].setValue(actor.name);
          this.profileForm.controls['surname'].setValue(actor.surname);
          this.profileForm.controls['email'].setValue(actor.email);
          this.profileForm.controls['password'].setValue(actor.password);
          this.profileForm.controls['phone'].setValue(actor.phone);
          this.profileForm.controls['preferredLanguage'].setValue(actor.preferredLanguage);
          this.profileForm.controls['role'].setValue(actor.role);
          this.profileForm.controls['address'].setValue(actor.address);
          console.log('photo: ', actor.photoObject);
          if (actor.photoObject != undefined) { // Para que no salte el error cuando no está creada la estructura
            this.picture = actor.photoObject.Buffer;
            document.getElementById('showresult').textContent = actor.photoObject.Buffer;
            this.formModel = this.profileForm.value;
            this.formModel.photoObject = new Picture ();
            this.formModel.photoObject.Buffer = document.getElementById('showresult').textContent;
            this.formModel.photoObject.contentType = 'image/png';
          }
          if (this.actor.address == null) {
            this.setCurrentPosition();
          } else {
            const coords = this.actor.address.split(';');
            console.log('Split: ' + coords);
            if (coords != null && coords.length === 2) {
              this.markers.push({
                lat: +coords[0],
                lng: +coords[1],
                draggable: true
              });
            }
          }
        }
      });
    }
  }

  onSubmit() {
    console.log('Estoy dentro de onSubmit');

    /*const result = [];
    Object.keys(this.profileForm.controls).forEach(key => {

      const controlErrors: ValidationErrors = this.profileForm.get(key).errors;
      if (controlErrors) {
        Object.keys(controlErrors).forEach(keyError => {
          console.log('control: ', key);
          console.log('error: ', keyError);
          console.log('value: ', controlErrors[keyError]);
        });
      }
    });*/

    // se recuperan los valores que el usuario haya podido modificar
    // Si photoChanged = true, el usuario ha cambiado la foto, en ese caso actualizamos la variable formModel del formulario
    if (this.photoChanged) {
      console.log('actualizamos la foto');
      this.formModel = this.profileForm.value;
      this.formModel.photoObject = new Picture ();
      this.formModel.photoObject.Buffer = document.getElementById('showresult').textContent;
      this.formModel.photoObject.contentType = 'image/png'; // Por ahora solo aceptamos imagenes de tipo .png
    }

    if (!this.cancelChanges) {
      console.log('Acepto los cambios y me voy a home');
      // Llamo al método updateProfile que vuelca al Json Server los valores que ha modificado el usuario
      this.formModel = this.profileForm.value;
      this.formModel.photoObject = new Picture ();
      this.formModel.photoObject.Buffer = document.getElementById('showresult').textContent;
      this.formModel.photoObject.contentType = 'image/png'; // Por ahora solo aceptamos imagenes de tipo .png
      this.actorService.updateProfile(this.formModel).then((val) => {
      console.log(val);
      this.cancelChanges = true;
      // Si todo va bien vuelvo a la página que hayamos definido
      this.router.navigate(['/home']);
    }).catch((err) => {
      console.error(err);
    });
    } else {
      this.cancelChanges = false;
    }
  }


  // Este evento es el que se dispara cuando el usuario haga click en el botón "examinar" del html para buscar una foto
  onFileChange(event) {
    const reader = new FileReader();
    const showout = document.getElementById('showresult');
    let res;
    // Bandera que sirve para indicarnos que el usuario ha cambiado la foto
    this.photoChanged = true;
    console.log('Estoy dentro de onFileChange');

    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;

      reader.addEventListener('loadend', function () {
        res = reader.result;
        showout.textContent = this.result.toString();
      });
      reader.readAsDataURL(file);
    }
  }


// Método genérico que cada componente lo tiene que customizar
canDeactivate (): Observable <boolean> | Promise <boolean> | boolean {
  console.log('Estoy dentro de canDeactivate');
  let result = false;
  const message = this.translateService.instant('messages.discard.changes');
  if (!this.updated && this.profileForm.dirty) {
    result = confirm(message);
    if (!result) {
      console.log('Cancelar');
     this.cancelChanges = true;
    }
  }
  return result;
}


// Este método se ejecuta al pinchar en el botón cancelar del html y lo que hacemos es evaluar el resultado del canDeactivate anterior
goBack(): void {
  const result = this.canDeactivate();
  console.log(result);
  if (result) {
    console.log('Has pinchado en Aceptar la cancelación');
    this.router.navigate(['/home']);
  } else {
    console.log('Has pinchado en cancelar');
  }
}


// Método que se ejecuta cuando se pincha en algún punto del mapa
  mapClicked($event: MouseEvent) {
    this.markers = [];
    this.markers.push({
      lat: $event.coords.lat,
      lng: $event.coords.lng,
      draggable: true
    });

    this.profileForm.value.address = $event.coords.lat + ';' + $event.coords.lng;
    this.profileForm.controls['address'].setValue(this.profileForm.value.address);
  }


// Método para establecer la posición en el mapa
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      console.log('Geolocation');
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
}
