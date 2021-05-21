import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDisplayComponent } from './application-display.component';

describe('ApplicationDisplayComponent', () => {
  let component: ApplicationDisplayComponent;
  let fixture: ComponentFixture<ApplicationDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
